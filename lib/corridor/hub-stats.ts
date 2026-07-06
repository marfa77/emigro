import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import type { CorridorHubTileStats } from "@/lib/corridor/hub";
import { countGuidesForTopic } from "@/lib/guides/corridor-guides";
import { isPortugalHubTopic } from "@/lib/portugal/hub";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

export async function getCorridorHubTileStats(topic: NewsTopicConfig): Promise<CorridorHubTileStats> {
  const corridorSlug = topic.corridorSlug;
  const [corridor, notes, news] = await Promise.all([
    corridorSlug ? getCorridorBySlug(corridorSlug) : Promise.resolve(null),
    isPortugalHubTopic(topic) ? getPublishedCommunityNotes(topic.urlSegment) : Promise.resolve([]),
    getPublishedNewsDigests({ topicKey: topic.key, limit: 100 }),
  ]);

  const lastNews = news[0]?.published_at;
  const guideCount = countGuidesForTopic(topic.key, corridorSlug);

  return {
    routeCount: corridor?.programs.length ?? 0,
    digestCount: corridor?.digest.length ?? 0,
    guideCount,
    newsCount: news.length,
    practiceNotes: notes.length,
    lastNewsLabel: lastNews
      ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(lastNews))
      : null,
  };
}
