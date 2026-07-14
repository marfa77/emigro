import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { NewsIndexContent } from "@/components/news/NewsIndexContent";
import {
  getPublishedNewsDigests,
  NEWS_INDEX_POOL_LIMIT,
} from "@/lib/news/digests";
import { getActiveNewsTopics } from "@/lib/news/topics";
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

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Новости релокации в Европу",
    titleAbsolute: true,
    description:
      "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей.",
    path: "/ru/news",
    ogImage: "/images/og/news-digest.jpg",
    ogImageAlt: "Новости релокации Emigro",
    aiDescription: buildNewsIndexAiDescription(null),
    aiCategory: "relocation-news-index",
  }),
  alternates: {
    types: { "application/rss+xml": newsFeedUrl() },
  },
};

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
    name: "Новости релокации в Европу",
    url: indexUrl,
    description:
      "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей.",
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
        <h2>ai:description</h2>
        <p>{aiDescription}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <NewsIndexContent allTopics={allTopics} digests={digests} pillarGuides={pillarGuides} />
      <SiteFooter />
    </>
  );
}
