#!/usr/bin/env python3
"""
Telethon parser for portugal.emigro.online — based on Barakhlo parser.

Reads new text messages from configured Telegram groups (e.g. @chatlisboa),
POSTs signals to Emigro /api/v1/ingest/community-signals for editorial review.

First run (interactive auth):
  cd parser && pip install -r requirements.txt && python main.py --auth

Incremental cron:
  python main.py --once

Bootstrap + JSON (pipeline):
  python main.py --once --bootstrap --json-out parser/out/signals-latest.json
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml
from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.types import Message

from sender import send_batch
from signal_builder import build_hashtags, detect_content_kind, is_useful_signal, should_skip_text, topic_hints
from storage import get_last_id, set_last_id

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

TG_API_ID = int(os.getenv("TG_API_ID", "0"))
TG_API_HASH = os.getenv("TG_API_HASH", "")
SESSION_FILE = os.getenv("SESSION_FILE", str(ROOT / "tg.session"))
EMIGRO_API_URL = os.getenv("EMIGRO_API_URL", "http://localhost:3000")
INGEST_API_KEY = os.getenv("COMMUNITY_INGEST_API_KEY", "")
INCREMENTAL_LIMIT = int(os.getenv("PARSER_INCREMENTAL_LIMIT", "40"))
BOOTSTRAP_LIMIT = int(os.getenv("PARSER_BOOTSTRAP_LIMIT", "100"))
MAX_AGE_HOURS = int(os.getenv("PARSER_MAX_AGE_HOURS", "48"))
SINCE_DAYS_LIMIT = int(os.getenv("PARSER_SINCE_DAYS_LIMIT", "400"))


def make_client() -> TelegramClient:
    from telethon.sessions import StringSession

    session_string = (os.getenv("TG_SESSION_STRING") or "").strip()
    if session_string:
        return TelegramClient(StringSession(session_string), TG_API_ID, TG_API_HASH)
    return TelegramClient(SESSION_FILE, TG_API_ID, TG_API_HASH)


def load_groups() -> list[dict]:
    with open(ROOT / "groups.yaml", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    return data.get("groups", [])


def build_signal(msg: Message, group_cfg: dict) -> dict | None:
    text = (msg.message or "").strip()
    skip = should_skip_text(text)
    if skip:
        return None
    hints = topic_hints(text)
    if not is_useful_signal(text, hints):
        return None
    if msg.reply_to and getattr(msg.reply_to, "forum_topic", False) is False and msg.reply_to_msg_id:
        # skip thread replies — focus on top-level questions
        return None

    username = group_cfg["username"].lstrip("@")
    posted = msg.date
    if posted.tzinfo is None:
        posted = posted.replace(tzinfo=timezone.utc)

    content_kind = detect_content_kind(text, hints)
    hashtags = build_hashtags(text, hints, content_kind)

    return {
        "message_id": msg.id,
        "channel_username": username,
        "channel_title": group_cfg.get("title"),
        "post_url": f"https://telegram.me/{username}/{msg.id}",
        "text": text,
        "topic_hints": hints,
        "content_kind": content_kind,
        "hashtags": hashtags,
        "city": group_cfg.get("city", "lisbon"),
        "country_key": group_cfg.get("country_key", "portugal"),
        "posted_at": posted.isoformat().replace("+00:00", "Z"),
    }


async def process_group(
    client: TelegramClient,
    group_cfg: dict,
    *,
    dry_run: bool = False,
    bootstrap: bool = False,
    since_days: int = 0,
) -> dict:
    username = group_cfg["username"].lstrip("@")
    group_id = group_cfg.get("group_id", username)
    last_id = 0 if bootstrap or since_days > 0 else get_last_id(group_id)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=MAX_AGE_HOURS)
    if since_days > 0:
        cutoff = datetime.now(timezone.utc) - timedelta(days=since_days)
    limit = SINCE_DAYS_LIMIT if since_days > 0 else (BOOTSTRAP_LIMIT if bootstrap else INCREMENTAL_LIMIT)

    entity = await client.get_entity(username)
    signals: list[dict] = []
    max_id = last_id

    if since_days > 0:
        print(f"  since-days={since_days}: from {cutoff.strftime('%Y-%m-%d %H:%M')} UTC, limit={limit}")
        async for msg in client.iter_messages(entity, offset_date=cutoff, reverse=True, limit=limit):
            if not isinstance(msg, Message) or msg.action:
                continue
            msg_date = msg.date.replace(tzinfo=timezone.utc) if msg.date.tzinfo is None else msg.date
            if msg_date < cutoff:
                continue
            payload = build_signal(msg, group_cfg)
            if not payload:
                continue
            signals.append(payload)
            max_id = max(max_id, msg.id)
    else:
        kwargs: dict = {"limit": limit, "reverse": not bootstrap}
        if not bootstrap and last_id > 0:
            kwargs["min_id"] = last_id

        async for msg in client.iter_messages(entity, **kwargs):
            if not isinstance(msg, Message) or msg.action:
                continue
            msg_date = msg.date.replace(tzinfo=timezone.utc) if msg.date.tzinfo is None else msg.date
            if msg_date < cutoff:
                continue
            payload = build_signal(msg, group_cfg)
            if not payload:
                continue
            signals.append(payload)
            max_id = max(max_id, msg.id)

    print(f"@{username}: {len(signals)} signal(s) (bootstrap={bootstrap}, since_id={last_id})")

    if dry_run:
        for s in signals[:3]:
            print(f"  sample [{','.join(s['topic_hints']) or 'general'}]: {s['text'][:120]}…")
        return {"group_id": group_id, "signals": signals, "dry_run": True}

    if signals and INGEST_API_KEY:
        result = await send_batch(EMIGRO_API_URL, INGEST_API_KEY, signals)
        print(f"  ingest: {result}")
    elif signals:
        print("  skip HTTP ingest: COMMUNITY_INGEST_API_KEY not set")

    if not bootstrap and not since_days and max_id > last_id:
        set_last_id(group_id, max_id)

    return {"group_id": group_id, "signals": signals}


async def run(
    *,
    dry_run: bool = False,
    bootstrap: bool = False,
    since_days: int = 0,
    json_out: str | None = None,
) -> None:
    if not TG_API_ID or not TG_API_HASH:
        raise SystemExit("Set TG_API_ID and TG_API_HASH in parser/.env")

    groups = load_groups()
    client = make_client()
    await client.start()
    all_signals: list[dict] = []
    try:
        for group in groups:
            result = await process_group(
                client, group, dry_run=dry_run or bool(json_out), bootstrap=bootstrap, since_days=since_days
            )
            all_signals.extend(result.get("signals") or [])
    finally:
        await client.disconnect()

    if json_out:
        out_path = Path(json_out)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"fetched_at": datetime.now(timezone.utc).isoformat(), "signals": all_signals}
        out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Wrote {len(all_signals)} signals → {out_path}")
        if not bootstrap and not since_days:
            for group in groups:
                gid = group.get("group_id", group["username"])
                ids = [s["message_id"] for s in all_signals if s["channel_username"] == group["username"].lstrip("@")]
                if ids:
                    set_last_id(gid, max(ids))


async def auth_only() -> None:
    client = make_client()
    await client.start()
    me = await client.get_me()
    print(f"OK as {me.username or me.id}")
    await client.disconnect()


def main() -> None:
    parser = argparse.ArgumentParser(description="Emigro Portugal community signal parser")
    parser.add_argument("--auth", action="store_true", help="Telethon login only")
    parser.add_argument("--once", action="store_true", help="Single incremental run (cron)")
    parser.add_argument("--dry-run", action="store_true", help="Fetch without POST")
    parser.add_argument("--bootstrap", action="store_true", help="Recent window, ignore cursor (first fill)")
    parser.add_argument("--since-days", type=int, default=0, help="Import useful signals since N days ago (e.g. 30)")
    parser.add_argument("--json-out", metavar="PATH", help="Write signals JSON (for TS pipeline)")
    args = parser.parse_args()

    if args.auth:
        asyncio.run(auth_only())
        return

    asyncio.run(
        run(
            dry_run=args.dry_run,
            bootstrap=args.bootstrap,
            since_days=args.since_days,
            json_out=args.json_out,
        )
    )


if __name__ == "__main__":
    main()
