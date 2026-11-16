import type { NewsDigest } from "@/lib/news/digests";

/**
 * Git-shipped SEO patches for published stories until Supabase rows are updated
 * (`scripts/apply-bing-seo-batch2-news.ts`). Facts must match live article bodies.
 */
export const NEWS_SEO_OVERRIDES: Partial<
  Record<string, Pick<NewsDigest, "seo_title" | "seo_description">>
> = {
  "sweden-story-2026-08-31-ea8jvq": {
    seo_title: "Выборы в Швеции 2026: 31 августа",
    seo_description:
      "Выборы в Швеции 31 августа 2026: что партии обещают иностранцам по иммиграции, разрешениям на работу, налогам и социальным выплатам.",
  },
};

export function applyNewsSeoOverrides<T extends Pick<NewsDigest, "slug" | "seo_title" | "seo_description">>(
  digest: T,
): T {
  const patch = NEWS_SEO_OVERRIDES[digest.slug];
  if (!patch) return digest;
  return {
    ...digest,
    seo_title: patch.seo_title ?? digest.seo_title,
    seo_description: patch.seo_description ?? digest.seo_description,
  };
}