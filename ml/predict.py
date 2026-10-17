"""Local image prediction only; nothing in this module connects to the website."""

import argparse
import json
import math
from pathlib import Path

from dataset import build_model, build_transform, choose_device

THRESHOLD_NOTICE = "Provisional threshold: validate on held-out validation data, including unknown objects. Softmax scores are not calibrated certainty."


# Reject weak scores without changing the complete list of model probabilities.
def summarize_probabilities(class_names, probabilities, threshold, unsupported_class="unsupported"):
    if not class_names or len(class_names) != len(probabilities) or len(set(class_names)) != len(class_names):
        raise ValueError("Class names must be unique and match probability count.")
    if not math.isfinite(threshold) or not 0 < threshold <= 1:
        raise ValueError("Threshold must be greater than 0 and at most 1.")
    if any(not math.isfinite(p) or p < 0 or p > 1 for p in probabilities) or not math.isclose(sum(probabilities), 1, abs_tol=1e-5):
        raise ValueError("Probabilities must be finite and sum to 1.")
    index = max(range(len(probabilities)), key=probabilities.__getitem__)
    top, confidence = class_names[index], probabilities[index]
    result = "unsupported_or_uncertain" if confidence < threshold else top
    return {"prediction": result, "top_class": top, "confidence": confidence,
            "class_probabilities": dict(zip(class_names, probabilities)),
            "threshold": threshold, "threshold_status": "provisional_unvalidated",
            "notice": THRESHOLD_NOTICE,
            "unsupported_class_trained": unsupported_class in class_names,
            "is_supported_prediction": result not in {unsupported_class, "unsupported_or_uncertain"},
            "scope": "Visual class only; does not verify an exact model, diagnosis, repair or parts compatibility."}


# Load only your own trusted checkpoints; this never fetches pretrained weights.
def load_checkpoint(path, device=None):
    import torch
    device = device or choose_device()
    checkpoint = torch.load(path, map_location="cpu", weights_only=True)
    if checkpoint.get("architecture") != "mobilenet_v3_small":
        raise ValueError("Expected a Repera MobileNetV3 Small checkpoint.")
    classes = checkpoint["class_names"]
    if len(classes) < 2 or len(set(classes)) != len(classes):
        raise ValueError("Checkpoint needs at least two unique classes.")
    model = build_model(len(classes))
    model.load_state_dict(checkpoint["state_dict"], strict=True)
    model.to(device).eval()
    return model, checkpoint, device


# The same deterministic image transform is used for validation, test and prediction.
def predict_image(model, image_path, class_names, config, device, experimental=False):
    import torch
    from PIL import Image, ImageOps
    with Image.open(image_path) as image:
        tensor = build_transform(False)(ImageOps.exif_transpose(image).convert("RGB")).unsqueeze(0).to(device)
    model.eval()
    with torch.inference_mode():
        probabilities = torch.softmax(model(tensor), dim=1)[0].cpu().tolist()
    result = summarize_probabilities(class_names, probabilities, config["confidence_threshold"], config["unsupported_class"])
    return mark_experimental(result) if experimental else result


# A prototype score remains inspectable but cannot become a supported identification.
def mark_experimental(result):
    return dict(result, prediction="experimental_unvalidated", is_supported_prediction=False,
                status="experimental_unvalidated",
                notice="Training-only prototype with no independent validation or test results. "
                       "Scores are experimental; do not use for diagnosis or parts compatibility.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--checkpoint", type=Path, required=True)
    parser.add_argument("--image", type=Path, required=True)
    args = parser.parse_args()
    try:
        model, checkpoint, device = load_checkpoint(args.checkpoint)
        result = predict_image(model, args.image, checkpoint["class_names"], checkpoint["config"], device,
                               experimental=checkpoint.get("status") == "experimental_unvalidated")
    except (ValueError, OSError, ImportError) as error:
        parser.exit(2, f"Prediction failed: {error}\n")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
