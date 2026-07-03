"""Persist last processed message id per channel."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

STATE_FILE = Path(__file__).resolve().parent / "state.json"


def load_state() -> dict[str, Any]:
    if not STATE_FILE.exists():
        return {}
    try:
        with open(STATE_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def save_state(state: dict[str, Any]) -> None:
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def get_last_id(group_id: str) -> int:
    entry = load_state().get(group_id, {})
    return int(entry.get("last_id", 0))


def set_last_id(group_id: str, last_id: int) -> None:
    state = load_state()
    state[group_id] = {"last_id": last_id}
    save_state(state)
