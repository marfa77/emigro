import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { enrichStoryLinks, sanitizeSourceLinks } from "@/lib/news/article-resolve";
import {
  fetchPrep2GoArticleContent,
  fetchPrep2GoListingItems,
  isPrep2GoDbConfigured,
  prep2GoListingSource,
} from "@/lib/news/prep2go-db-fetch";
import {
  prep2GoRssItemFromUrl,
  probePrep2GoArticleForWeekEnd,
  weekStartFromWeekEnd,
  type Prep2GoRssItem,
} from "@/lib/news/prep2go-fetch";
import { translatePrep2GoArticle } from "@/lib/news/prep2go-translate";
import { revalidateNewsPages } from "@/lib/news/revalidate-cache";
import { pingIndexNow } from "@/lib/seo/indexnow";
import { newsArticleUrl, publicSiteUrl } from "@/lib/site-url";
import { publishDigestToTelegram } from "@/lib/news/publish-digest-telegram";
import { buildNewsDigestSlug, getNewsTopicOrThrow } from "@/lib/news/topics";
import { validateSiteDigestQuality } from "@/lib/news/quality";
import { assertPrep2GoFactCheck } from "@/lib/news/fact-check";

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

function utcTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** week_end in slug is the editorial date; allow a few days back for timezone / RSS lag. */
function isRecentWeekEnd(weekEnd: string, maxDaysBack: number): boolean {
  const endMs = Date.parse(`${weekEnd}T12:00:00.000Z`);
  if (Number.isNaN(endMs)) return false;
  const todayMs = Date.parse(`${utcTodayDate()}T12:00:00.000Z`);
  return endMs >= todayMs - maxDaysBack * 24 * 60 * 60 * 1000;
}

function compareWeekEndPreference(a: Prep2GoRssItem, b: Prep2GoRssItem, today: string): number {
  const aToday = a.weekEnd === today ? 1 : 0;
  const bToday = b.weekEnd === today ? 1 : 0;
  if (aToday !== bToday) return bToday - aToday;
  return b.weekEnd.localeCompare(a.weekEnd);
}

async function filterUnimportedRecentItems(
  supabase: SupabaseClient,
  items: Prep2GoRssItem[],
  maxDaysBack: number
): Promise<Prep2GoRssItem[]> {
  const today = utcTodayDate();
  const unimported: Prep2GoRssItem[] = [];

  for (const item of items) {
    if (!isRecentWeekEnd(item.weekEnd, maxDaysBack)) continue;
    const emigroSlug = buildNewsDigestSlug(item.topicKey, item.weekEnd);
    if (await slugExists(supabase, emigroSlug)) continue;
    unimported.push(item);
  }

  unimported.sort((a, b) => compareWeekEndPreference(a, b, today));
  return unimported;
}

async function resolveDailyPrep2GoCandidate(supabase: SupabaseClient): Promise<{
  item: Prep2GoRssItem | null;
  skipped: number;
}> {
  const today = utcTodayDate();
  const maxDaysBack = 3;
  let skipped = 0;

  const listingItems = await fetchPrep2GoListingItems();
  for (const item of listingItems) {
    if (!isRecentWeekEnd(item.weekEnd, maxDaysBack)) continue;
    const emigroSlug = buildNewsDigestSlug(item.topicKey, item.weekEnd);
    if (await slugExists(supabase, emigroSlug)) skipped += 1;
  }

  const candidates = await filterUnimportedRecentItems(supabase, listingItems, maxDaysBack);
  if (candidates.length > 0) {
    return { item: candidates[0], skipped };
  }

  // When DB is configured it is authoritative; skip URL probes. RSS/HTML probe only as fallback.
  if (isPrep2GoDbConfigured() && prep2GoListingSource() === "db") {
    return { item: null, skipped };
  }

  // RSS may lag behind the site (e.g. Italy published but not yet in feed.xml).
  for (let daysBack = 0; daysBack <= 1; daysBack += 1) {
    const probeDate = new Date(`${today}T12:00:00.000Z`);
    probeDate.setUTCDate(probeDate.getUTCDate() - daysBack);
    const weekEnd = probeDate.toISOString().slice(0, 10);
    const probed = await probePrep2GoArticleForWeekEnd(weekEnd);
    if (!probed) continue;

    const emigroSlug = buildNewsDigestSlug(probed.topicKey, probed.weekEnd);
    if (await slugExists(supabase, emigroSlug)) {
      skipped += 1;
      continue;
    }
    return { item: probed, skipped };
  }

  return { item: null, skipped };
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
    const article = await fetchPrep2GoArticleContent(item);

    if (article.sections.length === 0) {
      return { ...base, status: "skipped", reason: "no content sections parsed" };
    }

    const rawSources = article.sources.map((s) => ({
      title: s.title,
      link: s.url,
      source: s.title,
    }));
    const enriched = await enrichStoryLinks(rawSources);
    const resolvedSources = sanitizeSourceLinks(
      enriched.filter((s) => s.resolved).map((s) => ({
        title: s.resolved_source,
        url: s.resolved_link,
      }))
    );

    const weekStart = weekStartFromWeekEnd(item.weekEnd);
    const translated = await translatePrep2GoArticle(article, topic, weekStart, resolvedSources);
    const siteQualityErrors = validateSiteDigestQuality({
      topic: topic.key,
      weekEnd: item.weekEnd,
      digest: translated,
      selectedCount: Math.min(article.sections.length, 4),
      sourceLinks: resolvedSources,
    });
    if (siteQualityErrors.length > 0) {
      throw new Error(`Prep2Go digest failed QA: ${siteQualityErrors.join("; ")}`);
    }
    await assertPrep2GoFactCheck({
      stage: "site",
      article,
      topic,
      weekStart,
      weekEnd: item.weekEnd,
      sourceLinks: resolvedSources,
      siteDigest: translated,
    });

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
      sourceArticle: article,
      siteFactCheckPassed: true,
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

/** Import a single Prep2Go article by URL (CLI --url). */
export async function importPrep2GoFromUrl(
  url: string,
  options: Pick<ImportPrep2GoOptions, "dryRun" | "force" | "skipTelegram"> = {}
): Promise<ImportPrep2GoSummary> {
  const { dryRun = false, force = false, skipTelegram = false } = options;
  const supabase = createSupabaseAdmin();
  const item = await prep2GoRssItemFromUrl(url);
  const result = await importOnePrep2GoItem(item, {
    dryRun,
    force,
    supabase,
    skipTelegram: dryRun || skipTelegram,
  });

  if (!dryRun && result.status === "imported") {
    await postImportActions([result]);
  }

  return {
    results: [result],
    imported: result.status === "imported" ? 1 : 0,
    skipped: result.status === "skipped" ? 1 : 0,
    failed: result.status === "failed" ? 1 : 0,
  };
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

  let items = await fetchPrep2GoListingItems();

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
 * Daily cron: import at most one Prep2Go article not yet in emigro_news_digests.
 * Source: CIPLE A2 Supabase `news_digests` (PREP2GO_SUPABASE_*).
 * Prefers highest recent week_end (today first); RSS/HTML probe only when DB unreachable.
 */
export async function importLatestPrep2GoNews(): Promise<DailyPrep2GoImportResult> {
  const supabase = createSupabaseAdmin();
  const { item, skipped } = await resolveDailyPrep2GoCandidate(supabase);

  if (!item) {
    return { imported: 0, skipped, message: "nothing new" };
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
    return { imported: 0, skipped: skipped + 1, slug: result.emigroSlug, message: result.reason };
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
