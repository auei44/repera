"""Shared metadata rules and image loading; importing this file needs no torch."""

import csv
import hashlib
import json
import math
import random
import re
from pathlib import Path

ML_DIR = Path(__file__).resolve().parent
FIELDS = ["filename", "class_name", "actual_model", "source_url", "permission",
          "physical_vacuum_id", "use_type", "notes"]
USE_TYPES = {"classifier", "reference", "model_label", "exclude"}
IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".gif", ".heic", ".heif", ".avif"}


# All relative config paths are relative to the config file, not the terminal.
def load_config(path=None):
    path = Path(path or ML_DIR / "config.json").resolve()
    config = json.loads(path.read_text(encoding="utf-8-sig"))
    for key in ("csv_path", "raw_dir"):
        config[key] = str((path.parent / config[key]).resolve())
    if config["image_size"] != 224:
        raise ValueError("This pipeline requires 224 x 224 input.")
    if not 0 <= config["near_duplicate_distance"] <= 64:
        raise ValueError("near_duplicate_distance must be between 0 and 64.")
    if config["min_independent_groups_per_class"] < 3:
        raise ValueError("At least three independent groups per class are required.")
    ratios = config["split_ratios"]
    if len(ratios) != 3 or any(r <= 0 for r in ratios) or not math.isclose(sum(ratios), 1):
        raise ValueError("Three positive split ratios must add up to 1.")
    if not 0 < config["confidence_threshold"] <= 1:
        raise ValueError("confidence_threshold must be greater than 0 and at most 1.")
    return config


# Read metadata without guessing missing values or changing the original CSV.
def read_metadata(path):
    with Path(path).open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames or len(reader.fieldnames) != len(set(reader.fieldnames)):
            raise ValueError("CSV needs unique column names.")
        missing = set(FIELDS) - set(reader.fieldnames)
        if missing:
            raise ValueError("Missing CSV columns: " + ", ".join(sorted(missing)))
        rows = []
        for line, row in enumerate(reader, 2):
            if None in row or any(value is None for value in row.values()):
                raise ValueError(f"Malformed CSV row {line}; check commas and quoting.")
            row = {key: value.strip() for key, value in row.items()}
            row["_line"] = line
            rows.append(row)
        return rows


# Resolve filenames safely inside raw; folders do not determine class labels.
def image_path(raw_dir, filename):
    root = Path(raw_dir).resolve()
    portable = filename.replace("\\", "/")
    if not portable or ":" in portable or Path(portable).is_absolute():
        raise ValueError("filename must be a relative path inside data/raw")
    path = (root / portable).resolve()
    if not path.is_relative_to(root) or path == root:
        raise ValueError("filename escapes data/raw")
    return path


# Permission is a human-reviewed record, never inferred from a public URL.
def exclusion_reasons(row, config):
    reasons = []
    if row["use_type"] not in USE_TYPES:
        reasons.append("missing or invalid use_type")
    elif row["use_type"] != "classifier":
        reasons.append("not a classifier image")
    if row["permission"] not in config["verified_permissions"]:
        reasons.append("missing or unverified reuse permission")
    if not re.search(r"(?:^|;)\s*permission_evidence\s*=\s*[^;\s][^;]*", row["notes"]):
        reasons.append("missing permission_evidence in notes")
    if not row["source_url"]:
        reasons.append("missing source_url (use an own:// session URI for your own photos)")
    if not row["physical_vacuum_id"]:
        reasons.append("missing physical_vacuum_id")
    if not re.fullmatch(r"[a-z0-9][a-z0-9_]*", row["class_name"]):
        reasons.append("missing or invalid class_name; use lowercase letters, digits, underscores")
    # Explicit content review keeps parts, labels and disassembly out of training.
    content = re.findall(r"(?:^|;)\s*content\s*=\s*([^;]+)", row["notes"])
    allowed = {"whole_vacuum"}
    if row["class_name"] == config["unsupported_class"]:
        allowed.add("unsupported_scene")
    if len(content) != 1 or content[0].strip() not in allowed:
        reasons.append("content must be whole_vacuum (or unsupported_scene for unsupported)")
    return reasons


# Hashes let later steps detect changed files and accidental duplicates.
def sha256_file(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def perceptual_hash(path):
    from PIL import Image, ImageOps
    with Image.open(path) as image:
        image.load()
        if getattr(image, "n_frames", 1) != 1:
            raise ValueError("Multi-frame files are not supported; record individual frames.")
        # A 64-bit difference hash is a perceptual fingerprint, not proof of identity.
        thumbnail = ImageOps.exif_transpose(image).convert("L").resize(
            (9, 8), Image.Resampling.LANCZOS)
        pixels = list(thumbnail.tobytes())
    bits = 0
    for y in range(8):
        for x in range(8):
            bits = (bits << 1) | (pixels[y * 9 + x] > pixels[y * 9 + x + 1])
    return f"{bits:016x}"


def hash_distance(left, right):
    return (int(left, 16) ^ int(right, 16)).bit_count()


# Torch is loaded only by model-related commands, so audits can run without it.
def seed_everything(seed):
    import os
    os.environ.setdefault("CUBLAS_WORKSPACE_CONFIG", ":4096:8")
    import torch
    random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.benchmark = False
    torch.backends.cudnn.deterministic = True
    torch.use_deterministic_algorithms(True)


def choose_device():
    import torch
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Preserve aspect ratio by padding; only training receives mild random changes.
def square_image(image):
    from PIL import ImageOps
    return ImageOps.pad(image, (224, 224), color=(127, 127, 127))


def build_transform(training=False):
    from torchvision import transforms as T
    steps = [T.Lambda(square_image)]
    if training:
        steps += [T.RandomHorizontalFlip(), T.RandomRotation(7, fill=127),
                  T.RandomResizedCrop(224, scale=(0.9, 1.0), ratio=(0.95, 1.05)),
                  T.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.02)]
    steps += [T.ToTensor(), T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])]
    return T.Compose(steps)


# This map-style dataset works with a PyTorch DataLoader without importing torch early.
class VacuumDataset:
    def __init__(self, rows, raw_dir, class_names, training=False):
        self.rows = rows
        self.raw_dir = raw_dir
        self.labels = {name: index for index, name in enumerate(class_names)}
        self.transform = build_transform(training)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        from PIL import Image, ImageOps
        row = self.rows[index]
        with Image.open(image_path(self.raw_dir, row["filename"])) as image:
            tensor = self.transform(ImageOps.exif_transpose(image).convert("RGB"))
        return tensor, self.labels[row["class_name"]]


# Training requires ImageNet weights; prediction restores a saved trained checkpoint.
def build_model(class_count, pretrained=False, allow_download=False):
    import torch
    from torchvision.models import mobilenet_v3_small, MobileNet_V3_Small_Weights
    weights = MobileNet_V3_Small_Weights.IMAGENET1K_V1 if pretrained else None
    if weights is not None and not allow_download:
        from urllib.parse import urlparse
        cached = Path(torch.hub.get_dir()) / "checkpoints" / Path(urlparse(weights.url).path).name
        if not cached.is_file():
            raise ValueError("Pretrained weights are not cached. Review then use --allow-weight-download.")
    model = mobilenet_v3_small(weights=weights)
    model.classifier[-1] = torch.nn.Linear(model.classifier[-1].in_features, class_count)
    return model
