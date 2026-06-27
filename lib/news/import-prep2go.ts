import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { enrichStoryLinks } from "@/lib/news/article-resolve";
import {
  fetchPrep2GoArticle,
  fetchPrep2GoRssItems,
  weekStartFromWeekEnd,
  type Prep2GoRssItem,
} from "@/lib/news/prep2go-fetch";
import { translatePrep2GoArticle } from "@/lib/news/prep2go-translate";
import { revalidateNewsPages } from "@/lib/news/revalidate-cache";
import { pingIndexNow } from "@/lib/seo/indexnow";
import { newsArticleUrl, publicSiteUrl } from "@/lib/site-url";
import { publishDigestToTelegram } from "@/lib/news/publish-digest-telegram";
import { buildNewsDigestSlug, getNewsTopicOrThrow } from "@/lib/news/topics";

export type Prep2GoImportResult = {
  prep2goSlug: string;
  emigroSlug: string;
  topic: string;
  status: "imported" | "skipped" | "failed";
  reason?: string;
  titleRu?: string;
  titleEn?: string;
};

export type ImportPrep2GoOptions = {
  dryRun?: boolean;
  force?: boolean;
  topicKey?: string;
  limit?: number;
  concurrency?: number;
  /** Only consider RSS items published within this many hours (daily cron). */
  maxAgeHours?: number;
  /** Skip cache revalidation and IndexNow (caller handles). */
  skipPostImport?: boolean;
  /** Skip Telegram channel + owner DM after import. */
  skipTelegram?: boolean;
};

export type ImportPrep2GoSummary = {
  results: Prep2GoImportResult[];
  imported: number;
  skipped: number;
  failed: number;
};

export type DailyPrep2GoImportResult = {
  imported: number;
  skipped: number;
  slug?: string;
  titleRu?: string;
  titleEn?: string;
  topic?: string;
  message?: string;
  error?: string;
};

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase env missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  }
  if (!process.env.GOOGLE_API_KEY?.trim()) {
    throw new Error("GOOGLE_API_KEY required for translation");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function isWithinLastHours(pubDate: string, hours: number): boolean {
  const ts = new Date(pubDate).getTime();
  if (Number.isNaN(ts)) return false;
  return Date.now() - ts <= hours * 60 * 60 * 1000;
}

async function slugExists(supabase: SupabaseClient, slug: string): Promise<boolean> {
  const { data } = await supabase.from("emigro_news_digests").select("id").eq("slug", slug).maybeSingle();
  return Boolean(data);
}

export async function importOnePrep2GoItem(
  item: Prep2GoRssItem,
  options: { dryRun: boolean; force: boolean; supabase: SupabaseClient; skipTelegram?: boolean }
): Promise<Prep2GoImportResult> {
  const emigroSlug = buildNewsDigestSlug(item.topicKey, item.weekEnd);
  const base: Prep2GoImportResult = {
    prep2goSlug: item.prep2goSlug,
    emigroSlug,
    topic: item.topicKey,
    titleEn: item.title,
    status: "failed",
  };

  try {
    if (!options.force && (await slugExists(options.supabase, emigroSlug))) {
      return { ...base, status: "skipped", reason: "already exists" };
    }

    const topic = await getNewsTopicOrThrow(item.topicKey);
    const article = await fetchPrep2GoArticle(item);

    if (article.sections.length === 0) {
      return { ...base, status: "skipped", reason: "no content sections parsed" };
    }

    const rawSources = article.sources.map((s) => ({
      title: s.title,
      link: s.url,
      source: s.title,
    }));
    const enriched = await enrichStoryLinks(rawSources);
    const resolvedSources = enriched.map((s) => ({
      title: s.resolved_source,
      url: s.resolved_link,
    }));

    const weekStart = weekStartFromWeekEnd(item.weekEnd);
    const translated = await translatePrep2GoArticle(article, topic, weekStart, resolvedSources);

    const pubIso = new Date(`${item.weekEnd}T08:00:00.000Z`).toISOString();

    const payload = {
      slug: emigroSlug,
      corridor_slug: topic.corridorSlug,
      topic_key: topic.key,
      country: topic.countryRu,
      locale: "ru",
      title: translated.title,
      excerpt: translated.excerpt,
      seo_title: translated.seo_title,
      seo_description: translated.seo_description,
      content_blocks: translated.content_blocks,
      key_takeaways: translated.key_takeaways,
      tags: Array.from(new Set([...translated.tags, ...topic.seoTags])).slice(0, 12),
      source_links: resolvedSources,
      telegram_html: null,
      threads_text: null,
      week_start: weekStart,
      week_end: item.weekEnd,
      published_at: pubIso,
      status: "published" as const,
      updated_at: new Date().toISOString(),
    };

    if (options.dryRun) {
      return { ...base, status: "imported", titleRu: translated.title, reason: "dry-run" };
    }

    const { error } = await options.supabase.from("emigro_news_digests").upsert(payload, { onConflict: "slug" });
    if (error) throw new Error(error.message);

    await publishDigestToTelegram({
      supabase: options.supabase,
      slug: emigroSlug,
      topic,
      weekStart,
      weekEnd: item.weekEnd,
      title: translated.title,
      excerpt: translated.excerpt,
      keyTakeaways: translated.key_takeaways,
      contentBlocks: translated.content_blocks,
      sourceLinks: resolvedSources,
      skipTelegram: options.skipTelegram,
    });

    return { ...base, status: "imported", titleRu: translated.title };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ...base, status: "failed", reason: msg };
  }
}

async function runPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function postImportActions(imported: Prep2GoImportResult[]): Promise<void> {
  if (imported.length === 0) return;
  await revalidateNewsPages(imported.map((r) => r.emigroSlug));
  const site = publicSiteUrl();
  const urls = [`${site}/ru/news`, ...imported.map((r) => newsArticleUrl(r.emigroSlug))];
  await pingIndexNow(urls);
}

/** Bulk import from Prep2Go RSS (CLI). */
export async function importPrep2GoNews(options: ImportPrep2GoOptions = {}): Promise<ImportPrep2GoSummary> {
  const {
    dryRun = false,
    force = false,
    topicKey,
    limit,
    concurrency = 2,
    maxAgeHours,
    skipPostImport = false,
    skipTelegram = false,
  } = options;

  const supabase = createSupabaseAdmin();

  let items = await fetchPrep2GoRssItems();

  if (maxAgeHours != null) {
    items = items.filter((i) => isWithinLastHours(i.pubDate, maxAgeHours));
  }
  if (topicKey) {
    items = items.filter((i) => i.topicKey === topicKey);
  }
  if (limit != null) {
    items = items.slice(0, limit);
  }

  const results = await runPool(items, concurrency, (item) =>
    importOnePrep2GoItem(item, { dryRun, force, supabase, skipTelegram: dryRun || skipTelegram })
  );

  const imported = results.filter((r) => r.status === "imported");
  const skipped = results.filter((r) => r.status === "skipped");
  const failed = results.filter((r) => r.status === "failed");

  if (!dryRun && !skipPostImport) {
    await postImportActions(imported);
  }

  return {
    results,
    imported: imported.length,
    skipped: skipped.length,
    failed: failed.length,
  };
}

/**
 * Daily cron: import at most one newest Prep2Go article not yet in Supabase.
 * Considers RSS items published in the last 24 hours only.
 */
export async function importLatestPrep2GoNews(): Promise<DailyPrep2GoImportResult> {
  const supabase = createSupabaseAdmin();
  const maxAgeHours = 24;

  let items = await fetchPrep2GoRssItems();
  items = items.filter((i) => isWithinLastHours(i.pubDate, maxAgeHours));

  if (items.length === 0) {
    return { imported: 0, skipped: 0, message: "nothing new" };
  }

  let skipped = 0;

  for (const item of items) {
    const emigroSlug = buildNewsDigestSlug(item.topicKey, item.weekEnd);

    if (await slugExists(supabase, emigroSlug)) {
      skipped += 1;
      continue;
    }

    const result = await importOnePrep2GoItem(item, { dryRun: false, force: false, supabase });

    if (result.status === "imported") {
      await postImportActions([result]);
      return {
        imported: 1,
        skipped,
        slug: result.emigroSlug,
        titleRu: result.titleRu,
        titleEn: result.titleEn,
        topic: result.topic,
      };
    }

    if (result.status === "skipped") {
      skipped += 1;
      continue;
    }

    return {
      imported: 0,
      skipped,
      slug: result.emigroSlug,
      titleEn: result.titleEn,
      topic: result.topic,
      error: result.reason,
    };
  }

  return { imported: 0, skipped, message: "nothing new" };
}
