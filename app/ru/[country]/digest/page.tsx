import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorIntelLinks } from "@/components/corridor/CorridorIntelLinks";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { CorridorBreadcrumb } from "@/components/corridor/CorridorLanding";
import { DigestSeoSections } from "@/components/corridor/DigestSeoSections";
import { HeroShell } from "@/components/visuals/HeroShell";
import { CorridorHeroVisual } from "@/components/visuals/CorridorHeroVisual";
import { corridorStaticParamsFromSegments, getPublishedCorridorSegments } from "@/lib/corridor/segments";
import { LatestNewsTeaser } from "@/components/news/LatestNewsTeaser";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { getTopicByCountrySegment } from "@/lib/corridor/resolve-topic";
import { isCorridorFull, isCorridorOnSite } from "@/lib/corridor/publish";
import { countryAccentBarClass } from "@/lib/brand/country-accents";
import {
  buildCorridorBreadcrumbSchema,
  buildDigestArticleSchema,
  buildDigestFaq,
  buildDigestItemListSchema,
  buildDigestMetadata,
  buildFaqSchema,
  digestPagePath,
} from "@/lib/seo/corridor-page-seo";
import { SITE_URL } from "@/lib/site-url";

export async function generateStaticParams() {
  const segments = await getPublishedCorridorSegments();
  return corridorStaticParamsFromSegments(segments);
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.sitePaths?.guide) return {};
  return buildDigestMetadata(topic);
}

function formatVerifiedDate(date: string | null): string | null {
  if (!date) return null;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default async function CountryDigestPage({ params }: { params: { country: string } }) {
  const topic = await getTopicByCountrySegment(params.country);
  if (!topic?.corridorSlug || !isCorridorOnSite(topic.status) || !topic.sitePaths?.guide) notFound();

  const corridor = await getCorridorBySlug(topic.corridorSlug);
  if (!corridor) {
    return <p className="p-8 text-center">Дайджест недоступен.</p>;
  }

  const base = topic.sitePaths.landing;
  const path = digestPagePath(topic);
  const url = `${SITE_URL}${path}`;
  const faq = buildDigestFaq(topic, corridor);
  const heroClass = `from-slate-950 via-corridor-800 to-sky-800 bg-gradient-to-br ${countryAccentBarClass(topic.urlSegment)}`;

  const breadcrumbSchema = buildCorridorBreadcrumbSchema(topic, "Справочник", url);
  const articleSchema = buildDigestArticleSchema(topic, corridor, url);
  const itemListSchema = buildDigestItemListSchema(topic, corridor, url);
  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current="Справочник" />

        <HeroShell visual={<CorridorHeroVisual segment={topic.urlSegment} />} className={heroClass}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-50">
            <BookOpen className="h-4 w-4" />
            Справочник коридора
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
            Справочник: {topic.countryRu}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-corridor-100">
            Практические заметки по гражданству, языку и административным шагам — статический intelligence-слой коридора
            для паспортов RU/BY/UA/KZ. Актуальные изменения законов — в{" "}
            <Link href={`/ru/news?country=${topic.key}`} className="font-medium text-white underline">
              еженедельных новостях
            </Link>
            .
          </p>
        </HeroShell>

        <div className="mt-8">
          <LatestNewsTeaser topicKey={topic.key} />
        </div>

        <DigestSeoSections topic={topic} corridor={corridor} landingPath={base} />

        <ServiceProvidersSection
          className="mt-10"
          corridorSlug={topic.corridorSlug}
          topicKey={topic.key}
          placement="digest"
        />

        <div className="mt-10 space-y-6">
          {corridor.digest.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-medium uppercase text-corridor-600">{item.category}</p>
              <h2 className="mt-2 text-xl font-semibold">{item.title_ru}</h2>
              <p className="mt-3 whitespace-pre-line text-slate-700">{item.body_ru}</p>
              {(item.last_verified || item.source_url) && (
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                  {item.last_verified && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Проверено: {formatVerifiedDate(item.last_verified)}
                    </span>
                  )}
                  {item.source_url && (
                    <a
                      href={item.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-corridor-600 underline"
                    >
                      Официальный источник
                    </a>
                  )}
                </div>
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
