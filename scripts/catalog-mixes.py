#!/usr/bin/env python3
"""
Catalog the SiriusXM Pitbull Globalization mixes.

- Reads source files from brand-assets/audio/Past SiriusXm Mixes/
- Parses dates from filenames (which are like '06262024 @djdannywest.aif')
- Sorts chronologically — oldest = Vol 1
- Writes a private catalog CSV (kept out of git, never shown publicly)
- Generates a public-facing JSON catalog used by the Mixes page
- Generates one SVG cover per volume in public/cover-art/
"""
import csv
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path("/sessions/awesome-amazing-babbage/mnt/djdannywest")
SRC = ROOT / "brand-assets" / "audio" / "Past SiriusXm Mixes"
EXCLUDES = ROOT / "brand-assets" / "audio" / "_excludes.txt"
PRIVATE_CAT = ROOT / "brand-assets" / "audio" / "_catalog.csv"
PUBLIC_DATA = ROOT / "src" / "data"
COVER_DIR = ROOT / "public" / "cover-art"

# Read excludes (one filename per line, # comments allowed)
excludes = set()
if EXCLUDES.exists():
    for line in EXCLUDES.read_text().splitlines():
        s = line.strip()
        if s and not s.startswith("#"):
            excludes.add(s)

# --- 1. parse + sort ---
date_pat = re.compile(r"(\d{8})")

def parse_date(name):
    m = date_pat.search(name)
    if not m:
        return None
    s = m.group(1)
    # Treat as MMDDYYYY
    return f"{s[4:8]}-{s[0:2]}-{s[2:4]}"

def duration_seconds(p: Path) -> int:
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "default=noprint_wrappers=1:nokey=1", str(p)],
            capture_output=True, text=True, timeout=20,
        )
        return int(float(out.stdout.strip()))
    except Exception:
        return 0

files = sorted(
    [p for p in SRC.iterdir()
     if p.suffix.lower() in (".mp3", ".aif", ".aiff", ".wav")
     and p.name not in excludes],
    key=lambda p: (parse_date(p.name) or "9999-99-99", p.name),
)

# Assemble entries
entries = []
for i, p in enumerate(files, start=1):
    dur = duration_seconds(p)
    entries.append({
        "vol": i,
        "slug": f"siriusxm-globalization-vol-{i:02d}",
        "title": "SiriusXM Pitbull Globalization",
        "subtitle": f"Vol. {i:02d}",
        "source": "SiriusXM",
        "series": "Pitbull's Globalization",
        "duration_sec": dur,
        "duration_pretty": f"{dur // 60}:{dur % 60:02d}" if dur else "—",
        "is_explicit": False,  # Danny stated these are clean
        "is_master_lossless": p.suffix.lower() in (".aif", ".aiff", ".wav"),
        # private fields
        "_orig_filename": p.name,
        "_orig_date": parse_date(p.name) or "",
        "_orig_size_bytes": p.stat().st_size,
    })

# --- 2. write private catalog (never shipped to the public site) ---
PRIVATE_CAT.parent.mkdir(parents=True, exist_ok=True)
with PRIVATE_CAT.open("w", newline="") as f:
    w = csv.writer(f)
    w.writerow([
        "vol", "slug", "duration_pretty", "duration_sec",
        "is_master_lossless", "orig_filename", "orig_date", "orig_size_bytes",
    ])
    for e in entries:
        w.writerow([
            e["vol"], e["slug"], e["duration_pretty"], e["duration_sec"],
            e["is_master_lossless"], e["_orig_filename"], e["_orig_date"], e["_orig_size_bytes"],
        ])

# --- 3. write public-facing JSON used by the site (no dates, no original filenames) ---
PUBLIC_DATA.mkdir(parents=True, exist_ok=True)
public = [
    {
        "vol": e["vol"],
        "slug": e["slug"],
        "title": e["title"],
        "subtitle": e["subtitle"],
        "source": e["source"],
        "series": e["series"],
        "durationSec": e["duration_sec"],
        "duration": e["duration_pretty"],
        "isExplicit": e["is_explicit"],
        "coverArt": f"/cover-art/{e['slug']}.svg",
        "tags": ["Latin", "Open Format", "Peak Time"],  # placeholder until Danny tags them
    }
    for e in entries
]
with (PUBLIC_DATA / "mixes.json").open("w") as f:
    json.dump(public, f, indent=2)

# --- 4. generate SVG cover art per volume ---
COVER_DIR.mkdir(parents=True, exist_ok=True)

def cover_svg(vol: int, duration: str) -> str:
    n = f"{vol:02d}"
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0A0907"/>
      <stop offset="0.55" stop-color="#14110D"/>
      <stop offset="1" stop-color="#0A0907"/>
    </linearGradient>
    <radialGradient id="ember" cx="0.85" cy="0.15" r="0.65">
      <stop offset="0" stop-color="#E5B97A" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#E5B97A" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 0.5 0"/>
    </filter>
  </defs>

  <rect width="1000" height="1000" fill="url(#bg)"/>
  <rect width="1000" height="1000" fill="url(#ember)"/>
  <rect width="1000" height="1000" filter="url(#grain)" opacity="0.45"/>

  <!-- TOP STRIP -->
  <g font-family="Inter, system-ui, sans-serif" fill="#F5F1EA">
    <text x="80" y="105" font-size="20" letter-spacing="5" fill-opacity="0.78">SIRIUSXM</text>
    <text x="80" y="135" font-size="20" letter-spacing="5" fill-opacity="0.78">PITBULL GLOBALIZATION</text>
    <text x="80" y="165" font-size="20" letter-spacing="5" fill-opacity="0.78">CHANNEL 13</text>
    <line x1="80" y1="190" x2="180" y2="190" stroke="#E5B97A" stroke-opacity="0.85" stroke-width="2"/>
  </g>

  <!-- VOLUME LABEL -->
  <g font-family="Inter, system-ui, sans-serif" fill="#F5F1EA" fill-opacity="0.5">
    <text x="80" y="430" font-size="22" letter-spacing="8">VOLUME</text>
  </g>

  <!-- HUGE VOLUME NUMBER (vertically centered around y=620) -->
  <g font-family="Fraunces, Georgia, serif" fill="#F5F1EA"
     style="font-variation-settings: 'opsz' 144;">
    <text x="80" y="780" font-size="380" font-style="italic" font-weight="300"
          letter-spacing="-18">{n}</text>
  </g>

  <!-- ember dot accent next to number -->
  <circle cx="920" cy="430" r="6" fill="#E5B97A"/>

  <!-- BOTTOM STRIP -->
  <g font-family="Inter, system-ui, sans-serif" fill="#F5F1EA" fill-opacity="0.55">
    <line x1="80" y1="930" x2="920" y2="930" stroke="#F5F1EA" stroke-opacity="0.18" stroke-width="1"/>
    <text x="80" y="970" font-size="20" letter-spacing="5">DJ DANNY WEST</text>
    <text x="920" y="970" text-anchor="end" font-size="20" letter-spacing="5">{duration.upper()}</text>
  </g>
</svg>
"""

for e in entries:
    out = COVER_DIR / f"{e['slug']}.svg"
    out.write_text(cover_svg(e["vol"], e["duration_pretty"]))

print(f"Cataloged {len(entries)} mixes")
print(f"  Private CSV  -> {PRIVATE_CAT}")
print(f"  Public JSON  -> {PUBLIC_DATA / 'mixes.json'}")
print(f"  Covers       -> {COVER_DIR} ({len(entries)} files)")
print()
for e in entries[:3] + ["..."] + entries[-3:]:
    if e == "...":
        print("  ...")
        continue
    print(f"  Vol {e['vol']:02d}  {e['duration_pretty']}  {e['_orig_filename']}")
