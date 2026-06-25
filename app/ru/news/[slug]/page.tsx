import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Newspaper, ShieldCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { NewsArticleTracker } from "@/components/analytics/NewsArticleTracker";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { NewsArticleBody } from "@/components/news/NewsDigest";
import { HeroShell } from "@/components/visuals/HeroShell";
import { NewsHeroVisual } from "@/components/visuals/NewsHeroVisual";
import {
  getNewsDisplaySeoTitle,
  getNewsDisplayTitle,
  getPublishedNewsDigestBySlug,
} from "@/lib/news/digests";
import { getNewsTopic, newsIndexPath } from "@/lib/news/topics";
import { newsArticleUrl, newsHubUrl, SITE_URL } from "@/lib/site-url";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function formatDateRu(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const digest = await getPublishedNewsDigestBySlug(params.slug);
  if (!digest) return {};

  const url = newsArticleUrl(digest.slug);
  const title = getNewsDisplaySeoTitle(digest);

  return {
    title,
    description: digest.seo_description,
    alternates: { canonical: url, languages: { "ru-RU": url } },
    keywords: digest.tags,
    openGraph: {
      title,
      description: digest.seo_description,
      url,
      locale: "ru_RU",
      type: "article",
      publishedTime: digest.published_at,
      tags: digest.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: digest.seo_description,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const digest = await getPublishedNewsDigestBySlug(params.slug);
  if (!digest) notFound();

  const topic = await getNewsTopic(digest.topic_key);
  const flag = topic?.flag ?? "🌍";
  const url = newsArticleUrl(digest.slug);
  const displayTitle = getNewsDisplayTitle(digest);
  const backHref = topic ? newsIndexPath(topic.urlSegment) : newsIndexPath();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: displayTitle,
    description: digest.excerpt,
    inLanguage: "ru-RU",
    datePublished: digest.published_at,
    dateModified: digest.updated_at,
    author: { "@type": "Organization", name: "Emigro", url: SITE_URL },
    publisher: { "@type": "Organization", name: "Emigro", url: SITE_URL },
    mainEntityOfPage: url,
    articleSection: `Релокация в ${digest.country}`,
    keywords: digest.tags.join(", "),
    about: digest.tags.map((tag) => ({ "@type": "Thing", name: tag })),
    citation: digest.source_links.map((s) => s.url),
    audience: {
      "@type": "Audience",
      audienceType: topic?.audienceRu ?? "Russian-speaking relocation applicants",
      geographicArea: { "@type": "Country", name: topic?.countryEn ?? digest.country },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Emigro", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Новости", item: newsHubUrl() },
      ...(topic
        ? [{ "@type": "ListItem", position: 3, name: topic.countryRu, item: newsHubUrl(topic.urlSegment) }]
        : []),
      {
        "@type": "ListItem",
        position: topic ? 4 : 3,
        name: displayTitle,
        item: url,
      },
    ],
  };

  return (
    <>
      <NewsArticleTracker slug={digest.slug} topicKey={digest.topic_key} />
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <article>
          <HeroShell visual={<NewsHeroVisual />} className="from-slate-950 via-corridor-800 to-indigo-800">
            <Link href={backHref} className="text-sm font-medium text-corridor-100 hover:text-white">
              ← Все новости{topic ? ` (${topic.countryRu})` : ""}
            </Link>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-medium text-corridor-50">
                <Newspaper className="h-4 w-4" />
                {flag} {digest.country}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-corridor-50">
                <CalendarDays className="h-4 w-4" />
                неделя до {formatDateRu(digest.week_end)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-corridor-50">
                <ShieldCheck className="h-4 w-4" />
                источники проверены
              </span>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{displayTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100">{digest.excerpt}</p>
            <p className="mt-5 text-sm text-corridor-100/80">
              Опубликовано <time dateTime={digest.published_at}>{formatDateRu(digest.published_at)}</time>
            </p>
          </HeroShell>

          {digest.key_takeaways.length > 0 && (
            <section className="mt-6 grid gap-3 md:grid-cols-3">
              {digest.key_takeaways.slice(0, 3).map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className="text-sm font-semibold text-corridor-600">0{index + 1}</span>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{item}</p>
                </div>
              ))}
            </section>
          )}

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            <NewsArticleBody digest={digest} />

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              {topic && <CorridorIntelLinks topic={topic} />}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-slate-900">Что дальше</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Новости дают контекст. Для решения по маршруту проверьте личный профиль в wizard.
                </p>
                <Link
                  href="/ru/wizard"
                  className="mt-5 inline-flex w-full justify-center rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
                >
                  Подобрать маршрут
                </Link>
              </section>
            </aside>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
