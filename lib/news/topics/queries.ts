import { createServerClient } from "@/lib/supabase/server";
import type { NewsTopicConfig, NewsTopicStatus } from "./types";

export type NewsTopicRow = {
  key: string;
  url_segment: string;
  country_ru: string;
  country_en: string;
  flag: string;
  audience_ru: string;
  focus_hint_ru: string;
  corridor_slug: string | null;
  status: NewsTopicStatus;
  seo_tags: string[];
  rss_queries: string[];
  site_paths: { landing?: string; wizard?: string; guide?: string } | null;
  sort_order: number;
  is_published: boolean;
};

function mapSitePaths(
  raw: NewsTopicRow["site_paths"]
): NewsTopicConfig["sitePaths"] | undefined {
  if (!raw?.landing) return undefined;
  return {
    landing: raw.landing,
    wizard: raw.wizard,
    guide: raw.guide,
  };
}

export function mapNewsTopicRow(row: NewsTopicRow): NewsTopicConfig {
  return {
    key: row.key,
    urlSegment: row.url_segment,
    countryRu: row.country_ru,
    countryEn: row.country_en,
    flag: row.flag,
    audienceRu: row.audience_ru,
    focusHintRu: row.focus_hint_ru,
    corridorSlug: row.corridor_slug,
    status: row.status,
    seoTags: row.seo_tags ?? [],
    rssQueries: row.rss_queries ?? [],
    sitePaths: mapSitePaths(row.site_paths),
  };
}

async function fetchPublishedTopics(): Promise<NewsTopicConfig[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("emigro_news_topics")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("key");

  if (error) {
    console.warn("[news-topics] DB load failed:", error.message);
    return [];
  }
  return (data as NewsTopicRow[]).map(mapNewsTopicRow);
}

export async function getAllNewsTopics(): Promise<NewsTopicConfig[]> {
  return fetchPublishedTopics();
}

export async function getActiveNewsTopics(): Promise<NewsTopicConfig[]> {
  const topics = await fetchPublishedTopics();
  return topics.filter((t) => t.status === "active" || t.status === "news_only" || t.status === "in_development");
}

export async function getNewsTopic(key: string): Promise<NewsTopicConfig | null> {
  const normalized = key.trim().toLowerCase();
  const topics = await fetchPublishedTopics();
  return topics.find((t) => t.key === normalized) ?? null;
}

export async function getNewsTopicOrThrow(key: string): Promise<NewsTopicConfig> {
  const topic = await getNewsTopic(key);
  if (!topic) {
    const keys = (await getAllNewsTopics()).map((t) => t.key).join(", ");
    throw new Error(`Unknown news topic: ${key}. Valid: ${keys || "(none in DB)"}`);
  }
  return topic;
}

export async function getNewsTopicKeys(): Promise<string[]> {
  return (await getActiveNewsTopics()).map((t) => t.key);
}

export async function resolveNewsTopicFromParam(param: string | undefined): Promise<NewsTopicConfig | null> {
  if (!param) return null;
  const normalized = param.trim().toLowerCase();
  const topics = await fetchPublishedTopics();
  return topics.find((t) => t.key === normalized || t.urlSegment === normalized) ?? null;
}

export async function getNewsTopicByCorridorSlug(corridorSlug: string): Promise<NewsTopicConfig | null> {
  const topics = await fetchPublishedTopics();
  return topics.find((t) => t.corridorSlug === corridorSlug) ?? null;
}
