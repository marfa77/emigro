import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, Sparkles } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { RelocatorChatPromo } from "@/components/community/RelocatorChatPromo";
import { HubDestinationsSectionSuspense } from "@/components/hub/HubDestinationsSection";
import { WizardPulseSectionSuspense } from "@/components/wizard/WizardPulseSectionSuspense";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { guidePath } from "@/lib/guides/paths";
import { listPillarGuides } from "@/lib/guides/pillar-guides";
import { getActiveNewsTopics, newsIndexPath } from "@/lib/news/topics";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildCollectionPageItemListSchema } from "@/lib/seo/collection-schema";
import { portugalSatelliteUrl, spainSatelliteUrl } from "@/lib/site-url";
import { TRANSIT_HUBS } from "@/lib/transit-hubs";
import { heroTitle } from "@/lib/ui/mobile";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Emigro — ВНЖ и релокация в Европу",
  titleAbsolute: true,
  description:
    "Навигатор по ВНЖ и гражданству для русскоязычных: коридоры Европы, wizard подбора, справочники программ и еженедельные новости с источниками.",
  path: "/ru",
});

export default async function RuHubPage() {
  const topics = await getActiveNewsTopics();
  const pillarGuides = listPillarGuides().slice(0, 8);
  const destinationCount = topics.length;
  const fullCorridors = topics.filter((t) => t.status === "active" && t.sitePaths);
  const developingCorridors = topics.filter((t) => t.status === "in_development" && t.sitePaths);
  const newsOnly = topics.filter((t) => t.status === "news_only");

  const itemListElements = [
    ...topics.map((t) => ({
      name: t.countryRu,
      url: pageUrl(t.sitePaths?.landing ?? newsIndexPath(t.urlSegment)),
    })),
    ...TRANSIT_HUBS.map((hub) => ({
      name: `${hub.countryRu} — транзитный хаб`,
      url: pageUrl(hub.path),
    })),
  ];

  const hubUrl = pageUrl("/ru");
  const collectionSchema = buildCollectionPageItemListSchema({
    name: "Направления релокации Emigro",
    url: hubUrl,
    description:
      "Навигатор релокации для русскоязычных: европейские коридоры ВНЖ, транзитные хабы, wizard подбора и еженедельные новости.",
    inLanguage: "ru-RU",
    items: itemListElements.map((item) => ({ url: item.url, name: item.name })),
  });

  return (
    <>
      <SiteHeader />
      {collectionSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      )}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <HeroShell visual={<HubHeroVisual />}>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-corridor-100">
            <Globe2 className="h-4 w-4" />
            {destinationCount} направлений
          </div>
          <h1 className={`mt-4 ${heroTitle}`}>Emigro — ВНЖ и маршруты в Европу</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Для русскоязычных за рубежом и в СНГ: уже живёте в Европе или планируете переезд — еженедельные новости,
            wizard подбора, справочники и проверка маршрутов.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ru/portugal/wizard"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Португалия D8/D7 — подобрать маршрут
            </Link>
            <Link
              href={HUB_WIZARD_PATH}
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Все страны — hub wizard
            </Link>
          </div>
        </HeroShell>

        <section className="mt-10 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Коридор №1
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Португалия — самый проработанный маршрут</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-700">
            D8 digital nomad и D7 пассивный доход: pillar-гид, wizard, новости AIMA и{" "}
            <strong>живая практика</strong> (NIF, банк, аренда, биометрия) — то, чего нет у других коридоров.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                href={guidePath("vnj-portugaliya-d8-d7-grazhdanstvo-2026")}
                className="block rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-900 hover:border-emerald-300"
              >
                D8 и D7 Португалия 2026 — pillar-гид
              </Link>
            </li>
            <li>
              <Link
                href={guidePath("pervye-30-dnej-v-portugalii-2026")}
                className="block rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-900 hover:border-emerald-300"
              >
                Первые 30 дней: NIF, банк, AIMA
              </Link>
            </li>
            <li>
              <a
                href={portugalSatelliteUrl("/")}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900 hover:border-teal-400"
              >
                Практика — portugal.emigro.online
              </a>
            </li>
            <li>
              <Link
                href="/ru/portugal"
                className="block rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-emerald-900 hover:border-emerald-300"
              >
                Коридор Португалия — обзор
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-8">
          <div className="flex flex-wrap items-start gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              <Sparkles className="h-3.5 w-3.5" />
              Коридор №2
            </span>
            <h2 className="text-2xl font-bold text-slate-900">Испания — digital nomad €2 849/мес</h2>
          </div>
          <p className="mt-3 max-w-2xl text-slate-700">
            Digital nomad visa (teletrabajo), non-lucrative, Beckham 24%: pillar-гид, wizard, новости extranjería и{" "}
            <strong>практика</strong> (NIE, TIE, аренда Valencia) на spain.emigro.online.
          </p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            <li>
              <Link
                href={guidePath("vnj-ispaniya-2026")}
                className="block rounded-lg border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-amber-950 hover:border-amber-300"
              >
                Digital nomad Испания 2026 — pillar-гид
              </Link>
            </li>
            <li>
              <Link
                href={guidePath("pervye-30-dnej-v-ispanii-2026")}
                className="block rounded-lg border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-amber-950 hover:border-amber-300"
              >
                Первые 30 дней: NIE, TIE, extranjería
              </Link>
            </li>
            <li>
              <a
                href={spainSatelliteUrl("/")}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950 hover:border-amber-400"
              >
                Практика — spain.emigro.online
              </a>
            </li>
            <li>
              <Link
                href="/ru/spain"
                className="block rounded-lg border border-amber-100 bg-white px-4 py-3 text-sm font-medium text-amber-950 hover:border-amber-300"
              >
                Коридор Испания — обзор
              </Link>
            </li>
          </ul>
        </section>

        <WizardPulseSectionSuspense />

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">Выберите ваш паспорт</h2>
          <p className="mt-1 text-sm text-slate-500">
            Emigro — для русскоязычных за рубежом и в СНГ: смена статуса, новая страна ЕС или первый переезд.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/ru/rossiyane"
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-corridor-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>🇷🇺</span>
              <div>
                <p className="font-semibold text-slate-900">Граждане РФ</p>
                <p className="mt-0.5 text-xs text-slate-500">Origin hub — EU-коридоры, пороги, консульства</p>
              </div>
            </Link>
            <Link
              href="/ru/wizard?interest=poland,czechia,germany"
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-corridor-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>🇺🇦</span>
              <div>
                <p className="font-semibold text-slate-900">Граждане Украины</p>
                <p className="mt-0.5 text-xs text-slate-500">Wizard: TP vs ВНЖ · PL, CZ, DE</p>
              </div>
            </Link>
            <Link
              href={guidePath("belorusy-v-evropu-vnj-2026")}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-corridor-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>🇧🇾</span>
              <div>
                <p className="font-semibold text-slate-900">Беларусь</p>
                <p className="mt-0.5 text-xs text-slate-500">ВНЖ без TP — Польша, Чехия, D7/D8</p>
              </div>
            </Link>
            <Link
              href="/ru/wizard"
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-corridor-300 hover:shadow-md"
            >
              <span className="text-2xl" aria-hidden>🇰🇿</span>
              <div>
                <p className="font-semibold text-slate-900">Казахстан</p>
                <p className="mt-0.5 text-xs text-slate-500">Wizard подбора маршрута ВНЖ</p>
              </div>
            </Link>
          </div>
        </section>

        <HubDestinationsSectionSuspense
          fullCorridors={fullCorridors}
          developingCorridors={developingCorridors}
          newsOnly={newsOnly}
        />

        {pillarGuides.length > 0 && (
          <section className="mt-14">
            <h2 className="text-2xl font-semibold text-slate-900">Гайды по релокации</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              Начните с Португалии D8/D7 — дальше pillar-разборы по digital nomad, семье, отказам и бюджету.{" "}
              <Link href="/ru/rossiyane" className="text-corridor-600 hover:underline">
                Origin hub для россиян
              </Link>
              {" · "}
              <Link href="/ru/wizard" className="text-corridor-600 hover:underline">
                Hub wizard
              </Link>
              .
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {pillarGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={guidePath(guide.slug)}
                    className="block rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-800 transition hover:border-corridor-400 hover:shadow-sm"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/ru/guides" className="mt-4 inline-block text-sm font-medium text-corridor-600 hover:underline">
              Все гайды →
            </Link>
          </section>
        )}

        <RelocatorChatPromo source="homepage" className="mt-14" />

        <section className="mt-14 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-corridor-600">Emigro Assist</p>
              <h2 className="mt-1.5 text-xl font-bold text-slate-900">Route Check — €129</h2>
              <p className="mt-2 max-w-lg text-slate-600">
                Пишете, чего хотите — согласуем созвон со специалистом. После встречи присылает PDF.
              </p>
            </div>
            <Link
              href="/ru/assist"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-corridor-700 px-5 py-3 font-medium text-white hover:bg-corridor-800"
            >
              Route Check — €129
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
