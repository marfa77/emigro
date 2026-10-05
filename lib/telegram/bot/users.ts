import { createAdminClient } from "@/lib/admin/supabase";
import type { BotUserCtx } from "@/lib/telegram/bot/types";

export async function upsertBotUser(ctx: BotUserCtx, countryHint?: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();
    const { data: existing } = await supabase
      .from("emigro_bot_users")
      .select("telegram_user_id, country_hint")
      .eq("telegram_user_id", ctx.userId)
      .maybeSingle();

    let hint = countryHint ?? existing?.country_hint ?? null;
    if (!hint) {
      const { data: news } = await supabase
        .from("emigro_news_bot_subscriptions")
        .select("topic_key")
        .eq("telegram_user_id", ctx.userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();
      hint = news?.topic_key ?? null;
    }

    const { error } = await supabase.from("emigro_bot_users").upsert(
      {
        telegram_user_id: ctx.userId,
        chat_id: ctx.chatId,
        username: ctx.username ?? null,
        first_name: ctx.firstName ?? null,
        last_name: ctx.lastName ?? null,
        country_hint: hint,
        last_seen_at: now,
        ...(existing ? {} : { first_seen_at: now }),
      },
      { onConflict: "telegram_user_id" }
    );
    if (error) console.warn("[bot] upsert user failed:", error.message);
  } catch (e) {
    console.warn("[bot] upsert user failed:", e instanceof Error ? e.message : e);
  }
}

export async function markBotUserBlocked(telegramUserId: number): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase
      .from("emigro_bot_users")
      .update({ blocked_at: new Date().toISOString() })
      .eq("telegram_user_id", telegramUserId);
  } catch (e) {
    console.warn("[bot] mark blocked failed:", e instanceof Error ? e.message : e);
  }
}
