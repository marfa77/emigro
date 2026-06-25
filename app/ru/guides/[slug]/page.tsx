import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, Clock, Compass, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { countryCardImage } from "@/lib/brand/country-accents";
import { guidePath, getRelatedGuides, listGuides, loadGuide } from "@/lib/guides/load";
import type { GuideArticle } from "@/lib/guides/load";
import { getActiveNewsTopics } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { corridorSlugForTopic, findFirstProviderTopicKey } from "@/lib/providers/registry";
import { pageMetadata } from "@/lib/seo";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/site-url";

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = loadGuide(params.slug);
  if (!guide) return {};
  const title = guide.seo_title ?? guide.title;
  const ogImage = schemaImage(guide.cover_path);
  const metadata = pageMetadata({
    title,
    description: guide.seo_description ?? guide.excerpt ?? guide.quick_answer ?? guide.title,
    path: guidePath(guide.slug),
    ogImage,
  });
  return {
    ...metadata,
    keywords: guide.tags,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: guide.date_published,
      modifiedTime: guide.date_modified ?? guide.date_published,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...metadata.twitter,
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

function GuideHeroVisual({ coverPath, title }: { coverPath: string; title: string }) {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border-2 border-white/30 bg-white shadow-2xl" aria-hidden>
      <Image
        src={coverPath}
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
      <div className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-950">
        2026
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}

function GuideFeaturedImage({ coverPath, title }: { coverPath: string; title: string }) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full">
        <Image src={coverPath} alt={title} fill sizes="(max-width: 1024px) 100vw, (max-width: 1360px) 960px, 1020px" className="object-cover" />
      </div>
    </figure>
  );
}

function GuideCorridorVisuals({ topics }: { topics: NewsTopicConfig[] }) {
  if (topics.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900">Коридоры в этом гайде</h2>
      <div className="mt-4 flex flex-wrap gap-4">
        {topics.map((topic) => (
          <Link
            key={topic.key}
            href={topic.sitePaths!.landing}
            className="group w-[140px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-corridor-300 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              <Image
                src={countryCardImage(topic.urlSegment)}
                alt=""
                fill
                sizes="140px"
                className="object-cover transition group-hover:scale-105"
              />
            </div>
            <p className="px-3 py-2 text-sm font-medium text-slate-800">
              {topic.flag} {topic.countryRu}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function buildGuideLlmFacts(guide: GuideArticle): string[] {
  const facts: string[] = [];
  if (guide.quick_answer) facts.push(guide.quick_answer);
  if (guide.tags?.length) facts.push(`Теги: ${guide.tags.join(", ")}`);
  if (guide.estimated_minutes) facts.push(`Время чтения: ~${guide.estimated_minutes} мин`);
  if (guide.date_modified ?? guide.date_published) {
    facts.push(`Обновлено: ${guide.date_modified ?? guide.date_published}`);
  }
  facts.push("Emigro: hub wizard для подбора маршрута ВНЖ без выбора страны заранее.");
  return facts;
}

function resolveCountryTopics(topicKeys: string[] | undefined, allTopics: NewsTopicConfig[]): NewsTopicConfig[] {
  if (!topicKeys?.length) return [];
  const topicMap = new Map(allTopics.map((t) => [t.key, t]));
  return topicKeys
    .filter((key) => key !== "europe")
    .map((key) => topicMap.get(key))
    .filter((t): t is NewsTopicConfig => !!t?.sitePaths?.landing)
    .slice(0, 3);
}

function extractToc(bodyHtml: string) {
  return Array.from(bodyHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/g))
    .map((match) => match[1]?.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean)
    .slice(0, 7);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wizardHrefWithInterest(href: string, topicKeys?: string[]): string {
  const primaryKey = topicKeys?.[0];
  if (!primaryKey || !href.includes("/wizard")) return href;

  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  if (!params.has("interest")) {
    params.set("interest", primaryKey);
  }
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function extractFaq(bodyHtml: string) {
  const faqSection = /<h2[^>]*>\s*FAQ\s*<\/h2>([\s\S]*?)(?=<h2|$)/i.exec(bodyHtml)?.[1] ?? "";
  const combined = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s+([\s\S]*?)<\/p>/g)
  );
  const split = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>\s*<p[^>]*>(.*?)<\/p>/g)
  );
  const matches = combined.length > 0 ? combined : split;
  return matches
    .map((match) => ({
      question: stripHtml(match[1] ?? ""),
      answer: stripHtml(match[2] ?? ""),
    }))
    .filter((item) => item.question && item.answer)
    .slice(0, 7);
}

export default async function GuideArticlePage({ params }: { params: { slug: string } }) {
  const guide = loadGuide(params.slug);
  if (!guide) notFound();
  const allTopics = await getActiveNewsTopics();
  const countryTopics = resolveCountryTopics(guide.topic_keys, allTopics);
  const relatedGuides = getRelatedGuides(guide.slug, guide.corridor_slugs);
  const providerTopicKey = findFirstProviderTopicKey(guide.topic_keys ?? []);
  const toc = extractToc(guide.bodyHtml);
  const faqItems = extractFaq(guide.bodyHtml);
  const llmFacts = buildGuideLlmFacts(guide);
  const url = `${SITE_URL}${guidePath(guide.slug)}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.excerpt ?? guide.quick_answer,
    datePublished: guide.date_published,
    dateModified: guide.date_modified ?? guide.date_published,
    author: emigroAuthorOrg(),
    publisher: EMIGRO_PUBLISHER,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: schemaImage(guide.cover_path),
    inLanguage: "ru-RU",
    ...(guide.tags?.length ? { keywords: guide.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Emigro", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Гайды", item: `${SITE_URL}/ru/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  const faqSchema =
    faqItems.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const llmDescription = [
    guide.quick_answer,
    "Emigro помогает сравнить маршруты ВНЖ через hub wizard без выбора страны заранее.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{llmDescription}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-[1360px]">
        <HeroShell visual={<GuideHeroVisual coverPath={guide.cover_path} title={guide.title} />} className="from-slate-950 via-corridor-800 to-sky-800">
          <Link href="/ru/guides" className="text-sm font-medium text-corridor-100 hover:text-white">
            ← Все гайды
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
              <BookOpen className="h-4 w-4" />
              Гайд Emigro
            </span>
            {guide.estimated_minutes ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
                <Clock className="h-4 w-4" />
                {guide.estimated_minutes} мин чтения
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl 2xl:max-w-4xl">{guide.title}</h1>
          {guide.excerpt && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100 2xl:max-w-3xl">{guide.excerpt}</p>}
          {guide.tags && guide.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {guide.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/85">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </HeroShell>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <GuideFeaturedImage coverPath={guide.cover_path} title={guide.title} />

            {guide.quick_answer && (
              <section className="mt-8 rounded-2xl border border-corridor-200 bg-white p-6 shadow-sm">
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-700">
                  <Sparkles className="h-4 w-4" />
                  Короткий ответ
                </p>
                <p className="mt-3 text-lg leading-relaxed text-slate-800">{guide.quick_answer}</p>
              </section>
            )}

            <GuideCorridorVisuals topics={countryTopics} />

            <article
              className="prose prose-lg prose-slate mt-8 max-w-none rounded-2xl border border-slate-200 bg-white p-6 shadow-sm prose-h2:border-t prose-h2:border-slate-100 prose-h2:pt-8 prose-table:block prose-table:overflow-x-auto prose-table:text-sm sm:p-8"
              dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
            />

            <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Краткая выжимка (для LLM)</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
                {llmFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </section>

            {relatedGuides.length > 0 && (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-slate-900">Читайте также</h2>
                <ul className="mt-4 space-y-3">
                  {relatedGuides.map((related) => (
                    <li key={related.slug}>
                      <Link href={guidePath(related.slug)} className="font-medium text-corridor-700 hover:underline">
                        {related.title}
                      </Link>
                      {related.excerpt && <p className="mt-1 text-sm text-slate-600">{related.excerpt}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {providerTopicKey && (
              <ServiceProvidersSection
                corridorSlug={corridorSlugForTopic(providerTopicKey)}
                topicKey={providerTopicKey}
                placement="guide_sidebar"
                title="Сервисы на маршруте"
                className="mt-8 hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm 2xl:block sm:p-8"
              />
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {toc.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                  <Compass className="h-4 w-4 text-corridor-600" />
                  Внутри гайда
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-slate-600">
                  {toc.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="font-semibold text-corridor-600">{index + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="rounded-2xl border border-corridor-200 bg-corridor-50 p-5">
              <h2 className="font-semibold text-slate-900">Проверить свой случай</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Гайд даёт карту маршрутов, а wizard сопоставит паспорт, доход, семью и сроки с программами.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {guide.cta_primary && (
                  <Link
                    href={wizardHrefWithInterest(guide.cta_primary, guide.topic_keys)}
                    className="rounded-lg bg-corridor-600 px-5 py-3 text-center font-medium text-white hover:bg-corridor-700"
                  >
                    Подобрать маршрут
                  </Link>
                )}
                {guide.cta_secondary && (
                  <Link
                    href={guide.cta_secondary}
                    className="rounded-lg border border-corridor-200 bg-white px-5 py-3 text-center font-medium text-slate-700 hover:border-corridor-400"
                  >
                    Смотреть коридор
                  </Link>
                )}
              </div>
            </section>

            {providerTopicKey && (
              <ServiceProvidersSection
                corridorSlug={corridorSlugForTopic(providerTopicKey)}
                topicKey={providerTopicKey}
                placement="guide_sidebar"
                title="Сервисы на маршруте"
                className="2xl:hidden"
              />
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
