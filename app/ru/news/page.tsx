import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, Rss } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { NewsCountryNav } from "@/components/news/NewsCountryNav";
import { NewsDigestCard } from "@/components/news/NewsDigest";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { NewsHeroVisual } from "@/components/visuals/NewsHeroVisual";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { getPublishedNewsDigests } from "@/lib/news/digests";
import { getActiveNewsTopics, resolveNewsTopicFromParam } from "@/lib/news/topics";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { guidePath } from "@/lib/guides/load";
import { newsArticleUrl, newsFeedUrl, newsHubUrl, SITE_URL } from "@/lib/site-url";

export const revalidate = 60;

type Props = { searchParams: { country?: string } };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const topic = await resolveNewsTopicFromParam(searchParams.country);
  const allTags = (await getActiveNewsTopics()).flatMap((t) => t.seoTags);

  if (topic) {
    const path = `/ru/news?country=${topic.urlSegment}`;
    const base = pageMetadata({
      title: `Новости ${topic.countryRu} — ВНЖ и гражданство`,
      titleAbsolute: true,
      description: `Еженедельные обзоры по релокации в ${topic.countryRu} для ${topic.audienceRu}: изменения законов, консульства, пороги ВНЖ и практика подачи с проверенными источниками.`,
      path,
    });
    return {
      ...base,
      keywords: topic.seoTags,
      alternates: {
        ...base.alternates,
        canonical: pageUrl("/ru/news"),
        types: { "application/rss+xml": newsFeedUrl(topic.urlSegment) },
      },
    };
  }

  const base = pageMetadata({
    title: "Новости релокации в Европу",
    titleAbsolute: true,
    description:
      "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей.",
    path: "/ru/news",
    ogImage: "/images/og/news-digest.jpg",
    ogImageAlt: "Новости релокации Emigro",
  });
  return {
    ...base,
    keywords: allTags,
    alternates: {
      ...base.alternates,
      types: { "application/rss+xml": newsFeedUrl() },
    },
  };
}

export default async function NewsIndexPage({ searchParams }: Props) {
  const allTopics = await getActiveNewsTopics();
  const topic = await resolveNewsTopicFromParam(searchParams.country);
  const topicByKey = new Map(allTopics.map((t) => [t.key, t]));
  const pillarGuides = listPillarGuides().slice(0, 6);
  const digests = await getPublishedNewsDigests({
    topicKey: topic?.key,
    limit: topic ? 60 : 120,
  });

  const hubUrl = newsHubUrl(topic?.urlSegment);
  const feedUrl = newsFeedUrl(topic?.urlSegment);
  const pageTitle = topic
    ? `Новости ${topic.countryRu} для русскоязычных`
    : "Новости релокации в Европу";
  const pageDescription = topic
    ? `Изменения по маршрутам для ${topic.audienceRu}. Не юридическая консультация — ориентиры с источниками.`
    : "Еженедельные обзоры Emigro по ВНЖ, визам и гражданству в Португалии, Испании, Германии, Франции, Италии, Польше и других коридорах. Каждый выпуск — проверенные факты, ссылки на BOE, AIMA, BAMF и официальные источники. Для граждан РФ, Беларуси, Украины и Казахстана.";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    inLanguage: "ru-RU",
    itemListElement: digests.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: newsArticleUrl(d.slug),
      name: d.title,
    })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Новости" },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

        {digests.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
            Первый выпуск появится после импорта Prep2Go. Запуск:{" "}
            <code className="text-sm">npm run news:import-prep2go</code>
            {topic && (
              <>
                {" "}
                или <code className="text-sm">npm run news:import-prep2go -- --topic={topic.key}</code>
              </>
            )}
          </div>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {digests.map((digest) => (
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
      <SiteFooter />
    </>
  );
}
