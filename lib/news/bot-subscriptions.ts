import { createAdminClient } from "@/lib/admin/supabase";
import type { NewsBotTopic } from "@/lib/news/bot-subscribe-topics";

export type NewsBotSubscription = {
  telegram_user_id: number;
  chat_id: number;
  topic_key: string;
  status: "active" | "paused";
};

export async function upsertNewsBotSubscription(input: {
  telegramUserId: number;
  chatId: number;
  topic: NewsBotTopic;
  username?: string;
  firstName?: string;
}): Promise<{ created: boolean }> {
  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("emigro_news_bot_subscriptions")
    .select("status")
    .eq("telegram_user_id", input.telegramUserId)
    .eq("topic_key", input.topic.key)
    .maybeSingle();

  const { error } = await supabase.from("emigro_news_bot_subscriptions").upsert(
    {
      telegram_user_id: input.telegramUserId,
      chat_id: input.chatId,
      topic_key: input.topic.key,
      status: "active",
      username: input.username ?? null,
      first_name: input.firstName ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "telegram_user_id,topic_key" }
  );
  if (error) throw new Error(error.message);
  return { created: !existing || existing.status !== "active" };
}

export async function pauseNewsBotSubscriptions(
  telegramUserId: number,
  topicKey?: string
): Promise<number> {
  const supabase = createAdminClient();
  let query = supabase
    .from("emigro_news_bot_subscriptions")
    .update({ status: "paused", updated_at: new Date().toISOString() })
    .eq("telegram_user_id", telegramUserId)
    .eq("status", "active");
  if (topicKey) query = query.eq("topic_key", topicKey);
  const { data, error } = await query.select("topic_key");
  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}

export async function listActiveNewsBotSubscriptions(
  topicKey?: string
): Promise<NewsBotSubscription[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("emigro_news_bot_subscriptions")
    .select("telegram_user_id, chat_id, topic_key, status")
    .eq("status", "active");
  if (topicKey) query = query.eq("topic_key", topicKey);
  const { data, error } = await query;
  if (error) {
    console.warn("[news-bot] list subscriptions failed:", error.message);
    return [];
  }
  return (data ?? []) as NewsBotSubscription[];
}

export async function markNewsBotDelivery(input: {
  telegramUserId: number;
  digestId: string;
  topicKey: string;
}): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("emigro_news_bot_deliveries").insert({
    telegram_user_id: input.telegramUserId,
    digest_id: input.digestId,
    topic_key: input.topicKey,
  });
  if (error) {
    if (error.code === "23505") return false;
    console.warn("[news-bot] mark delivery failed:", error.message);
    return false;
  }
  return true;
}

export async function pauseSubscriptionForBlockedUser(
  telegramUserId: number,
  topicKey: string
): Promise<void> {
  await pauseNewsBotSubscriptions(telegramUserId, topicKey);
}
