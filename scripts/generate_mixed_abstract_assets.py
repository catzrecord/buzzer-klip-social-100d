#!/usr/bin/env python3
"""Render the 100-day queue with a varied cinematic abstract subject system."""

from __future__ import annotations

import json
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PLAN_PATH = ROOT / "content-plan.json"
POSTS_DIR = ROOT / "posts" / "buzzer-klip-100d"
LOGO_PATH = ROOT / "brand-audit" / "buzzer-klip-logo-instagram-crop.png"
PEOPLE_DIR = ROOT / "production-sources" / "abstract-people-v1"
OBJECT_DIR_A = ROOT / "production-sources" / "pusatklip-match-v2"
OBJECT_DIR_B = ROOT / "production-sources" / "abstract-redesign-v1"
SCENE_DIR = ROOT / "assets" / "pusatklip-abstract"

PEOPLE_SOURCE_PATHS = [
    PEOPLE_DIR / "slide-01.png", PEOPLE_DIR / "slide-02.png",
    PEOPLE_DIR / "slide-03.png", PEOPLE_DIR / "slide-04.png",
    PEOPLE_DIR / "slide-05.png", PEOPLE_DIR / "single-01.png",
    PEOPLE_DIR / "source-07-seated.png", PEOPLE_DIR / "source-08-duo.png",
    PEOPLE_DIR / "source-09-reach.png", PEOPLE_DIR / "source-10-builder.png",
    PEOPLE_DIR / "source-11-ring.png", PEOPLE_DIR / "source-12-meditate.png",
]
OBJECT_SOURCE_PATHS = [
    OBJECT_DIR_A / "slide-01.png", OBJECT_DIR_A / "slide-02.png",
    OBJECT_DIR_A / "slide-03.png", OBJECT_DIR_A / "slide-04.png",
    OBJECT_DIR_A / "slide-05.png", OBJECT_DIR_A / "single-01.png",
    OBJECT_DIR_B / "slide-01.png", OBJECT_DIR_B / "slide-02.png",
    OBJECT_DIR_B / "slide-03.png", OBJECT_DIR_B / "slide-04.png",
    OBJECT_DIR_B / "slide-05.png", OBJECT_DIR_B / "single-01.png",
]
SCENE_SOURCE_PATHS = [
    SCENE_DIR / "editing-engine.png", SCENE_DIR / "holographic-screens.png",
    SCENE_DIR / "play-engine.png", SCENE_DIR / "signal-capsule.png",
    OBJECT_DIR_A / "slide-05.png", OBJECT_DIR_B / "slide-05.png",
]
SOURCE_PATHS = PEOPLE_SOURCE_PATHS + OBJECT_SOURCE_PATHS + SCENE_SOURCE_PATHS

W, H = 1080, 1350
BLACK = (3, 4, 5)
WHITE = (247, 246, 242)
LIME = (200, 255, 0)
PINK = (255, 39, 131)
CYAN = (0, 216, 239)
LAVENDER = (175, 140, 255)
PALETTE = [LIME, PINK, CYAN, LAVENDER]
AVENIR = "/System/Library/Fonts/Avenir Next.ttc"

ROLE_LABELS = {
    "cover": "CREATOR INSIGHT",
    "single": "CLIPPING INSIGHT",
    "problem": "PROBLEM CHECK",
    "principle": "CORE PRINCIPLE",
    "action": "ACTION STEP",
    "cta": "CREATOR MOVE",
}
THEME_LABELS = {
    "education": "CLIPPING INSIGHT",
    "mindset": "CREATOR MINDSET",
    "relatable": "CREATOR LIFE",
    "community": "COMMUNITY SIGNAL",
    "brand": "BUZZER KLIP",
    "challenge": "CREATOR CHALLENGE",
    "story": "CREATOR STORY",
    "motivation": "CREATOR ENERGY",
    "culture": "CLIPPER CULTURE",
}


def font(size: int, weight: str = "bold") -> ImageFont.FreeTypeFont:
    indexes = {"heavy": 8, "bold": 0, "demi": 2, "medium": 5, "regular": 7}
    return ImageFont.truetype(AVENIR, size=size, index=indexes[weight])


def text_width(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont) -> int:
    box = draw.textbbox((0, 0), text, font=face)
    return box[2] - box[0]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, face: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = str(text).upper().replace("\n", " ").split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if not current or text_width(draw, candidate, face) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_title(draw: ImageDraw.ImageDraw, text: str, max_width=920, max_lines=3, start=90, minimum=54):
    for size in range(start, minimum - 1, -2):
        face = font(size, "heavy")
        lines = wrap_text(draw, text, face, max_width)
        if len(lines) <= max_lines:
            return face, lines
    face = font(minimum, "heavy")
    return face, wrap_text(draw, text, face, max_width)


def fit_body(draw: ImageDraw.ImageDraw, text: str, max_width=900, max_lines=3, start=30, minimum=21):
    for size in range(start, minimum - 1, -1):
        face = font(size, "medium")
        words = str(text).replace("\n", " ").split()
        lines: list[str] = []
        current = ""
        for word in words:
            candidate = word if not current else f"{current} {word}"
            if not current or text_width(draw, candidate, face) <= max_width:
                current = candidate
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        if len(lines) <= max_lines:
            return face, lines
    return font(minimum, "medium"), lines


def variant_background(source: Image.Image, seed: int, accent) -> Image.Image:
    rng = random.Random(seed)
    image = source.convert("RGB")
    if rng.random() < 0.5:
        image = ImageOps.mirror(image)

    zoom = rng.uniform(1.0, 1.12)
    target_w, target_h = int(W * zoom), int(H * zoom)
    fitted = ImageOps.fit(image, (target_w, target_h), Image.Resampling.LANCZOS,
                          centering=(rng.uniform(0.46, 0.54), rng.uniform(0.43, 0.52)))
    left = (target_w - W) // 2 + rng.randint(-12, 12)
    top = (target_h - H) // 2 + rng.randint(-10, 10)
    image = fitted.crop((left, top, left + W, top + H))
    image = ImageEnhance.Contrast(image).enhance(rng.uniform(1.02, 1.10))
    image = ImageEnhance.Color(image).enhance(rng.uniform(0.94, 1.09)).convert("RGBA")

    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # A restrained per-post color atmosphere makes repeated source poses feel bespoke.
    draw.rectangle((0, 0, W, H), fill=(*accent, rng.randint(5, 15)))
    for _ in range(9):
        x = rng.randint(25, W - 25)
        y = rng.randint(160, 930)
        length = rng.randint(38, 155)
        color = rng.choice(PALETTE)
        draw.line((x, y, min(W, x + length), y - rng.randint(15, 70)), fill=(*color, rng.randint(26, 62)), width=2)
        if rng.random() < 0.45:
            draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(*color, 120))

    # Soft top vignette and strong lower typography bed.
    for y in range(0, 220):
        alpha = int(82 * (1 - y / 220))
        draw.line((0, y, W, y), fill=(0, 0, 0, alpha))
    fade_start = 755
    for y in range(fade_start, H):
        progress = (y - fade_start) / (H - fade_start)
        alpha = int(252 * (progress ** 0.57))
        draw.line((0, y, W, y), fill=(0, 0, 0, alpha))

    return Image.alpha_composite(image, overlay)


def add_logo(image: Image.Image, logo: Image.Image) -> None:
    resized = logo.copy()
    resized.thumbnail((205, 84), Image.Resampling.LANCZOS)
    image.alpha_composite(resized, (53, 45))


def add_header(image: Image.Image, label: str, accent) -> None:
    draw = ImageDraw.Draw(image)
    label = label.upper()
    face = font(21, "demi")
    while text_width(draw, label, face) > 300 and face.size > 16:
        face = font(face.size - 1, "demi")
    pill_width = text_width(draw, label, face) + 67
    right = W - 53
    left = right - pill_width
    draw.rounded_rectangle((left + 7, 60, right + 7, 102), 13, fill=(0, 0, 0, 125))
    draw.rounded_rectangle((left, 53, right, 95), 13, fill=accent)
    draw.ellipse((left + 16, 68, left + 27, 79), fill=BLACK)
    draw.text((left + 37, 62), label, font=face, fill=BLACK)
    draw.text((right, 118), "buzzer-klip.com", font=font(23, "medium"), fill=WHITE, anchor="ra")


def add_progress(draw: ImageDraw.ImageDraw, accent, y: int, slide_index: int, slide_count: int) -> None:
    total_width = 240
    gap = 9
    segment = (total_width - gap * (slide_count - 1)) // slide_count
    left = (W - total_width) // 2
    for idx in range(slide_count):
        color = accent if idx <= slide_index else WHITE
        x1 = left + idx * (segment + gap)
        draw.rounded_rectangle((x1, y, x1 + segment, y + 10), 5, fill=color)


def draw_cover_copy(image: Image.Image, item: dict, slide: dict, accent, slide_index: int) -> None:
    draw = ImageDraw.Draw(image)
    face, lines = fit_title(draw, slide["headline"], start=88, max_lines=3)
    line_height = int(face.size * 0.91)
    block_height = len(lines) * line_height
    top = max(915, 1115 - block_height)
    cursor = top
    for idx, line in enumerate(lines):
        color = accent if idx == len(lines) - 1 else WHITE
        draw.text((W // 2 + 4, cursor + 5), line, font=face, fill=(0, 0, 0, 215), anchor="ma")
        draw.text((W // 2, cursor), line, font=face, fill=color, anchor="ma")
        cursor += line_height

    subtitle = slide.get("body") or item.get("pillar", "")
    body_face, body_lines = fit_body(draw, subtitle, start=27, max_lines=2)
    for line in body_lines:
        draw.text((W // 2, cursor + 8), line, font=body_face, fill=WHITE, anchor="ma")
        cursor += int(body_face.size * 1.18)
    add_progress(draw, accent, min(cursor + 28, 1260), slide_index, item["slide_count"])


def draw_inner_copy(image: Image.Image, item: dict, slide: dict, accent, slide_index: int) -> None:
    draw = ImageDraw.Draw(image)
    headline = slide["headline"]
    face, lines = fit_title(draw, headline, start=78, max_lines=2)
    line_height = int(face.size * 0.92)
    top = 948 if len(lines) == 1 else 900
    cursor = top
    for idx, line in enumerate(lines):
        color = accent if idx == len(lines) - 1 else WHITE
        draw.text((W // 2 + 3, cursor + 5), line, font=face, fill=(0, 0, 0, 220), anchor="ma")
        draw.text((W // 2, cursor), line, font=face, fill=color, anchor="ma")
        cursor += line_height

    body_face, body_lines = fit_body(draw, slide["body"], start=29, max_lines=4)
    cursor += 10
    for line in body_lines:
        draw.text((W // 2, cursor), line, font=body_face, fill=WHITE, anchor="ma")
        cursor += int(body_face.size * 1.2)
    add_progress(draw, accent, min(cursor + 26, 1270), slide_index, item["slide_count"])


def slide_family(item: dict, slide_index: int) -> str:
    base = item.get("subject_family", "object")
    sequences = {
        "human": ["human", "object", "human", "scene", "object"],
        "object": ["object", "human", "object", "scene", "object"],
        "scene": ["scene", "object", "human", "object", "scene"],
    }
    return sequences.get(base, sequences["object"])[slide_index % 5]


def render_asset(item: dict, slide: dict, slide_index: int, pools: dict[str, list[Image.Image]], logo: Image.Image) -> Image.Image:
    item_id = int(item["id"])
    family = slide_family(item, slide_index)
    sources = pools[family]
    source_index = (item_id * 5 + slide_index * 3) % len(sources)
    accent = PALETTE[(item_id + slide_index) % len(PALETTE)]
    image = variant_background(sources[source_index], 700_000 + item_id * 997 + slide_index * 101, accent)
    add_logo(image, logo)
    role = slide.get("role", "single")
    label = THEME_LABELS.get(item.get("content_theme"), item.get("pillar", "CREATOR SIGNAL"))
    add_header(image, label, accent)
    if role in {"cover", "single"}:
        draw_cover_copy(image, item, slide, accent, slide_index)
    else:
        draw_inner_copy(image, item, slide, accent, slide_index)
    return image.convert("RGB")


def save_jpeg(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # Instagram recompresses uploads; this retains clean neon edges while keeping
    # the 272-file hosted queue practical for GitHub Pages and daily publishing.
    image.save(path, "JPEG", quality=86, subsampling=1, optimize=True)


def main() -> None:
    plan = json.loads(PLAN_PATH.read_text())
    missing = [str(path) for path in SOURCE_PATHS if not path.exists()]
    if missing:
        raise FileNotFoundError("Missing mixed-abstract sources: " + ", ".join(missing))
    logo = Image.open(LOGO_PATH).convert("RGBA")
    pools = {
        "human": [Image.open(path).convert("RGB") for path in PEOPLE_SOURCE_PATHS],
        "object": [Image.open(path).convert("RGB") for path in OBJECT_SOURCE_PATHS],
        "scene": [Image.open(path).convert("RGB") for path in SCENE_SOURCE_PATHS],
    }

    generated = 0
    for item in plan:
        if item.get("status") == "published" or item.get("manual_asset_lock") is True:
            continue
        for slide_index, slide in enumerate(item["slides"]):
            image = render_asset(item, slide, slide_index, pools, logo)
            save_jpeg(image, ROOT / slide["asset"])
            generated += 1

    print(f"Generated {generated} queued mixed-abstract assets for {len(plan)} posts")


if __name__ == "__main__":
    main()
