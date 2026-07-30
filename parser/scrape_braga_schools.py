#!/usr/bin/env python3
"""One-off: scrape school-related messages from @braga_pt_rus."""
from __future__ import annotations

import asyncio
import json
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from telethon import TelegramClient

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

SCHOOL_RE = re.compile(
    r"школ|school|CLIB|OBS|CLIP|Gualtar|кол[её]дж|col[eé]gio|international|"
    r"матр[иі]кул|ensino|agrupamento|детсад|jardim|nursery|IB\b|British|"
    r"публичн|частн|учен|класс",
    re.I,
)


async def main() -> None:
    api_id = int(os.getenv("TG_API_ID", "0"))
    api_hash = os.getenv("TG_API_HASH", "")
    from telethon.sessions import StringSession

    session_string = (os.getenv("TG_SESSION_STRING") or "").strip()
    if session_string:
        client = TelegramClient(StringSession(session_string), api_id, api_hash)
    else:
        session = os.getenv("SESSION_FILE", str(ROOT / "tg.session"))
        client = TelegramClient(session, api_id, api_hash)
    await client.connect()
    if not await client.is_user_authorized():
        print("NOT_AUTHORIZED")
        return

    try:
        entity = await client.get_entity("braga_pt_rus")
        print("ENTITY_OK", getattr(entity, "title", None), getattr(entity, "username", None))
    except Exception as e:
        print("ENTITY_ERR", type(e).__name__, e)
        try:
            from telethon.tl.functions.channels import JoinChannelRequest

            await client(JoinChannelRequest("braga_pt_rus"))
            entity = await client.get_entity("braga_pt_rus")
            print("JOINED", getattr(entity, "title", None))
        except Exception as e2:
            print("JOIN_ERR", type(e2).__name__, e2)
            await client.disconnect()
            return

    hits = []
    async for msg in client.iter_messages(entity, limit=1500):
        text = (msg.message or "").strip()
        if not text or len(text) < 35 or not SCHOOL_RE.search(text):
            continue
        hits.append(
            {
                "id": msg.id,
                "date": msg.date.isoformat() if msg.date else None,
                "text": " ".join(text.split())[:700],
            }
        )
        if len(hits) >= 60:
            break

    out = ROOT / "out" / "braga-schools-hits.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(hits, ensure_ascii=False, indent=2), encoding="utf-8")
    print("HITS", len(hits), "->", out)
    for h in hits[:40]:
        print("---", (h["date"] or "")[:10], h["id"])
        print(h["text"])
    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
