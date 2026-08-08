import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mapNewsTopicRow, type NewsTopicRow } from "@/lib/news/topics/queries";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import {
  countLightningTelegramToday,
  publishStoryLightningToTelegram,
} from "@/lib/news/publish-story-telegram";
import {
  LIGHTNING_MAX_PER_DAY,
  LIGHTNING_SKIP_MARK,
  isLightningImmigrationText,
} from "@/lib/news/story-lightning";

const LOOKBACK_DAYS = 5;
/** One post per cron tick — keeps @Emigro_news from dumping a batch. */
export const LIGHTNING_PER_RUN = 1;

type StoryRow = {
  slug: string;
  topic_key: string;
  title: string;
  excerpt: string | null;
  telegram_html: string | null;
  telegram_message_ids: number[] | null;
  source_links: Array<{ title?: string; url?: string }> | null;
  content_blocks: Array<{ story_title?: string; source_name?: string }> | null;
  published_at: string;
};

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase env missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function loadTopic(supabase: SupabaseClient, topicKey: string): Promise<NewsTopicConfig | null> {
  const { data, error } = await supabase
    .from("emigro_news_topics")
    .select("*")
    .eq("key", topicKey)
    .maybeSingle();
  if (error || !data) return null;
  return mapNewsTopicRow(data as NewsTopicRow);
}

function alreadySentOrSkipped(row: StoryRow): boolean {
  const ids = row.telegram_message_ids ?? [];
  if (ids.length > 0) return true;
  if ((row.telegram_html ?? "").trim() === LIGHTNING_SKIP_MARK) return true;
  return false;
}

function gateTextForRow(row: StoryRow): string {
  const storyTitle = row.content_blocks?.[0]?.story_title ?? "";
  return [row.title, row.excerpt ?? "", storyTitle].join(" ");
}

async function markLightningSkip(supabase: SupabaseClient, slug: string): Promise<void> {
  await supabase
    .from("emigro_news_digests")
    .update({ telegram_html: LIGHTNING_SKIP_MARK, updated_at: new Date().toISOString() })
    .eq("slug", slug);
}

export type LightningQueueResult = {
  considered: number;
  published: string[];
  skipped: string[];
  remainingToday: number;
  dryRun: boolean;
};

/** Drain at most `maxPublish` pending immigration stories into @Emigro_news (#молния). */
export async function runLightningTelegramQueue(options?: {
  dryRun?: boolean;
  maxPublish?: number;
}): Promise<LightningQueueResult> {
  const dryRun = Boolean(options?.dryRun);
  const maxPublish = Math.max(1, Math.min(3, options?.maxPublish ?? LIGHTNING_PER_RUN));
  const supabase = createSupabaseAdmin();

  const sentToday = await countLightningTelegramToday(supabase);
  let remaining = Math.max(0, LIGHTNING_MAX_PER_DAY - sentToday);
  console.log(`[lightning] budget today ${remaining}/${LIGHTNING_MAX_PER_DAY} (already ${sentToday})`);

  if (remaining <= 0) {
    return { considered: 0, published: [], skipped: ["daily-cap"], remainingToday: 0, dryRun };
  }

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select(
      "slug, topic_key, title, excerpt, telegram_html, telegram_message_ids, source_links, content_blocks, published_at"
    )
    .eq("format", "story")
    .eq("status", "published")
    .gte("published_at", since)
    .order("published_at", { ascending: true })
    .limit(60);

  if (error) throw new Error(`lightning queue load failed: ${error.message}`);

  const pending = ((data ?? []) as StoryRow[]).filter((row) => !alreadySentOrSkipped(row));
  console.log(`[lightning] pending candidates=${pending.length} (lookback ${LOOKBACK_DAYS}d)`);

  const published: string[] = [];
  const skipped: string[] = [];
  let considered = 0;

  for (const row of pending) {
    if (published.length >= maxPublish || remaining <= 0) break;
    considered += 1;

    const gateText = gateTextForRow(row);
    if (!isLightningImmigrationText(gateText)) {
      skipped.push(`${row.slug}:not-immigration`);
      if (!dryRun) await markLightningSkip(supabase, row.slug);
      else console.log(`[lightning] dry-run would skip ${row.slug} (not immigration)`);
      continue;
    }

    const topic = await loadTopic(supabase, row.topic_key);
    if (!topic) {
      skipped.push(`${row.slug}:missing-topic`);
      continue;
    }

    const sourceLabel =
      row.source_links?.[0]?.title ||
      row.content_blocks?.[0]?.source_name ||
      topic.countryEn;

    const tg = await publishStoryLightningToTelegram({
      supabase,
      slug: row.slug,
      topic,
      title: row.title,
      excerpt: (row.excerpt ?? "").trim() || row.title,
      sourceLabel,
      gateText,
      // Already on site; queue gate is keyword-only.
      storyScore: 99,
      dryRun,
      remainingToday: remaining,
    });

    if (tg.published || (dryRun && tg.html)) {
      published.push(row.slug);
      remaining = Math.max(0, remaining - 1);
    } else if (tg.reason) {
      skipped.push(`${row.slug}:${tg.reason}`);
    }
  }

  return { considered, published, skipped, remainingToday: remaining, dryRun };
}
