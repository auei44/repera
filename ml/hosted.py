"""Hosted entry point; local launchers keep binding only to loopback."""
import os
from urllib.parse import urlsplit

from serve import Predictor, ROOT, make_server


def config(env):
    origin = (env.get('REPERA_PUBLIC_ORIGIN') or env.get('RENDER_EXTERNAL_URL') or '').rstrip('/')
    url = urlsplit(origin)
    if (url.scheme != 'https' or not url.hostname or url.username or url.password or
            url.port is not None or url.path or url.query or url.fragment):
        raise ValueError('Set REPERA_PUBLIC_ORIGIN to the exact public HTTPS origin.')
    port = int(env.get('PORT', '10000'))
    if not 1 <= port <= 65535:
        raise ValueError('PORT must be between 1 and 65535.')
    if not env.get('GEMINI_API_KEY', '').strip():
        raise ValueError('Set GEMINI_API_KEY in the hosting service secret settings.')
    return origin, port


def main():
    origin, port = config(os.environ)
    server = make_server(Predictor(ROOT / 'ml/web_config.json'), port, host='0.0.0.0')
    server.public_origin = origin
    server.hosted = True
    print('Repera hosted server ready: ' + origin, flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
