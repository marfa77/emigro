#!/usr/bin/env npx tsx
/**
 * Local long-poll for MILAN4AT_BOT_TOKEN (dedicated draft bot).
 *
 *   npm run milan4at:poll
 *
 * Requires MILAN4AT_BOT_TOKEN in .env.local. Does not post into groups.
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import {
  milan4atBotToken,
  processMilan4atUpdate,
  type Milan4atUpdate,
} from "../lib/milan-4at/bot-handler";

const token = milan4atBotToken();
if (!token) {
  console.error("MILAN4AT_BOT_TOKEN is not set in .env.local");
  process.exit(1);
}

let offset = 0;

async function api(method: string, body?: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return (await res.json()) as {
    ok?: boolean;
    result?: unknown;
    description?: string;
  };
}

async function poll(): Promise<void> {
  const url = `https://api.telegram.org/bot${token}/getUpdates?timeout=30&offset=${offset}`;
  const res = await fetch(url);
  const json = (await res.json()) as {
    ok?: boolean;
    result?: Milan4atUpdate[];
    description?: string;
  };
  if (!json.ok) {
    console.error("[milan4at-poll]", json.description ?? res.statusText);
    return;
  }
  for (const update of json.result ?? []) {
    offset = update.update_id + 1;
    await processMilan4atUpdate(update);
    const msg = update.message || update.edited_message;
    console.log(
      "[milan4at-poll] processed",
      update.update_id,
      "chat",
      msg?.chat?.id,
      "text",
      (msg?.text || msg?.caption || "").slice(0, 60)
    );
  }
}

async function main(): Promise<void> {
  await api("deleteWebhook", { drop_pending_updates: false });
  const me = await api("getMe");
  const username =
    me.ok && me.result && typeof me.result === "object" && "username" in me.result
      ? String((me.result as { username?: string }).username)
      : "?";
  console.log(`Polling @${username} (milan4at drafts) — Ctrl+C to stop`);
  for (;;) {
    try {
      await poll();
    } catch (e) {
      console.error("[milan4at-poll] error:", e instanceof Error ? e.message : e);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error("[milan4at-poll] fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
