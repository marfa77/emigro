#!/usr/bin/env tsx
/**
 * Register Telegram webhook for Emigro news bot (EMIGRO_NEWS_BOT_TOKEN).
 * Used for #молния owner approval callbacks.
 *
 *   npx tsx scripts/set-news-bot-webhook.ts
 *   npx tsx scripts/set-news-bot-webhook.ts --delete
 */
import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function botToken(): string {
  return (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || "").trim();
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const deleteWebhook = args.includes("--delete");
  const token = botToken();
  if (!token) {
    console.error("EMIGRO_NEWS_BOT_TOKEN is not set");
    return 1;
  }

  const base = `https://api.telegram.org/bot${token}`;

  if (deleteWebhook) {
    const res = await fetch(`${base}/deleteWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drop_pending_updates: false }),
    });
    const data = await res.json();
    console.log("Webhook deleted:", data);
    return data.ok ? 0 : 1;
  }

  const site = (
    process.env.EMIGRO_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.emigro.online"
  )
    .trim()
    .replace(/\/$/, "");

  const webhookUrl = `${site}/api/telegram/news-webhook`;
  const secret =
    process.env.TELEGRAM_NEWS_WEBHOOK_SECRET?.trim() ||
    process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  const body: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: false,
  };
  if (secret) body.secret_token = secret;

  const setRes = await fetch(`${base}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const setData = (await setRes.json()) as { ok?: boolean; description?: string };
  if (!setData.ok) {
    console.error("setWebhook failed:", setData);
    return 1;
  }

  console.log("News bot webhook set:", webhookUrl);
  if (secret) console.log("Secret token configured");

  const infoRes = await fetch(`${base}/getWebhookInfo`);
  const infoData = (await infoRes.json()) as {
    result?: { url?: string; pending_update_count?: number; last_error_message?: string };
  };
  console.log("getWebhookInfo:", infoData.result);

  return 0;
}

main().then((code) => process.exit(code));
