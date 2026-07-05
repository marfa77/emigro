import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { PORTUGAL_CORRIDOR_SLUG, PORTUGAL_URL_SEGMENT, type PortugalHubTileStats } from "@/lib/portugal/hub";

export type { PortugalHubTileStats };

export async function getPortugalHubTileStats(): Promise<PortugalHubTileStats> {
  const [corridor, notes, news] = await Promise.all([
    getCorridorBySlug(PORTUGAL_CORRIDOR_SLUG),
    getPublishedCommunityNotes(PORTUGAL_URL_SEGMENT),
    getPublishedNewsDigests({ topicKey: PORTUGAL_URL_SEGMENT, limit: 100 }),
  ]);

  const lastNews = news[0]?.published_at;

  return {
    routeCount: corridor?.programs.length ?? 3,
    digestCount: corridor?.digest.length ?? 0,
    newsCount: news.length,
    practiceNotes: notes.length,
    lastNewsLabel: lastNews
      ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" }).format(new Date(lastNews))
      : null,
  };
}
