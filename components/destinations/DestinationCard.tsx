import { CorridorHubTile, CorridorHubTileSlot } from "@/components/corridor/hub/CorridorHubTile";
import { DestinationCardPlain } from "@/components/destinations/DestinationCardPlain";
import { resolveCorridorCountryTile } from "@/lib/corridor/hub";
import { getCorridorHubTileStats } from "@/lib/corridor/hub-stats";
import { topicHasLanding } from "@/lib/corridor/publish";
import type { NewsTopicConfig } from "@/lib/news/topics";

export async function DestinationCard({ topic }: { topic: NewsTopicConfig }) {
  if (!topicHasLanding(topic)) {
    return <DestinationCardPlain topic={topic} />;
  }

  const stats = await getCorridorHubTileStats(topic);
  const tile = resolveCorridorCountryTile(topic, stats);

  return (
    <CorridorHubTileSlot>
      <CorridorHubTile tile={tile} />
    </CorridorHubTileSlot>
  );
}
