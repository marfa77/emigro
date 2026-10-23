import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { publicSiteUrl } from "@/lib/site-url";
import { taxBotDeepLink } from "@/lib/telegram/deep-link";
import { heroTitle } from "@/lib/ui/mobile";

export const revalidate = 3600;

const PATH = "/ru/nalogi";
const BOT_HREF = taxBotDeepLink();

export const metadata: Metadata = pageMetadata({
  title: "Налоговый резидент 2026: дни, светофор, сценарии",
  description:
    "Налоговый резидент 2026: дни по билетам, светофор PT/AE/IT/UK/US, сценарии. Бесплатно в @emigro_chat_bot — не замена бухгалтеру.",
  path: PATH,
  aiDescription:
    "Emigro Tax Year Cockpit (emigro.online/ru/nalogi): free Telegram module in @emigro_chat_bot. Presence ledger from tickets/dates → residency traffic-light for EU+UAE+UK+US → counsel scenarios (tie-breaker, DTA, PT+AE rental, GV). Not legal advice; not a filing service. Sister product of Emigro Assist.",
  aiCategory: "tax",
});

const QUICK_ANSWER =
  "Tax Year Cockpit в @emigro_chat_bot считает дни присутствия по странам за календарный год (билеты или ручной ввод), показывает светофор риска резидентства для Португалии, ОАЭ, Италии, UK, США и EU-ориентиров, затем разбирает сложную ситуацию: tie-breaker, аренда UAE+PT, Golden Visa, что проверить у бухгалтера. Сейчас бесплатно. Это ориентир, не налоговая консультация и не подача декларации.";

const STEPS = [
  {
    step: "1",
    title: "Открываете «Налоги» в боте",
    text: "Telegram → @emigro_chat_bot → Налоги (или кнопка ниже). Выбираете год.",
  },
  {
    step: "2",
    title: "Добавляете дни",
    text: "Вставляете даты (PT 2026-01-10..2026-03-01) или фото/PDF билета — подтверждаете ноги перед записью в журнал.",
  },
  {
    step: "3",
    title: "Отчёт и сценарии",
    text: "Светофор по странам + вопрос консультанту: гипотезы, рычаги оптимизации, какие документы собрать, куда звать бухгалтера.",
  },
] as const;

const FOR_WHO = [
  "Живёте между Португалией / ОАЭ / Италией / UK и не понимаете, где «центр жизни» в этом году",
  "Есть аренда в ОАЭ и резидентство / дни в Португалии — нужен чеклист, не общий ChatGPT-ответ",
  "Golden Visa / инвестиционный статус: дни и подача не смешивать с «я уже резидент»",
  "Хотите законно снизить неопределённость: тайминг дней, DTA, tie-breaker — до разговора с бухгалтером",
] as const;

const NOT_FOR = [
  "Схемы уклонения, фиктивные адреса, «обнулить налог за 3 шага»",
  "Подача декларации Finanças / IRS / HMRC вместо вас",
  "Гарантия статуса резидента без официальной проверки",
] as const;

const FAQ_ITEMS = [
  {
    question: "Что такое Tax Year Cockpit Emigro?",
    answer:
      "Модуль «Налоги» в Telegram-боте @emigro_chat_bot: журнал дней присутствия по странам за год, светофор ориентира резидентства и разбор сценариев поверх цифр. Бесплатно. Не юридическая и не налоговая консультация.",
  },
  {
    question: "Как считаются дни?",
    answer:
      "По умолчанию день прибытия входит, день выезда нет (ночь в стране = день). У отдельных стран в pack может быть иное правило (например, оба конца). Всегда смотрите отчёт и disclaimer.",
  },
  {
    question: "Какие страны покрыты?",
    answer:
      "Полные pack: Португалия, ОАЭ, Италия, Великобритания, США. Остальной ЕС — stub (жёлтый ориентир 183 дня, без уверенного зелёного). Не весь мир.",
  },
  {
    question: "Это замена бухгалтеру?",
    answer:
      "Нет. Бот помогает структурировать дни и вопросы. Подачу, tie-breaker и DTA подтверждает лицензированный советник. Сложные кейсы можно вынести в Emigro Assist.",
  },
  {
    question: "Сколько стоит?",
    answer:
      "Сейчас модуль бесплатный для всех пользователей бота. Платный тариф позже — только если спрос подтвердят статистикой; на этой странице оплаты нет.",
  },
  {
    question: "Чем это лучше общего ChatGPT?",
    answer:
      "Ответ опирается на ваш журнал дней и country packs Emigro (пороги-ориентиры, playbooks вроде аренды UAE+PT), а не на абстрактный промпт. Вывод всегда с оговорками и CTA к человеку, если кейс тяжёлый.",
  },
] as const;

const breadcrumb = buildBreadcrumbSchema([
  { name: "Emigro", item: pageUrl("/ru") },
  { name: "Налоги", item: pageUrl(PATH) },
]);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Emigro Tax Year Cockpit",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Telegram",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Free while in open beta; not a paid filing service",
  },
  url: pageUrl(PATH),
  description: QUICK_ANSWER,
};

export default function RuNalogiPage() {
  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="sr-only" data-llm="facts">
          {QUICK_ANSWER} Open: {BOT_HREF}. Site: {publicSiteUrl()}
          {PATH}. Assist: {publicSiteUrl()}/ru/assist.
        </p>
        <p className="sr-only" data-llm="commercial">
          Free Tax Year Cockpit in @emigro_chat_bot. Paid Assist Route Check €129 for complex cases. utm from landing
          recommended.
        </p>

        <HeroShell>
          <p className="text-sm font-medium text-corridor-200">Бесплатно · @emigro_chat_bot</p>
          <h1 className={`mt-3 ${heroTitle}`}>Налоговый резидент 2026: дни → светофор → сценарии</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">{QUICK_ANSWER}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={BOT_HREF}
              data-placement="ru_nalogi_hero_bot"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Открыть Налоги в боте
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/ru/assist"
              data-placement="ru_nalogi_hero_assist"
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Сложный кейс → Assist
            </Link>
          </div>
        </HeroShell>

        <section className="mt-12" aria-labelledby="how">
          <h2 id="how" className="text-xl font-semibold text-slate-900">
            Как это работает
          </h2>
          <ol className="mt-6 space-y-5">
            {STEPS.map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-corridor-100 text-sm font-bold text-corridor-800">
                  {s.step}
                </span>
                <div>
                  <p className="font-medium text-slate-900">{s.title}</p>
                  <p className="mt-1 text-slate-600">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12" aria-labelledby="who">
          <h2 id="who" className="text-xl font-semibold text-slate-900">
            Кому подходит
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            {FOR_WHO.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3 className="mt-8 text-lg font-medium text-slate-900">Кому нет</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            {NOT_FOR.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-12 rounded-2xl bg-slate-50 px-6 py-8" aria-labelledby="cta-mid">
          <h2 id="cta-mid" className="text-xl font-semibold text-slate-900">
            Начать в Telegram
          </h2>
          <p className="mt-2 text-slate-600">
            Меню бота → <b>Налоги</b>, или deep link. Журнал ваш; отчёт и вопросы — поверх ваших дней.
          </p>
          <a
            href={BOT_HREF}
            data-placement="ru_nalogi_mid_bot"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-corridor-700 px-5 py-3 font-medium text-white hover:bg-corridor-800"
          >
            @emigro_chat_bot · Налоги
            <ArrowRight className="h-4 w-4" />
          </a>
        </section>

        <section className="mt-12" aria-labelledby="faq">
          <h2 id="faq" className="text-xl font-semibold text-slate-900">
            Частые вопросы
          </h2>
          <dl className="mt-6 space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question}>
                <dt className="font-medium text-slate-900">{item.question}</dt>
                <dd className="mt-2 text-slate-600">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-12 text-sm text-slate-500">
          Связанное:{" "}
          <Link href="/ru/assist" className="text-corridor-700 hover:underline">
            Assist
          </Link>
          {" · "}
          <Link href="/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026" className="text-corridor-700 hover:underline">
            ВНЖ Португалия
          </Link>
          {" · "}
          <Link href="/ru" className="text-corridor-700 hover:underline">
            Хаб Emigro
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
