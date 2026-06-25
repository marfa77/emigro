import type { MetadataRoute } from "next";
import { corridorDigestPath, corridorLandingPath, corridorWizardPath, programPath } from "@/lib/corridor/paths";
import { guidePath, listGuides } from "@/lib/guides/load";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { getActiveNewsTopics } from "@/lib/news/topics";
import { newsArticleUrl, newsHubUrl, SITE_URL } from "@/lib/site-url";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const developingCorridors = topics.filter(
    (t) => t.status === "in_development" && t.corridorSlug && t.sitePaths?.landing
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ru`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/ru/wizard`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE_URL}/ru/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: newsHubUrl(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ru/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/ru/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/ru/privacy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/ru/terms`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/ru/cookies`, changeFrequency: "yearly", priority: 0.3 },
    ...TRANSIT_HUBS.map((hub) => ({
      url: `${SITE_URL}${hub.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
    ...topics.map((t) => ({
      url: newsHubUrl(t.urlSegment),
      changeFrequency: "daily" as const,
      priority: 0.85,
    })),
  ];

  const corridorRoutes: MetadataRoute.Sitemap = [];
  const programRoutes: MetadataRoute.Sitemap = [];

  for (const topic of developingCorridors) {
    const slug = topic.corridorSlug!;
    corridorRoutes.push(
      { url: `${SITE_URL}${corridorLandingPath(slug)}`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${SITE_URL}${corridorDigestPath(slug)}`, changeFrequency: "weekly", priority: 0.65 }
    );
  }

  for (const topic of fullCorridors) {
    const slug = topic.corridorSlug!;
    corridorRoutes.push(
      { url: `${SITE_URL}${corridorLandingPath(slug)}`, changeFrequency: "weekly", priority: 0.95 },
      { url: `${SITE_URL}${corridorWizardPath(slug)}`, changeFrequency: "monthly", priority: 0.85 },
      { url: `${SITE_URL}${corridorDigestPath(slug)}`, changeFrequency: "weekly", priority: 0.8 }
    );

    const corridor = await getCorridorBySlug(slug);
    for (const p of corridor?.programs ?? []) {
      programRoutes.push({
        url: `${SITE_URL}${programPath(slug, p.slug)}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  const digests = await getPublishedNewsDigests();
  const newsRoutes: MetadataRoute.Sitemap = digests.map((d) => ({
    url: newsArticleUrl(d.slug),
    lastModified: d.updated_at || d.published_at,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const guideRoutes: MetadataRoute.Sitemap = listGuides().map((guide) => ({
    url: `${SITE_URL}${guidePath(guide.slug)}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...corridorRoutes, ...programRoutes, ...guideRoutes, ...newsRoutes];
}
