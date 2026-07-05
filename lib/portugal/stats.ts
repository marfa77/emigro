import { getCorridorHubTileStats as getStats } from "@/lib/corridor/hub-stats";
import { PORTUGAL_URL_SEGMENT, type PortugalHubTileStats } from "@/lib/portugal/hub";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";

export type { PortugalHubTileStats };

export async function getPortugalHubTileStats(): Promise<PortugalHubTileStats> {
  const topic = await getTopicByCountrySegment(PORTUGAL_URL_SEGMENT);
  if (!topic) {
    return {
      routeCount: 0,
      digestCount: 0,
      newsCount: 0,
      practiceNotes: 0,
      lastNewsLabel: null,
    };
  }
  return getStats(topic);
}
