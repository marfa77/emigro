import { CorridorHubTile, CorridorHubTileSlot, CorridorHubTilesGrid, CorridorHubTilesLegend } from "@/components/corridor/hub/CorridorHubTile";
import {
  corridorHubJourney,
  corridorHubLabel,
  resolveCorridorHubTiles,
} from "@/lib/corridor/hub";
import { getCorridorHubTileStats } from "@/lib/corridor/hub-stats";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

type Props = {
  topic: NewsTopicConfig;
};

export async function CorridorHubStack({ topic }: Props) {
  const stats = await getCorridorHubTileStats(topic);
  const tiles = resolveCorridorHubTiles(topic, stats);
  const journey = corridorHubJourney(topic);
  const hubLabel = corridorHubLabel(topic);
  const headingId = `corridor-hub-stack-${topic.urlSegment}`;

  return (
    <section className="mt-10" aria-labelledby={headingId}>
      <div className="rounded-2xl border border-corridor-200 bg-gradient-to-br from-slate-950 via-slate-900 to-corridor-950 p-4 sm:p-6 md:p-8">
        <h2 id={headingId} className="text-xl font-bold text-white sm:text-2xl">
          {hubLabel}
        </h2>

        <ol className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
          {journey.map((item, index) => (
            <li
              key={item.step}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-200 sm:px-4 sm:py-3 sm:text-sm"
            >
              <span className="font-semibold text-white">
                {index + 1}. {item.step}
              </span>
              <p className="mt-1 text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ol>

        <CorridorHubTilesGrid>
          {tiles.map((tile) => (
            <CorridorHubTileSlot key={tile.id}>
              <CorridorHubTile tile={tile} />
            </CorridorHubTileSlot>
          ))}
        </CorridorHubTilesGrid>

        <CorridorHubTilesLegend />
      </div>
    </section>
  );
}
