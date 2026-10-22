#!/usr/bin/env python3
"""Fetch recent messages from @chatporto as JSON (stdout). Uses parser/tg.session."""

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
_session_env = (os.getenv("SESSION_FILE") or "").strip()
SESSION_FILE = (
    str(Path(_session_env).expanduser())
    if _session_env and Path(_session_env).is_absolute()
    else str(ROOT / (_session_env or "tg.session"))
)

# Public username without @. Override with CHATPORTO_CHANNEL.
DEFAULT_CHANNEL = (os.getenv("CHATPORTO_CHANNEL") or "chatporto").strip().lstrip("@")


def make_client() -> TelegramClient:
    from telethon.sessions import StringSession

    session_string = (os.getenv("TG_SESSION_STRING") or "").strip()
    if session_string:
        return TelegramClient(StringSession(session_string), TG_API_ID, TG_API_HASH)
    return TelegramClient(SESSION_FILE, TG_API_ID, TG_API_HASH)


def message_url(channel: str, msg_id: int, username: str | None) -> str:
    if username:
        return f"https://t.me/{username}/{msg_id}"
    # Private / no username — deep link still useful in Telethon clients
    return f"https://t.me/c/{channel}/{msg_id}"


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
        uname = getattr(entity, "username", None) or (channel if channel.isalpha() or "_" in channel else None)
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
                su = getattr(msg.sender, "username", None)
                sid = getattr(msg.sender, "id", None)
                sender = {
                    "id": sid,
                    "username": su,
                    "label": f"@{su}" if su else (f"id:{sid}" if sid else None),
                }
            out.append(
                {
                    "id": msg.id,
                    "channel": "chatporto",
                    "date": d.isoformat().replace("+00:00", "Z"),
                    "text": text,
                    "url": message_url(str(getattr(entity, "id", channel)), msg.id, uname),
                    "reply_to": getattr(msg.reply_to, "reply_to_msg_id", None) if msg.reply_to else None,
                    "from": sender,
                }
            )
    finally:
        await client.disconnect()
    out.reverse()
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--hours", type=float, default=26)
    ap.add_argument("--limit", type=int, default=120)
    ap.add_argument("--channel", default=DEFAULT_CHANNEL)
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
