import { CorridorHubTile, CorridorHubTileSlot } from "@/components/corridor/hub/CorridorHubTile";
import { DestinationCardPlain } from "@/components/destinations/DestinationCardPlain";
import type { CorridorHubTileStats } from "@/lib/corridor/hub";
import { resolveCorridorCountryTile } from "@/lib/corridor/hub";
import { topicHasLanding } from "@/lib/corridor/publish";
import type { NewsTopicConfig } from "@/lib/news/topics";

export function DestinationCard({
  topic,
  stats,
}: {
  topic: NewsTopicConfig;
  stats?: CorridorHubTileStats;
}) {
  if (!topicHasLanding(topic)) {
    return <DestinationCardPlain topic={topic} />;
  }

  if (!stats) {
    throw new Error(`DestinationCard requires stats for ${topic.key}`);
  }

  const tile = resolveCorridorCountryTile(topic, stats);

  return (
    <CorridorHubTileSlot>
      <CorridorHubTile tile={tile} />
    </CorridorHubTileSlot>
  );
}
