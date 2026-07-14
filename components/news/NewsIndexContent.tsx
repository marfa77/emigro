"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Newspaper, Rss } from "lucide-react";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { NewsCountryNav } from "@/components/news/NewsCountryNav";
import { NewsDigestCard } from "@/components/news/NewsDigest";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { NewsHeroVisual } from "@/components/visuals/NewsHeroVisual";
import type { NewsDigest } from "@/lib/news/digests";
import { NEWS_INDEX_DISPLAY_LIMIT } from "@/lib/news/digests";
import type { NewsTopicConfig } from "@/lib/news/topics";
import type { GuideFrontmatter } from "@/lib/guides/types";
import { guidePath } from "@/lib/guides/paths";
import { newsFeedUrl } from "@/lib/site-url";

type Props = {
  allTopics: NewsTopicConfig[];
  digests: NewsDigest[];
  pillarGuides: GuideFrontmatter[];
};

function NewsIndexBody({ allTopics, digests, pillarGuides }: Props) {
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country")?.trim().toLowerCase();

  const topic = useMemo(() => {
    if (!countryParam) return null;
    return allTopics.find((t) => t.key === countryParam || t.urlSegment === countryParam) ?? null;
  }, [allTopics, countryParam]);

  const topicByKey = useMemo(() => new Map(allTopics.map((t) => [t.key, t])), [allTopics]);

  const visibleDigests = useMemo(() => {
    const filtered = topic ? digests.filter((d) => d.topic_key === topic.key) : digests;
    return filtered.slice(0, NEWS_INDEX_DISPLAY_LIMIT);
  }, [digests, topic]);

  const feedUrl = newsFeedUrl(topic?.urlSegment);
  const pageTitle = topic
    ? `Новости ${topic.countryRu} для русскоязычных`
    : "Новости релокации в Европу";
  const pageDescription = topic
    ? `Изменения по маршрутам для ${topic.audienceRu}. Не юридическая консультация — ориентиры с источниками.`
    : "Еженедельные обзоры Emigro по ВНЖ, визам и гражданству в Португалии, Испании, Германии, Франции, Италии, Польше и других коридорах. Каждый выпуск — проверенные факты, ссылки на BOE, AIMA, BAMF и официальные источники. Для граждан РФ, Беларуси, Украины и Казахстана.";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_240px]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-corridor-100 px-3 py-1 text-sm font-medium text-corridor-800">
            <Newspaper className="h-4 w-4" />
            Еженедельный дайджест
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{pageTitle}</h1>
          <p className="mt-4 text-lg text-slate-600">{pageDescription}</p>
          <NewsCountryNav topics={allTopics} activeCountry={topic?.urlSegment} />
          {topic && (
            <div className="mt-6">
              <CorridorIntelLinks topic={topic} />
            </div>
          )}
          <a
            href={feedUrl}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-corridor-700 hover:underline"
          >
            <Rss className="h-4 w-4" />
            RSS-лента{topic ? ` (${topic.countryRu})` : ""}
          </a>
        </div>
        <div className="hidden lg:block" aria-hidden>
          <NewsHeroVisual />
        </div>
      </div>

      {visibleDigests.length === 0 ? (
        <div className="mt-12 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          Пока нет опубликованных выпусков{topic ? ` по ${topic.countryRu}` : ""}.
        </div>
      ) : (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {visibleDigests.map((digest) => (
            <NewsDigestCard
              key={digest.id}
              digest={digest}
              topic={topicByKey.get(digest.topic_key)}
            />
          ))}
        </div>
      )}

      <RelocatorChatPromo source="news_index" className="mt-12" />

      {!topic && pillarGuides.length > 0 && (
        <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Pillar-гайды Emigro</h2>
          <p className="mt-1 text-sm text-slate-600">
            Подробные разборы маршрутов ВНЖ — дополнение к еженедельным новостям.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {pillarGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={guidePath(guide.slug)}
                  className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-corridor-400"
                >
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic?.corridorSlug && (
        <div className="mt-12">
          <CorridorIntelLinks topic={topic} variant="compact" />
        </div>
      )}
    </main>
  );
}

export function NewsIndexContent(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" aria-hidden />}>
      <NewsIndexBody {...props} />
    </Suspense>
  );
}
