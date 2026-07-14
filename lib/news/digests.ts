import { unstable_cache } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import { buildNewsDigestSlug as buildSlug } from "@/lib/news/topics/paths";

export type { NewsTopicKey } from "@/lib/news/topics/types";

/** Pool loaded once for index + client-side country filter. */
export const NEWS_INDEX_POOL_LIMIT = 60;
/** Default cards shown per view after client filter. */
export const NEWS_INDEX_DISPLAY_LIMIT = 30;

export type NewsSourceLink = { title: string; url: string };

export type NewsContentBlock = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  source_name?: string;
  source_url?: string;
  story_title?: string;
};

export type NewsDigest = {
  id: string;
  slug: string;
  corridor_slug: string | null;
  topic_key: string;
  country: string;
  locale: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  content_blocks: NewsContentBlock[];
  key_takeaways: string[];
  tags: string[];
  source_links: NewsSourceLink[];
  telegram_html: string | null;
  threads_text: string | null;
  telegram_message_ids: number[] | null;
  week_start: string;
  week_end: string;
  published_at: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export { buildSlug as buildNewsDigestSlug };

function toYmd(dateLike: string | Date): string {
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  if (!Number.isFinite(date.getTime())) return String(dateLike).slice(0, 10);
  return date.toISOString().slice(0, 10);
}

export function formatNewsWeekEndRu(weekEnd: string | Date): string {
  const ymd = toYmd(weekEnd);
  const [y, m, d] = ymd.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getNewsDisplayTitle(digest: Pick<NewsDigest, "title" | "week_end">): string {
  const t = digest.title.trim();
  if (/^еженедельный обзор/i.test(t)) return t;
  return `Еженедельный обзор за ${formatNewsWeekEndRu(digest.week_end)}: ${t}`;
}

export function getNewsDisplaySeoTitle(
  digest: Pick<NewsDigest, "seo_title" | "title" | "week_end" | "country">,
  countryRu?: string
): string {
  const raw = digest.seo_title.trim() || digest.title.trim();
  const weekLabel = formatNewsWeekEndRu(digest.week_end);
  const country = (countryRu ?? digest.country)?.trim();
  if (/^еженедельный обзор за/i.test(raw)) return raw.slice(0, 70);
  const topic = raw.replace(/^еженедельный обзор:\s*/i, "").trim() || raw;
  const prefix = country
    ? `Еженедельный обзор ${country} за ${weekLabel}:`
    : `Еженедельный обзор за ${weekLabel}:`;
  return `${prefix} ${topic}`.slice(0, 70);
}

async function fetchPublishedNewsDigestsUncached(options: {
  topicKey?: string;
  corridorSlug?: string;
  limit: number;
}): Promise<NewsDigest[]> {
  const supabase = createServerClient();
  let query = supabase
    .from("emigro_news_digests")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(options.limit);

  if (options.topicKey) query = query.eq("topic_key", options.topicKey);
  if (options.corridorSlug) query = query.eq("corridor_slug", options.corridorSlug);

  const { data, error } = await query;
  if (error) {
    console.warn("[news] load failed:", error.message);
    return [];
  }
  return (data ?? []) as NewsDigest[];
}

export async function getPublishedNewsDigests(options?: {
  topicKey?: string;
  corridorSlug?: string;
  limit?: number;
}): Promise<NewsDigest[]> {
  const limit = options?.limit ?? NEWS_INDEX_POOL_LIMIT;
  const topicKey = options?.topicKey ?? "";
  const corridorSlug = options?.corridorSlug ?? "";

  return unstable_cache(
    () =>
      fetchPublishedNewsDigestsUncached({
        topicKey: options?.topicKey,
        corridorSlug: options?.corridorSlug,
        limit,
      }),
    ["news-digests", topicKey, corridorSlug, String(limit)],
    { revalidate: CACHE_REVALIDATE.newsDigests, tags: [CACHE_TAGS.newsDigests] },
  )();
}

async function fetchPublishedNewsDigestBySlugUncached(slug: string): Promise<NewsDigest | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.warn("[news] slug load failed:", error.message);
    return null;
  }
  return (data as NewsDigest | null) ?? null;
}

export async function getPublishedNewsDigestBySlug(slug: string): Promise<NewsDigest | null> {
  return unstable_cache(
    () => fetchPublishedNewsDigestBySlugUncached(slug),
    ["news-digest-by-slug", slug],
    { revalidate: CACHE_REVALIDATE.newsDigests, tags: [CACHE_TAGS.newsDigests, `news-${slug}`] },
  )();
}
