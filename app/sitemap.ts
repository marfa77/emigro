import type { MetadataRoute } from "next";
import { corridorDigestPath, corridorLandingPath, corridorWizardPath, programPath } from "@/lib/corridor/paths";
import { getCorridorBySlug, getProgramBySlug } from "@/lib/corridor/queries";
import { guidePath, listGuides } from "@/lib/guides/load";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { getActiveNewsTopics } from "@/lib/news/topics";
import {
  corridorDigestLastModified,
  programLastModified,
  verifiedDateToLastModified,
} from "@/lib/seo/corridor-page-seo";
import { newsArticleUrl, newsHubUrl, publicSiteUrl } from "@/lib/site-url";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = publicSiteUrl();
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const developingCorridors = topics.filter(
    (t) => t.status === "in_development" && t.corridorSlug && t.sitePaths?.landing
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${origin}/ru`, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/ru/wizard`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${origin}/ru/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}/ru/community`, changeFrequency: "monthly", priority: 0.75 },
    { url: `${origin}/ru/ukraine`, changeFrequency: "monthly", priority: 0.82 },
    { url: newsHubUrl(), changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/ru/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/ru/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/ru/privacy`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${origin}/ru/terms`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${origin}/ru/cookies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}/ru/assist`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/ru/assist/sample-plan`, changeFrequency: "monthly", priority: 0.6 },
    ...TRANSIT_HUBS.map((hub) => ({
      url: `${origin}${hub.path}`,
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
    const corridor = await getCorridorBySlug(slug);
    const lastModified = corridor ? verifiedDateToLastModified(corridorDigestLastModified(corridor)) : undefined;
    corridorRoutes.push(
      {
        url: `${origin}${corridorLandingPath(slug)}`,
        changeFrequency: "weekly",
        priority: 0.7,
        ...(lastModified ? { lastModified } : {}),
      },
      {
        url: `${origin}${corridorDigestPath(slug)}`,
        changeFrequency: "weekly",
        priority: 0.65,
        ...(lastModified ? { lastModified } : {}),
      }
    );
  }

  for (const topic of fullCorridors) {
    const slug = topic.corridorSlug!;
    const corridor = await getCorridorBySlug(slug);
    const digestModified = corridor
      ? verifiedDateToLastModified(corridorDigestLastModified(corridor))
      : undefined;

    corridorRoutes.push(
      {
        url: `${origin}${corridorLandingPath(slug)}`,
        changeFrequency: "weekly",
        priority: 0.95,
        ...(digestModified ? { lastModified: digestModified } : {}),
      },
      {
        url: `${origin}${corridorWizardPath(slug)}`,
        changeFrequency: "monthly",
        priority: 0.85,
        ...(digestModified ? { lastModified: digestModified } : {}),
      },
      {
        url: `${origin}${corridorDigestPath(slug)}`,
        changeFrequency: "weekly",
        priority: 0.8,
        ...(digestModified ? { lastModified: digestModified } : {}),
      }
    );

    for (const p of corridor?.programs ?? []) {
      const program = await getProgramBySlug(p.slug);
      if (!program?.version) continue;
      const programModified = verifiedDateToLastModified(programLastModified(program));
      programRoutes.push({
        url: `${origin}${programPath(slug, p.slug)}`,
        changeFrequency: "monthly",
        priority: 0.8,
        ...(programModified ? { lastModified: programModified } : {}),
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
    url: `${origin}${guidePath(guide.slug)}`,
    ...(guide.date_modified || guide.date_published
      ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
      : {}),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...corridorRoutes, ...programRoutes, ...guideRoutes, ...newsRoutes];
}
