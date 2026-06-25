/** News digest topic — loaded from emigro_news_topics (ops API / SQL, no deploy). */

export type NewsTopicKey = string;

export type NewsTopicStatus = "active" | "news_only" | "in_development";

export interface NewsTopicConfig {
  key: NewsTopicKey;
  urlSegment: string;
  countryRu: string;
  countryEn: string;
  flag: string;
  audienceRu: string;
  seoTags: string[];
  rssQueries: string[];
  corridorSlug: string | null;
  status: NewsTopicStatus;
  focusHintRu: string;
  sitePaths?: {
    landing: string;
    wizard?: string;
    guide?: string;
  };
}

export type NewsTopicUpsert = {
  key: string;
  url_segment: string;
  country_ru: string;
  country_en: string;
  flag?: string;
  audience_ru: string;
  focus_hint_ru: string;
  corridor_slug?: string | null;
  status?: NewsTopicStatus;
  seo_tags?: string[];
  rss_queries?: string[];
  site_paths?: NewsTopicConfig["sitePaths"] | null;
  sort_order?: number;
  is_published?: boolean;
};
