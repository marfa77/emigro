import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Compass, FileText, Layers, Sparkles } from "lucide-react";
import { ShareButtons } from "@/components/share/ShareButtons";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { HeroShell } from "@/components/visuals/HeroShell";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { countryCardImage } from "@/lib/brand/country-accents";
import { guidePath, getRelatedGuides, listGuides, loadGuide } from "@/lib/guides/load";
import type { GuideArticle } from "@/lib/guides/load";
import { loadGuideLiveDataForGuide } from "@/lib/guides/corridor-live-data";
import { getActiveNewsTopics } from "@/lib/news/topics";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { corridorSlugForTopic, findFirstProviderTopicKey } from "@/lib/providers/registry";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { getPtLongTailByGuideSlug } from "@/lib/seo/pt-longtail";
import { EMIGRO_PUBLISHER, emigroAuthorOrg, schemaImage } from "@/lib/seo/schema";
import { GuideCorridorLiveData } from "@/components/guides/GuideCorridorLiveData";
import { GuideOfficialSources } from "@/components/guides/GuideOfficialSources";
import { SITE_URL } from "@/lib/site-url";

export function generateStaticParams() {
  return listGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = loadGuide(params.slug);
  if (!guide) return {};
  const longTail = getPtLongTailByGuideSlug(guide.slug);
  const title = longTail?.seoTitle ?? guide.seo_title ?? guide.title;
  const description =
    longTail?.seoDescription ?? guide.seo_description ?? guide.excerpt ?? guide.quick_answer ?? guide.title;
  const ogImagePath = guide.og_image_path;
  const metadata = pageMetadata({
    title,
    description,
    path: guidePath(guide.slug),
    ogImage: ogImagePath,
    ogImageAlt: title,
  });
  return {
    ...metadata,
    keywords: longTail ? [...(guide.tags ?? []), ...longTail.queries] : guide.tags,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: guide.date_published,
      modifiedTime: guide.date_modified ?? guide.date_published,
    },
  };
}

function GuideHeroVisual({ coverPath, title }: { coverPath: string; title: string }) {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-white/30 bg-white shadow-2xl ring-1 ring-white/20" aria-hidden>
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
      <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/20 bg-slate-950/55 p-4 text-white shadow-lg backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-corridor-100">Editorial guide</p>
        <p className="mt-1 line-clamp-2 text-lg font-bold leading-tight">{title}</p>
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}

function GuideFeaturedImage({ coverPath, title }: { coverPath: string; title: string }) {
  return (
    <figure className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-slate-200/70 ring-1 ring-slate-950/5">
      <div className="relative aspect-[16/9] w-full">
        <Image src={coverPath} alt={title} fill sizes="(max-width: 1024px) 100vw, (max-width: 1360px) 960px, 1020px" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
        <figcaption className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 text-sm font-medium text-slate-700 shadow-lg backdrop-blur">
          Практический editorial-гайд Emigro: маршруты, цифры, риски и следующие шаги.
        </figcaption>
      </div>
    </figure>
  );
}

function GuideCorridorVisuals({ topics }: { topics: NewsTopicConfig[] }) {
  if (topics.length === 0) return null;
  return (
    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-950/5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-600">Маршруты</p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">Коридоры в этом гайде</h2>
        </div>
        <Layers className="h-5 w-5 text-corridor-600" />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.key}
            href={topic.sitePaths!.landing}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-0.5 hover:border-corridor-300 hover:shadow-md"
          >
            <div className="relative aspect-[16/10] w-full bg-slate-100">
              <Image
                src={countryCardImage(topic.urlSegment)}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 240px"
                className="object-cover transition group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                {topic.flag} {topic.countryRu}
              </span>
            </div>
            <p className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800">
              Открыть коридор
              <ArrowRight className="h-4 w-4 text-corridor-600 transition group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function GuideFactCards({ guide, corridorCount }: { guide: GuideArticle; corridorCount: number }) {
  const facts = [
    guide.estimated_minutes ? { label: "Время", value: `${guide.estimated_minutes} мин`, icon: Clock } : null,
    guide.date_modified ?? guide.date_published
      ? { label: "Обновлено", value: guide.date_modified ?? guide.date_published ?? "", icon: FileText }
      : null,
    guide.tags?.length ? { label: "Фокус", value: guide.tags.slice(0, 2).join(" / "), icon: CheckCircle2 } : null,
    corridorCount ? { label: "Коридоры", value: `${corridorCount} маршрута`, icon: Compass } : null,
  ].filter((item): item is { label: string; value: string; icon: typeof Clock } => Boolean(item));

  if (facts.length === 0) return null;

  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Ключевые факты">
      {facts.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-950/5">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-corridor-50 p-2 text-corridor-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
            </div>
          </div>
        </div>
      ))}
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
  // h2 may wrap label in <span> (markdown processor): <h2><span>FAQ</span></h2>
  const faqSection =
    /<h2[^>]*>[\s\S]*?FAQ[\s\S]*?<\/h2>([\s\S]*?)(?=<h2|$)/i.exec(bodyHtml)?.[1] ?? "";

  // Primary: markdown processor renders **Q?** as <section>...<h3>Q?</h3><p>Answer</p></section>
  const sectionMatches = Array.from(
    faqSection.matchAll(/<section[^>]*>[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/section>/g)
  );

  // Fallback: bare <h3>Q?</h3><p>Answer</p> pairs
  const h3Matches = Array.from(
    faqSection.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g)
  );

  // Legacy fallback: <p><strong>Q</strong> Answer</p> or split pairs
  const legacyCombined = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s+([\s\S]*?)<\/p>/g)
  );
  const legacySplit = Array.from(
    faqSection.matchAll(/<p[^>]*>\s*<strong>(.*?)<\/strong>\s*<\/p>\s*<p[^>]*>(.*?)<\/p>/g)
  );

  const matches =
    sectionMatches.length > 0
      ? sectionMatches
      : h3Matches.length > 0
        ? h3Matches
        : legacyCombined.length > 0
          ? legacyCombined
          : legacySplit;

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
  const relatedGuides = getRelatedGuides(guide.slug, guide.corridor_slugs, guide.topic_keys);
  const providerTopicKey = findFirstProviderTopicKey(guide.topic_keys ?? []);
  const toc = extractToc(guide.bodyHtml);
  const faqItems = extractFaq(guide.bodyHtml);
  const llmFacts = buildGuideLlmFacts(guide);
  const url = `${SITE_URL}${guidePath(guide.slug)}`;
  const liveData = await loadGuideLiveDataForGuide(guide.corridor_slugs, guide.topic_keys);

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
    image: schemaImage(guide.og_image_path),
    inLanguage: "ru-RU",
    ...(guide.tags?.length ? { keywords: guide.tags.join(", ") } : {}),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Гайды по ВНЖ", item: pageUrl("/ru/guides") },
    { name: guide.title },
  ]);

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
      <main className="bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_32rem)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 2xl:max-w-[1360px]">
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

        <GuideFactCards guide={guide} corridorCount={countryTopics.length} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <GuideFeaturedImage coverPath={guide.cover_path} title={guide.title} />

            <ShareButtons
              url={url}
              title={guide.title}
              text={guide.excerpt ?? guide.quick_answer}
              className="mt-8"
            />

            {guide.quick_answer && (
              <section className="mt-8 rounded-[2rem] border border-corridor-200 bg-gradient-to-br from-white via-corridor-50 to-sky-50 p-6 shadow-sm ring-1 ring-corridor-100 sm:p-7">
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-corridor-700">
                  <Sparkles className="h-4 w-4" />
                  Короткий ответ
                </p>
                <p className="mt-3 text-xl leading-8 text-slate-800">{guide.quick_answer}</p>
              </section>
            )}

            <GuideCorridorLiveData programs={liveData.programs} meta={liveData.meta} />

            <article
              className="guide-article prose prose-lg prose-slate mt-8 max-w-none rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 prose-a:font-semibold prose-strong:text-slate-950 sm:p-8 lg:p-10"
              dangerouslySetInnerHTML={{ __html: guide.bodyHtml }}
            />

            {guide.official_sources && guide.official_sources.length > 0 && (
              <GuideOfficialSources sources={guide.official_sources} />
            )}

            <GuideCorridorVisuals topics={countryTopics} />

            <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-lg font-semibold text-slate-900">Коротко для проверки маршрута</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
                {llmFacts.map((fact) => (
                  <li key={fact} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-corridor-600" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </section>

            <RelocatorChatPromo variant="inline" source={`guide_${guide.slug}`} className="mt-8" />

            {relatedGuides.length > 0 && (
              <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 sm:p-8">
                <h2 className="text-2xl font-bold text-slate-950">Читайте также</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {relatedGuides.map((related) => (
                    <article key={related.slug} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition hover:-translate-y-0.5 hover:border-corridor-300 hover:shadow-md">
                      <Link href={guidePath(related.slug)} className="block">
                        <div className="relative aspect-[16/9] bg-slate-100">
                          <Image src={related.cover_path} alt="" fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover transition group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold leading-snug text-slate-950 group-hover:text-corridor-700">{related.title}</h3>
                          {related.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{related.excerpt}</p>}
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {providerTopicKey && (
              <ServiceProvidersSection
                corridorSlug={corridorSlugForTopic(providerTopicKey)}
                topicKey={providerTopicKey}
                placement="guide_article"
                variant="default"
                title="Сервисы на маршруте"
                className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5"
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

            <RelocatorChatPromo variant="sidebar" source={`guide_sidebar_${guide.slug}`} />

            {providerTopicKey && (
              <ServiceProvidersSection
                corridorSlug={corridorSlugForTopic(providerTopicKey)}
                topicKey={providerTopicKey}
                placement="guide_sidebar"
                variant="compact"
                title="Сервисы на маршруте"
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              />
            )}
          </aside>
        </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
