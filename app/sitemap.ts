import type { MetadataRoute } from "next";
import { corridorDigestPath, corridorLandingPath, corridorWizardPath, programPath } from "@/lib/corridor/paths";
import { getCorridorBySlug, getProgramsBySlugs } from "@/lib/corridor/queries";
import { ES_PATHS, esGuidePath } from "@/lib/es/corridor";
import { guidePath, listGuides } from "@/lib/guides/load";
import { listStories } from "@/lib/stories/load";
import { storyPath, STORIES_INDEX_PATH } from "@/lib/stories/paths";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { getActiveNewsTopics } from "@/lib/news/topics";
import {
  corridorDigestLastModified,
  programLastModified,
  verifiedDateToLastModified,
} from "@/lib/seo/corridor-page-seo";
import { newsIndexPath } from "@/lib/news/topics";
import { newsArticleUrl, newsHubUrl, publicSiteUrl } from "@/lib/site-url";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";
import { ORIGIN_HUB_PATH } from "@/lib/seo/corridor-llm-layer";
import { publicHostKind } from "@/lib/seo/request-host";
import { buildSatelliteSitemapEntries } from "@/lib/seo/satellite-sitemap-entries";

export const revalidate = 3600;

async function buildWwwSitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = publicSiteUrl();
  const topics = await getActiveNewsTopics();
  const fullCorridors = topics.filter((t) => t.status === "active" && t.corridorSlug && t.sitePaths);
  const developingCorridors = topics.filter(
    (t) => t.status === "in_development" && t.corridorSlug && t.sitePaths?.landing
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${origin}/ru`, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}${ES_PATHS.home}`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${origin}/llms.txt`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${origin}/llms-full.txt`, changeFrequency: "weekly", priority: 0.4 },
    { url: `${origin}/ru/wizard`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${origin}${ORIGIN_HUB_PATH}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}/ru/guides`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}${ES_PATHS.guides}`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}${ES_PATHS.uruguay}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.ecuador}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.peru}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.paraguay}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.colombia}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.spain}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.portugal}`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${origin}${ES_PATHS.wizard}`, changeFrequency: "monthly", priority: 0.93 },
    { url: `${origin}${ES_PATHS.contact}`, changeFrequency: "monthly", priority: 0.55 },
    { url: `${origin}${ES_PATHS.privacy}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}${ES_PATHS.terms}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}${STORIES_INDEX_PATH}`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${origin}/ru/community`, changeFrequency: "monthly", priority: 0.75 },
    { url: `${origin}/ru/ukraine`, changeFrequency: "monthly", priority: 0.82 },
    { url: newsHubUrl(), changeFrequency: "daily", priority: 0.9 },
    { url: `${origin}/ru/partners`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${origin}/ru/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${origin}/ru/assist`, changeFrequency: "monthly", priority: 0.6 },
    ...TRANSIT_HUBS.map((hub) => ({
      url: `${origin}${hub.path}`,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
  ];

  const countryNewsRoutes: MetadataRoute.Sitemap = topics.map((t) => ({
    url: `${origin}${newsIndexPath(t.urlSegment)}`,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const corridorRoutes: MetadataRoute.Sitemap = [];
  const programRoutes: MetadataRoute.Sitemap = [];

  const allCorridorTopics = [...developingCorridors, ...fullCorridors];
  const corridorSlugs = Array.from(new Set(allCorridorTopics.map((t) => t.corridorSlug!)));
  const corridors = await Promise.all(corridorSlugs.map((slug) => getCorridorBySlug(slug)));
  const corridorBySlug = new Map(corridorSlugs.map((slug, index) => [slug, corridors[index]]));

  const programSlugs = Array.from(
    new Set(
      fullCorridors.flatMap((topic) => {
        const corridor = corridorBySlug.get(topic.corridorSlug!);
        return corridor?.programs.map((p) => p.slug) ?? [];
      }),
    ),
  );
  const programsBySlug = await getProgramsBySlugs(programSlugs);

  for (const topic of developingCorridors) {
    const slug = topic.corridorSlug!;
    const corridor = corridorBySlug.get(slug);
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
      },
    );
  }

  for (const topic of fullCorridors) {
    const slug = topic.corridorSlug!;
    const corridor = corridorBySlug.get(slug);
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
      },
    );

    for (const p of corridor?.programs ?? []) {
      const program = programsBySlug.get(p.slug);
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

  const guideRoutes: MetadataRoute.Sitemap = [
    ...listGuides("ru").map((guide) => ({
      url: `${origin}${guidePath(guide.slug, "ru")}`,
      ...(guide.date_modified || guide.date_published
        ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
        : {}),
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    ...listGuides("es").map((guide) => ({
      url: `${origin}${esGuidePath(guide.slug)}`,
      ...(guide.date_modified || guide.date_published
        ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
        : {}),
      changeFrequency: "monthly" as const,
      priority: 0.88,
    })),
  ];

  const storyRoutes: MetadataRoute.Sitemap = listStories().map((story) => ({
    url: `${origin}${storyPath(story.slug)}`,
    ...(story.date_modified || story.date_published
      ? { lastModified: new Date((story.date_modified || story.date_published)!).toISOString() }
      : {}),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Satellite note URLs live on portugal./spain.emigro.online — listed only in those hosts' sitemaps.
  return [
    ...staticRoutes,
    ...countryNewsRoutes,
    ...corridorRoutes,
    ...programRoutes,
    ...guideRoutes,
    ...storyRoutes,
    ...newsRoutes,
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const kind = publicHostKind();
  if (kind === "portugal-satellite") {
    return buildSatelliteSitemapEntries("portugal");
  }
  if (kind === "spain-satellite") {
    return buildSatelliteSitemapEntries("spain");
  }
  return buildWwwSitemap();
}
