"""Topic hints from message text (for editorial queue, not auto-publish)."""

from __future__ import annotations

import re

TOPIC_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("nif", re.compile(r"\bnif\b|finanças|financas|e-fatura|efatura|representante", re.I)),
    ("aima", re.compile(r"\baima\b|agora\.imigrante|vng|внж|виз", re.I)),
    ("arenda", re.compile(r"аренд|arend|caução|caucao|fiador|arrendamento|квартир", re.I)),
    ("bank", re.compile(r"\bbank\b|банк|conta|revolut|millennium", re.I)),
    ("sns", re.compile(r"\bsns\b|здоров|medico|médico|utente", re.I)),
    ("ciple", re.compile(r"ciple|caple|португал.*язык", re.I)),
]


def topic_hints(text: str) -> list[str]:
    hints: list[str] = []
    for key, pattern in TOPIC_PATTERNS:
        if pattern.search(text):
            hints.append(key)
    return hints


def should_skip_text(text: str) -> str | None:
    cleaned = (text or "").strip()
    if len(cleaned) < 40:
        return "too_short"
    if cleaned.startswith("/"):
        return "command"
    if re.search(r"^https?://\S+$", cleaned):
        return "link_only"
    if re.search(r"^(?:\+|-)?\d{8,}$", cleaned.replace(" ", "")):
        return "phone_only"
    return None
