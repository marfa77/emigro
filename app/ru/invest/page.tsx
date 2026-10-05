import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
import { InvestmentQualifier } from "@/components/investment/InvestmentQualifier";
import { InvestmentRouteLink, InvestmentViewTracker } from "@/components/investment/InvestmentAnalytics";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import {
  INVESTMENT_ROUTES,
  capitalFateLabel,
  expenseKindLabel,
  investmentAssetLabel,
  liquidityLabel,
  outcomeLabel,
  hasRuByPassportRestriction,
  passportRestrictionLabel,
  routeKey,
  routeStatusLabel,
  uniqueInvestmentCountries,
} from "@/lib/investment/registry";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { propertyBotDeepLink } from "@/lib/telegram/deep-link";

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

  const routeCount = INVESTMENT_ROUTES.length;
  const countryCount = uniqueInvestmentCountries().length;
  const heroStats = [
    { value: String(routeCount), label: "капитальных маршрутов в реестре" },
    { value: String(countryCount), label: "юрисдикций для сравнения" },
    { value: "0", label: "офферов без официального источника" },
  ];

  return (
    <>
      <SiteHeader />
      <InvestmentViewTracker event="investment_hub_view" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-corridor-900 to-corridor-800 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 right-[-10%] h-96 w-96 rounded-full bg-corridor-400/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]"
          />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-24">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
              <span className="h-px w-8 bg-gradient-to-r from-amber-300 to-transparent" />
              Private Capital · Investment Migration
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Инвестиционная миграция:
              <br className="hidden sm:block" /> сначала{" "}
              <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                профиль
              </span>
              , потом программа
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200/90">
              У вас есть капитал — сначала определим тип маршрута (сохранение / статус / структура расхода), паспорт и
              SoF. Emigro покажет shortlist для проверки, а не «7 Golden Visa на выбор». Доходность активов мы не
              оцениваем.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#qualifier"
                className="group inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-amber-500/25 transition hover:from-amber-200 hover:to-amber-300 hover:shadow-amber-400/40"
              >
                Проверить инвестиционный профиль
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#routes"
                className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
              >
                Сначала посмотреть страны
              </a>
              <a
                href={propertyBotDeepLink()}
                className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10"
              >
                Короткая заявка в боте
              </a>
            </div>

            <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-5 border-t border-white/10 pt-8 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-3xl font-bold tracking-tight text-amber-200 sm:text-4xl">{stat.value}</dd>
                  <p className="mt-1 text-sm leading-snug text-slate-300">{stat.label}</p>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex max-w-3xl gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200 backdrop-blur">
              <Scale className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p>
                <strong className="text-white">Не юридическая и не инвестиционная консультация.</strong> Emigro
                сравнивает <em>миграционные</em> характеристики капитальных маршрутов, а не доходность активов. Порог в
                карточке — ориентир скрининга, не оферта. Право на статус зависит от актуальных правил, происхождения
                средств, гражданства, семьи и проверки компетентным органом.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <section className="grid gap-5 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-corridor-500 to-corridor-700" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-corridor-50 ring-1 ring-corridor-100">
                <Users className="h-6 w-6 text-corridor-700" />
              </span>
              <h2 className="mt-5 text-xl font-bold text-slate-950">Для инвестора и семьи</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {[
                  "Короткий список программ вместо несопоставимых рекламных обещаний.",
                  "Раздельная оценка бюджета, актива, статуса и семейного состава.",
                  "Ссылки на публичный разбор Emigro и официальный источник каждой программы.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
                <BriefcaseBusiness className="h-6 w-6 text-emerald-700" />
              </span>
              <h2 className="mt-5 text-xl font-bold text-slate-950">Для проверенного партнёра</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                {[
                  "Структурированный профиль до первого контакта.",
                  "Явное согласие заявителя на связь и возможную передачу запроса.",
                  "Ручная проверка применимости — без автоматических юридических выводов.",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </section>

          <div className="mt-14">
            <InvestmentQualifier />
          </div>

          <section id="routes" className="scroll-mt-24 pt-14">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-corridor-600">
                  <span className="h-px w-6 bg-gradient-to-r from-amber-400 to-transparent" />
                  Реестр маршрутов
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Страны для первичного сравнения</h2>
              </div>
              <p className="max-w-md text-sm text-slate-500">Данные программы нужно перепроверять перед любым переводом денег или подачей.</p>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {INVESTMENT_ROUTES.map((route) => {
                const passportNote = passportRestrictionLabel(route);
                const ruByBlocked = hasRuByPassportRestriction(route);
                const statusClass =
                  route.status === "closed"
                    ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                    : ruByBlocked
                      ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                      : route.status === "active"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-amber-50 text-amber-800 ring-1 ring-amber-100";
                const statusText =
                  route.status === "closed"
                    ? routeStatusLabel(route.status)
                    : ruByBlocked
                      ? "RU/BY: ограничено"
                      : routeStatusLabel(route.status);
                return (
                <article key={routeKey(route)} id={routeKey(route)} className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-corridor-300 hover:shadow-xl hover:shadow-corridor-900/5">
                  <span className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-amber-300 via-amber-400 to-corridor-500 transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-2xl ring-1 ring-slate-200/80" aria-hidden>{route.flag}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                      {statusText}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-950">{route.title}</h3>
                  {passportNote ? (
                    <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold leading-snug text-rose-900">
                      {passportNote}
                    </p>
                  ) : null}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{route.summary}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
                    <div>
                      <dt className="text-slate-500">
                        {route.status === "closed"
                          ? "Статус новых заявок"
                          : ruByBlocked
                            ? "Ориентир программы"
                            : route.screeningPrimaryLabel
                              ? "Порог / пакет"
                              : "Скрининг от"}
                      </dt>
                      <dd className={`mt-1 font-semibold ${ruByBlocked || route.status === "closed" ? "text-slate-500" : "text-slate-900"}`}>
                        {route.screeningPrimaryLabel ??
                          `€${route.screeningFloorEur.toLocaleString("ru-RU")}`}
                        {route.screeningSecondaryLabel ? (
                          <span className="mt-1 block text-xs font-medium text-slate-600">
                            {route.screeningSecondaryLabel}
                          </span>
                        ) : null}
                        {route.screeningFloorNote ? (
                          <span className="mt-1 block text-xs font-medium text-amber-900">
                            {route.screeningFloorNote}
                          </span>
                        ) : null}
                        {ruByBlocked && !route.screeningFloorNote ? (
                          <span className="mt-1 block text-xs font-medium text-rose-800">
                            не для новых заявок RU/BY
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Ориентир статуса</dt>
                      <dd className="mt-1 font-semibold text-slate-900">{outcomeLabel(route.outcome)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-500">Структура капитала</dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">
                        {capitalFateLabel(route.capitalFate)} · {expenseKindLabel(route.expenseKind)} ·{" "}
                        {liquidityLabel(route.liquidity)}
                        {route.lockupNote ? (
                          <span className="mt-1 block text-xs font-normal text-slate-600">
                            Lock-up: {route.lockupNote}
                          </span>
                        ) : null}
                      </dd>
                    </div>
                    {route.routeKindLabel ? (
                      <div className="col-span-2">
                        <dt className="text-slate-500">Тип маршрута</dt>
                        <dd className="mt-1 text-sm font-medium text-slate-800">{route.routeKindLabel}</dd>
                      </div>
                    ) : null}
                  </dl>
                  <p className="mt-3 text-sm leading-snug text-corridor-900">
                    <span className="font-semibold">Главный вопрос: </span>
                    {route.decisionHook}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-slate-500">
                    Актив: {route.assets.map(investmentAssetLabel).join(" · ")}
                  </p>
                  <InvestmentRouteLink
                    href={`/ru/invest/${route.country}#${routeKey(route)}`}
                    country={route.country}
                    slug={routeKey(route)}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-corridor-700 transition-colors group-hover:text-corridor-800"
                  >
                    {route.status === "closed"
                      ? "Почему закрыта"
                      : ruByBlocked
                        ? "Ограничения для RU/BY"
                        : "Разобрать маршрут"}{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                <div key={String(title)} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/60 p-6 transition hover:border-corridor-200 hover:shadow-sm">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-corridor-50 ring-1 ring-corridor-100">
                    <ItemIcon className="h-5 w-5 text-corridor-700" />
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{String(title)}</h3>
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
