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
  isLightningPendingThreadsText,
  lightningChannelPriority,
  scoreLightningWithLlm,
} from "@/lib/news/story-lightning";

const LOOKBACK_DAYS = 5;
/** One approval request per cron tick — keeps DMs from stacking. */
export const LIGHTNING_PER_RUN = 1;

type StoryRow = {
  slug: string;
  topic_key: string;
  title: string;
  excerpt: string | null;
  telegram_html: string | null;
  threads_text: string | null;
  telegram_message_ids: number[] | null;
  source_links: Array<{ title?: string; url?: string }> | null;
  content_blocks: Array<{
    story_title?: string;
    source_name?: string;
    paragraphs?: string[];
  }> | null;
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

function alreadyHandled(row: StoryRow): boolean {
  const ids = row.telegram_message_ids ?? [];
  if (ids.length > 0) return true;
  if ((row.telegram_html ?? "").trim() === LIGHTNING_SKIP_MARK) return true;
  if (isLightningPendingThreadsText(row.threads_text)) return true;
  return false;
}

function gateTextForRow(row: StoryRow): string {
  const block = row.content_blocks?.[0];
  const storyTitle = block?.story_title ?? "";
  const body = (block?.paragraphs ?? []).slice(0, 2).join(" ");
  return [row.title, row.excerpt ?? "", storyTitle, body].join(" ");
}

async function markLightningSkip(supabase: SupabaseClient, slug: string): Promise<void> {
  await supabase
    .from("emigro_news_digests")
    .update({
      telegram_html: LIGHTNING_SKIP_MARK,
      threads_text: null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);
}

export type LightningQueueResult = {
  considered: number;
  /** Slugs sent to owner DM for approval (not yet in channel). */
  awaitingApproval: string[];
  published: string[];
  skipped: string[];
  remainingToday: number;
  dryRun: boolean;
};

/** Queue #молния candidates → owner DM approval (no auto channel publish). */
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
    return {
      considered: 0,
      awaitingApproval: [],
      published: [],
      skipped: ["daily-cap"],
      remainingToday: 0,
      dryRun,
    };
  }

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select(
      "slug, topic_key, title, excerpt, telegram_html, threads_text, telegram_message_ids, source_links, content_blocks, published_at"
    )
    .eq("format", "story")
    .eq("status", "published")
    .gte("published_at", since)
    .order("published_at", { ascending: true })
    .limit(60);

  if (error) throw new Error(`lightning queue load failed: ${error.message}`);

  const candidates = ((data ?? []) as StoryRow[])
    .filter((row) => !alreadyHandled(row))
    .map((row) => ({
      row,
      priority: lightningChannelPriority(gateTextForRow(row), row.topic_key),
    }))
    .sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.row.published_at.localeCompare(b.row.published_at);
    });

  const priorityHits = candidates.filter((c) => c.priority >= 80).length;
  console.log(
    `[lightning] open candidates=${candidates.length} (lookback ${LOOKBACK_DAYS}d)` +
      (priorityHits ? `, priority≥80=${priorityHits}` : "")
  );

  const awaitingApproval: string[] = [];
  const published: string[] = [];
  const skipped: string[] = [];
  let considered = 0;

  for (const { row, priority } of candidates) {
    if (awaitingApproval.length >= maxPublish || remaining <= 0) break;
    considered += 1;
    if (priority >= 80) {
      console.log(`[lightning] priority=${priority} ${row.slug}`);
    }

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

    // Grey-zone / critical investor tracks: lower LLM bar so they reach owner DM first.
    const llm = await scoreLightningWithLlm({
      countryRu: topic.countryRu,
      title: row.title,
      excerpt: (row.excerpt ?? "").trim() || row.title,
      originalTitle: row.content_blocks?.[0]?.story_title,
      paragraphs: row.content_blocks?.[0]?.paragraphs,
      preferPublish: priority >= 80,
    });
    console.log(
      `[lightning] llm ${row.slug}: publish=${llm.publish} conf=${llm.confidence.toFixed(2)} — ${llm.reason}`
    );

    if (!llm.publish) {
      skipped.push(`${row.slug}:llm:${llm.reason}`);
      if (!dryRun) await markLightningSkip(supabase, row.slug);
      else console.log(`[lightning] dry-run would skip ${row.slug} (llm)`);
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
      storyScore: 99,
      dryRun,
      remainingToday: remaining,
      llmReason: llm.reason,
      paragraphs: row.content_blocks?.[0]?.paragraphs,
    });

    if (tg.awaitingApproval) {
      awaitingApproval.push(row.slug);
      // Reserve budget slot so we don't spam approvals beyond daily channel cap.
      remaining = Math.max(0, remaining - 1);
    } else if (tg.reason) {
      skipped.push(`${row.slug}:${tg.reason}`);
    }
  }

  return { considered, awaitingApproval, published, skipped, remainingToday: remaining, dryRun };
}
