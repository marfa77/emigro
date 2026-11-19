import Link from "next/link";
import { ArrowRight, Construction, UserCheck } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { CorridorHubShell } from "@/components/corridor/hub/CorridorHubShell";
import { CorridorLandingSeoSections } from "@/components/corridor/CorridorLandingSeoSections";
import { CorridorRouteCompare } from "@/components/corridor/CorridorRouteCompare";
import { PortugalFeaturedNotes } from "@/components/portugal/PortugalFeaturedNotes";
import { SpainFeaturedNotes } from "@/components/spain/SpainFeaturedNotes";
import { ItalyFeaturedNotes } from "@/components/italy/ItalyFeaturedNotes";
import { isPortugalHubTopic } from "@/lib/portugal/hub";
import { isSpainHubTopic } from "@/lib/spain/hub";
import { isItalyHubTopic } from "@/lib/italy/hub";
import { GuideDigestPreview } from "@/components/corridor/GuideDigestPreview";
import { LatestNewsTeaserSuspense } from "@/components/news/LatestNewsTeaser";
import { TelegramCommunityCta } from "@/components/community/TelegramCommunityCta";
import { isPublicTelegramCommunityCountry } from "@/lib/telegram/public-communities";
import { HeroShell } from "@/components/visuals/HeroShell";
import { CorridorHeroVisual } from "@/components/visuals/CorridorHeroVisual";
import { isCorridorFull, topicHasLanding } from "@/lib/corridor/publish";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { requirePublishedCorridorTopic } from "@/lib/corridor/resolve-topic";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { buildCorridorBreadcrumbSchema, buildCorridorLandingArticleSchema, buildCorridorLandingQuickAnswer, buildFaqSchema, buildCorridorLandingFaq } from "@/lib/seo/corridor-page-seo";
import { pageUrl } from "@/lib/seo";
import { heroTitle } from "@/lib/ui/mobile";
import { getUniPrepOfferForTopic } from "@/lib/uniprep2go/catalog";
import { ruCountryGenitive, ruCountryIn, ruCountryTo } from "@/lib/ru-country-cases";

/** Visible FAQ and FAQPage schema stay identical. */
const FAQ_LIMIT = 6;

/**
 * Country corridor landing, rebuilt 2026-11-19 after a layout audit (20 phone screens → ~7):
 * hero with two actions → route comparison → what changed → practice → free specialist → FAQ → links.
 * Removed: duplicate nav blocks, Emigro Score tiles, sister-product ads, provider directory, hidden text.
 */
export async function CorridorLanding({ country }: { country: string }) {
  const topic = await requirePublishedCorridorTopic(country);
  const corridor = await getCorridorBySlug(topic.corridorSlug!);
  const isFull = isCorridorFull(topic.status);

  if (!corridor) {
    return (
      <>
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Коридор не найден</h1>
          <p className="mt-2 text-slate-600">Данные коридора ещё не загружены в базу.</p>
        </div>
        <SiteFooter />
      </>
    );
  }

  const base = topic.sitePaths!.landing;
  const url = pageUrl(base);
  const faq = buildCorridorLandingFaq(topic, corridor).slice(0, FAQ_LIMIT);
  const breadcrumbSchema = buildCorridorBreadcrumbSchema(topic, "Коридор");
  const articleSchema = buildCorridorLandingArticleSchema(topic, corridor, url);
  const faqSchema = buildFaqSchema(faq);
  const showHub = topicHasLanding(topic);
  const uniPrepOffer = getUniPrepOfferForTopic(topic.key);
  const assistHref = `/ru/assist?country=${topic.urlSegment}&source=corridor_${topic.urlSegment}#assist-form`;
  const prepHref = uniPrepOffer?.mock?.path ?? uniPrepOffer?.deck?.path;

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <CorridorBreadcrumb topic={topic} current="Коридор" />

        {showHub && <CorridorHubShell topic={topic} active="hub" />}

        {!isFull && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-950">
            <Construction className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Направление в разработке</p>
              <p className="mt-1 text-sm text-amber-900/90">
                Мы наполняем программы и справочник. Подбор маршрута появится после завершения наполнения.
              </p>
            </div>
          </div>
        )}

        <HeroShell visual={<CorridorHeroVisual segment={topic.urlSegment} alt={corridor.title_ru} />}>
          <p className="text-sm uppercase tracking-wide text-corridor-100">ВНЖ · {topic.countryRu} · 2026</p>
          <h1 className={`mt-2 ${heroTitle}`}>
            ВНЖ {ruCountryIn(topic.countryRu)} для граждан России, Беларуси, Украины и Казахстана
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-corridor-50 sm:text-lg">
            {buildCorridorLandingQuickAnswer(topic, corridor)}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isFull && topic.sitePaths?.wizard && (
              <Link
                href={topic.sitePaths.wizard}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-corridor-900 hover:bg-corridor-50"
              >
                Подобрать маршрут за 2 минуты
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
            <Link
              href={assistHref}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/50 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Подобрать специалиста — бесплатно
            </Link>
          </div>
        </HeroShell>

        {corridor.programs.length > 0 && (
          <CorridorRouteCompare
            programs={corridor.programs}
            countryRu={topic.countryRu}
            landingPath={base}
            interactive={isFull}
          />
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-950">Что изменилось и что проверено</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <LatestNewsTeaserSuspense topicKey={topic.key} />
            {topic.sitePaths?.guide && (
              <GuideDigestPreview items={corridor.digest} guideHref={topic.sitePaths.guide} countryRu={topic.countryRu} />
            )}
          </div>
        </section>

        {isPortugalHubTopic(topic) && <PortugalFeaturedNotes />}
        {isSpainHubTopic(topic) && <SpainFeaturedNotes />}
        {isItalyHubTopic(topic) && <ItalyFeaturedNotes />}

        <section className="mt-12 flex flex-col gap-4 rounded-2xl border border-corridor-200 bg-corridor-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UserCheck className="mt-1 h-6 w-6 shrink-0 text-corridor-700" aria-hidden />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Нужна помощь с переездом {ruCountryTo(topic.countryRu)}?</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-700">
                Оставьте имя и контакт — бесплатно подберём юриста или агентство под ваш случай. Комиссию Emigro платит
                специалист, цена для вас не меняется.
              </p>
            </div>
          </div>
          <Link
            href={assistHref}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg bg-corridor-600 px-5 py-3 font-semibold text-white hover:bg-corridor-700"
          >
            Подобрать специалиста
          </Link>
        </section>

        <CorridorLandingSeoSections topic={topic} faq={faq} />

        <section className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Ещё по направлению</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
            {topic.sitePaths?.guide && (
              <li>
                <Link href={topic.sitePaths.guide} className="text-corridor-700 hover:underline">
                  Справочник: факты с источниками
                </Link>
              </li>
            )}
            <li>
              <Link href={`/ru/news?country=${topic.key}`} className="text-corridor-700 hover:underline">
                Новости {ruCountryGenitive(topic.countryRu)}
              </Link>
            </li>
            {prepHref && (
              <li>
                <a href={prepHref} className="text-corridor-700 hover:underline">
                  Подготовка к экзамену {uniPrepOffer?.examLabelRu}
                </a>
              </li>
            )}
            <li>
              <a href="https://www.pixid.studio/idphoto" className="text-corridor-700 hover:underline">
                Фото на визу и ВНЖ (PixID)
              </a>
            </li>
          </ul>
          {isPublicTelegramCommunityCountry(topic.urlSegment) ? (
            <TelegramCommunityCta countryKey={topic.urlSegment} source={`corridor_${topic.urlSegment}`} className="mt-4" />
          ) : null}
          <p className="mt-4 text-xs text-slate-500">
            Emigro — навигатор по маршрутам ВНЖ, не юридическая консультация. Перед подачей сверяйтесь с официальными
            источниками на страницах программ.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

export function CorridorBreadcrumb({
  topic,
  current,
}: {
  topic: NewsTopicConfig;
  current: string;
}) {
  return (
    <nav className="text-sm text-slate-500">
      <Link href="/ru" className="text-corridor-600 hover:underline">
        Все направления
      </Link>
      <span className="mx-2">/</span>
      <Link href={topic.sitePaths?.landing ?? `/ru/${topic.urlSegment}`} className="text-corridor-600 hover:underline">
        {topic.countryRu}
      </Link>
      <span className="mx-2">/</span>
      <span>{current}</span>
    </nav>
  );
}
