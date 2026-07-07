import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { validateTelegramLogin } from "@/lib/telegram/validate-login";
import { sendWizardReportToTelegramUser } from "@/lib/wizard/send-telegram-report";
import type { WizardTelegramMode } from "@/lib/telegram/deep-link";

type DeliverBody = {
  session_id?: string;
  mode?: WizardTelegramMode;
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
};

export async function POST(request: Request) {
  let body: DeliverBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  const mode = body.mode;
  if (!sessionId || (mode !== "hub" && mode !== "corridor")) {
    return NextResponse.json({ error: "session_id and mode required" }, { status: 400 });
  }

  const payload = {
    id: body.id,
    first_name: body.first_name,
    last_name: body.last_name,
    username: body.username,
    photo_url: body.photo_url,
    auth_date: body.auth_date,
    hash: body.hash,
  };

  if (!validateTelegramLogin(payload)) {
    return NextResponse.json({ error: "Invalid Telegram login" }, { status: 400 });
  }

  const telegramUserId = String(body.id);
  const result = await sendWizardReportToTelegramUser({ sessionId, telegramUserId });
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Delivery failed" }, { status: 500 });
  }

  void trackServerEvent(
    "wizard_telegram_delivered",
    {
      session_id: sessionId,
      wizard_mode: mode,
      telegram_user_id: telegramUserId,
      skipped_duplicate: result.skipped ? "1" : "0",
    },
    "web"
  );

  return NextResponse.json({
    ok: true,
    delivered: !result.skipped,
    message: result.skipped
      ? "Отчёт уже был отправлен в этот Telegram."
      : "Отчёт отправлен в Telegram. Проверьте личные сообщения с ботом.",
  });
}
