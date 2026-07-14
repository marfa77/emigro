import { Suspense } from "react";
import {
  CorridorHubTile,
  CorridorHubTileSlot,
  CorridorHubTilesGrid,
  CorridorHubTilesLegend,
} from "@/components/corridor/hub/CorridorHubTile";
import {
  corridorHubJourney,
  corridorHubLabel,
  type CorridorHubTileStats,
  resolveCorridorHubTiles,
} from "@/lib/corridor/hub";
import { getCorridorHubTileStats, getCorridorHubTileStatsFromCorridor } from "@/lib/corridor/hub-stats";
import type { NewsTopicConfig } from "@/lib/news/topics/types";
import type { Corridor } from "@/lib/types";

type ViewProps = {
  topic: NewsTopicConfig;
  stats: CorridorHubTileStats;
};

export function CorridorHubStackView({ topic, stats }: ViewProps) {
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

function CorridorHubStackFallback() {
  return (
    <section className="mt-10 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 p-8" aria-hidden>
      <div className="h-7 w-56 rounded bg-slate-200" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 rounded-lg bg-slate-200" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-xl bg-slate-200" />
        ))}
      </div>
    </section>
  );
}

/** Loads stats using a preloaded corridor (no duplicate corridor query). */
export async function CorridorHubStackSection({
  topic,
  corridor,
}: {
  topic: NewsTopicConfig;
  corridor: Corridor;
}) {
  const stats = await getCorridorHubTileStatsFromCorridor(topic, corridor);
  return <CorridorHubStackView topic={topic} stats={stats} />;
}

export function CorridorHubStackSectionSuspense({
  topic,
  corridor,
}: {
  topic: NewsTopicConfig;
  corridor: Corridor;
}) {
  return (
    <Suspense fallback={<CorridorHubStackFallback />}>
      <CorridorHubStackSection topic={topic} corridor={corridor} />
    </Suspense>
  );
}

/** Standalone loader when corridor is not already available (e.g. Portugal hub embed). */
export async function CorridorHubStack({ topic }: { topic: NewsTopicConfig }) {
  const stats = await getCorridorHubTileStats(topic);
  return <CorridorHubStackView topic={topic} stats={stats} />;
}
