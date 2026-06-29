import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, MessageCircle, ShieldCheck } from "lucide-react";
import { AssistLeadForm, type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { AssistPaymentMethods } from "@/components/assist/AssistPaymentMethods";
import { AssistPricingCards } from "@/components/assist/AssistPricingCards";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { getAllProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { GUMROAD_ROUTE_CHECK_URL } from "@/lib/site-contact";
import { getAssistCountryOptions } from "@/lib/corridor/registry";
import { publicSiteUrl } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Emigro Assist — Route Check €129",
  description:
    "€129 — опишите цель, Emigro подберёт партнёра. Партнёр проведёт созвон и пришлёт PDF после встречи.",
  path: "/ru/assist",
});

const COUNTRY_OPTIONS = getAssistCountryOptions();

const FLOW_STEPS = [
  {
    step: "1",
    title: "Оплата €129",
    text: "Оплачиваете на Gumroad или через заявку — и пишете цель: страна, текущий статус, смена ВНЖ или первичный переезд.",
  },
  {
    step: "2",
    title: "Подбор партнёра",
    text: "Emigro подбирает партнёрского специалиста по вашему маршруту. Дальше работает уже он.",
  },
  {
    step: "3",
    title: "Созвон и PDF",
    text: "Партнёр связывается, проводит созвон. После встречи присылает PDF с разбором маршрута.",
  },
] as const;

export default function AssistPage() {
  const providers: AssistProviderOption[] = getAllProviders()
    .filter((provider) => !provider.isFirstParty)
    .map((provider) => ({
      id: provider.id,
      name: provider.name,
      category: PROVIDER_CATEGORY_LABELS_RU[provider.category],
    }));

  const origin = publicSiteUrl();
  const assistUrl = pageUrl("/ru/assist");

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro", item: pageUrl("/ru") },
    { name: "Emigro Assist", item: assistUrl },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Route Check",
    description:
      "Персональная проверка маршрута ВНЖ: Emigro подбирает партнёра, созвон и PDF-план после встречи.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "European Union" },
    offers: {
      "@type": "Offer",
      price: "129",
      priceCurrency: "EUR",
      url: GUMROAD_ROUTE_CHECK_URL,
      availability: "https://schema.org/InStock",
    },
    inLanguage: "ru-RU",
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Emigro Assist</span>
        </nav>

        <HeroShell className="mt-8">
          <p className="text-sm uppercase tracking-wide text-corridor-100">Сервис Emigro</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Route Check — €129</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Опишите ситуацию — уже в Европе или планируете переезд. Emigro подберёт партнёра: он проведёт созвон и
            после встречи пришлёт PDF.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={GUMROAD_ROUTE_CHECK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Оплатить €129 на Gumroad
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="#assist-form"
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Оставить заявку
            </a>
            <Link
              href="/ru/assist/sample-plan"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              <FileText className="h-4 w-4" aria-hidden />
              Пример плана
            </Link>
          </div>
        </HeroShell>

        <AssistPricingCards />

        <section aria-labelledby="assist-flow-heading" className="mt-10">
          <h2 id="assist-flow-heading" className="text-2xl font-bold text-slate-950">
            Как это работает
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {FLOW_STEPS.map(({ step, title, text }) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-corridor-100 text-sm font-bold text-corridor-700">
                  {step}
                </span>
                <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Пример deliverable</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">
                Максим из Петербурга → Валенсия, Digital Nomad Visa
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Семья с двумя детьми: резюме, профиль, таймлайн на 5,5 месяцев, бюджет €8 400, чек-лист документов и
                риски. Откройте образец или сохраните как PDF.
              </p>
            </div>
            <Link
              href="/ru/assist/sample-plan"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 text-sm font-medium text-white hover:bg-corridor-700"
            >
              Смотреть пример
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>

        <AssistPaymentMethods />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <MessageCircle className="h-5 w-5 text-corridor-600" aria-hidden />
              <h2 className="mt-3 font-semibold text-slate-950">Что происходит после заявки</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Оплатили на Gumroad — напишите, чего хотите, по инструкции на email. Оставили заявку с Wise, Stars или
                crypto — Emigro подберёт партнёра и пришлёт реквизиты. Партнёр свяжется сам и назначит созвон.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-corridor-600" aria-hidden />
              <h2 className="mt-3 font-semibold text-slate-950">Честная рамка</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Emigro только подбирает партнёра. Созвон и PDF делает партнёр. Мы не оказываем юридические услуги и не
                гарантируем одобрение визы. Дальше — напрямую с партнёром, если захотите продолжить.
              </p>
            </div>
          </section>

          <section id="assist-form" className="scroll-mt-24">
            <h2 className="mb-4 text-xl font-bold text-slate-950">Заявка на Route Check</h2>
            <AssistLeadForm countries={COUNTRY_OPTIONS} providers={providers} defaultPlanTier="route-check" />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
