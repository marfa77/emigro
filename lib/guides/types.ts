import type { FactcheckCadence, GuideReviewTier } from "@/lib/guides/review-tiers";

export type GuideOfficialSource = {
  url: string;
  label: string;
};

export type GuideFrontmatter = {
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  excerpt?: string;
  quick_answer?: string;
  cta_primary?: string;
  cta_secondary?: string;
  estimated_minutes?: number;
  date_published?: string;
  date_modified?: string;
  tags?: string[];
  topic_keys?: string[];
  corridor_slugs?: string[];
  primary_intent?: string;
  cover_image?: string;
  official_sources?: GuideOfficialSource[];
  review_tier: GuideReviewTier;
  factcheck_cadence: FactcheckCadence;
  cover_path: string;
  og_image_path: string;
};

export type GuideArticle = GuideFrontmatter & {
  bodyHtml: string;
};
