import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { DubaiOfferVerdictPromo } from "@/components/investment/DubaiOfferVerdictPromo";
import {
  INVESTMENT_ROUTES,
  investmentAssetLabel,
  outcomeLabel,
  qualifyInvestmentRoutes,
  type InvestmentAsset,
  type InvestmentOutcome,
} from "@/lib/investment/registry";
import { pageMetadata } from "@/lib/seo";
import { verifyInvestmentResultToken } from "@/lib/investment/result-token";
import { showsDubaiOfferVerdict } from "@/lib/investment/uae-offer-verdict";

export const metadata: Metadata = pageMetadata({
  title: "Результаты инвестиционного qualifier",
  description: "Персональный предварительный рейтинг инвестиционных маршрутов Emigro.",
  path: "/ru/invest/results",
  noIndex: true,
});

const assets = new Set<InvestmentAsset | "any">([
  "any",
  "property",
  "fund",
  "business",
  "bonds",
  "donation",
  "membership",
]);
const outcomes = new Set<InvestmentOutcome | "any">([
  "any",
  "residence",
  "permanent_residence",
  "citizenship_path",
]);

export default function InvestmentResultsPage({
  searchParams,
}: {
  searchParams: {
    budget?: string;
    asset?: string;
    outcome?: string;
    passport?: string;
    country?: string;
    token?: string;
  };
}) {
  const budgetEur = Number(searchParams.budget);
  const asset = assets.has(searchParams.asset as InvestmentAsset | "any")
    ? (searchParams.asset as InvestmentAsset | "any")
    : "any";
  const outcome = outcomes.has(searchParams.outcome as InvestmentOutcome | "any")
    ? (searchParams.outcome as InvestmentOutcome | "any")
    : "any";
  const validInput = Number.isFinite(budgetEur) && budgetEur > 0;
  const passportIso2 = /^[A-Z]{2}$/.test(searchParams.passport ?? "") ? searchParams.passport : undefined;
  const evaluatedRoutes = validInput
    ? qualifyInvestmentRoutes({ budgetEur, asset, outcome, passportIso2 })
    : [];
  const preferredCountry = INVESTMENT_ROUTES.some((route) => route.country === searchParams.country)
    ? searchParams.country
    : undefined;
  const submittedLeadId = verifyInvestmentResultToken(searchParams.token);
  const results = preferredCountry
    ? [...evaluatedRoutes].sort((a, b) =>
        a.country === preferredCountry ? -1 : b.country === preferredCountry ? 1 : 0
      )
    : evaluatedRoutes;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link href="/ru/invest" className="text-sm font-medium text-corridor-700 hover:underline">
          ← Инвестиционная миграция
        </Link>

        {!validInput ? (
          <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h1 className="text-2xl font-bold text-amber-950">Нет данных для рейтинга</h1>
            <p className="mt-3 text-amber-900">Заполните qualifier, чтобы сопоставить бюджет, актив и цель.</p>
            <Link href="/ru/invest#qualifier" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800">
              Перейти к qualifier <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        ) : (
          <>
            <header className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950 to-corridor-800 p-7 text-white sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-corridor-200">Предварительный рейтинг</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Маршруты по вашему профилю</h1>
              <p className="mt-4 max-w-3xl text-slate-200">
                Бюджет €{budgetEur.toLocaleString("ru-RU")} ·{" "}
                {asset === "any" ? "любой актив" : investmentAssetLabel(asset)} ·{" "}
                {outcome === "any" ? "все типы статуса" : outcomeLabel(outcome)}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                {submittedLeadId
                  ? "Заявка сохранена и поставлена в очередь ручной проверки. Контакт партнёру не передан."
                  : "Это предварительный просмотр. Заявка не создана, пока qualifier не отправлен."}
              </p>
            </header>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Рейтинг использует только скрининговые данные реестра и не является legal, tax или investment
                advice. «Предварительно подходит» не гарантирует одобрение, срок, доходность или гражданство.
              </p>
            </div>

            <section className="mt-8 space-y-4" aria-label="Рейтинг маршрутов">
              {results.map((route, index) => {
                const statusStyle =
                  route.match === "likely"
                    ? "bg-emerald-50 text-emerald-800"
                    : route.match === "review"
                      ? "bg-amber-50 text-amber-800"
                      : route.match === "blocked" || route.match === "closed"
                        ? "bg-rose-50 text-rose-800"
                        : "bg-slate-100 text-slate-600";
                const statusLabel =
                  route.match === "likely"
                    ? "Предварительно совпадает"
                    : route.match === "review"
                      ? "Нужна ручная сверка"
                      : route.match === "blocked"
                        ? "Паспорт ограничен"
                        : route.match === "not_property"
                          ? "Недвижимость не основание"
                          : route.match === "closed"
                            ? "Программа закрыта"
                            : "Есть разрыв по бюджету";

                return (
                  <article key={route.country} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-corridor-50 font-bold text-corridor-800">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-2xl" aria-hidden>{route.flag}</span>
                          <h2 className="text-xl font-bold text-slate-950">{route.title}</h2>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>{statusLabel}</span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-700">{route.reason}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-500">{route.caveat}</p>
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
                          <Link href={`/ru/invest/${route.country}`} className="inline-flex min-h-11 items-center gap-2 text-corridor-700 hover:underline">
                            Карточка маршрута <ArrowRight className="h-4 w-4" />
                          </Link>
                          <a href={route.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-slate-600 hover:text-corridor-700">
                            Официальный источник <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            {results.some(
              (route) =>
                showsDubaiOfferVerdict(route.country) &&
                (route.match === "likely" || route.match === "review") &&
                (asset === "property" || asset === "any")
            ) ? (
              <DubaiOfferVerdictPromo placement="invest_results" content="results" />
            ) : null}

            <section className="mt-10 rounded-2xl border border-corridor-200 bg-corridor-50 p-6">
              <h2 className="text-xl font-bold text-slate-950">Следующий шаг</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">
                {submittedLeadId
                  ? "Emigro проверит профиль вручную. Передача контакта партнёру происходит только отдельным действием и с повторным смыслом согласия."
                  : "Чтобы поставить профиль в очередь, отправьте qualifier. Прямая ссылка на рейтинг заявку не создаёт."}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/ru/invest#qualifier" className="inline-flex min-h-11 items-center rounded-xl border border-corridor-300 bg-white px-5 py-3 font-semibold text-corridor-800 hover:border-corridor-500">
                  Изменить ответы
                </Link>
                <Link href="/ru/assist#assist-form-route-check" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800">
                  Заказать Route Check <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
