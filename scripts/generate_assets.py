#!/usr/bin/env python3
"""Generate the 100-day Buzzer Klip feed artwork from the approved visual system.

The two approved AI previews are used as visual texture references; every final
asset is rendered deterministically with the verified Instagram logo composited
from the supplied PNG, so the logo is never retyped by a model.
"""
from __future__ import annotations

import json
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PLAN_PATH = ROOT / "content-plan.json"
POSTS_DIR = ROOT / "posts" / "buzzer-klip-100d"
LOGO_PATH = ROOT / "brand-audit" / "buzzer-klip-logo-instagram-crop.png"
REFERENCE_PATHS = [
    ROOT / "previews" / "buzzer-klip-logo-preview-01.jpg",
    ROOT / "previews" / "buzzer-klip-logo-preview-02.jpg",
]

W, H = 1080, 1350
BLACK = (8, 8, 8)
OFFWHITE = (249, 246, 237)
LIME = (212, 255, 0)
PINK = (255, 42, 122)
CYAN = (0, 229, 255)
LAVENDER = (185, 162, 255)
PALE = (232, 227, 213)
PALETTE = [LIME, PINK, CYAN, LAVENDER]

FONT_BLACK = "/Users/coong/Library/Fonts/Montserrat-Black.ttf"
FONT_BOLD = "/Users/coong/Library/Fonts/Montserrat-Bold.ttf"
FONT_MONO = "/System/Library/Fonts/SFNSMono.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt, stroke_width=0)
    return box[2] - box[0], box[3] - box[1]


def wrap_text(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = str(text).replace("\n", " ").split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if text_size(draw, candidate, fnt)[0] <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_lines(draw: ImageDraw.ImageDraw, text: str, max_width: int, max_size: int, min_size: int = 32) -> tuple[ImageFont.FreeTypeFont, list[str], int]:
    for size in range(max_size, min_size - 1, -2):
        fnt = font(FONT_BLACK, size)
        lines = wrap_text(draw, text, fnt, max_width)
        if len(lines) <= 4:
            return fnt, lines, size
    fnt = font(FONT_BLACK, min_size)
    return fnt, wrap_text(draw, text, fnt, max_width), min_size


def rounded_card(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], fill, radius: int = 18, shadow: int = 8, outline=BLACK, width: int = 6) -> None:
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle((x1 + shadow, y1 + shadow, x2 + shadow, y2 + shadow), radius=radius, fill=BLACK)
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def add_texture(im: Image.Image, rng: random.Random, intensity: int = 90) -> None:
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(intensity):
        x = rng.randrange(0, W)
        y = rng.randrange(0, H)
        size = rng.choice([1, 1, 2, 3, 5])
        color = (255, 255, 255, rng.randrange(8, 32)) if rng.random() > 0.5 else (0, 0, 0, rng.randrange(8, 28))
        draw.ellipse((x, y, x + size, y + size), fill=color)
    im.alpha_composite(overlay)


def draw_stickers(draw: ImageDraw.ImageDraw, rng: random.Random, accent) -> None:
    # Loud, simple shapes keep the feed coherent while changing each asset.
    for index in range(4):
        x = rng.choice([35, 78, 880, 930, 980])
        y = rng.choice([230, 330, 760, 1060, 1190])
        color = rng.choice(PALETTE)
        if index % 2:
            draw.polygon([(x, y + 35), (x + 25, y), (x + 52, y + 35), (x + 25, y + 70)], fill=color, outline=BLACK)
        else:
            draw.line((x, y, x + 50, y + 50), fill=color, width=12)
            draw.line((x + 50, y, x, y + 50), fill=color, width=12)
    # Tape strips
    for x, y, color in [(28, 174, LAVENDER), (820, 1175, PINK)]:
        draw.polygon([(x, y), (x + 118, y - 9), (x + 128, y + 28), (x + 10, y + 38)], fill=color)


def draw_waveform(draw: ImageDraw.ImageDraw, rng: random.Random, xy: tuple[int, int, int, int], color=CYAN) -> None:
    x1, y1, x2, y2 = xy
    mid = (y1 + y2) // 2
    points = []
    for x in range(x1, x2, 7):
        amp = rng.randint(5, max(8, (y2 - y1) // 2 - 4))
        points.extend([(x, mid - amp), (x + 3, mid + amp)])
    draw.line(points, fill=color, width=4, joint="curve")


def paste_reference(im: Image.Image, rng: random.Random, box: tuple[int, int, int, int], reference: Image.Image) -> None:
    x1, y1, x2, y2 = box
    crop_w = int(reference.width * rng.uniform(0.35, 0.7))
    crop_h = int(reference.height * rng.uniform(0.35, 0.7))
    left = rng.randrange(0, max(1, reference.width - crop_w))
    top = rng.randrange(0, max(1, reference.height - crop_h))
    crop = reference.crop((left, top, left + crop_w, top + crop_h))
    crop = ImageOps.fit(crop, (x2 - x1, y2 - y1), method=Image.Resampling.LANCZOS)
    crop = ImageEnhance.Contrast(crop).enhance(1.12)
    frame = Image.new("RGBA", (x2 - x1 + 16, y2 - y1 + 16), BLACK + (255,))
    frame.alpha_composite(crop.convert("RGBA"), (8, 8))
    im.alpha_composite(frame, (x1 - 8, y1 - 8))


def draw_header(draw: ImageDraw.ImageDraw, item: dict, accent, base) -> None:
    label = f"BUZZER KLIP  /  {int(item['id']):03d}  /  {item['pillar'].upper()}"
    draw.text((46, 34), label, font=font(FONT_MONO, 18), fill=OFFWHITE if base == BLACK else BLACK)


def draw_logo(im: Image.Image, logo: Image.Image) -> None:
    logo_width = 190
    logo_height = round(logo.height * logo_width / logo.width)
    resized = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)
    im.alpha_composite(resized, (W - 50 - logo_width, 55))


def draw_cover(item: dict, rng: random.Random, reference: Image.Image, logo: Image.Image) -> Image.Image:
    accent = rng.choice(PALETTE)
    base = BLACK if rng.random() > 0.28 else OFFWHITE
    im = Image.new("RGBA", (W, H), base + (255,))
    draw = ImageDraw.Draw(im)
    add_texture(im, rng, 260)
    draw_header(draw, item, accent, base)
    draw_stickers(draw, rng, accent)

    # Leave the locked top-right logo area open.
    max_width = 760
    fnt, lines, _ = fit_lines(draw, item["title"], max_width, 112, 48)
    fill = BLACK
    card_fill = accent if base == BLACK else PALE
    y = 165
    cursor_y = y
    for idx, line in enumerate(lines):
        width, height = text_size(draw, line, fnt)
        x = 46 + (idx % 2) * 18
        yy = cursor_y
        pad_x, pad_y = 24, 12
        rounded_card(draw, (x, yy, x + width + pad_x * 2, yy + height + pad_y * 2), card_fill, radius=4, shadow=10)
        draw.text((x + pad_x, yy + pad_y - 4), line, font=fnt, fill=fill)
        cursor_y = yy + height + pad_y * 2 + 22

    wave_y = 785
    draw.rectangle((35, wave_y, 730, wave_y + 150), fill=CYAN if accent != CYAN else LAVENDER, outline=BLACK, width=7)
    draw_waveform(draw, rng, (65, wave_y + 24, 700, wave_y + 126), BLACK)
    draw.text((56, wave_y + 12), "TIMELINE / HOOK / CUT", font=font(FONT_MONO, 15), fill=BLACK)

    paste_reference(im, rng, (690, 820, 1028, 1190), reference)
    # Lower timeline strip.
    draw.rectangle((42, 1192, 1038, 1264), fill=accent, outline=BLACK, width=6)
    for x in range(70, 1020, 108):
        draw.rectangle((x, 1210, x + rng.randint(56, 92), 1242), fill=BLACK)
    draw.text((48, 1280), "POTONG. POSTING. CUAN.", font=font(FONT_BLACK, 25), fill=BLACK if base != BLACK else OFFWHITE)
    draw_logo(im, logo)
    return im.convert("RGB")


def draw_inner(item: dict, slide: dict, slide_index: int, rng: random.Random, reference: Image.Image, logo: Image.Image) -> Image.Image:
    accent = PALETTE[(item["id"] + slide_index) % len(PALETTE)]
    base = OFFWHITE if slide_index % 2 == 0 else BLACK
    im = Image.new("RGBA", (W, H), base + (255,))
    draw = ImageDraw.Draw(im)
    add_texture(im, rng, 180)
    draw_header(draw, item, accent, base)
    draw_stickers(draw, rng, accent)

    role = slide["role"].upper()
    draw.text((48, 134), f"{slide_index + 1:02d}  /  {role}", font=font(FONT_MONO, 22), fill=accent if base == BLACK else BLACK)
    headline = slide["headline"]
    body = slide["body"]
    fnt, lines, _ = fit_lines(draw, headline, 810, 105, 50)
    fill = OFFWHITE if base == BLACK else BLACK
    y = 220
    cursor_y = y
    for idx, line in enumerate(lines):
        width, height = text_size(draw, line, fnt)
        color = accent if idx % 2 == 0 else (PINK if accent != PINK else LIME)
        card_y = cursor_y
        rounded_card(draw, (46, card_y, 46 + width + 38, card_y + height + 22), color, radius=3, shadow=8)
        draw.text((65, card_y + 7), line, font=fnt, fill=BLACK)
        cursor_y = card_y + height + 44

    body_y = 660 if len(lines) <= 2 else 790
    body_font = font(FONT_BOLD, 34)
    body_lines = wrap_text(draw, body, body_font, 660)
    body_card_h = min(270, 58 * len(body_lines) + 48)
    rounded_card(draw, (48, body_y, 740, body_y + body_card_h), PALE if base == BLACK else LAVENDER, radius=12, shadow=8)
    for idx, line in enumerate(body_lines[:4]):
        draw.text((76, body_y + 26 + idx * 54), line, font=body_font, fill=BLACK)

    if slide_index in (1, 3):
        paste_reference(im, rng, (700, 720, 1030, 1120), reference)
    else:
        draw.rectangle((690, 760, 1030, 1120), fill=accent, outline=BLACK, width=8)
        draw_waveform(draw, rng, (720, 830, 1000, 1035), BLACK)
        draw.text((720, 780), "CLIP IT", font=font(FONT_BLACK, 38), fill=BLACK)

    footer = "SWIPE → SIMPAN → PRAKTIKKAN" if slide_index < 4 else "GILIRANMU BUAT CLIP"
    draw.text((50, 1245), footer, font=font(FONT_MONO, 22), fill=accent if base == BLACK else BLACK)
    draw_logo(im, logo)
    return im.convert("RGB")


def save_jpeg(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, format="JPEG", quality=91, subsampling=0, optimize=True)


def main() -> None:
    plan = json.loads(PLAN_PATH.read_text())
    logo = Image.open(LOGO_PATH).convert("RGBA")
    references = [Image.open(path).convert("RGB") for path in REFERENCE_PATHS]
    generated = 0
    for item in plan:
        rng = random.Random(100_000 + int(item["id"]) * 997)
        reference = references[(int(item["id"]) + int(item["week_number"])) % len(references)]
        if item["post_type"] == "carousel":
            for slide_index, slide in enumerate(item["slides"]):
                image = draw_cover(item, rng, reference, logo) if slide_index == 0 else draw_inner(item, slide, slide_index, rng, reference, logo)
                save_jpeg(image, ROOT / slide["asset"])
                generated += 1
        else:
            image = draw_cover(item, rng, reference, logo)
            save_jpeg(image, ROOT / item["asset"])
            generated += 1
    print(f"Generated {generated} feed assets for {len(plan)} posts")


if __name__ == "__main__":
    main()
