import { createAdminClient } from "@/lib/admin/supabase";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";
import { newsBotTopicByKey, type NewsBotTopic } from "@/lib/news/bot-subscribe-topics";
import {
  listActiveNewsBotSubscriptions,
  markNewsBotDelivery,
  pauseSubscriptionForBlockedUser,
} from "@/lib/news/bot-subscriptions";
import { newsArticleUrl } from "@/lib/site-url";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";

type DigestRow = {
  id: string;
  slug: string;
  topic_key: string;
  title: string;
  excerpt: string;
  published_at: string;
};

export function formatNewsBotCardHtml(digest: DigestRow, topic?: NewsBotTopic): string {
  const meta = topic ?? newsBotTopicByKey(digest.topic_key);
  const label = meta ? `${meta.flag} ${meta.countryRu}` : digest.topic_key;
  const excerpt = (digest.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 280);
  return [
    `<b>Новость · ${escapeTelegramHtml(label)}</b>`,
    "",
    `<b>${escapeTelegramHtml(digest.title.trim())}</b>`,
    excerpt ? escapeTelegramHtml(excerpt) : "",
    "",
    `<a href="${newsArticleUrl(digest.slug)}">Читать на emigro.online</a>`,
    "",
    "<i>Отписка: напишите «отписка» или /stop</i>",
  ]
    .filter((line, i, arr) => line !== "" || (arr[i - 1] !== "" && i !== 0))
    .join("\n");
}

async function loadPublishedDigests(options: {
  topicKey?: string;
  slugs?: string[];
  lookbackHours: number;
}): Promise<DigestRow[]> {
  const supabase = createAdminClient();
  let query = supabase
    .from("emigro_news_digests")
    .select("id, slug, topic_key, title, excerpt, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(40);

  if (options.topicKey) query = query.eq("topic_key", options.topicKey);
  if (options.slugs?.length) query = query.in("slug", options.slugs);
  else {
    const since = new Date(Date.now() - options.lookbackHours * 3600_000).toISOString();
    query = query.gte("published_at", since);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("[news-bot] load digests failed:", error.message);
    return [];
  }
  return (data ?? []) as DigestRow[];
}

async function alreadyDelivered(telegramUserId: number, digestId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("emigro_news_bot_deliveries")
    .select("digest_id", { count: "exact", head: true })
    .eq("telegram_user_id", telegramUserId)
    .eq("digest_id", digestId);
  return (count ?? 0) > 0;
}

export async function sendLatestNewsSample(
  chatId: number,
  telegramUserId: number,
  topic: NewsBotTopic
): Promise<boolean> {
  const [digest] = await loadPublishedDigests({ topicKey: topic.key, lookbackHours: 24 * 90 });
  if (!digest) return false;
  if (await alreadyDelivered(telegramUserId, digest.id)) return false;

  const sent = await sendStatsBotMessage(chatId, formatNewsBotCardHtml(digest, topic), {
    parseMode: "HTML",
    disableWebPagePreview: false,
  });
  if (!sent.success) return false;
  await markNewsBotDelivery({
    telegramUserId,
    digestId: digest.id,
    topicKey: topic.key,
  });
  return true;
}

export async function deliverPendingNewsToBotSubscribers(options?: {
  topicKey?: string;
  slugs?: string[];
  lookbackHours?: number;
}): Promise<{ sent: number; skipped: number; errors: number }> {
  const lookbackHours = options?.lookbackHours ?? 36;
  const digests = await loadPublishedDigests({
    topicKey: options?.topicKey,
    slugs: options?.slugs,
    lookbackHours,
  });
  if (digests.length === 0) return { sent: 0, skipped: 0, errors: 0 };

  const byTopic = new Map<string, DigestRow[]>();
  for (const digest of digests) {
    const list = byTopic.get(digest.topic_key) ?? [];
    list.push(digest);
    byTopic.set(digest.topic_key, list);
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const [topicKey, topicDigests] of Array.from(byTopic.entries())) {
    const subscribers = await listActiveNewsBotSubscriptions(topicKey);
    const topic = newsBotTopicByKey(topicKey);
    for (const sub of subscribers) {
      for (const digest of topicDigests) {
        if (await alreadyDelivered(sub.telegram_user_id, digest.id)) {
          skipped += 1;
          continue;
        }
        const result = await sendStatsBotMessage(
          sub.chat_id,
          formatNewsBotCardHtml(digest, topic),
          { parseMode: "HTML", disableWebPagePreview: false }
        );
        if (!result.success) {
          errors += 1;
          const err = (result.error || "").toLowerCase();
          if (err.includes("blocked") || err.includes("forbidden") || err.includes("chat not found")) {
            await pauseSubscriptionForBlockedUser(sub.telegram_user_id, topicKey);
          }
          break;
        }
        const marked = await markNewsBotDelivery({
          telegramUserId: sub.telegram_user_id,
          digestId: digest.id,
          topicKey,
        });
        if (marked) sent += 1;
        else skipped += 1;
      }
    }
  }

  return { sent, skipped, errors };
}
