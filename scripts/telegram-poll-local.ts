/**
 * Local Telegram bot polling (no webhook) — for testing wizard report delivery.
 *
 * Usage:
 *   npx tsx scripts/telegram-poll-local.ts
 *
 * Requires in .env.local:
 *   EMIGRO_CHAT_BOT_TOKEN=...
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (for session lookup)
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { processTelegramUpdate } from "../lib/telegram/handle-update";

const token =
  process.env.EMIGRO_CHAT_BOT_TOKEN?.trim() || process.env.EMIGRO_BOT_TOKEN?.trim();

if (!token) {
  console.error("EMIGRO_CHAT_BOT_TOKEN is not set");
  process.exit(1);
}

let offset = 0;

async function poll(): Promise<void> {
  const url = `https://api.telegram.org/bot${token}/getUpdates?timeout=30&offset=${offset}`;
  const res = await fetch(url);
  const json = (await res.json()) as {
    ok?: boolean;
    result?: Array<{ update_id: number; message?: unknown; edited_message?: unknown }>;
    description?: string;
  };

  if (!json.ok) {
    console.error("[telegram-poll]", json.description ?? res.statusText);
    return;
  }

  for (const update of json.result ?? []) {
    offset = update.update_id + 1;
    await processTelegramUpdate(update as Parameters<typeof processTelegramUpdate>[0]);
    console.log("[telegram-poll] processed update", update.update_id);
  }
}

async function deleteWebhook(): Promise<void> {
  const res = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drop_pending_updates: false }),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!json.ok) {
    console.warn("[telegram-poll] deleteWebhook:", json.description ?? res.statusText);
  } else {
    console.log("[telegram-poll] webhook cleared for local polling");
  }
}

async function main(): Promise<void> {
  await deleteWebhook();
  console.log("Polling @emigro_chat_bot updates — Ctrl+C to stop");
  for (;;) {
    try {
      await poll();
    } catch (e) {
      console.error("[telegram-poll] error:", e instanceof Error ? e.message : e);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

main().catch((e) => {
  console.error("[telegram-poll] fatal:", e instanceof Error ? e.message : e);
  process.exit(1);
});
