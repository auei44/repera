"""Serve Repera and its existing NN locally; uploads are never saved."""

import argparse
import errno
import io
import hashlib
import json
import socket
import secrets
import sys
import threading
import time
import warnings
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from gemini_service import GeminiService, GeminiError

ROOT = Path(__file__).resolve().parent.parent
MAX_BYTES = 8 * 1024 * 1024
MAX_PIXELS = 20_000_000
STATIC = {"/": ("index.html", "text/html"), "/index.html": ("index.html", "text/html"),
          "/globe-texture.js": ("globe-texture.js", "text/javascript"),
          "/landing.js": ("landing.js", "text/javascript"),
          "/gemini.js": ("gemini.js", "text/javascript"),
          "/repair-options.js": ("repair-options.js", "text/javascript"),
          "/parts-data.js": ("parts-data.js", "text/javascript"),
          "/globe-land.js": ("globe-land.js", "text/javascript"),
          "/app.js": ("app.js", "text/javascript"), "/style.css": ("style.css", "text/css"),
          "/troubleshooting-data.js": ("troubleshooting-data.js", "text/javascript")}


# Load the selected checkpoint once. Future checkpoints use this same API.
class Predictor:
    def __init__(self, config_path):
        import torch
        from predict import load_checkpoint
        config_path = Path(config_path).resolve()
        config = json.loads(config_path.read_text(encoding="utf-8"))
        checkpoint_path = (config_path.parent / config["checkpoint"]).resolve()
        torch.set_num_threads(2)
        self.model, self.checkpoint, self.device = load_checkpoint(checkpoint_path)
        self.families = config["families"]
        self.experimental = self.checkpoint.get("status") == "experimental_unvalidated"
        evidence = json.loads((ROOT / "ml/gemini-evidence.json").read_text(encoding="utf-8"))
        if hashlib.sha256((ROOT / "troubleshooting-data.js").read_bytes()).hexdigest() != evidence["source_sha256"]:
            raise ValueError("Diagnostic evidence is stale. Run node ml/export-gemini-evidence.cjs.")
        self.coverage = []
        for label in self.checkpoint["class_names"]:
            if label == self.checkpoint["config"]["unsupported_class"]:
                continue
            family = self.families.get(label)
            if not isinstance(family, dict) or not isinstance(family.get("name"), str) or not family["name"].strip():
                raise ValueError(f"Missing recognition mapping for {label}.")
            models = family.get("models")
            identities = family.get("recognized_models", models)
            if not isinstance(models, list) or not isinstance(identities, list) or not all(isinstance(x, str) for x in models + identities):
                raise ValueError(f"Invalid model identities for {label}.")
            if any(x not in evidence["models"] or x not in identities for x in models):
                raise ValueError(f"Diagnostic mapping for {label} has not passed the evidence gate.")
            if any(x not in evidence["identities"] for x in identities):
                raise ValueError(f"Unregistered model identity for {label}.")
            self.coverage.append({"class_id": label, "name": family["name"],
                                  "recognized_models": identities, "candidate_models": models})
        self.model_id = checkpoint_path.parent.name
        self.checkpoint_hash = hashlib.sha256(checkpoint_path.read_bytes()).hexdigest()

    def info(self):
        return {"available": True, "experimental": self.experimental,
                "max_bytes": MAX_BYTES, "class_count": len(self.checkpoint["class_names"]),
                "model_id": self.model_id, "checkpoint_sha256": self.checkpoint_hash,
                "architecture": self.checkpoint["architecture"], "coverage": self.coverage,
                "diagnostic_count": len({m for row in self.coverage for m in row["candidate_models"]}),
                "unknown_detection_validated": False}

    def predict(self, data):
        from PIL import Image
        from predict import predict_image
        # Decode and inspect dimensions before allocating a prediction tensor.
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as photo:
                if photo.width * photo.height > MAX_PIXELS or getattr(photo, "n_frames", 1) != 1:
                    raise ValueError("Use a single image smaller than 20 megapixels.")
                photo.verify()
        result = predict_image(self.model, io.BytesIO(data), self.checkpoint["class_names"],
                               self.checkpoint["config"], self.device, experimental=self.experimental)
        family = self.families.get(result["top_class"])
        # Experimental results are suggestions only, even when their score is high.
        suggested = family is not None and result["confidence"] >= result["threshold"] and result["top_class"] != self.checkpoint["config"]["unsupported_class"]
        return {"status": "suggestion" if suggested else "uncertain", "experimental": self.experimental,
                "family": family["name"] if suggested else None,
                "class_id": result["top_class"] if suggested else None,
                "recognized_models": family.get("recognized_models", family["models"]) if suggested else [],
                "candidate_models": family["models"] if suggested else [],
                "requires_model_confirmation": True}


# Serve only public frontend files, never the dataset, checkpoint or project files.
def make_server(predictor, port=8000, gemini=None, host="127.0.0.1"):
    token = secrets.token_urlsafe(32)
    inference_lock = threading.Lock()
    gemini = gemini if gemini is not None else GeminiService()
    gemini_lock = threading.Lock()
    public_calls = []
    public_total = 0
    public_started = time.monotonic()
    public_lock = threading.Lock()

    class Handler(BaseHTTPRequestHandler):
        def setup(self):
            super().setup()
            self.connection.settimeout(15)

        def log_message(self, *args):
            pass  # Do not log uploaded photos, filenames, answers or request bodies.

        def allowed_host(self):
            port = self.server.server_address[1]
            hosts = {f"127.0.0.1:{port}", f"localhost:{port}"}
            if self.server.public_origin:
                hosts.add(urlsplit(self.server.public_origin).netloc)
            return self.headers.get("Host") in hosts

        def send(self, status, body, content_type="application/json"):
            # Drain only small rejected bodies, with a short deadline. Closing a
            # Windows socket with unread input can discard the error response.
            if status >= 400 and self.command == "POST" and not getattr(self, "body_consumed", False):
                try:
                    size = int(self.headers.get("Content-Length", "0"))
                    if 0 < size <= 65536 and not self.headers.get("Transfer-Encoding"):
                        self.connection.settimeout(.2)
                        self.rfile.read(size)
                except (ValueError, OSError):
                    pass
                finally:
                    self.connection.settimeout(15)
            payload = json.dumps(body).encode() if isinstance(body, dict) else body
            self.send_response(status)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Content-Security-Policy", "default-src 'self'; img-src 'self' blob: data:; style-src 'self'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'")
            self.end_headers()
            self.wfile.write(payload)
            self.wfile.flush()
            # Responses close this HTTP/1.0 connection. Half-close first so Windows
            # delivers an early rejection even when the request body is unread.
            self.close_connection = True
            try:
                self.connection.shutdown(socket.SHUT_WR)
            except OSError:
                pass

        def do_GET(self):
            if not self.allowed_host():
                self.send(403, {"error": "Local requests only."})
                return
            route = urlsplit(self.path).path
            if route == "/api/health":
                self.send(200, {"ok": True})
            elif route == "/api/model":
                self.send(200, {**predictor.info(), "token": token, "gemini": gemini.info()})
            elif route in STATIC:
                name, mime = STATIC[route]
                self.send(200, (ROOT / name).read_bytes(), mime + "; charset=utf-8")
            else:
                self.send(404, {"error": "Not found."})

        def do_POST(self):
            nonlocal public_total, public_started
            port = self.server.server_address[1]
            origin = self.headers.get("Origin")
            origins = {f"http://127.0.0.1:{port}", f"http://localhost:{port}"}
            if self.server.public_origin:
                origins.add(self.server.public_origin)
            if (not self.allowed_host() or self.headers.get("X-Repera-Token") != token or
                    (origin is not None and origin not in origins)):
                self.send(403, {"error": "Open Repera from its local server."})
                return
            route = urlsplit(self.path).path
            if self.server.public_origin and route in {"/api/predict", "/api/gemini/photo", "/api/gemini/explain", "/api/gemini/assess"}:
                with public_lock:
                    now = time.monotonic()
                    if self.server.hosted and now - public_started >= 86400:
                        public_total = 0
                        public_started = now
                    public_calls[:] = [stamp for stamp in public_calls if now - stamp < 60]
                    if len(public_calls) >= 10 or public_total >= 200:
                        self.send(429, {"error": "This shared demo's request limit was reached. Try again later or select a model manually."})
                        return
                    public_calls.append(now)
                    public_total += 1
            if route in {"/api/gemini/photo", "/api/gemini/explain", "/api/gemini/assess"}:
                self.handle_gemini(route)
                return
            if route != "/api/predict":
                self.send(404, {"error": "Not found."})
                return
            try:
                size = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                size = 0
            if self.headers.get("Transfer-Encoding") or not 0 < size <= MAX_BYTES:
                self.send(413, {"error": "Choose an image no larger than 8 MB."})
                return
            if not inference_lock.acquire(blocking=False):
                self.send(503, {"error": "Photo recognition is busy. Try again shortly."})
                return
            try:
                data = self.rfile.read(size)
                self.body_consumed = True
                if len(data) != size:
                    raise ValueError("Incomplete image upload.")
                self.send(200, predictor.predict(data))
            except (ValueError, OSError, SyntaxError, Warning) as error:
                self.send(400, {"error": "The image could not be read. Use a smaller JPG or PNG image."})
            except Exception:
                self.send(500, {"error": "Photo recognition failed. Select your model manually."})
            finally:
                inference_lock.release()

        # Cloud requests are separate, explicit, size-limited and token-protected.
        def handle_gemini(self, route):
            if self.headers.get("X-Repera-Cloud-Consent") != "yes":
                self.send(400, {"error": "Confirm sending this request to Google first."})
                return
            try:
                size = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                size = 0
            limit = 12 * 1024 * 1024 if route.endswith("assess") else MAX_BYTES if route.endswith("photo") else 4096
            if self.headers.get("Transfer-Encoding") or not 0 < size <= limit:
                self.send(413, {"error": "This Gemini request is empty or too large."})
                return
            if not gemini.info()["configured"]:
                self.send(503, {"error": "Gemini is not configured. See GEMINI_SETUP.md; local tools still work."})
                return
            if not gemini_lock.acquire(blocking=False):
                self.send(429, {"error": "A Gemini request is already running. Please wait."})
                return
            try:
                data = self.rfile.read(size)
                self.body_consumed = True
                if len(data) != size:
                    raise ValueError("Incomplete request")
                result = gemini.photo(data) if route.endswith("photo") else gemini.assess(json.loads(data)) if route.endswith("assess") else gemini.explain(json.loads(data))
                self.send(200, result)
            except GeminiError as error:
                self.send(error.status, {"error": str(error)})
            except (ValueError, UnicodeError):
                self.send(400, {"error": "This Gemini request could not be read."})
            except Exception:
                self.send(502, {"error": "Gemini could not finish. Use the local tools."})
            finally:
                gemini_lock.release()

    server = ThreadingHTTPServer((host, port), Handler)
    server.public_origin = None
    server.hosted = False
    return server


# Bind to this computer only. Restart with a changed config to load new weights.
def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=Path(__file__).with_name("web_config.json"))
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args(argv)
    if not 0 <= args.port <= 65535:
        parser.error('Use a port from 1 to 65535, or 0 to choose a free port.')
    # Startup problems have actionable messages; no dependencies are installed here.
    try:
        predictor = Predictor(args.config)
    except ModuleNotFoundError as error:
        print(f"Repera could not start: missing Python package '{error.name}'. "
              "Use the project's .venv and follow ml/README.md for setup. "
              "You can still open index.html for manual troubleshooting.", file=sys.stderr)
        return 2
    except Exception as error:
        print(f"Repera could not load photo recognition: {error}. "
              "Check ml/web_config.json and its checkpoint file. "
              "You can still open index.html for manual troubleshooting.", file=sys.stderr)
        return 2
    try:
        server = make_server(predictor, args.port)
    except OSError as error:
        if error.errno == errno.EADDRINUSE or getattr(error, 'winerror', None) == 10048:
            print(f"Repera could not start: port {args.port} is already in use. "
                  "If Repera is already running, use its existing window. "
                  "Otherwise run start-repera.cmd --port 0 or use Python with ml/serve.py --port 0 "
                  "to choose a free port.", file=sys.stderr)
        elif error.errno == errno.EACCES or getattr(error, 'winerror', None) == 10013:
            print(f"Repera could not start: port {args.port} is unavailable "
                  "(it may be in use, reserved, or blocked). "
                  "Try start-repera.cmd --port 0 to choose a free port, "
                  "or open index.html for manual troubleshooting.", file=sys.stderr)
        else:
            print(f"Repera could not open its local server: {error}. "
                  "Try another port with --port 0, or open index.html for manual troubleshooting.", file=sys.stderr)
        return 2
    print(f"Repera: http://127.0.0.1:{server.server_address[1]}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
