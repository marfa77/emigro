import { PortugalHubTile, PortugalHubTilesLegend } from "@/components/portugal/PortugalHubTile";
import { PortugalHubPulse } from "@/components/portugal/PortugalHubPulse";
import { PORTUGAL_HUB_JOURNEY, resolvePortugalHubTiles } from "@/lib/portugal/hub";
import { getPortugalHubTileStats } from "@/lib/portugal/stats";

export async function PortugalHubStack() {
  const stats = await getPortugalHubTileStats();
  const tiles = resolvePortugalHubTiles(stats);

  return (
    <section className="mt-10" aria-labelledby="portugal-hub-stack-heading">
      <div className="rounded-2xl border border-corridor-200 bg-gradient-to-br from-slate-950 via-slate-900 to-corridor-950 p-6 sm:p-8">
        <h2 id="portugal-hub-stack-heading" className="text-2xl font-bold text-white">
          Portugal Hub
        </h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          Четыре слоя одного коридора — как у Nomads, но про ваш переезд: маршрут, новости, практика и барахолка.
        </p>

        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {PORTUGAL_HUB_JOURNEY.map((item, index) => (
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
            <PortugalHubTile key={tile.id} tile={tile} />
          ))}
        </div>

        <PortugalHubTilesLegend />

        <PortugalHubPulse />
      </div>
    </section>
  );
}
