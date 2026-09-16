#!/usr/bin/env python3
"""Fetch recent messages from Milan/Como relocant chats as JSON (stdout). Uses parser/tg.session."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.types import Message

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

TG_API_ID = int(os.getenv("TG_API_ID", "0"))
TG_API_HASH = os.getenv("TG_API_HASH", "")
# Always anchor session under parser/ — a relative SESSION_FILE=tg.session breaks when cwd ≠ parser/
_session_env = (os.getenv("SESSION_FILE") or "").strip()
SESSION_FILE = (
    str(Path(_session_env).expanduser())
    if _session_env and Path(_session_env).is_absolute()
    else str(ROOT / (_session_env or "tg.session"))
)

ALLOWED_CHANNELS = ("milan_4at", "como_4at", "milan_ua_chat")


def make_client() -> TelegramClient:
    from telethon.sessions import StringSession

    session_string = (os.getenv("TG_SESSION_STRING") or "").strip()
    if session_string:
        return TelegramClient(StringSession(session_string), TG_API_ID, TG_API_HASH)
    return TelegramClient(SESSION_FILE, TG_API_ID, TG_API_HASH)


async def fetch(channel: str, hours: float, limit: int) -> list[dict]:
    if not TG_API_ID or not TG_API_HASH:
        raise SystemExit("Set TG_API_ID and TG_API_HASH in parser/.env")
    client = make_client()
    await client.connect()
    if not await client.is_user_authorized():
        await client.disconnect()
        raise SystemExit("Telethon session not authorized — run: cd parser && python main.py --auth")

    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    out: list[dict] = []
    try:
        entity = await client.get_entity(channel)
        async for msg in client.iter_messages(entity, limit=limit):
            if not isinstance(msg, Message) or msg.action:
                continue
            text = (msg.message or "").strip()
            if not text:
                continue
            d = msg.date
            if d.tzinfo is None:
                d = d.replace(tzinfo=timezone.utc)
            if d < cutoff:
                break
            sender = None
            if msg.sender:
                uname = getattr(msg.sender, "username", None)
                sid = getattr(msg.sender, "id", None)
                sender = {
                    "id": sid,
                    "username": uname,
                    "label": f"@{uname}" if uname else (f"id:{sid}" if sid else None),
                }
            out.append(
                {
                    "id": msg.id,
                    "channel": channel,
                    "date": d.isoformat().replace("+00:00", "Z"),
                    "text": text,
                    "url": f"https://t.me/{channel}/{msg.id}",
                    "reply_to": getattr(msg.reply_to, "reply_to_msg_id", None)
                    if msg.reply_to
                    else None,
                    "from": sender,
                }
            )
    finally:
        await client.disconnect()
    out.reverse()  # chronological
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--hours", type=float, default=4)
    ap.add_argument("--limit", type=int, default=80)
    ap.add_argument(
        "--channel",
        default="milan_4at",
        choices=list(ALLOWED_CHANNELS),
        help="Telegram public username without @",
    )
    args = ap.parse_args()
    rows = asyncio.run(fetch(args.channel, args.hours, args.limit))
    json.dump(
        {
            "channel": args.channel,
            "hours": args.hours,
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "messages": rows,
        },
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
