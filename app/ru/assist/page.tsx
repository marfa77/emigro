import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { AssistLeadForm, type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { AssistPaymentMethods } from "@/components/assist/AssistPaymentMethods";
import { AssistPricingCards } from "@/components/assist/AssistPricingCards";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { getAllProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { getAssistCountryOptions } from "@/lib/corridor/registry";
import { publicSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Emigro Assist — навигация и сопровождение",
  description:
    "Emigro Assist — Route Check €129: созвон с командой Emigro и PDF с разбором кейса, подбор партнёров, сопровождение €100/час. Оплата после согласования слота.",
  path: "/ru/assist",
});

const COUNTRY_OPTIONS = getAssistCountryOptions();

const AUDIENCE_POINTS = [
  "Не знаете, какая виза подходит именно вам",
  "Планируете переезд, но непонятно с чего начать",
  "Уже в процессе и застряли на конкретном шаге",
  "Получили отказ и не понимаете почему",
  "Не говорите на языке страны и нужна помощь в коммуникации с провайдерами",
] as const;

const FLOW_STEPS = [
  {
    step: "1",
    title: "Заявка",
    text: "Страна, текущий статус, доход, семья, сроки, цель — описываете ситуацию в форме.",
  },
  {
    step: "2",
    title: "Согласование",
    text: "Emigro подбирает время, подтверждает слот — затем оплата €129 (PayPal, Telegram Stars, USDT/USDC, карта через Gumroad).",
  },
  {
    step: "3",
    title: "Созвон",
    text: "Команда Emigro проводит встречу по структурированному чек-листу на русском.",
  },
  {
    step: "4",
    title: "PDF и партнёры",
    text: "В течение 48 часов после созвона — PDF с разбором кейса и контакты профильных провайдеров.",
  },
  {
    step: "5",
    title: "Дальше",
    text: "Продолжаете с партнёром напрямую или подключаете сопровождение €100/час.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Чем Route Check отличается от консультации юриста?",
    answer:
      "Route Check — структурированный разбор вашей ситуации: команда Emigro проводит созвон по чек-листу и готовит PDF с маршрутом, таймлайном, бюджетом и рисками. После — подбор профильных партнёров. Это не замена юридической консультации: юридические услуги оказывает партнёр, которого вы выбираете.",
  },
  {
    question: "Что входит в сопровождение €100/час?",
    answer:
      "Коммуникационная поддержка: переписка с консульством, юристом или агентством на нужном языке, подготовка писем и форм, разбор отказов. Это не юридическое представительство и не гарантия одобрения.",
  },
  {
    question: "Когда нужно платить?",
    answer:
      "После согласования времени созвона (Route Check) или формата работы (сопровождение). Реквизиты или ссылку вышлем на PayPal, Telegram Stars, USDT/USDC или для оплаты картой — ссылку на Gumroad.",
  },
  {
    question: "Emigro гарантирует получение визы?",
    answer:
      "Нет. Emigro не юридическая фирма и не иммиграционное агентство. Мы не несём ответственности за решения консульства или AIMA. Юридические услуги оказывает партнёр напрямую.",
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
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Emigro Assist" },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Assist",
    description:
      "Сервис Emigro: Route Check — созвон с командой Emigro и PDF с разбором кейса, подбор партнёров, почасовое сопровождение переписки.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "European Union" },
    offers: [
      {
        "@type": "Offer",
        name: "Route Check",
        price: "129",
        priceCurrency: "EUR",
        url: assistUrl,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Сопровождение",
        price: "100",
        priceCurrency: "EUR",
        url: `${assistUrl}#assist-accompaniment`,
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "100",
          priceCurrency: "EUR",
          unitText: "HUR",
        },
      },
    ],
    inLanguage: "ru-RU",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Разберём ваш кейс и найдём маршрут</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Рассказываете ситуацию — мы задаём правильные вопросы, делаем разбор и рекомендуем конкретные шаги. Не
            общие советы, а план под ваш паспорт, доход и сроки.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#assist-form"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Запросить Route Check — €129
            </a>
          </div>
        </HeroShell>

        <section aria-labelledby="assist-audience-heading" className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 id="assist-audience-heading" className="text-2xl font-bold text-slate-950">
            Для кого это
          </h2>
          <p className="mt-2 text-slate-600">Emigro Assist для тех, кто:</p>
          <ul className="mt-5 space-y-3">
            {AUDIENCE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-corridor-600" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <AssistPricingCards />

        <section
          aria-labelledby="assist-disclaimer-heading"
          className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-6"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <h2 id="assist-disclaimer-heading" className="text-xl font-bold text-slate-950">
                Честная рамка
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Emigro не юридическая фирма. Мы не гарантируем одобрение визы. Route Check — это структурированный
                разбор вашей ситуации и навигация к нужным специалистам. Юридическую ответственность несёт партнёр,
                которого вы выбираете.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="assist-flow-heading" className="mt-10">
          <h2 id="assist-flow-heading" className="text-2xl font-bold text-slate-950">
            Как это работает
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

        <AssistPaymentMethods />

        <section aria-labelledby="assist-faq-heading" className="mt-10">
          <h2 id="assist-faq-heading" className="text-2xl font-bold text-slate-950">
            Частые вопросы
          </h2>
          <dl className="mt-6 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <dt className="font-semibold text-slate-950">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="assist-form" className="mt-12 scroll-mt-24">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Заявка в Emigro Assist</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Выберите Route Check или сопровождение — опишите ситуацию, и мы свяжемся для согласования следующего
                шага.
              </p>
            </div>
            <Link
              href="/ru/assist/sample-plan"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-corridor-700 hover:underline"
            >
              Пример PDF после Route Check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <span id="assist-form-accompaniment" className="sr-only">
            Форма с предвыбором сопровождения
          </span>
          <AssistLeadForm countries={COUNTRY_OPTIONS} providers={providers} defaultPlanTier="route-check" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
