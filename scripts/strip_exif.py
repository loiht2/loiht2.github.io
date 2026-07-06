#!/usr/bin/env python3
"""Losslessly remove metadata segments from JPEGs (no pixel re-encode).

Drops APP1 (EXIF/XMP), APP3-APP13 (incl. Photoshop/IPTC), APP15, COM.
Keeps APP0 (JFIF), APP2 (ICC color profile), APP14 (Adobe color transform).

Usage: python3 scripts/strip_exif.py public/assets/images/*.jpg
"""
import sys
from pathlib import Path

DROP = {0xE1, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEF, 0xFE}

def strip(path: Path) -> None:
    data = path.read_bytes()
    if data[:2] != b"\xff\xd8":
        raise SystemExit(f"{path}: not a JPEG")
    out = bytearray(b"\xff\xd8")
    i = 2
    found_sos = False
    while i < len(data) - 1:
        if data[i] != 0xFF:
            raise SystemExit(f"{path}: corrupt segment at byte {i}; re-export the image manually")
        marker = data[i + 1]
        if marker == 0xDA:          # start-of-scan: copy the rest verbatim
            out += data[i:]
            found_sos = True
            break
        if marker == 0xFF:          # fill byte
            i += 1
            continue
        seglen = int.from_bytes(data[i + 2 : i + 4], "big")
        if marker not in DROP:
            out += data[i : i + 2 + seglen]
        i += 2 + seglen
    if not found_sos:
        raise SystemExit(f"{path}: no SOS marker found — file truncated or corrupt; not writing output")
    path.write_bytes(bytes(out))
    print(f"stripped {path.name}: {len(data)} -> {len(out)} bytes")

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        strip(Path(arg))
