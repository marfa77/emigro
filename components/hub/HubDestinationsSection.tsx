import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CorridorHubTilesGrid, CorridorHubTilesLegend } from "@/components/corridor/hub/CorridorHubTile";
import { getCorridorHubTileStatsBatch } from "@/lib/corridor/hub-stats";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";

type Props = {
  fullCorridors: NewsTopicConfig[];
  developingCorridors: NewsTopicConfig[];
  newsOnly: NewsTopicConfig[];
};

export async function HubDestinationsSection({ fullCorridors, developingCorridors, newsOnly }: Props) {
  const allTopics = [...fullCorridors, ...developingCorridors, ...newsOnly];
  const statsByTopic = await getCorridorHubTileStatsBatch(allTopics);

  return (
    <section id="destinations" className="mt-14 scroll-mt-20">
      <h2 className="text-2xl font-semibold text-slate-900">Направления</h2>
      <p className="mt-2 max-w-2xl text-slate-600">
        Клик по плитке — рейтинги коридора · Open — обзор коридора.
      </p>

      {fullCorridors.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-corridor-700">
            Полные коридоры ({fullCorridors.length})
          </h3>
          <CorridorHubTilesGrid>
            {fullCorridors.map((topic) => (
              <DestinationCard key={topic.key} topic={topic} stats={statsByTopic.get(topic.key)} />
            ))}
          </CorridorHubTilesGrid>
          <CorridorHubTilesLegend />
        </>
      )}

      <section className="mt-10 rounded-2xl border border-corridor-100 bg-corridor-50/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-800">
              <Route className="h-4 w-4" />
              Транзитные хабы
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Первый шаг на 3–12 месяцев: стабилизировать документы, банки и доход, если нужен промежуточный хаб
              перед EU-маршрутом. Это не коридоры ВНЖ или гражданства.
            </p>
          </div>
          <Link href={HUB_WIZARD_PATH} className="text-sm font-medium text-corridor-700 hover:underline">
            Проверить EU-маршрут
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TRANSIT_HUBS.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.path}
              className="group rounded-xl border border-white bg-white p-4 shadow-sm transition hover:border-corridor-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>
                {hub.flag}
              </span>
              <h4 className="mt-2 font-semibold text-slate-900">{hub.countryRu}</h4>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-corridor-700">
                {hub.cardLabel ?? "Транзитный хаб"}
              </p>
              <p className="mt-2 text-sm text-slate-600">{hub.tagline}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-corridor-700 group-hover:underline">
                Открыть
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {developingCorridors.length > 0 && (
        <>
          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-amber-800">
            Коридоры в разработке ({developingCorridors.length})
          </h3>
          <CorridorHubTilesGrid>
            {developingCorridors.map((topic) => (
              <DestinationCard key={topic.key} topic={topic} stats={statsByTopic.get(topic.key)} />
            ))}
          </CorridorHubTilesGrid>
        </>
      )}

      {newsOnly.length > 0 && (
        <>
          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Только новости ({newsOnly.length})
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsOnly.map((topic) => (
              <DestinationCard key={topic.key} topic={topic} stats={statsByTopic.get(topic.key)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function HubDestinationsFallback() {
  return (
    <section className="mt-14 animate-pulse rounded-2xl border border-slate-200 bg-slate-50 p-8" aria-hidden>
      <div className="h-7 w-48 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-40 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </section>
  );
}

export function HubDestinationsSectionSuspense(props: Props) {
  return (
    <Suspense fallback={<HubDestinationsFallback />}>
      <HubDestinationsSection {...props} />
    </Suspense>
  );
}
