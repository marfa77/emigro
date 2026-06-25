import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { CorridorBreadcrumb } from "@/components/corridor/CorridorLanding";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { LatestNewsTeaser } from "@/components/news/LatestNewsTeaser";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull, isCorridorOnSite } from "@/lib/corridor/publish";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const segments = await getPublishedCorridorSegments();
  return corridorStaticParamsFromSegments(segments);
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths) return {};
  return pageMetadata({
    title: `Справочник коридора — ${topic.countryRu}`,
    description: `Проверенные факты по ВНЖ, языку и срокам гражданства для русскоязычных в ${topic.countryRu}.`,
    path: topic.sitePaths.guide!,
  });
}

export default async function CountryDigestPage({ params }: { params: { country: string } }) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.guide) notFound();

  const corridor = await getCorridorBySlug(topic.corridorSlug);
  if (!corridor) {
    return <p className="p-8 text-center">Дайджест недоступен.</p>;
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current="Справочник" />

        <h1 className="mt-4 text-3xl font-bold">Справочник: {topic.countryRu}</h1>
        <p className="mt-2 text-slate-600">
          Практические заметки по гражданству, языку и административным шагам — статический intelligence-слой коридора.
          Актуальные изменения законов — в{" "}
          <Link href={`/ru/news?country=${topic.key}`} className="text-corridor-600 underline">
            еженедельных новостях
          </Link>
          .
        </p>

        <div className="mt-8">
          <LatestNewsTeaser topicKey={topic.key} />
        </div>

        <div className="mt-10 space-y-6">
          {corridor.digest.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium uppercase text-corridor-600">{item.category}</p>
              <h2 className="mt-2 text-xl font-semibold">{item.title_ru}</h2>
              <p className="mt-3 whitespace-pre-line text-slate-700">{item.body_ru}</p>
              {item.source_url && (
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-corridor-600 underline"
                >
                  Источник
                </a>
              )}
            </article>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          <CorridorIntelLinks topic={topic} />
          {isCorridorFull(topic.status) && topic.sitePaths.wizard && (
            <p className="text-center text-sm text-slate-500">
              <Link href={topic.sitePaths.wizard} className="text-corridor-600 hover:underline">
                Подобрать маршрут →
              </Link>
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
