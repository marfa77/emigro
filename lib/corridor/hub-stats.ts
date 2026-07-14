import { unstable_cache } from "next/cache";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import type { CorridorHubTileStats } from "@/lib/corridor/hub";
import { countGuidesForTopic } from "@/lib/guides/corridor-guides";
import { NEWS_INDEX_POOL_LIMIT, getPublishedNewsDigests } from "@/lib/news/digests";
import { isPortugalHubTopic } from "@/lib/portugal/hub";
import { topicHasLanding } from "@/lib/corridor/publish";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import type { Corridor } from "@/lib/types";

function formatLastNewsLabel(publishedAt: string | undefined): string | null {
  if (!publishedAt) return null;
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(publishedAt));
}

function buildStatsForTopic(
  topic: NewsTopicConfig,
  corridor: Awaited<ReturnType<typeof getCorridorBySlug>>,
  news: { published_at: string }[],
  practiceNotes: number,
): CorridorHubTileStats {
  const corridorSlug = topic.corridorSlug;
  return {
    routeCount: corridor?.programs.length ?? 0,
    digestCount: corridor?.digest.length ?? 0,
    guideCount: countGuidesForTopic(topic.key, corridorSlug),
    newsCount: news.length,
    practiceNotes,
    lastNewsLabel: formatLastNewsLabel(news[0]?.published_at),
  };
}

const getPortugalPracticeNotesCount = unstable_cache(
  async () => (await getPublishedCommunityNotes("portugal")).length,
  ["portugal-practice-notes-count"],
  { revalidate: 300, tags: ["community-notes"] },
);

export async function getCorridorHubTileStatsBatch(
  topics: NewsTopicConfig[],
): Promise<Map<string, CorridorHubTileStats>> {
  const withLanding = topics.filter(topicHasLanding);
  const statsMap = new Map<string, CorridorHubTileStats>();
  if (withLanding.length === 0) return statsMap;

  const corridorSlugs = Array.from(
    new Set(withLanding.map((topic) => topic.corridorSlug).filter((slug): slug is string => Boolean(slug))),
  );
  const needsPortugalNotes = withLanding.some(isPortugalHubTopic);

  const [corridors, newsPool, portugalNotesCount] = await Promise.all([
    Promise.all(corridorSlugs.map((slug) => getCorridorBySlug(slug))),
    getPublishedNewsDigests({ limit: NEWS_INDEX_POOL_LIMIT }),
    needsPortugalNotes ? getPortugalPracticeNotesCount() : Promise.resolve(0),
  ]);

  const corridorBySlug = new Map(corridorSlugs.map((slug, index) => [slug, corridors[index]]));
  const newsByTopic = new Map<string, { published_at: string }[]>();
  for (const digest of newsPool) {
    const bucket = newsByTopic.get(digest.topic_key) ?? [];
    bucket.push(digest);
    newsByTopic.set(digest.topic_key, bucket);
  }

  for (const topic of withLanding) {
    const corridor = topic.corridorSlug ? corridorBySlug.get(topic.corridorSlug) ?? null : null;
    const news = newsByTopic.get(topic.key) ?? [];
    const practiceNotes = isPortugalHubTopic(topic) ? portugalNotesCount : 0;
    statsMap.set(topic.key, buildStatsForTopic(topic, corridor, news, practiceNotes));
  }

  return statsMap;
}

/** Stats from an already-loaded corridor — skips a second getCorridorBySlug round-trip. */
export async function getCorridorHubTileStatsFromCorridor(
  topic: NewsTopicConfig,
  corridor: Corridor,
): Promise<CorridorHubTileStats> {
  const [news, practiceNotes] = await Promise.all([
    getPublishedNewsDigests({ topicKey: topic.key, limit: NEWS_INDEX_POOL_LIMIT }),
    isPortugalHubTopic(topic) ? getPortugalPracticeNotesCount() : Promise.resolve(0),
  ]);
  return buildStatsForTopic(topic, corridor, news, practiceNotes);
}

export async function getCorridorHubTileStats(topic: NewsTopicConfig): Promise<CorridorHubTileStats> {
  const stats = await getCorridorHubTileStatsBatch([topic]);
  return (
    stats.get(topic.key) ?? {
      routeCount: 0,
      digestCount: 0,
      guideCount: countGuidesForTopic(topic.key, topic.corridorSlug),
      newsCount: 0,
      practiceNotes: 0,
      lastNewsLabel: null,
    }
  );
}
