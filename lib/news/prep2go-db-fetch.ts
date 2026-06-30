import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  buildPrep2GoNewsLink,
  fetchPrep2GoArticle as fetchPrep2GoArticleFromHtml,
  fetchPrep2GoRssItems,
  PREP2GO_TOPIC_KEYS,
  type Prep2GoArticle,
  type Prep2GoRssItem,
  type Prep2GoSection,
} from "@/lib/news/prep2go-fetch";
import { isPublishableSourceUrl } from "@/lib/news/article-resolve";

const VALID_TOPICS = new Set<string>(PREP2GO_TOPIC_KEYS);

const LISTING_SELECT =
  "slug,title,excerpt,topic_key,week_end,published_at,status" as const;

const ARTICLE_SELECT =
  "slug,title,excerpt,topic_key,week_start,week_end,published_at,content_blocks,key_takeaways,source_links,status" as const;

type Prep2GoDbListingRow = {
  slug: string;
  title: string;
  excerpt: string;
  topic_key: string;
  week_end: string;
  published_at: string | null;
  status: string;
};

type Prep2GoDbArticleRow = Prep2GoDbListingRow & {
  week_start: string;
  content_blocks: Array<{ heading: string; paragraphs: string[]; bullets?: string[] }>;
  key_takeaways: string[];
  source_links: Array<{ title: string; url: string }>;
};

let lastListingSource: "db" | "rss" = "rss";

export function prep2GoListingSource(): "db" | "rss" {
  return lastListingSource;
}

/** CIPLE A2 / Prep2Go Supabase only — never Emigro's own project (empty news_digests). */
function prep2GoSupabaseCredentials(): { url: string; key: string } | null {
  const prepUrl = process.env.PREP2GO_SUPABASE_URL?.trim();
  const prepKey =
    process.env.PREP2GO_SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.PREP2GO_SUPABASE_ANON_KEY?.trim();
  if (!prepUrl || !prepKey) return null;
  return { url: prepUrl.replace(/\/$/, ""), key: prepKey };
}

/** Prep2Go `news_digests` source: CIPLE A2 Supabase via PREP2GO_SUPABASE_* env. */
export function isPrep2GoDbConfigured(): boolean {
  return prep2GoSupabaseCredentials() != null;
}

export function createPrep2GoSupabaseClient(existing?: SupabaseClient): SupabaseClient | null {
  if (existing) return existing;
  const creds = prep2GoSupabaseCredentials();
  if (!creds) return null;
  return createClient(creds.url, creds.key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function toYmd(value: string): string {
  return value.slice(0, 10);
}

function listingRowToItem(row: Prep2GoDbListingRow): Prep2GoRssItem | null {
  const topicKey = row.topic_key.trim().toLowerCase();
  const weekEnd = toYmd(row.week_end);
  if (!VALID_TOPICS.has(topicKey)) return null;

  return {
    title: row.title,
    link: buildPrep2GoNewsLink(topicKey, weekEnd),
    pubDate: row.published_at ?? weekEnd,
    excerpt: row.excerpt,
    topicKey,
    weekEnd,
    prep2goSlug: row.slug,
  };
}

function articleRowToPrep2GoArticle(row: Prep2GoDbArticleRow, item: Prep2GoRssItem): Prep2GoArticle {
  const sections: Prep2GoSection[] = (row.content_blocks ?? [])
    .map((block) => ({
      heading: block.heading?.trim() ?? "",
      paragraphs: (block.paragraphs ?? []).map((p) => p.trim()).filter(Boolean),
      bullets: (block.bullets ?? []).map((b) => b.trim()).filter(Boolean),
    }))
    .filter((section) => section.heading || section.paragraphs.length > 0 || section.bullets.length > 0);

  return {
    ...item,
    title: row.title || item.title,
    excerpt: row.excerpt || item.excerpt,
    pubDate: row.published_at ?? item.pubDate,
    keyTakeaways: row.key_takeaways ?? [],
    sections,
    sources: (row.source_links ?? [])
      .map((source) => ({ title: source.title?.trim() ?? "", url: source.url?.trim() ?? "" }))
      .filter((source) => source.title && source.url.startsWith("http") && isPublishableSourceUrl(source.url)),
  };
}

/** Latest published Prep2Go news from shared Supabase `news_digests`. */
export async function fetchPrep2GoItemsFromSupabase(
  limit = 100,
  supabase?: SupabaseClient
): Promise<Prep2GoRssItem[]> {
  const client = createPrep2GoSupabaseClient(supabase);
  if (!client) return [];

  const { data, error } = await client
    .from("news_digests")
    .select(LISTING_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.warn("[prep2go-db] listing failed:", error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => listingRowToItem(row as Prep2GoDbListingRow))
    .filter((item): item is Prep2GoRssItem => item != null)
    .sort((a, b) => b.weekEnd.localeCompare(a.weekEnd));
}

export async function fetchPrep2GoArticleFromDb(
  slug: string,
  supabase?: SupabaseClient
): Promise<Prep2GoArticle | null> {
  const client = createPrep2GoSupabaseClient(supabase);
  if (!client) return null;

  const { data, error } = await client
    .from("news_digests")
    .select(ARTICLE_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.warn(`[prep2go-db] article ${slug} failed:`, error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Prep2GoDbArticleRow;
  const item = listingRowToItem(row);
  if (!item) return null;

  return articleRowToPrep2GoArticle(row, item);
}

/**
 * Prep2Go listing: CIPLE A2 Supabase `news_digests` first, RSS only when DB unreachable.
 * Emigro `emigro_news_digests` is write-only (translated output), never the source.
 */
export async function fetchPrep2GoListingItems(limit = 100): Promise<Prep2GoRssItem[]> {
  if (isPrep2GoDbConfigured()) {
    const dbItems = await fetchPrep2GoItemsFromSupabase(limit);
    if (dbItems.length > 0) {
      lastListingSource = "db";
      return dbItems;
    }
    console.warn("[prep2go] CIPLE Supabase news_digests empty or query failed — falling back to RSS");
  } else {
    console.warn("[prep2go] PREP2GO_SUPABASE_* not set — falling back to RSS");
  }

  lastListingSource = "rss";
  const rssItems = await fetchPrep2GoRssItems();
  return limit >= rssItems.length ? rssItems : rssItems.slice(0, limit);
}

/** Full article body: DB content_blocks when available, else HTML scrape. */
export async function fetchPrep2GoArticleContent(item: Prep2GoRssItem): Promise<Prep2GoArticle> {
  if (isPrep2GoDbConfigured()) {
    const fromDb = await fetchPrep2GoArticleFromDb(item.prep2goSlug);
    if (fromDb && fromDb.sections.length > 0) return fromDb;
  }
  return fetchPrep2GoArticleFromHtml(item);
}
