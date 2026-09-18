import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BriefcaseBusiness, Scale, ShieldCheck, Users } from "lucide-react";
import { InvestmentQualifier } from "@/components/investment/InvestmentQualifier";
import { InvestmentRouteLink, InvestmentViewTracker } from "@/components/investment/InvestmentAnalytics";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import {
  INVESTMENT_ROUTES,
  investmentAssetLabel,
  outcomeLabel,
  passportRestrictionLabel,
  routeKey,
  routeStatusLabel,
} from "@/lib/investment/registry";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Инвестиционная миграция: ВНЖ и ПМЖ",
  titleAbsolute: true,
  description:
    "Сравните инвестиционные маршруты ВНЖ и ПМЖ по бюджету, активу, сроку и составу семьи. Предварительный qualifier Emigro с официальными источниками.",
  path: "/ru/invest",
  aiDescription:
    "RU investment migration hub: compares residence and permanent-residence routes by budget, asset, family and timing. Screening only, not legal advice.",
  aiCategory: "investment-migration",
});

export default function InvestmentHubPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Инвестиционная миграция — маршруты Emigro",
    url: pageUrl("/ru/invest"),
    inLanguage: "ru-RU",
    hasPart: INVESTMENT_ROUTES.map((route) => ({
      "@type": "WebPage",
      name: route.title,
      url: pageUrl(`/ru/invest/${route.country}#${routeKey(route)}`),
    })),
  };

  return (
    <>
      <SiteHeader />
      <InvestmentViewTracker event="investment_hub_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-corridor-950 to-corridor-800 text-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-corridor-200">Investment Migration</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
              Инвестиционная миграция: сначала профиль, потом программа
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-200">
              Сопоставьте бюджет, тип актива, желаемый статус, сроки и семью. Emigro покажет маршруты для
              предметной проверки и поможет подготовить структурированный запрос профильному партнёру.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#qualifier" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-corridor-50">
                Получить предварительный рейтинг <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#routes" className="inline-flex min-h-12 items-center rounded-xl border border-white/30 px-5 py-3 font-medium hover:bg-white/10">
                Сначала посмотреть страны
              </a>
            </div>
            <div className="mt-8 flex max-w-3xl gap-3 rounded-xl border border-amber-300/30 bg-amber-100/10 p-4 text-sm leading-relaxed text-amber-50">
              <Scale className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                <strong>Не юридическая и не инвестиционная консультация.</strong> Порог в карточке — ориентир
                первичного скрининга, а не оферта. Право на статус зависит от актуальных правил, происхождения
                средств, гражданства, семьи и проверки компетентным органом.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <section className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-corridor-200 bg-corridor-50 p-6">
              <Users className="h-7 w-7 text-corridor-700" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">Для инвестора и семьи</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                <li>• Короткий список программ вместо несопоставимых рекламных обещаний.</li>
                <li>• Раздельная оценка бюджета, актива, статуса и семейного состава.</li>
                <li>• Ссылки на публичный разбор Emigro и официальный источник каждой программы.</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <BriefcaseBusiness className="h-7 w-7 text-emerald-700" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">Для проверенного партнёра</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                <li>• Структурированный профиль до первого контакта.</li>
                <li>• Явное согласие заявителя на связь и возможную передачу запроса.</li>
                <li>• Ручная проверка применимости — без автоматических юридических выводов.</li>
              </ul>
            </article>
          </section>

          <div className="mt-14">
            <InvestmentQualifier />
          </div>

          <section id="routes" className="scroll-mt-24 pt-14">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-corridor-600">Реестр маршрутов</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Страны для первичного сравнения</h2>
              </div>
              <p className="max-w-md text-sm text-slate-500">Данные программы нужно перепроверять перед любым переводом денег или подачей.</p>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {INVESTMENT_ROUTES.map((route) => {
                const passportNote = passportRestrictionLabel(route);
                const statusClass =
                  route.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : route.status === "closed"
                      ? "bg-rose-50 text-rose-800"
                      : "bg-amber-50 text-amber-800";
                return (
                <article key={routeKey(route)} id={routeKey(route)} className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-corridor-300 hover:shadow-md">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-3xl" aria-hidden>{route.flag}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}>
                      {routeStatusLabel(route.status)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-950">{route.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{route.summary}</p>
                  {passportNote ? (
                    <p className="mt-3 text-sm font-medium text-rose-800">{passportNote}</p>
                  ) : null}
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
                    <div>
                      <dt className="text-slate-500">Скрининг от</dt>
                      <dd className="mt-1 font-semibold text-slate-900">€{route.screeningFloorEur.toLocaleString("ru-RU")}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Ориентир</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{outcomeLabel(route.outcome)}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    {route.assets.map(investmentAssetLabel).join(" · ")}
                  </p>
                  <InvestmentRouteLink
                    href={`/ru/invest/${route.country}#${routeKey(route)}`}
                    country={route.country}
                    slug={routeKey(route)}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-corridor-700 group-hover:text-corridor-800"
                  >
                    {route.status === "closed" ? "Почему закрыта" : "Разобрать маршрут"} <ArrowRight className="h-4 w-4" />
                  </InvestmentRouteLink>
                </article>
                );
              })}
            </div>
          </section>

          <section className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "Официальные источники", "У каждой карточки есть ссылка на компетентный орган."],
              [BadgeCheck, "Структурированный скрининг", "Одинаковые критерии помогают сравнить разные программы."],
              [Scale, "Без гарантий статуса", "Финальное решение принимает государственный орган, не Emigro."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof ShieldCheck;
              return (
                <div key={String(title)} className="rounded-2xl border border-slate-200 p-5">
                  <ItemIcon className="h-6 w-6 text-corridor-700" />
                  <h3 className="mt-3 font-semibold text-slate-900">{String(title)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{String(text)}</p>
                </div>
              );
            })}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
