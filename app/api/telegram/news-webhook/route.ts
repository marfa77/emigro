import { NextResponse } from "next/server";
import { newsBotToken } from "@/lib/telegram";
import {
  handleLightningApprovalCallback,
  handleLightningApprovalCommand,
} from "@/lib/news/lightning-approval";
import { handleGuideApprovalCallback } from "@/lib/news/run-guide-telegram-queue";
import { processTelegramUpdate } from "@/lib/telegram/handle-update";

export const runtime = "nodejs";
export const maxDuration = 60;

type NewsUpdate = {
  update_id?: number;
  message?: {
    message_id?: number;
    text?: string;
    chat?: { id?: number | string; type?: string };
    from?: { id?: number | string; username?: string; first_name?: string; last_name?: string };
  };
  edited_message?: NewsUpdate["message"];
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

  let payload: NewsUpdate;
  try {
    payload = (await req.json()) as NewsUpdate;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const cb = payload.callback_query;
    if (cb?.id && cb.data) {
      const args = {
        data: cb.data,
        chatId: cb.message?.chat?.id ?? cb.from?.id ?? "",
        userId: cb.from?.id,
        callbackQueryId: cb.id,
        messageId: cb.message?.message_id,
      };
      const guideHandled = await handleGuideApprovalCallback(args);
      if (!guideHandled) {
        await handleLightningApprovalCallback(args);
      }
    } else {
      // Same bot token as EMIGRO_CHAT_BOT_TOKEN — must keep /stats, /start, wizard deep links.
      const msg = payload.message || payload.edited_message;
      let lightningHandled = false;
      if (msg?.text && msg.chat?.id != null) {
        lightningHandled = await handleLightningApprovalCommand({
          text: msg.text,
          chatId: msg.chat.id,
          userId: msg.from?.id,
        });
      }
      if (!lightningHandled) {
        await processTelegramUpdate(payload);
      }
    }
  } catch (e) {
    console.error("[telegram/news-webhook] handler failed:", e);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    bot: "emigro_news+chat",
    configured: Boolean(newsBotToken()),
    webhook: "/api/telegram/news-webhook",
    handlers: ["lightning", "guide", "stats", "wizard"],
  });
}
