import { NextResponse } from "next/server";
import { newsBotToken } from "@/lib/telegram";
import {
  handleLightningApprovalCallback,
  handleLightningApprovalCommand,
} from "@/lib/news/lightning-approval";

export const runtime = "nodejs";
export const maxDuration = 60;

type NewsUpdate = {
  message?: {
    message_id?: number;
    text?: string;
    chat?: { id?: number | string };
    from?: { id?: number | string };
  };
  callback_query?: {
    id: string;
    data?: string;
    from?: { id?: number | string };
    message?: {
      message_id?: number;
      chat?: { id?: number | string };
    };
  };
};

function verifyWebhookSecret(req: Request): boolean {
  const expected = process.env.TELEGRAM_NEWS_WEBHOOK_SECRET?.trim() || process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
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

  let payload: NewsUpdate;
  try {
    payload = (await req.json()) as NewsUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const cb = payload.callback_query;
    if (cb?.id && cb.data) {
      await handleLightningApprovalCallback({
        data: cb.data,
        chatId: cb.message?.chat?.id ?? cb.from?.id ?? "",
        userId: cb.from?.id,
        callbackQueryId: cb.id,
        messageId: cb.message?.message_id,
      });
    } else if (payload.message?.text && payload.message.chat?.id != null) {
      await handleLightningApprovalCommand({
        text: payload.message.text,
        chatId: payload.message.chat.id,
        userId: payload.message.from?.id,
      });
    }
  } catch (e) {
    console.error("[telegram/news-webhook] handler failed:", e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: "emigro_news",
    configured: Boolean(newsBotToken()),
    webhook: "/api/telegram/news-webhook",
  });
}
