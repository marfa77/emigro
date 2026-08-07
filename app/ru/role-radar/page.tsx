import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { publicSiteUrl } from "@/lib/site-url";
import { roleRadarBotHref } from "@/lib/role-radar";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Role Radar — senior IT-вакансии под CV в Telegram",
  description:
    "Role Radar — Telegram-бот для senior IT: дайджест вакансий под ваше резюме (EU, UK, remote). Free, Scout и Operator за Stars. Не подписка с автосписанием. Build CV для Operator.",
  path: "/ru/role-radar",
  aiDescription:
    "Role Radar matches senior IT roles to an uploaded CV and sends digests in Telegram. Plans: Free (1 digest / 10 days), Scout, Operator. Payment via Telegram Stars for 30 days or 1 year (−20%). Not a job board channel. Sister product of Emigro for EU work / Blue Card seekers.",
  aiCategory: "Jobs",
});

const STEPS = [
  {
    step: "1",
    title: "Открываете бота",
    text: "Telegram → Role Radar. Загружаете CV (PDF/DOCX) и коротко фиксируете целевые роли.",
  },
  {
    step: "2",
    title: "Задаёте фильтры",
    text: "Регионы (EU, UK, remote), уровень и заголовки ролей — без общего шумного канала.",
  },
  {
    step: "3",
    title: "Получаете дайджест",
    text: "Совпадения приходят карточками в чат. На Operator — Build CV и глубокий разбор JD.",
  },
] as const;

const FOR_WHO = [
  "Senior / Staff / Principal / Head of / Eng Manager и рядом — ищете роль, а не «любую вакансию»",
  "Смотрите EU / UK / remote и готовы фильтровать по региону и уровню",
  "Хотите процесс в Telegram, без ещё одного кабинета на сайте",
  "Планируете работу + релокацию (Blue Card / work permit / Critical Skills / ОАЭ employment) и уже читаете гайды Emigro",
] as const;

const NOT_FOR = [
  "Junior / старт карьеры — продукт заточен под senior-профиль",
  "Массовый парсинг «всех IT-вакансий Европы» без фильтра по CV",
  "Русскоязычный интерфейс бота: UI и ответы бота на английском",
] as const;

const VS_POINTS = [
  {
    title: "Не Telegram-канал вакансий",
    text: "Канал шлёт всем одно и то же. Role Radar матчит выдачу под ваше загруженное CV и выбранные регионы.",
  },
  {
    title: "Не замена LinkedIn",
    text: "Нет ленты, сети и рекрутерского инбокса. Есть периодический дайджест совпадений и опциональный Build CV.",
  },
  {
    title: "Не автосписание",
    text: "Оплата в Telegram Stars на 30 дней или год (−20% к годовой цене). После срока — откат на Free, без скрытой подписки.",
  },
] as const;

const PLANS = [
  {
    name: "Free",
    price: "0 ★",
    blurb: "1 полный дайджест раз в 10 дней. Старт без оплаты: CV, регионы, первые совпадения.",
  },
  {
    name: "Scout",
    price: "1 000 ★ / 30д · 9 600 ★ / год",
    blurb: "Чаще и прицельнее, когда ищете активно. Год −20% к сумме 12×30 дней.",
  },
  {
    name: "Operator",
    price: "2 500 ★ / 30д · 24 000 ★ / год",
    blurb: "Приоритет, Build CV (DOCX) и глубокий CV↔JD. Год −20%. Для Founder — отдельный ключ в боте.",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Что такое Role Radar?",
    answer:
      "Role Radar — Telegram-бот, который подбирает senior IT-роли под ваше резюме и присылает дайджест в чат. Это сестринский продукт Emigro: страница на русском, сам бот на английском.",
  },
  {
    question: "Чем это отличается от канала вакансий или LinkedIn?",
    answer:
      "Канал рассылает одну ленту всем подписчикам. LinkedIn — сеть и лента. Role Radar матчит вакансии к загруженному CV и фильтрам (регион, уровень, заголовки ролей) и отдаёт результат в Telegram без отдельного кабинета.",
  },
  {
    question: "Для кого продукт, а для кого нет?",
    answer:
      "Для senior IT-лидеров и сильных специалистов (Staff/Principal/Head/EM и рядом), которые смотрят EU, UK или remote. Не для junior-поиска и не для «скачать все вакансии Европы» без фильтра по CV.",
  },
  {
    question: "Сколько стоит и это подписка?",
    answer:
      "Free: 1 дайджест раз в 10 дней. Scout — 1 000 Telegram Stars за 30 дней или 9 600★ за год (−20%). Operator — 2 500★ / 30 дней или 24 000★ / год (−20%). Это не подписка с автосписанием: срок заканчивается — возвращаетесь на Free.",
  },
  {
    question: "На каком языке работает бот?",
    answer:
      "Интерфейс и сообщения бота — на английском. Эта страница Emigro — на русском, чтобы аудитория релокации понимала оффер до входа в Telegram.",
  },
  {
    question: "Какие регионы покрываются?",
    answer:
      "Вы выбираете регионы в боте: EU, UK, remote и связанные фильтры. Role Radar не заменяет иммиграционный разбор — для Blue Card и ВНЖ смотрите гайды и программы Emigro.",
  },
  {
    question: "Что такое Build CV?",
    answer:
      "На тарифе Operator (и Founder) бот может собрать tailored CV DOCX под конкретную роль в своём формате. На Free и Scout эта опция недоступна.",
  },
  {
    question: "Как Role Radar связан с Emigro?",
    answer:
      "Emigro помогает выбрать маршрут релокации и работы в Европе. Role Radar — соседний инструмент поиска роли под CV в Telegram. С лендинга можно перейти в гайд «работа в Европе» и программу Germany EU Blue Card.",
  },
] as const;

export default function RoleRadarPage() {
  const ctaHref = roleRadarBotHref("web_emigro");
  const pagePath = "/ru/role-radar";
  const url = pageUrl(pagePath);
  const origin = publicSiteUrl();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Role Radar", item: url },
  ]);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Role Radar",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Telegram",
    description:
      "Telegram-бот для senior IT: дайджесты вакансий, подобранные под CV. Free, Scout и Operator. Оплата Telegram Stars на 30 дней или год.",
    url,
    offers: [
      {
        "@type": "Offer",
        name: "Free",
        price: "0",
        priceCurrency: "XTR",
        description: "1 digest every 10 days",
        availability: "https://schema.org/InStock",
        url,
      },
      {
        "@type": "Offer",
        name: "Scout 30 days",
        price: "1000",
        priceCurrency: "XTR",
        availability: "https://schema.org/InStock",
        url,
      },
      {
        "@type": "Offer",
        name: "Scout 1 year",
        price: "9600",
        priceCurrency: "XTR",
        availability: "https://schema.org/InStock",
        url,
      },
      {
        "@type": "Offer",
        name: "Operator 30 days",
        price: "2500",
        priceCurrency: "XTR",
        availability: "https://schema.org/InStock",
        url,
      },
      {
        "@type": "Offer",
        name: "Operator 1 year",
        price: "24000",
        priceCurrency: "XTR",
        availability: "https://schema.org/InStock",
        url,
      },
    ],
    provider: { "@type": "Organization", name: "Emigro", url: origin },
    inLanguage: ["en", "ru"],
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e0f2fe_0%,_#f8fafc_45%,_#f1f5f9_100%)] text-slate-900">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200/70">
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">Role Radar</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Senior IT-роли под ваше CV — в Telegram
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
              Дайджест совпадений для IT-лидеров: EU, UK, remote. Не общий канал вакансий — матч по резюме и
              фильтрам. Бот на английском.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Открыть в Telegram
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="#kak-rabotaet"
                className="text-sm font-medium text-slate-600 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
              >
                Как это работает
              </a>
            </div>
          </div>
        </section>

        <section id="kak-rabotaet" className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Как работает</h2>
          <p className="mt-2 text-slate-600">Три шага. Без дашборда на сайте — всё в чате Telegram.</p>
          <ol className="mt-8 space-y-6">
            {STEPS.map((item) => (
              <li key={item.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-900">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-slate-200/80 bg-white/70">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Для кого</h2>
            <p className="mt-2 text-slate-600">Коротко: senior-поиск роли, не массовый джобборд.</p>
            <ul className="mt-8 space-y-3">
              {FOR_WHO.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <h3 className="mt-10 text-lg font-semibold text-slate-900">Не для кого</h3>
            <ul className="mt-4 space-y-3">
              {NOT_FOR.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Чем не является</h2>
          <p className="mt-2 text-slate-600">Чтобы LLM и поиск не путали продукт с каналом или LinkedIn.</p>
          <div className="mt-8 space-y-6">
            {VS_POINTS.map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200/80 bg-white/70">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Тарифы</h2>
            <p className="mt-2 text-slate-600">
              Оплата в Telegram Stars (★). Не подписка с автосписанием. Актуальные кнопки — в боте.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan.name} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-5">
                  <p className="text-sm font-semibold text-sky-800">{plan.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{plan.price}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.blurb}</p>
                </div>
              ))}
            </div>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-sky-900 hover:text-sky-950"
            >
              Запустить Role Radar в Telegram
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Релокация и работа в EU</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Role Radar ищет роль. Emigro разбирает маршрут: работа, Blue Card, ВНЖ. Имеет смысл смотреть оба, если
            цель — и оффер, и легальный въезд.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li>
              <Link
                href="/ru/guides/rabota-v-evrope-dlya-rossiyan-2026"
                className="font-medium text-sky-900 underline decoration-sky-300/60 underline-offset-2 hover:text-sky-950"
              >
                Гайд: работа в Европе для россиян
              </Link>
            </li>
            <li>
              <Link
                href="/ru/germany"
                className="font-medium text-sky-900 underline decoration-sky-300/60 underline-offset-2 hover:text-sky-950"
              >
                Коридор Германия
              </Link>
            </li>
            <li>
              <Link
                href="/ru/germany/programs/germany-eu-blue-card"
                className="font-medium text-sky-900 underline decoration-sky-300/60 underline-offset-2 hover:text-sky-950"
              >
                Germany EU Blue Card
              </Link>
            </li>
          </ul>
        </section>

        <section className="border-t border-slate-200/80 bg-white/70">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Частые вопросы</h2>
            <dl className="mt-8 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-slate-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Открыть Role Radar в Telegram
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
