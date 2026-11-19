import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/admin/supabase";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import { inlineRows } from "@/lib/telegram/bot/markup";
import { REQUEST_DB_APP, REQUEST_TTL_MS } from "@/lib/telegram/bot/session";

export const runtime = "nodejs";
export const maxDuration = 60;

const IDLE_MS = 24 * 60 * 60 * 1000;

/**
 * One gentle reminder for people who left the specialist-request dialogue in @emigro_chat_bot
 * half-way: idle for 24 h, session still alive (48 h TTL), not reminded yet.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const now = Date.now();
  const { data, error } = await supabase
    .from("emigro_bot_sessions")
    .select("telegram_user_id, step, payload, updated_at, expires_at")
    .eq("app", REQUEST_DB_APP)
    .lt("updated_at", new Date(now - IDLE_MS).toISOString())
    .gt("expires_at", new Date(now).toISOString());
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  let reminded = 0;
  for (const row of data ?? []) {
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    if (payload.reminded) continue;
    const sent = await sendStatsBotMessage(
      row.telegram_user_id,
      "Вы начали заявку на подбор специалиста, но не закончили. Осталось несколько вопросов — продолжим? Это бесплатно.",
      { parseMode: null, replyMarkup: inlineRows([[{ text: "Продолжить заявку", callback_data: "rs:resume" }]]) }
    );
    if (!sent.success) continue;
    reminded++;
    await supabase
      .from("emigro_bot_sessions")
      .update({
        payload: { ...payload, reminded: true },
        expires_at: new Date(now + REQUEST_TTL_MS).toISOString(),
      })
      .eq("telegram_user_id", row.telegram_user_id);
  }
  return NextResponse.json({ ok: true, candidates: data?.length ?? 0, reminded });
}
