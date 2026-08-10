import { Suspense } from "react";
import Link from "next/link";
import { Globe2, Route } from "lucide-react";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { CorridorHubTilesGrid, CorridorHubTilesLegend } from "@/components/corridor/hub/CorridorHubTile";
import { EmigroScoreLinkCard } from "@/components/emigro-score/EmigroScoreLinkCard";
import { getCorridorHubTileStatsBatch } from "@/lib/corridor/hub-stats";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { EMIGRO_SCORE_PATH, sortByEmigroScoreDesc } from "@/lib/emigro-score";
import { getHubsByKind, type TransitHub } from "@/lib/transit-hubs";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";

type Props = {
  fullCorridors: NewsTopicConfig[];
  developingCorridors: NewsTopicConfig[];
  newsOnly: NewsTopicConfig[];
};

function HubCardsGrid({ hubs }: { hubs: TransitHub[] }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {hubs.map((hub) => (
        <EmigroScoreLinkCard key={hub.slug} hub={hub} />
      ))}
    </div>
  );
}

export async function HubDestinationsSection({ fullCorridors, developingCorridors, newsOnly }: Props) {
  const allTopics = [...fullCorridors, ...developingCorridors, ...newsOnly];
  const statsByTopic = await getCorridorHubTileStatsBatch(allTopics);
  const byScoreTopic = (t: NewsTopicConfig) => t.urlSegment;
  const fullSorted = sortByEmigroScoreDesc(fullCorridors, byScoreTopic);
  const developingSorted = sortByEmigroScoreDesc(developingCorridors, byScoreTopic);
  const newsSorted = sortByEmigroScoreDesc(newsOnly, byScoreTopic);
  const settleHubs = sortByEmigroScoreDesc(getHubsByKind("settle"), (h) => h.slug);
  const transitHubs = sortByEmigroScoreDesc(getHubsByKind("transit"), (h) => h.slug);

  return (
    <section id="destinations" className="mt-14 scroll-mt-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Направления</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Emigro Score /100 — сортировка по убыванию рейтинга (база: паспорт РФ). Клик — оси · Open — обзор.
          </p>
        </div>
        <Link
          href={EMIGRO_SCORE_PATH}
          className="shrink-0 text-sm font-medium text-corridor-700 hover:underline"
        >
          Методология Score
        </Link>
      </div>

      {fullSorted.length > 0 && (
        <>
          <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-corridor-700">
            Полные коридоры ({fullSorted.length})
          </h3>
          <CorridorHubTilesGrid>
            {fullSorted.map((topic) => (
              <DestinationCard key={topic.key} topic={topic} stats={statsByTopic.get(topic.key)} />
            ))}
          </CorridorHubTilesGrid>
          <CorridorHubTilesLegend />
        </>
      )}

      {settleHubs.length > 0 && (
        <section className="mt-10 rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-900">
                <Globe2 className="h-4 w-4" />
                Страны для жизни
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Направления вне ЕС, где можно строить долгую жизнь, статус и интеграцию — не только транзит в Европу.
              </p>
            </div>
            <Link href="/ru/guides?cat=settle" className="text-sm font-medium text-teal-800 hover:underline">
              Гайды категории
            </Link>
          </div>
          <HubCardsGrid hubs={settleHubs} />
        </section>
      )}

      {transitHubs.length > 0 && (
        <section className="mt-10 rounded-2xl border border-corridor-100 bg-corridor-50/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-800">
                <Route className="h-4 w-4" />
                Транзитные хабы
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Первый шаг на 3–12 месяцев: стабилизировать документы, банки и доход перед EU-маршрутом. Это не
                коридоры ВНЖ или гражданства.
              </p>
            </div>
            <Link href={HUB_WIZARD_PATH} className="text-sm font-medium text-corridor-700 hover:underline">
              Проверить EU-маршрут
            </Link>
          </div>
          <HubCardsGrid hubs={transitHubs} />
        </section>
      )}

      {developingSorted.length > 0 && (
        <>
          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-amber-800">
            Коридоры в разработке ({developingSorted.length})
          </h3>
          <CorridorHubTilesGrid>
            {developingSorted.map((topic) => (
              <DestinationCard key={topic.key} topic={topic} stats={statsByTopic.get(topic.key)} />
            ))}
          </CorridorHubTilesGrid>
        </>
      )}

      {newsSorted.length > 0 && (
        <>
          <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Только новости ({newsSorted.length})
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsSorted.map((topic) => (
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
