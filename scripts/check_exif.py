#!/usr/bin/env python3
"""Fail (exit 1) if any JPEG under the given dirs contains EXIF/XMP/IPTC metadata.

Usage: python3 scripts/check_exif.py public/assets/images
"""
import sys
from pathlib import Path

MARKERS = (b"Exif\x00\x00", b"http://ns.adobe.com/xap/1.0/", b"Photoshop 3.0")

def dirty_segments(data: bytes) -> list[str]:
    found = []
    for m in MARKERS:
        if m in data:
            found.append(m.split(b"/")[-1].decode("latin1").strip("\x00"))
    return found

def main(dirs: list[str]) -> int:
    bad = 0
    for d in dirs:
        for p in sorted(p for p in Path(d).rglob("*") if p.suffix.lower() in {".jpg", ".jpeg"}):
            hits = dirty_segments(p.read_bytes())
            if hits:
                print(f"DIRTY  {p}  ->  {', '.join(hits)}")
                bad += 1
            else:
                print(f"clean  {p}")
    return 1 if bad else 0

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["public/assets/images"]))
