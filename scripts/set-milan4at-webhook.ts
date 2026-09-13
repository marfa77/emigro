#!/usr/bin/env tsx
/**
 * Register Telegram webhook for MILAN4AT_BOT_TOKEN (@benchenergy_bot drafts).
 *
 *   npx tsx scripts/set-milan4at-webhook.ts
 *   npx tsx scripts/set-milan4at-webhook.ts --delete
 */
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const deleteWebhook = args.includes("--delete");
  const token = (process.env.MILAN4AT_BOT_TOKEN || "").trim();
  if (!token) {
    console.error("MILAN4AT_BOT_TOKEN is not set");
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
    console.log(data);
    return data.ok ? 0 : 1;
  }

  const rawSite = (
    process.env.EMIGRO_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.emigro.online"
  )
    .trim()
    .replace(/\/$/, "");
  const site =
    !rawSite || /localhost|127\.0\.0\.1/i.test(rawSite)
      ? "https://www.emigro.online"
      : rawSite;
  const webhookUrl = `${site}/api/telegram/milan4at-webhook`;
  const secret = process.env.MILAN4AT_WEBHOOK_SECRET?.trim();
  const body: Record<string, unknown> = {
    url: webhookUrl,
    allowed_updates: ["message", "edited_message"],
    drop_pending_updates: false,
  };
  if (secret) body.secret_token = secret;

  const res = await fetch(`${base}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  console.log(data);
  const info = await fetch(`${base}/getWebhookInfo`).then((r) => r.json());
  console.log("getWebhookInfo:", info);
  return data.ok ? 0 : 1;
}

main().then((c) => process.exit(c));
