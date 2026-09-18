import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Scale } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { DubaiOfferVerdictPromo } from "@/components/investment/DubaiOfferVerdictPromo";
import { InvestmentViewTracker } from "@/components/investment/InvestmentAnalytics";
import {
  INVESTMENT_PROGRAM_NOTES,
  investmentAssetLabel,
  investmentCountryRoutes,
  outcomeLabel,
  routeKey,
  routeStatusLabel,
  uniqueInvestmentCountries,
} from "@/lib/investment/registry";
import { showsDubaiOfferVerdict } from "@/lib/investment/uae-offer-verdict";
import { pageMetadata } from "@/lib/seo";

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

  return (
    <>
      <SiteHeader />
      <InvestmentViewTracker event="investment_country_view" country={route.country} />
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
        </header>

        {routes.map((item) => (
          <article key={routeKey(item)} id={routeKey(item)} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-950">{item.title}</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{routeStatusLabel(item.status)}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{item.summary}</p>
            <p className="mt-3 text-sm text-slate-500">Скрининг от €{item.screeningFloorEur.toLocaleString("ru-RU")} · {item.assets.map(investmentAssetLabel).join(", ")} · {outcomeLabel(item.outcome)}</p>
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
        ))}

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

        {showsDubaiOfferVerdict(route.country) ? (
          <DubaiOfferVerdictPromo placement="invest_country" content={route.country} />
        ) : null}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-3">
            <Scale className="mt-0.5 h-5 w-5 shrink-0 text-slate-600" />
            <div>
              <h2 className="font-bold text-slate-950">Что означает предварительное совпадение</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Оно означает только совпадение выбранного бюджета, типа актива и цели с данными реестра. Это не
                подтверждение eligibility, одобрения, доходности актива, срока выдачи статуса или будущего
                гражданства. До сделки нужны независимые legal, tax, sanctions и source-of-funds проверки.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href={`/ru/invest#qualifier`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-corridor-700 px-6 py-3 font-semibold text-white hover:bg-corridor-800">
            Проверить свой профиль <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/ru/invest" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50">
            Сравнить другие страны
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
