#!/usr/bin/env python3
"""Convert root resume.yaml to Hugo data/resume.json."""

from __future__ import annotations

import json
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "resume.yaml"
TARGET_DIR = ROOT / "data"
TARGET = TARGET_DIR / "resume.json"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source file not found: {SOURCE}")

    with SOURCE.open("r", encoding="utf-8") as f:
        data = yaml.safe_load(f)

    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    with TARGET.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Converted {SOURCE} -> {TARGET}")


if __name__ == "__main__":
    main()
