"""POST signal batches to Emigro ingest API."""

from __future__ import annotations

import asyncio

import httpx


async def send_batch(api_url: str, api_key: str, signals: list[dict]) -> dict:
    if not signals:
        return {"received": 0, "inserted": 0, "skipped": 0}

    async with httpx.AsyncClient(timeout=120.0) as client:
        resp = await client.post(
            f"{api_url.rstrip('/')}/api/v1/ingest/community-signals",
            headers={"X-Api-Key": api_key, "Content-Type": "application/json"},
            json={"signals": signals},
        )
        resp.raise_for_status()
        return resp.json()
