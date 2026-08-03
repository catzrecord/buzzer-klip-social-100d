#!/usr/bin/env python3
"""Generate a compact original electronic audio pack for the 100-day queue."""

from __future__ import annotations

import json
import math
import random
import subprocess
import wave
from pathlib import Path

import numpy as np


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "audio" / "abstract-human-v1"
SR = 48_000

TRACKS = [
    ("neon-resolve", "Neon Resolve", 94, 45, "focused cinematic pulse"),
    ("signal-rush", "Signal Rush", 112, 50, "fast creator momentum"),
    ("glass-pulse", "Glass Pulse", 100, 53, "precise digital confidence"),
    ("creator-drive", "Creator Drive", 118, 48, "bold forward motion"),
    ("focus-circuit", "Focus Circuit", 88, 52, "calm concentrated energy"),
    ("midnight-cut", "Midnight Cut", 104, 43, "dark editing rhythm"),
    ("lime-horizon", "Lime Horizon", 110, 45, "optimistic neon lift"),
    ("cyan-motion", "Cyan Motion", 120, 47, "clean high-speed workflow"),
    ("magenta-thought", "Magenta Thought", 92, 49, "curious idea formation"),
    ("portal-steps", "Portal Steps", 108, 50, "aspirational creator journey"),
    ("quiet-voltage", "Quiet Voltage", 84, 42, "minimal reflective tension"),
    ("final-upload", "Final Upload", 116, 44, "release-day confidence"),
]


def midi_hz(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def add_tone(buffer, start, duration, frequency, amplitude, pan=0.5, waveform="sine", decay=2.2):
    start_i = int(start * SR)
    length = min(int(duration * SR), len(buffer) - start_i)
    if length <= 0:
        return
    t = np.arange(length, dtype=np.float64) / SR
    phase = 2 * np.pi * frequency * t
    if waveform == "saw":
        signal = 2 * ((frequency * t) % 1.0) - 1.0
    elif waveform == "square":
        signal = np.sign(np.sin(phase))
    else:
        signal = np.sin(phase)
    attack = np.minimum(1.0, t / 0.015)
    envelope = attack * np.exp(-decay * t / max(duration, 0.01))
    signal *= amplitude * envelope
    left = math.cos(pan * math.pi / 2)
    right = math.sin(pan * math.pi / 2)
    buffer[start_i:start_i + length, 0] += signal * left
    buffer[start_i:start_i + length, 1] += signal * right


def add_kick(buffer, start, amplitude=0.9):
    start_i = int(start * SR)
    duration = 0.42
    length = min(int(duration * SR), len(buffer) - start_i)
    if length <= 0:
        return
    t = np.arange(length, dtype=np.float64) / SR
    phase = 2 * np.pi * (48 * t + 82 * (1 - np.exp(-14 * t)) / 14)
    signal = np.sin(phase) * np.exp(-10 * t) * amplitude
    buffer[start_i:start_i + length, :] += signal[:, None] * 0.72


def add_noise_hit(buffer, start, duration, amplitude, rng, pan=0.5, bright=False):
    start_i = int(start * SR)
    length = min(int(duration * SR), len(buffer) - start_i)
    if length <= 1:
        return
    noise = rng.normal(0, 1, length)
    if bright:
        noise = np.concatenate(([0.0], np.diff(noise)))
    t = np.arange(length, dtype=np.float64) / SR
    signal = noise * np.exp(-(18 if bright else 10) * t) * amplitude
    left = math.cos(pan * math.pi / 2)
    right = math.sin(pan * math.pi / 2)
    buffer[start_i:start_i + length, 0] += signal * left
    buffer[start_i:start_i + length, 1] += signal * right


def synthesize(index: int, bpm: int, root: int) -> tuple[np.ndarray, float]:
    beat = 60.0 / bpm
    bars = 8
    duration = bars * 4 * beat
    frames = int(duration * SR)
    audio = np.zeros((frames, 2), dtype=np.float64)
    rng = np.random.default_rng(23_000 + index * 941)
    py_rng = random.Random(51_000 + index * 977)

    # Minor-pentatonic bass and glassy arpeggio.
    scale = [0, 3, 5, 7, 10]
    bass_pattern = [0, 0, 3, 0, 4, 3, 1, 0]
    arp_pattern = [0, 2, 1, 3, 2, 4, 1, 3]
    for bar in range(bars):
        bar_start = bar * 4 * beat
        root_shift = [0, 0, 5, 3, 0, 7, 5, 3][bar]

        # Wide quiet pad.
        for chord_i, semitone in enumerate([0, 3, 7]):
            note = root + root_shift + semitone + 12
            add_tone(audio, bar_start, 4 * beat, midi_hz(note), 0.055,
                     pan=0.18 + chord_i * 0.32, waveform="sine", decay=0.35)

        for beat_i in range(4):
            when = bar_start + beat_i * beat
            add_kick(audio, when, 0.78 if beat_i in (0, 2) else 0.58)
            if beat_i in (1, 3):
                add_noise_hit(audio, when, 0.28, 0.11, rng, pan=0.52, bright=False)
            bass_note = root + root_shift + scale[bass_pattern[(bar + beat_i) % len(bass_pattern)]] - 12
            add_tone(audio, when, beat * 0.86, midi_hz(bass_note), 0.18,
                     pan=0.5, waveform="sine", decay=3.2)

            for half in range(2):
                hat_when = when + half * beat / 2
                add_noise_hit(audio, hat_when, 0.085, 0.035, rng,
                              pan=0.28 if (beat_i + half) % 2 == 0 else 0.72, bright=True)
                arp_step = (bar * 8 + beat_i * 2 + half) % len(arp_pattern)
                arp_note = root + root_shift + scale[arp_pattern[arp_step]] + 12
                add_tone(audio, hat_when, beat * 0.42, midi_hz(arp_note), 0.055,
                         pan=0.25 + 0.5 * py_rng.random(), waveform="sine", decay=5.0)

    # Short fade prevents edge clicks while retaining loop energy.
    fade = int(0.035 * SR)
    audio[:fade] *= np.linspace(0, 1, fade)[:, None]
    audio[-fade:] *= np.linspace(1, 0, fade)[:, None]
    audio = np.tanh(audio * 1.35)
    peak = float(np.max(np.abs(audio)))
    if peak > 0:
        audio *= 0.92 / peak
    return audio, duration


def write_wav(path: Path, audio: np.ndarray) -> None:
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(pcm.tobytes())


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for index, (slug, title, bpm, root, mood) in enumerate(TRACKS, start=1):
        audio, duration = synthesize(index, bpm, root)
        wav_path = OUT / f"{slug}.wav"
        m4a_path = OUT / f"{slug}.m4a"
        write_wav(wav_path, audio)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(wav_path), "-c:a", "aac", "-b:a", "128k",
            "-ar", str(SR), str(m4a_path),
        ], check=True)
        wav_path.unlink()
        manifest.append({
            "id": index,
            "slug": slug,
            "title": title,
            "bpm": bpm,
            "mood": mood,
            "duration_seconds": round(duration, 3),
            "asset": f"assets/audio/abstract-human-v1/{slug}.m4a",
            "native_search": f"{mood}, electronic instrumental, {bpm} bpm",
        })
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Generated {len(manifest)} original audio tracks in {OUT}")


if __name__ == "__main__":
    main()
