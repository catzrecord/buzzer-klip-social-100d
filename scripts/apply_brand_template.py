#!/usr/bin/env python3
"""Apply the verified Buzzer Klip Instagram logo to a 4:5 feed artwork."""
from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LOGO = ROOT / "brand-audit" / "buzzer-klip-logo-instagram-crop.png"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--logo", type=Path, default=DEFAULT_LOGO)
    args = parser.parse_args()

    with Image.open(args.input) as source:
        canvas = ImageOps.fit(
            ImageOps.exif_transpose(source).convert("RGB"),
            (1080, 1350),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        ).convert("RGBA")

    with Image.open(args.logo) as logo_source:
        logo = ImageOps.exif_transpose(logo_source).convert("RGBA")
        logo_width = 190
        logo_height = round(logo.height * logo_width / logo.width)
        logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    # Locked Buzzer Klip feed-template placement: small, top-right, safe margins.
    position = (1080 - 50 - logo.width, 55)
    canvas.alpha_composite(logo, position)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(args.output, quality=95, subsampling=0, optimize=True)


if __name__ == "__main__":
    main()
