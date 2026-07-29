"""Topic hints, content kind, hashtags from Telegram text."""

from __future__ import annotations

import re

TOPIC_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("nif", re.compile(r"\bnif\b|finanças|financas|e-fatura|efatura|representante", re.I)),
    ("aima", re.compile(r"\baima\b|agora\.imigrante|agora\b|vng|внж|виз|imigrante", re.I)),
    ("arenda", re.compile(r"аренд|arend|caução|caucao|fiador|arrendamento|квартир|жиль", re.I)),
    ("bank", re.compile(r"\bbank\b|банк|conta|revolut|millennium|открыть\s+сч", re.I)),
    ("sns", re.compile(r"\bsns\b|здоров|medico|médico|utente|numero\s+de\s+utente", re.I)),
    ("ciple", re.compile(r"ciple|caple|португал.*язык", re.I)),
    ("auto", re.compile(r"carta de condu|imt\b|водител|удостоверен|права\b|condutor|troca.*carta|замен.*прав|обмен.*прав", re.I)),
    ("transport", re.compile(r"метро|cp\b|comboios|bolt|uber|carris|viva\s+viagem|проезд", re.I)),
    ("sim", re.compile(r"\bsim\b|vodafone|meo|nos\b|интернет|мобильн", re.I)),
    ("school", re.compile(r"школ|school|детск|садик|kindergarten|colégio", re.I)),
    ("food", re.compile(r"ресторан|магазин|mercad|continente|lidl|еда|продукт", re.I)),
    ("pets", re.compile(r"собак|кошк|vet\b|ветерин|pet\b", re.I)),
]

USEFUL_RE = re.compile(
    r"nif|finanç|financ|aima|agora|vng|внж|виз|аренд|arend|caução|arrendamento|"
    r"банк|bank|conta|sns|utente|ciple|caple|reloca|переезд|легал|документ|"
    r"консул|passaporte|passport|паспорт|граждан|nacionalidade|residenc|"
    r"лайфхак|lifehack|life\s*hack|совет|рекоменд|подскаж|посовет|tip\b|"
    r"фишк|хак\b|как\s+сделать|где\s+лучше|кто\s+знает|стоит\s+ли|"
    r"метро|sim\b|школ|детск|ресторан|mercad|vet\b|imt\b|carta de condu|водител|удостоверен",
    re.I,
)

NOISE_RE = re.compile(
    r"стоматолог|rooftop|барахолк|продам|куплю|продаю|футбол|матч|"
    r"спектакл|игра\s+была|бар\s+на\s+крыше|lisbon_ravers|"
    r"группы\s+по\s+лиссабону.*продаж",
    re.I,
)

HASHTAG_RE = re.compile(r"#[\w\u0400-\u04ff]{2,32}", re.UNICODE)

KIND_NEWS = re.compile(
    r"новост|изменил|закон|принят|с\s+1\s|с\s+\d+\s|объявил|aima\s+сообщ|"
    r"министр|правительств|отставк|скандал|коррупц|парламент|"
    r"ministro|governo|demissão|inquérito|administração\s+interna",
    re.I,
)
KIND_LIFEHACK = re.compile(r"лайфхак|lifehack|life\s*hack|фишк|\bхак\b|life\s*tip", re.I)
KIND_TIP = re.compile(r"совет|рекоменд|подскаж|посовет|tip\b|кто\s+знает|поделитесь|стоит\s+ли", re.I)
KIND_QA = re.compile(r"\?\s*$|подскажите|как\s+получить|можно\s+ли|где\s+(?:взять|найти|оформ)", re.I)

KIND_TAG_RU = {
    "news": "новости",
    "lifehack": "лайфхак",
    "tip": "совет",
    "guide": "гайд",
    "qa": "вопрос",
}


def topic_hints(text: str) -> list[str]:
    hints: list[str] = []
    for key, pattern in TOPIC_PATTERNS:
        if pattern.search(text):
            hints.append(key)
    return hints


def extract_inline_hashtags(text: str) -> list[str]:
    return [h.lstrip("#").lower() for h in HASHTAG_RE.findall(text)]


def detect_content_kind(text: str, hints: list[str]) -> str:
    if KIND_NEWS.search(text):
        return "news"
    if KIND_LIFEHACK.search(text):
        return "lifehack"
    if KIND_QA.search(text):
        return "qa"
    if KIND_TIP.search(text):
        return "tip"
    if hints:
        return "guide"
    return "tip"


def build_hashtags(text: str, hints: list[str], content_kind: str) -> list[str]:
    tags: set[str] = set(extract_inline_hashtags(text))
    for h in hints:
        tags.add(h)
    tags.add(content_kind)
    ru = KIND_TAG_RU.get(content_kind)
    if ru:
        tags.add(ru)
    tags.add("portugal")
    tags.add("lisboa")
    tags.discard("")
    return sorted(tags)[:14]


def is_useful_signal(text: str, hints: list[str]) -> bool:
    if hints:
        return True
    if NOISE_RE.search(text):
        return False
    return bool(USEFUL_RE.search(text))


def should_skip_text(text: str) -> str | None:
    cleaned = (text or "").strip()
    if len(cleaned) < 30:
        return "too_short"
    if cleaned.startswith("/"):
        return "command"
    if re.search(r"^https?://\S+$", cleaned):
        return "link_only"
    if re.search(r"^(?:\+|-)?\d{8,}$", cleaned.replace(" ", "")):
        return "phone_only"
    return None
