import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Info, Scale } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import {
  INVESTMENT_ROUTES,
  investmentAssetLabel,
  investmentRoute,
  outcomeLabel,
} from "@/lib/investment/registry";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return INVESTMENT_ROUTES.map((route) => ({ country: route.country }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const route = investmentRoute(params.country);
  if (!route) return {};

  return pageMetadata({
    title: `${route.countryRu}: инвестиционный ВНЖ`,
    titleAbsolute: true,
    description: `${route.title}: бюджетный ориентир, активы, ограничения, публичный разбор и официальный источник. Предварительный скрининг Emigro без юридических гарантий.`,
    path: `/ru/invest/${route.country}`,
    aiDescription: `${route.countryRu} investment migration route. Screening floor EUR ${route.screeningFloorEur}; ${route.caveat} Not legal or investment advice.`,
    aiCategory: "investment-migration-route",
  });
}

export default function InvestmentCountryPage({ params }: { params: { country: string } }) {
  const route = investmentRoute(params.country);
  if (!route) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/ru/invest" className="text-sm font-medium text-corridor-700 hover:underline">
          ← Все инвестиционные маршруты
        </Link>

        <header className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-corridor-800 p-7 text-white sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-4xl" aria-hidden>{route.flag}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${route.status === "active" ? "bg-emerald-300/20 text-emerald-100" : "bg-amber-300/20 text-amber-100"}`}>
              {route.status === "active" ? "Активный маршрут в реестре" : "Требуется ручная проверка"}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{route.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-200">{route.summary}</p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Предварительный бюджет</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">от €{route.screeningFloorEur.toLocaleString("ru-RU")}</p>
            <p className="mt-2 text-xs text-slate-500">Скрининговый ориентир, не полная стоимость программы.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Тип результата</p>
            <p className="mt-2 font-bold text-slate-950">{outcomeLabel(route.outcome)}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">Активы для проверки</p>
            <p className="mt-2 font-bold text-slate-950">{route.assets.map(investmentAssetLabel).join(", ")}</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <h2 className="font-bold text-amber-950">Ключевое ограничение</h2>
              <p className="mt-2 leading-relaxed text-amber-900">{route.caveat}</p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Разобрать публичные условия</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Откройте существующий страновой или программный разбор Emigro: контекст маршрута, требования и
              связанные материалы.
            </p>
            <Link href={route.publicPath} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-corridor-700 hover:text-corridor-800">
              Открыть разбор Emigro <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold text-slate-950">Сверить официальный источник</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Проверяйте актуальную редакцию, валюту порога, допустимый актив, состав семьи и процедуру подачи
              непосредственно у компетентного органа.
            </p>
            <a href={route.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-corridor-700 hover:text-corridor-800">
              Официальный источник <ExternalLink className="h-4 w-4" />
            </a>
          </article>
        </section>

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
