import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { NewsIndexContent } from "@/components/news/NewsIndexContent";
import {
  getPublishedNewsDigests,
  NEWS_INDEX_POOL_LIMIT,
} from "@/lib/news/digests";
import { getActiveNewsTopics, resolveNewsTopicFromParam } from "@/lib/news/topics";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import {
  buildNewsFaqSchema,
  buildNewsIndexAiDescription,
  buildNewsIndexFaq,
} from "@/lib/seo/news-page-seo";
import { newsArticleUrl, newsFeedUrl } from "@/lib/site-url";

export const revalidate = 300;

const NEWS_INDEX_TITLE = "Новости релокации в Европу";
const NEWS_INDEX_DESCRIPTION =
  "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей.";

function buildIndexMetadata(topic: Awaited<ReturnType<typeof resolveNewsTopicFromParam>>): Metadata {
  const baseMetadata = pageMetadata({
    title: topic ? `Новости ${topic.countryRu} — ВНЖ и гражданство` : NEWS_INDEX_TITLE,
    titleAbsolute: true,
    description: topic
      ? `Еженедельные обзоры по релокации ${topic.countryInRu}. Не юридическая консультация — ориентиры с источниками.`
      : NEWS_INDEX_DESCRIPTION,
    path: "/ru/news",
    ogImage: "/images/og/news-digest.jpg",
    ogImageAlt: topic ? `Новости ${topic.countryRu} — Emigro` : "Новости релокации Emigro",
    aiDescription: buildNewsIndexAiDescription(topic),
    aiCategory: "relocation-news-index",
  });

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      canonical: pageUrl("/ru/news"),
      types: { "application/rss+xml": newsFeedUrl(topic?.urlSegment) },
    },
  };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { country?: string };
}): Promise<Metadata> {
  const topic = await resolveNewsTopicFromParam(searchParams.country);
  return buildIndexMetadata(topic);
}

export default async function NewsIndexPage() {
  const [allTopics, digests] = await Promise.all([
    getActiveNewsTopics(),
    getPublishedNewsDigests({ limit: NEWS_INDEX_POOL_LIMIT }),
  ]);
  const pillarGuides = listPillarGuides().slice(0, 6);

  const aiDescription = buildNewsIndexAiDescription(null);
  const faq = buildNewsIndexFaq(null);
  const faqSchema = buildNewsFaqSchema(faq);
  const indexUrl = pageUrl("/ru/news");

  const collectionSchema = buildCollectionPageItemListSchema({
    name: NEWS_INDEX_TITLE,
    url: indexUrl,
    description: NEWS_INDEX_DESCRIPTION,
    inLanguage: "ru-RU",
    items: digests.slice(0, 20).map((d) => ({
      url: newsArticleUrl(d.slug),
      name: d.title ?? d.slug,
    })),
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Новости", item: pageUrl("/ru/news") },
  ]);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <section className="sr-only" aria-label="AI description">
        <p>{aiDescription}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <NewsIndexContent allTopics={allTopics} digests={digests} pillarGuides={pillarGuides} />
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {faq.map((item) => (
            <div key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="font-medium text-slate-900">{item.question}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}