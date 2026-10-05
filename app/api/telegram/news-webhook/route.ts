import { NextResponse } from "next/server";
import { newsBotToken } from "@/lib/telegram";
import { processTelegramUpdate } from "@/lib/telegram/handle-update";

export const runtime = "nodejs";
/** Threads IMAGE + container wait can exceed 60s. */
export const maxDuration = 180;

function verifyWebhookSecret(req: Request): boolean {
  const expected =
    process.env.TELEGRAM_NEWS_WEBHOOK_SECRET?.trim() || process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!expected) return true;
  const header = req.headers.get("x-telegram-bot-api-secret-token");
  return header === expected;
}

export async function POST(req: Request) {
  if (!newsBotToken()) {
    return NextResponse.json({ ok: false, error: "News bot not configured" }, { status: 503 });
  }
  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await processTelegramUpdate(payload as Parameters<typeof processTelegramUpdate>[0]);
  } catch (e) {
    console.error("[telegram/news-webhook] handler failed:", e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: "emigro_chat_bot",
    configured: Boolean(newsBotToken()),
    webhook: "/api/telegram/news-webhook",
    handlers: ["owner", "home", "news", "city", "assist", "property", "wizard"],
  });
}
