import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Scale } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { DubaiOfferVerdictPromo } from "@/components/investment/DubaiOfferVerdictPromo";
import { InvestmentViewTracker } from "@/components/investment/InvestmentAnalytics";
import { InvestmentQualifier } from "@/components/investment/InvestmentQualifier";
import { UaePropertyLeadCta } from "@/components/investment/UaePropertyLeadCta";
import {
  INVESTMENT_PROGRAM_NOTES,
  capitalFateLabel,
  expenseKindLabel,
  investmentAssetLabel,
  investmentCountryRoutes,
  hasRuByPassportRestriction,
  liquidityLabel,
  outcomeLabel,
  passportRestrictionLabel,
  routeKey,
  routeStatusLabel,
  uniqueInvestmentCountries,
} from "@/lib/investment/registry";
import { showsDubaiOfferVerdict } from "@/lib/investment/uae-offer-verdict";
import { pageMetadata } from "@/lib/seo";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";

export function generateStaticParams() {
  return uniqueInvestmentCountries().map((route) => ({ country: route.country }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const routes = investmentCountryRoutes(params.country);
  const route = routes[0];
  if (!route) return {};
  const title = routes.length > 1 ? `${route.countryRu}: программы статуса` : `${route.countryRu}: инвестиционный ВНЖ`;

  return pageMetadata({
    title,
    titleAbsolute: true,
    description: `${route.countryRu}: ${routes.map((item) => item.title).join("; ")}. Предварительный скрининг Emigro без юридических гарантий.`,
    path: `/ru/invest/${route.country}`,
    aiDescription: `${route.countryRu} investment routes: ${routes.map((item) => item.caveat).join(" ")} Not legal or investment advice.`,
    aiCategory: "investment-migration-route",
  });
}

export default function InvestmentCountryPage({ params }: { params: { country: string } }) {
  const routes = investmentCountryRoutes(params.country);
  const route = routes[0];
  if (!route) notFound();
  const notes = INVESTMENT_PROGRAM_NOTES[route.country] ?? [];
  const faq = [
    {
      question: `Инвестиционный ВНЖ в стране «${route.countryRu}» даёт паспорт?`,
      answer:
        "Нет автоматически. Большинство программ дают ВНЖ или ПМЖ; гражданство — отдельный срок и экзамены. Не путайте скрининг Emigro с обещанием паспорта.",
    },
    {
      question: "Можно ли переносить условия одной программы на другую?",
      answer:
        routes.length > 1
          ? "Нет. На этой странице несколько маршрутов — совпадение по одному не переносится на остальные."
          : "Нет. Пороги, активы и статус этой программы не копируются на соседние страны или закрытые Golden Visa.",
    },
    {
      question: "Что проверяет скрининг Emigro?",
      answer: `Предварительный фильтр от €${route.screeningFloorEur.toLocaleString("ru-RU")} и типа актива. ${route.caveat} Это не юридическая и не инвестиционная консультация.`,
    },
    {
      question: "Закрытые программы ещё принимают заявки?",
      answer:
        route.status === "closed"
          ? "Эта программа закрыта для новых заявок. Смотрите актуальные маршруты в /ru/invest и официальный источник."
          : "Статус на странице — ориентир Emigro. Перед деньгами сверяйте official URL и паспортные ограничения (часто RU/BY).",
    },
    {
      question: "Куда идти дальше?",
      answer:
        "Разбор маршрута по ссылке программы, официальный портал, при недвижимости — qualifier. Не переводите деньги по скринингу чата.",
    },
  ];
  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <SiteHeader />
      <InvestmentViewTracker event="investment_country_view" country={route.country} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/ru/invest" className="text-sm font-medium text-corridor-700 hover:underline">
          ← Все инвестиционные маршруты
        </Link>

        <header className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-corridor-800 p-7 text-white sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl" aria-hidden>{route.flag}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${route.status === "active" && routes.length === 1 ? "bg-emerald-300/20 text-emerald-100" : route.status === "closed" ? "bg-rose-300/20 text-rose-100" : "bg-amber-300/20 text-amber-100"}`}>
              {routes.length > 1 ? `${routes.length} программы, проверяются раздельно` : routeStatusLabel(route.status)}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            {routes.length > 1 ? `${route.countryRu}: программы не взаимозаменяемы` : route.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">
            {routes.length > 1
              ? "Ниже отдельные программы. Совпадение по одной не переносится на остальные."
              : route.summary}
          </p>
          {hasRuByPassportRestriction(route) ? (
            <p className="mt-5 max-w-3xl rounded-xl border border-rose-300/40 bg-rose-500/20 px-4 py-3 text-sm font-semibold text-rose-50">
              {passportRestrictionLabel(route)}
            </p>
          ) : null}
          {showsDubaiOfferVerdict(route.country) ? (
            <div className="mt-6">
              <a
                href="#qualifier"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-corridor-900 hover:bg-corridor-50"
              >
                Квалифицировать бюджет → брокер <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ) : null}
        </header>

        {showsDubaiOfferVerdict(route.country) ? (
          <UaePropertyLeadCta placement="invest_country" content={route.country} />
        ) : null}

        {routes.map((item) => {
          const passportNote = passportRestrictionLabel(item);
          const ruByBlocked = hasRuByPassportRestriction(item);
          return (
          <article key={routeKey(item)} id={routeKey(item)} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-950">{item.title}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.status === "closed" || ruByBlocked
                    ? "bg-rose-100 text-rose-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {item.status === "closed"
                  ? routeStatusLabel(item.status)
                  : ruByBlocked
                    ? "RU/BY: ограничено"
                    : routeStatusLabel(item.status)}
              </span>
            </div>
            {passportNote ? (
              <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-900">
                {passportNote}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.summary}</p>
            <p className="mt-3 rounded-xl border border-corridor-100 bg-corridor-50 px-3 py-2 text-sm leading-snug text-corridor-950">
              <span className="font-semibold">Главный вопрос: </span>
              {item.decisionHook}
            </p>
            <p className={`mt-3 text-sm ${ruByBlocked ? "text-slate-500" : "text-slate-500"}`}>
              {item.status === "closed"
                ? "Статус: "
                : item.screeningPrimaryLabel
                  ? "Порог / пакет: "
                  : ruByBlocked
                    ? "Ориентир программы (не доступность для RU/BY): "
                    : "Скрининг от "}
              {item.screeningPrimaryLabel ?? `€${item.screeningFloorEur.toLocaleString("ru-RU")}`}
              {item.screeningSecondaryLabel ? ` · ${item.screeningSecondaryLabel}` : null}
              {" · "}
              {item.assets.map(investmentAssetLabel).join(", ")} · {outcomeLabel(item.outcome)}
            </p>
            {item.screeningFloorNote ? (
              <p className="mt-1 text-xs font-medium text-amber-900">{item.screeningFloorNote}</p>
            ) : null}
            {item.routeKindLabel ? (
              <p className="mt-1 text-xs font-medium text-slate-700">Тип маршрута: {item.routeKindLabel}</p>
            ) : null}
            <p className="mt-2 text-sm text-slate-600">
              Капитал: {capitalFateLabel(item.capitalFate)} · {expenseKindLabel(item.expenseKind)} ·{" "}
              {liquidityLabel(item.liquidity)}
              {item.lockupNote ? ` · Lock-up: ${item.lockupNote}` : null}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-amber-900">{item.caveat}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link href={item.publicPath} className="inline-flex min-h-11 items-center gap-2 text-corridor-700">
                Разбор Emigro <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-slate-600">
                Официальный источник <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </article>
          );
        })}

        {notes.length ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Что не смешивать</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
              {notes.map((note) => (
                <li key={note}>• {note}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-medium text-slate-900">{item.question}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
            <div>
              <h2 className="font-bold text-slate-950">Что означает предварительное совпадение</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Оно означает только совпадение выбранного бюджета, типа актива и цели с данными реестра (shortlist для
                проверки). Это не рейтинг «лучших программ», не подтверждение eligibility, одобрения, доходности
                актива, срока выдачи статуса или будущего гражданства. Emigro сравнивает миграционные характеристики
                маршрутов, а не инвестиционную доходность. До сделки нужны независимые legal, tax, sanctions и
                source-of-funds проверки.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href="#qualifier" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-corridor-700 px-6 py-3 font-semibold text-white hover:bg-corridor-800">
            {showsDubaiOfferVerdict(route.country)
              ? "Заполнить qualifier — свяжем с брокером"
              : "Проверить свой профиль по этой стране"}{" "}
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/ru/invest" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
            Сравнить другие страны
          </Link>
        </div>

        <div className="mt-10">
          <InvestmentQualifier id="qualifier" defaultPreferredCountry={route.country} />
        </div>

        {showsDubaiOfferVerdict(route.country) ? (
          <DubaiOfferVerdictPromo placement="invest_country" content={route.country} />
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
