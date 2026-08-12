import type { MetadataRoute } from "next";
import { corridorDigestPath, corridorLandingPath, corridorWizardPath, programPath } from "@/lib/corridor/paths";
import { getCorridorBySlug, getProgramsBySlugs } from "@/lib/corridor/queries";
import { ES_PATHS, esGuidePath } from "@/lib/es/corridor";
import { FR_PATHS, frGuidePath } from "@/lib/fr/corridor";
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

/** Index-boost for priority landings / wizards / programs / guides (wave 1 + wave 2). */
const SITEMAP_PRIORITY_BOOST: Record<string, number> = {
  // Wave 1 — hubs
  "/ru/greece": 0.96,
  "/ru/poland": 0.96,
  "/ru/estonia": 0.96,
  "/ru/cyprus": 0.96,
  "/ru/czechia": 0.96,
  // Wave 2 — hubs
  "/ru/denmark": 0.95,
  "/ru/finland": 0.95,
  "/ru/hungary": 0.95,
  "/ru/malta": 0.95,
  "/ru/norway": 0.95,
  "/ru/sweden": 0.95,
  // Wave 1 — wizards (top)
  "/ru/greece/wizard": 0.92,
  "/ru/poland/wizard": 0.92,
  // Wave 2 — wizards + conversion surfaces (/es/wizard keeps static 0.93)
  "/fr/wizard": 0.91,
  "/es/assist": 0.91,
  "/fr/assist": 0.91,
  "/es/role-radar": 0.91,
  "/ru/portugal/wizard": 0.91,
  "/ru/spain/wizard": 0.91,
  "/ru/france/wizard": 0.91,
  "/ru/italy/wizard": 0.91,
  "/ru/germany/wizard": 0.91,
  "/ru/netherlands/wizard": 0.91,
  "/ru/sweden/wizard": 0.91,
  "/ru/norway/wizard": 0.91,
  "/ru/finland/wizard": 0.91,
  "/ru/denmark/wizard": 0.91,
  "/ru/czechia/wizard": 0.91,
  "/ru/austria/wizard": 0.91,
  "/ru/cyprus/wizard": 0.91,
  "/ru/hungary/wizard": 0.91,
  "/ru/malta/wizard": 0.91,
  "/ru/bulgaria/wizard": 0.91,
  "/ru/croatia/wizard": 0.91,
  "/ru/slovenia/wizard": 0.91,
  "/ru/estonia/wizard": 0.91,
  // Wave 1 — programs
  "/ru/greece/programs/greece-digital-nomad": 0.9,
  "/ru/greece/programs/greece-fip": 0.9,
  "/ru/greece/programs/greece-golden-visa": 0.9,
  "/ru/estonia/programs/estonia-e-residency-ou": 0.9,
  "/ru/cyprus/programs/cyprus-category-f": 0.9,
  "/ru/czechia/programs/czechia-zivnost-freelancer": 0.9,
  // Wave 2 — programs
  "/ru/hungary/programs/hungary-white-card": 0.88,
  "/ru/hungary/programs/hungary-guest-investor": 0.88,
  "/ru/malta/programs/malta-mprp": 0.88,
  "/ru/malta/programs/malta-nrp": 0.88,
  "/ru/denmark/programs/denmark-work-permit": 0.88,
  "/ru/denmark/programs/denmark-fast-track": 0.88,
  "/ru/finland/programs/finland-startup": 0.88,
  "/ru/finland/programs/finland-work-permit": 0.88,
  "/ru/norway/programs/norway-skilled-worker": 0.88,
  "/ru/norway/programs/norway-eu-blue-card": 0.88,
  "/ru/sweden/programs/sweden-work-permit": 0.88,
  "/ru/sweden/programs/sweden-eu-blue-card": 0.88,
  "/ru/bulgaria/programs/bulgaria-digital-nomad": 0.88,
  "/ru/bulgaria/programs/bulgaria-eood": 0.88,
  "/ru/croatia/programs/croatia-digital-nomad": 0.88,
  "/ru/slovenia/programs/slovenia-digital-nomad": 0.88,
  "/ru/slovenia/programs/slovenia-self-employed-sp": 0.88,
  "/ru/estonia/programs/estonia-digital-nomad": 0.88,
  "/ru/cyprus/programs/cyprus-digital-nomad": 0.88,
  "/ru/czechia/programs/czechia-student-visa": 0.88,
  "/ru/greece/programs/greece-family-reunification": 0.88,
  // Wave 1 — guides
  "/ru/guides/vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026": 0.92,
  "/ru/guides/grazhdanstvo-germaniya-polsha-2026": 0.92,
  "/ru/guides/otkaz-v-natsionalnoy-vize-konsulstvo-2026": 0.92,
  "/ru/guides/pervye-30-dnej-v-polsche-2026": 0.92,
  "/ru/guides/pervye-30-dnej-v-gretsii-2026": 0.92,
  // Wave 2 — guides
  "/ru/guides/pervye-30-dnej-v-frantsii-2026": 0.9,
  "/ru/guides/oae-dlya-rossiyan-2026": 0.9,
  "/ru/guides/vnj-shvetsiya-2026-work-permit-grazhdanstvo": 0.9,
};

function sitemapPriority(pathname: string, fallback: number): number {
  return SITEMAP_PRIORITY_BOOST[pathname] ?? fallback;
}

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
    { url: `${origin}${FR_PATHS.home}`, changeFrequency: "weekly", priority: 0.94 },
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
    { url: `${origin}${ES_PATHS.chile}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.spain}`, changeFrequency: "weekly", priority: 0.92 },
    { url: `${origin}${ES_PATHS.portugal}`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${origin}${ES_PATHS.wizard}`,
      changeFrequency: "monthly",
      priority: sitemapPriority(ES_PATHS.wizard, 0.93),
    },
    {
      url: `${origin}${ES_PATHS.assist}`,
      changeFrequency: "monthly",
      priority: sitemapPriority(ES_PATHS.assist, 0.7),
    },
    {
      url: `${origin}${ES_PATHS.roleRadar}`,
      changeFrequency: "monthly",
      priority: sitemapPriority(ES_PATHS.roleRadar, 0.65),
    },
    { url: `${origin}${ES_PATHS.contact}`, changeFrequency: "monthly", priority: 0.55 },
    { url: `${origin}${ES_PATHS.privacy}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}${ES_PATHS.terms}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}${FR_PATHS.guides}`, changeFrequency: "weekly", priority: 0.88 },
    { url: `${origin}${FR_PATHS.maroc}`, changeFrequency: "weekly", priority: 0.91 },
    { url: `${origin}${FR_PATHS.algerie}`, changeFrequency: "weekly", priority: 0.91 },
    { url: `${origin}${FR_PATHS.tunisie}`, changeFrequency: "weekly", priority: 0.91 },
    { url: `${origin}${FR_PATHS.senegal}`, changeFrequency: "weekly", priority: 0.91 },
    { url: `${origin}${FR_PATHS.france}`, changeFrequency: "weekly", priority: 0.91 },
    {
      url: `${origin}${FR_PATHS.wizard}`,
      changeFrequency: "monthly",
      priority: sitemapPriority(FR_PATHS.wizard, 0.7),
    },
    {
      url: `${origin}${FR_PATHS.assist}`,
      changeFrequency: "monthly",
      priority: sitemapPriority(FR_PATHS.assist, 0.65),
    },
    { url: `${origin}${FR_PATHS.contact}`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${origin}${FR_PATHS.privacy}`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${origin}${FR_PATHS.terms}`, changeFrequency: "yearly", priority: 0.3 },
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
    const landing = corridorLandingPath(slug);
    corridorRoutes.push(
      {
        url: `${origin}${landing}`,
        changeFrequency: "weekly",
        priority: sitemapPriority(landing, 0.7),
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
    const landing = corridorLandingPath(slug);
    const wizard = corridorWizardPath(slug);

    corridorRoutes.push(
      {
        url: `${origin}${landing}`,
        changeFrequency: "weekly",
        priority: sitemapPriority(landing, 0.95),
        ...(digestModified ? { lastModified: digestModified } : {}),
      },
      {
        url: `${origin}${wizard}`,
        changeFrequency: "monthly",
        priority: sitemapPriority(wizard, 0.85),
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
      const progPath = programPath(slug, p.slug);
      programRoutes.push({
        url: `${origin}${progPath}`,
        changeFrequency: "monthly",
        priority: sitemapPriority(progPath, 0.8),
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
    ...listGuides("ru").map((guide) => {
      const path = guidePath(guide.slug, "ru");
      return {
        url: `${origin}${path}`,
        ...(guide.date_modified || guide.date_published
          ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
          : {}),
        changeFrequency: "monthly" as const,
        priority: sitemapPriority(path, 0.85),
      };
    }),
    ...listGuides("es").map((guide) => ({
      url: `${origin}${esGuidePath(guide.slug)}`,
      ...(guide.date_modified || guide.date_published
        ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
        : {}),
      changeFrequency: "monthly" as const,
      priority: 0.88,
    })),
    ...listGuides("fr").map((guide) => ({
      url: `${origin}${frGuidePath(guide.slug)}`,
      ...(guide.date_modified || guide.date_published
        ? { lastModified: new Date((guide.date_modified || guide.date_published)!).toISOString() }
        : {}),
      changeFrequency: "monthly" as const,
      priority: 0.87,
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
