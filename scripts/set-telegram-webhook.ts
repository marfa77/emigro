#!/usr/bin/env tsx
/**
 * Register Telegram webhook for @emigro_chat_bot (production).
 *
 * Usage:
 *   npx tsx scripts/set-telegram-webhook.ts
 *   npx tsx scripts/set-telegram-webhook.ts --url https://www.emigro.online/api/telegram/webhook
 *   npx tsx scripts/set-telegram-webhook.ts --delete
 */

import "dotenv/config";

function botToken(): string {
  return (
    process.env.EMIGRO_CHAT_BOT_TOKEN ||
    process.env.EMIGRO_BOT_TOKEN ||
    ""
  ).trim();
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const deleteWebhook = args.includes("--delete");
  const urlIdx = args.indexOf("--url");
  const urlArg = urlIdx >= 0 ? args[urlIdx + 1] : undefined;

  const token = botToken();
  if (!token) {
    console.error("EMIGRO_CHAT_BOT_TOKEN is not set (@emigro_chat_bot from BotFather)");
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

  const webhookUrl = urlArg || `${site}/api/telegram/webhook`;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();

  const body: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ["message", "edited_message"],
    drop_pending_updates: false,
  };
  if (secret) {
    body.secret_token = secret;
  }

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

  console.log("Webhook set:", webhookUrl);
  if (secret) console.log("Secret token configured (TELEGRAM_WEBHOOK_SECRET)");

  const infoRes = await fetch(`${base}/getWebhookInfo`);
  const infoData = (await infoRes.json()) as {
    result?: { url?: string; pending_update_count?: number; last_error_message?: string };
  };
  const info = infoData.result ?? {};
  console.log("getWebhookInfo:", info.url, "pending:", info.pending_update_count);
  if (info.last_error_message) {
    console.warn("last_error:", info.last_error_message);
  }

  const meRes = await fetch(`${base}/getMe`);
  const meData = (await meRes.json()) as { result?: { username?: string; id?: number } };
  if (meData.result?.username) {
    console.log("Bot:", `@${meData.result.username} (id ${meData.result.id})`);
  }

  return 0;
}

main().then((code) => process.exit(code));
