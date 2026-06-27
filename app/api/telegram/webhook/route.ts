import { NextResponse } from "next/server";
import { statsBotToken } from "@/lib/telegram/admin-bot";
import { processTelegramUpdate, type TelegramUpdate } from "@/lib/telegram/handle-update";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyWebhookSecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  if (!expected) return true;
  const header = req.headers.get("x-telegram-bot-api-secret-token");
  return header === expected;
}

export async function POST(req: Request) {
  if (!statsBotToken()) {
    return NextResponse.json({ ok: false, error: "Telegram bot not configured" }, { status: 503 });
  }

  if (!verifyWebhookSecret(req)) {
    return NextResponse.json({ ok: false, error: "Invalid webhook secret" }, { status: 401 });
  }

  let payload: TelegramUpdate;
  try {
    payload = (await req.json()) as TelegramUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Respond immediately; process in same invocation (Vercel serverless has no background tasks).
  try {
    await processTelegramUpdate(payload);
  } catch (e) {
    console.error("[telegram/webhook] handler failed:", e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: "emigro_chat_bot",
    configured: Boolean(statsBotToken()),
    webhook: "/api/telegram/webhook",
  });
}
