import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileText, Phone, ShieldCheck, UserCheck } from "lucide-react";
import { AssistPaymentMethods } from "@/components/assist/AssistPaymentMethods";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { ROUTE_CHECK_PDF_PATH, SAMPLE_PLAN_SECTIONS } from "@/lib/assist/sample-plan-data";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-url";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";

export const revalidate = 3600;

const ROUTE_CHECK_PATH = "/ru/route-check";

export const metadata = pageMetadata({
  title: "Route Check €129 — проверка маршрута ВНЖ",
  description:
    "Route Check от Emigro: созвон по чек-листу и PDF с маршрутом ВНЖ, таймлайном, бюджетом и рисками в течение 48 часов. €129 разово, оплата после согласования.",
  path: ROUTE_CHECK_PATH,
  aiDescription:
    "Emigro Route Check: €129 one-off. Structured call with the Emigro team, then a PDF with route, timeline, budget, risks and next steps within 48 hours after the call, plus matching with partners for the corridor. Payment after the call slot is agreed (PayPal, Telegram Stars, USDT/USDC, card via Gumroad). Not legal advice, no visa guarantee.",
  aiCategory: "assist",
});

const PRICE_SUMMARY = [
  { label: "Стоимость", value: "€129", note: "разово, без пакета «под ключ»" },
  { label: "PDF с разбором", value: "48 часов", note: "после созвона с командой Emigro" },
  { label: "Оплата", value: "После слота", note: "когда согласовали время созвона" },
] as const;

const INCLUDED = [
  {
    icon: Phone,
    title: "Созвон по чек-листу",
    text: "Команда Emigro разбирает вашу ситуацию по структурированному чек-листу: паспорт, текущий статус, доход и накопления, семья, сроки и цель переезда.",
  },
  {
    icon: FileText,
    title: "PDF с маршрутом",
    text: "После встречи — документ с маршрутом, таймлайном, бюджетом, рисками и следующими шагами. Готовим в течение 48 часов после созвона.",
  },
  {
    icon: UserCheck,
    title: "Подбор партнёров",
    text: "После разбора подбираем профильных партнёров под ваш коридор. Контакт передаём только с вашего согласия.",
  },
] as const;

const PDF_SECTIONS = SAMPLE_PLAN_SECTIONS.map((section) => ({
  number: section.number,
  title: section.title.split(" — ")[0],
}));

const AUDIENCE_POINTS = [
  "Не знаете, какая виза подходит именно вам",
  "Маршрут ещё не выбран, и нужен независимый разбор до оплаты юриста или агентства",
  "Нужен второй взгляд на уже выбранную программу",
  "Уже в процессе и застряли на конкретном шаге",
  "Получили отказ и не понимаете почему",
] as const;

const ORDER_STEPS = [
  {
    step: "1",
    title: "Заявка в боте",
    text: "В @emigro_chat_bot выберите Route Check, страну маршрута и одним сообщением опишите паспорт, доход или накопления, сроки и в чём затык.",
  },
  {
    step: "2",
    title: "Время созвона",
    text: "Согласуем удобный слот. Заявка в боте ничего не списывает.",
  },
  {
    step: "3",
    title: "Оплата €129",
    text: "После согласования времени: PayPal, Telegram Stars, USDT/USDC или карта через Gumroad.",
  },
  {
    step: "4",
    title: "Созвон и PDF",
    text: "Созвон по чек-листу, затем PDF с маршрутом, таймлайном, бюджетом и рисками — в течение 48 часов.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Сколько стоит Route Check?",
    answer:
      "€129 разово: созвон по чек-листу и PDF с маршрутом, таймлайном, бюджетом и рисками в течение 48 часов. Услуги юриста или агентства, которого вы выберете после разбора, оплачиваются отдельно по его условиям.",
  },
  {
    question: "Чем Route Check отличается от консультации юриста?",
    answer:
      "Route Check — структурированный разбор вашей ситуации: команда Emigro проводит созвон по чек-листу и готовит PDF с маршрутом, таймлайном, бюджетом и рисками. После — подбор профильных партнёров. Это не замена юридической консультации: юридические услуги оказывает партнёр, которого вы выбираете.",
  },
  {
    question: "Когда нужно платить?",
    answer:
      "После согласования времени созвона. Реквизиты или ссылку вышлем на PayPal, Telegram Stars, USDT/USDC или для оплаты картой — ссылку на Gumroad.",
  },
  {
    question: "Когда я получу PDF?",
    answer: "В течение 48 часов после созвона. Пример такого документа можно посмотреть заранее — ссылка выше на странице.",
  },
  {
    question: "Где оставить заявку?",
    answer:
      "Основной путь — Telegram-бот @emigro_chat_bot, тариф Route Check. Если бот недоступен, есть запасная форма на странице Emigro Assist. Заявка не списывает деньги: слот и оплата — после согласования.",
  },
  {
    question: "Что делать, если маршрут уже понятен?",
    answer:
      "Тогда Route Check не обязателен: Emigro бесплатно подберёт профильного партнёра по стране и задаче. Если в процессе понадобится помощь с письмами, формами или разбором отказа — есть сопровождение €100 в час.",
  },
  {
    question: "Emigro гарантирует получение визы?",
    answer:
      "Нет. Emigro не юридическая фирма и не иммиграционное агентство. Мы не несём ответственности за решения консульства или миграционной службы. Юридические услуги оказывает партнёр напрямую.",
  },
] as const;

export default function RouteCheckPage() {
  const url = pageUrl(ROUTE_CHECK_PATH);
  const orderHref = assistBotDeepLink({ tier: "route-check" });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Emigro Assist", item: pageUrl("/ru/assist") },
    { name: "Route Check" },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Route Check",
    serviceType: "Разбор маршрута ВНЖ",
    description:
      "Разовый разбор маршрута ВНЖ: созвон с командой Emigro по чек-листу и PDF с маршрутом, таймлайном, бюджетом, рисками и следующими шагами в течение 48 часов.",
    url,
    provider: { "@type": "Organization", name: "Emigro", url: publicSiteUrl() },
    areaServed: { "@type": "Place", name: "European Union" },
    offers: {
      "@type": "Offer",
      name: "Route Check",
      price: "129",
      priceCurrency: "EUR",
      url,
      availability: "https://schema.org/InStock",
    },
    inLanguage: "ru-RU",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
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
          <Link href="/ru/assist" className="text-corridor-600 hover:underline">
            Emigro Assist
          </Link>
          <span className="mx-2">/</span>
          <span>Route Check</span>
        </nav>

        <HeroShell className="mt-8">
          <p className="text-sm uppercase tracking-wide text-corridor-100">Emigro Assist</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Route Check — проверка маршрута ВНЖ за €129</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Разовый разбор вашей ситуации: созвон с командой Emigro по чек-листу, затем PDF с маршрутом, таймлайном,
            бюджетом, рисками и следующими шагами — в течение 48 часов после созвона.
          </p>
          <dl className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {PRICE_SUMMARY.map(({ label, value, note }) => (
              <div key={label} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-corridor-100">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{value}</dd>
                <dd className="mt-1 text-xs leading-snug text-corridor-100">{note}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <TrackedAssistLink
              href={orderHref}
              placement="ru_route_check_hero"
              linkLabel="Заказать Route Check — €129"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Заказать Route Check — €129
            </TrackedAssistLink>
            <Link
              href="/ru/assist/sample-plan"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Пример PDF
            </Link>
            <Link
              href="/ru/wizard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Сначала подобрать маршрут
            </Link>
          </div>
        </HeroShell>

        <section aria-labelledby="route-check-included-heading" className="mt-10">
          <h2 id="route-check-included-heading" className="text-2xl font-bold text-slate-950">
            Что входит
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {INCLUDED.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <Icon className="h-5 w-5 text-corridor-600" aria-hidden />
                <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="route-check-pdf-heading"
          className="mt-10 rounded-2xl border border-corridor-200 bg-corridor-50/60 p-6"
        >
          <h2 id="route-check-pdf-heading" className="text-2xl font-bold text-slate-950">
            Как выглядит PDF
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">
            Образец: IT-фрилансер из Белграда → Валенсия, DNV через консульство в Сербии. Таймлайн 5,5 месяцев, бюджет
            €6 330–8 630, {PDF_SECTIONS.length} разделов:
          </p>
          <ol className="mt-5 grid gap-2 sm:grid-cols-2">
            {PDF_SECTIONS.map(({ number, title }) => (
              <li key={number} className="flex items-baseline gap-3 text-sm text-slate-800">
                <span className="font-semibold text-corridor-700">{number}</span>
                <span>{title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link
              href="/ru/assist/sample-plan"
              className="inline-flex items-center gap-2 font-medium text-corridor-700 hover:underline"
            >
              Смотреть образец
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href={ROUTE_CHECK_PDF_PATH} className="font-medium text-corridor-700 hover:underline">
              Скачать PDF-пример
            </Link>
          </div>
        </section>

        <section
          aria-labelledby="route-check-audience-heading"
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 id="route-check-audience-heading" className="text-2xl font-bold text-slate-950">
            Кому подходит
          </h2>
          <ul className="mt-5 space-y-3">
            {AUDIENCE_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-corridor-600" aria-hidden />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            Если маршрут уже ясен, Route Check не нужен —{" "}
            <Link href="/ru/assist" className="font-medium text-corridor-700 hover:underline">
              бесплатный подбор специалиста через Emigro Assist
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="route-check-order-heading" className="mt-10">
          <h2 id="route-check-order-heading" className="text-2xl font-bold text-slate-950">
            Как заказать
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ORDER_STEPS.map(({ step, title, text }) => (
              <li key={step} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-corridor-100 text-sm font-bold text-corridor-700">
                  {step}
                </span>
                <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <TrackedAssistLink
              href={orderHref}
              placement="ru_route_check_steps"
              linkLabel="Открыть бота — Route Check"
              className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
            >
              <Clock className="h-4 w-4" aria-hidden />
              Открыть бота — Route Check
            </TrackedAssistLink>
            <TrackedAssistLink
              href="/ru/assist#assist-form-route-check"
              placement="ru_route_check_form"
              linkLabel="Форма на сайте"
              className="text-sm font-medium text-corridor-700 hover:underline"
            >
              Форма на сайте, если бот недоступен
            </TrackedAssistLink>
          </div>
        </section>

        <AssistPaymentMethods />

        <section
          aria-labelledby="route-check-disclaimer-heading"
          className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-6"
        >
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
            <div>
              <h2 id="route-check-disclaimer-heading" className="text-xl font-bold text-slate-950">
                Честная рамка
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Emigro не юридическая фирма и не гарантирует одобрение визы. Route Check помогает определить маршрут и
                риски до того, как вы платите за пакет услуг; юридическую часть ведёт партнёр, которого вы выбираете.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="route-check-faq-heading" className="mt-10">
          <h2 id="route-check-faq-heading" className="text-2xl font-bold text-slate-950">
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

        <section className="mt-10 rounded-2xl border border-corridor-200 bg-white p-6 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Готовы разобрать свой маршрут?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            €129 разово, оплата после согласования времени. PDF — в течение 48 часов после созвона.
          </p>
          <TrackedAssistLink
            href={orderHref}
            placement="ru_route_check_footer"
            linkLabel="Заказать Route Check — €129"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700"
          >
            Заказать Route Check — €129
          </TrackedAssistLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
