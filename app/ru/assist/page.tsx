import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { type AssistProviderOption } from "@/components/assist/AssistLeadForm";
import { QuickRequestForm } from "@/components/assist/QuickRequestForm";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { getAssistLeadProviders, PROVIDER_CATEGORY_LABELS_RU } from "@/lib/providers/registry";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { getAssistCountryOptions } from "@/lib/corridor/registry";
import { publicSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Подбор специалиста по переезду — бесплатно",
  description:
    "Оставьте имя и контакт — бесплатно подберём юриста или агентство под ваш случай: ВНЖ, виза, документы, сложные ситуации за границей. Паспорта RU/BY/UA/KZ.",
  path: "/ru/assist",
  aiDescription:
    "Emigro Assist: free matching with an immigration lawyer or agency for RU/BY/UA/KZ passport holders (name + contact is enough). Free for users: the chosen specialist pays Emigro a referral commission. Emigro (emigro.online) is a residence-route navigator; not affiliated with Emigro UG / Intermigro, Emigro Consulting (Doha), Emigro.co, or Emigro Pay. Not a law firm.",
  aiCategory: "assist",
});

const PRICE_SUMMARY = [
  { label: "Подбор специалиста", price: "€0", note: "юрист или агентство по стране и задаче" },
  { label: "Для вас", price: "Бесплатно", note: "комиссию Emigro платит специалист, не вы" },
  { label: "Контакт", price: "С согласия", note: "передаём только выбранному специалисту" },
] as const;

const AGENCY_COMPARISON = [
  {
    aspect: "Как платите",
    assist: "Emigro для вас бесплатен. Платите только выбранному специалисту — по его смете, если решите работать.",
    agency: "Обычно фиксированный пакет за весь процесс, часто с предоплатой до выбора маршрута.",
  },
  {
    aspect: "Выбор страны и визы",
    assist: "Сначала подбор маршрута по паспорту, доходу и семье, потом специалист под этот маршрут.",
    agency: "Пакет продаётся под программу, с которой агентство работает.",
  },
  {
    aspect: "Юридическая часть",
    assist: "Ведёт специалист, которого вы выбираете; его условия и цену обсуждаете напрямую.",
    agency: "Входит в пакет; состав услуг зависит от договора.",
  },
  {
    aspect: "Когда подходит",
    assist: "Маршрут ещё не выбран, нужен второй взгляд или помощь на одном застрявшем шаге.",
    agency: "Маршрут ясен и вы хотите передать весь процесс одной компании.",
  },
] as const;

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
    text: "Имя и контакт — этого достаточно. Если удобно, коротко опишите задачу.",
  },
  {
    step: "2",
    title: "Подбор",
    text: "Задаём пару вопросов о вашем случае (короткая анкета) и ищем специалиста по стране и задаче.",
  },
  {
    step: "3",
    title: "Знакомство",
    text: "С вашего согласия передаём запрос специалисту. Бесплатно, без продажи контакта случайным компаниям.",
  },
  {
    step: "4",
    title: "Работа",
    text: "Условия сопровождения и результат вы обсуждаете с партнёром напрямую.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Сколько стоит помощь с ВНЖ через Emigro?",
    answer:
      "Для вас — бесплатно. Emigro принимает запрос, уточняет детали и знакомит вас с профильным юристом или агентством. Услуги выбранного специалиста вы оплачиваете ему напрямую, по его смете и только если решите работать.",
  },
  {
    question: "На чём зарабатывает Emigro?",
    answer:
      "Если вы начинаете работать со специалистом, он платит Emigro комиссию из своего гонорара. Цена его услуг для вас от этого не меняется. Мы честно говорим об этом, чтобы было понятно, почему подбор бесплатный.",
  },
  {
    question: "Чем Emigro Assist отличается от агентства «под ключ»?",
    answer:
      "Агентство обычно продаёт фиксированный пакет под свою программу. Emigro сначала помогает понять подходящий маршрут, а затем знакомит со специалистом, который на нём работает. Перед оплатой попросите у специалиста смету по пунктам.",
  },
  {
    question: "Что будет после заявки?",
    answer:
      "Мы свяжемся с вами, при необходимости попросим заполнить короткую анкету о статусе, доходе и семье и передадим ваш случай подходящему специалисту — только с вашего согласия. Он свяжется с вами сам.",
  },
  {
    question: "Где оставить заявку?",
    answer:
      "В форме на этой странице или в Telegram-боте @emigro_chat_bot. Это бесплатно и ни к чему не обязывает.",
  },
  {
    question: "Emigro гарантирует получение визы?",
    answer:
      "Нет. Emigro не юридическая фирма и не иммиграционное агентство. Мы не несём ответственности за решения консульства или AIMA. Юридические услуги оказывает специалист напрямую.",
  },
] as const;

export default function AssistPage({
  searchParams,
}: {
  searchParams: { session?: string; country?: string; program?: string; provider?: string; source?: string };
}) {
  const providers: AssistProviderOption[] = getAssistLeadProviders().map((provider) => ({
    id: provider.id,
    name: provider.name,
    category: PROVIDER_CATEGORY_LABELS_RU[provider.category],
    corridorSlugs: provider.corridorSlugs ?? [],
  }));

  const origin = publicSiteUrl();
  const assistUrl = pageUrl("/ru/assist");
  // Keep where the visitor came from (guide, satellite, program) on the lead: "guide_<slug>" etc.
  const attributedSource =
    searchParams.source && /^[a-z0-9_.-]{1,140}$/i.test(searchParams.source) ? searchParams.source : undefined;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Emigro Assist" },
  ]);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Assist",
    description:
      "Сервис Emigro: бесплатный для пользователя подбор профильного юриста или агентства по ВНЖ, визе и релокации.",
    url: assistUrl,
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    areaServed: { "@type": "Place", name: "European Union" },
    offers: [
      {
        "@type": "Offer",
        name: "Подбор профильного специалиста",
        price: "0",
        priceCurrency: "EUR",
        url: assistUrl,
        availability: "https://schema.org/InStock",
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
          <p className="text-sm uppercase tracking-wide text-corridor-100">Emigro Assist</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Подберём специалиста по вашему переезду — бесплатно</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Оставьте имя и контакт: найдём юриста или агентство по стране и задаче и передадим запрос только с вашего
            согласия. Для вас это бесплатно — комиссию Emigro платит специалист.
          </p>
          <p className="mt-4 max-w-2xl rounded-lg border border-amber-200/60 bg-amber-50/95 px-4 py-3 text-sm leading-relaxed text-amber-950">
            Emigro (emigro.online) — навигатор по маршрутам ВНЖ; не связан с Emigro UG / Intermigro, Emigro
            Consulting (Доха), Emigro.co и Emigro Pay. Мы не юридическая фирма и не гарантируем визу или
            гражданство.
          </p>
          <dl className="mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {PRICE_SUMMARY.map(({ label, price, note }) => (
              <div key={label} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-corridor-100">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-white">{price}</dd>
                <dd className="mt-1 text-xs leading-snug text-corridor-100">{note}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#assist-form"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-corridor-900 hover:bg-corridor-50"
            >
              Оставить заявку — бесплатно
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </HeroShell>

        {/* Form right under the hero: on mobile it sat ~11 screens down, after pricing and FAQ, and
            visitors from «Найти специалиста» CTAs left before reaching it (2026-11-10). */}
        <section id="assist-form" className="mt-10 scroll-mt-24">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Оставить заявку</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-600">
                Имя и контакт — этого достаточно. Подберём специалиста бесплатно; контакт передаём только с вашего
                согласия.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <QuickRequestForm
              source={attributedSource ?? "emigro_assist"}
              countries={COUNTRY_OPTIONS}
              initialCountry={searchParams.country}
              programRoute={searchParams.program}
              sessionId={searchParams.session}
            />
          </div>
        </section>

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

        <section aria-labelledby="assist-vs-agency-heading" className="mt-10">
          <h2 id="assist-vs-agency-heading" className="text-2xl font-bold text-slate-950">
            Emigro Assist или агентство «под ключ»
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Цены агентств зависят от страны, программы и состава пакета. Перед оплатой просите смету по пунктам и
            сравнивайте с тем, какие шаги вам действительно нужны.
          </p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[10rem_1fr_1fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
              <span />
              <span>Emigro Assist</span>
              <span>Агентство «под ключ»</span>
            </div>
            <dl>
              {AGENCY_COMPARISON.map(({ aspect, assist, agency }) => (
                <div
                  key={aspect}
                  className="grid gap-2 border-b border-slate-100 px-5 py-4 last:border-b-0 sm:grid-cols-[10rem_1fr_1fr] sm:gap-4"
                >
                  <dt className="font-semibold text-slate-950">{aspect}</dt>
                  <dd className="text-sm leading-relaxed text-slate-700">
                    <span className="font-medium text-corridor-700 sm:hidden">Emigro: </span>
                    {assist}
                  </dd>
                  <dd className="text-sm leading-relaxed text-slate-600">
                    <span className="font-medium text-slate-800 sm:hidden">Агентство: </span>
                    {agency}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="sr-only" data-llm="commercial" aria-hidden="true">
          Emigro Assist 2026: free for users. Emigro matches the client with an immigration lawyer or agency; the
          specialist pays Emigro a referral commission, the client pays the specialist directly under the specialist&apos;s
          own terms. Emigro sells no paid services to users, is not a law firm and does not guarantee visa approval.
        </div>

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
                Emigro не юридическая фирма и не гарантирует одобрение визы. Мы бесплатно принимаем запрос и знакомим
                с профильным специалистом; стоимость его услуг вы обсуждаете напрямую. Если вы начинаете с ним работать,
                он платит Emigro комиссию — для вас цена не меняется.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="assist-flow-heading" className="mt-10">
          <h2 id="assist-flow-heading" className="text-2xl font-bold text-slate-950">
            Как это работает
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      </main>
      <SiteFooter />
    </>
  );
}
