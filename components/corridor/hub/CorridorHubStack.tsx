import { CorridorHubTile, CorridorHubTilesLegend } from "@/components/corridor/hub/CorridorHubTile";
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
      <div className="rounded-2xl border border-corridor-200 bg-gradient-to-br from-slate-950 via-slate-900 to-corridor-950 p-6 sm:p-8">
        <h2 id={headingId} className="text-2xl font-bold text-white">
          {hubLabel}
        </h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          Четыре слоя одного коридора — как у Nomads, но про ваш переезд: маршрут, новости, практика и барахолка.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {journey.map((item, index) => (
            <li
              key={item.step}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              <span className="font-semibold text-white">
                {index + 1}. {item.step}
              </span>
              <p className="mt-1 text-slate-400">{item.detail}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {tiles.map((tile) => (
            <CorridorHubTile key={tile.id} tile={tile} />
          ))}
        </div>

        <CorridorHubTilesLegend />
      </div>
    </section>
  );
}
