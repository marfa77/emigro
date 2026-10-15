import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { InvestQuickLead } from "@/components/investment/InvestQuickLead";
import {
  GoldenVisaCompareTable,
  InvestAssistOffers,
  LastCheckedLine,
} from "@/components/investment/InvestPageBlocks";
import { investPagePath, type InvestLocale } from "@/lib/investment/golden-visa-2026";
import type { InvestFaqItem } from "@/lib/investment/invest-en-copy";
import { goldenVisaDatasetSchema, investServiceSchema } from "@/lib/investment/invest-seo";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";

export const COMPARE_COPY = {
  ru: {
    title: "Сравнение Golden Visa 2026: Португалия, Италия, Греция и др. | Emigro",
    description:
      "Минимальные инвестиции, маршруты, срок до гражданства и доступность для паспортов РФ/РБ — с официальными источниками. Проверено 14.10.2026.",
    h1: "Golden Visa 2026: сравнение программ ВНЖ за инвестиции",
    intro:
      "8 программ в одной таблице: минимальная инвестиция, допустимые маршруты, срок до гражданства и что с паспортами РФ/РБ. У каждой строки — официальный источник и дата проверки; строки, которые ещё сверяются с первоисточником, помечены «уточняется».",
    aiDescription:
      "Golden Visa 2026 comparison (checked 2026-10-14): Portugal ARI €500K funds, citizenship 10y since 19.05.2026; Italy €250K–€2M, suspended for RU/BY; Greece €250K/€400K/€800K, RU/BY suspended (verify); Spain closed 03.04.2025; Thailand LTR US$500K + US$1M; UAE AED 2M property; Hungary €250K fund / €1M donation; Malta MPRP. Official sources per row.",
    back: "← Все инвестиционные маршруты",
    faqTitle: "Частые вопросы",
    pillar: "Подробный гайд: инвестиционный ВНЖ в Европе 2026",
    pillarHref: "/ru/guides/investitsionnyy-vnj-evropa-golden-visa-2026",
  },
  en: {
    title: "Golden Visa 2026 Comparison: Portugal, Italy, Greece & more | Emigro",
    description:
      "Minimum investment, routes, time to citizenship and RU/BY eligibility for 8 programmes — with official sources. Checked 14 Oct 2026.",
    h1: "Golden Visa 2026: investment residency programmes compared",
    intro:
      "Eight programmes in one table: minimum investment, qualifying routes, time to citizenship and what applies to Russian and Belarusian passports. Every row links to the official source and shows when it was checked; rows still being matched against the primary text are marked “being verified”.",
    aiDescription:
      "Golden Visa 2026 comparison (checked 2026-10-14): Portugal ARI €500K funds, citizenship 10y since 19.05.2026; Italy €250K–€2M, suspended for RU/BY; Greece €250K/€400K/€800K, RU/BY suspended (verify); Spain closed 03.04.2025; Thailand LTR US$500K + US$1M; UAE AED 2M property; Hungary €250K fund / €1M donation; Malta MPRP. Official sources per row.",
    back: "← All investment routes",
    faqTitle: "FAQ",
    pillar: "In-depth guide (Russian): investment residency in Europe 2026",
    pillarHref: "/ru/guides/investitsionnyy-vnj-evropa-golden-visa-2026",
  },
} as const;

export const COMPARE_FAQ: Record<InvestLocale, InvestFaqItem[]> = {
  ru: [
    {
      question: "Португальская Golden Visa ещё открыта в 2026?",
      answer:
        "Да. Программа ARI принимает заявки, но недвижимость и перевод капитала €1,5 млн исключены с октября 2023. Основной маршрут — от €500 000 в квалифицированные португальские фонды. С 19.05.2026 до гражданства 10 лет (7 лет для граждан ЕС и CPLP).",
    },
    {
      question: "Испанская Golden Visa закрыта?",
      answer:
        "Да. Виза инвестора отменена с 03.04.2025 (LO 1/2025, BOE-A-2025-76). Вместо неё смотрят ВНЖ без права работы (no lucrativa), визу цифрового кочевника, ВНЖ предпринимателя или фондовый маршрут Португалии.",
    },
    {
      question: "Какие Golden Visa доступны с паспортом РФ?",
      answer:
        "Португалия (ARI) и Таиланд (LTR) граждан РФ/РБ законом не исключают, но банки и фонды проводят усиленную проверку происхождения средств. Италия приостановила Investor Visa для РФ/РБ; Греция и Мальта сейчас не принимают новые заявки РФ/РБ (циркуляр Минмиграции Греции от 21.04.2026; FAQ Residency Malta). По ОАЭ и Венгрии — уточняется.",
    },
    {
      question: "Какая Golden Visa самая дешёвая в 2026?",
      answer:
        "На бумаге ниже всего пороги в Венгрии (€250 000 в паи фонда недвижимости), Италии (€250 000 в инновационный стартап) и Греции (€250 000 — только перевод коммерческого объекта в жильё или реставрация). Для паспортов РФ/РБ Италия и Греция закрыты, поэтому реальный минимум зависит от паспорта.",
    },
    {
      question: "Можно ли в 2026 получить ВНЖ ЕС за покупку недвижимости?",
      answer:
        "Из программ ЕС в таблице только в Греции покупка недвижимости сама по себе — квалифицирующая инвестиция. Мальта (MPRP) требует купить или арендовать жильё плюс государственные взносы. Португалия убрала недвижимость в 2023, Испания закрыла программу в 2025, Венгрия отменила вариант с квартирой до запуска.",
    },
  ],
  en: [
    {
      question: "Is Portugal golden visa still open in 2026?",
      answer:
        "Yes. ARI still accepts applications, but real estate and the €1.5M capital transfer were removed in October 2023. The main route is €500,000+ in qualifying Portuguese funds. Since 19 May 2026 citizenship takes 10 years (7 for EU and CPLP nationals).",
    },
    {
      question: "Is Spain golden visa closed?",
      answer:
        "Yes. Spain abolished its investor visa on 3 April 2025 (LO 1/2025, BOE-A-2025-76). Alternatives are the non-lucrative residence, the digital nomad visa, entrepreneur residence or Portugal's fund route.",
    },
    {
      question: "Which golden visas are open to Russian passports?",
      answer:
        "Portugal (ARI) and Thailand (LTR) do not exclude RU/BY citizens by law, though banks and funds run enhanced source-of-funds checks. Italy suspended its Investor Visa for RU/BY; Greece and Malta currently do not accept new RU/BY applications (Greek ministry circular of 21.04.2026; Residency Malta FAQ). The UAE and Hungary are being verified.",
    },
    {
      question: "What is the cheapest golden visa in 2026?",
      answer:
        "On paper the lowest thresholds are Hungary (€250,000 in real-estate fund units), Italy (€250,000 in an innovative startup) and Greece (€250,000, only for commercial-to-residential conversion or restoration). Italy and Greece are closed to RU/BY passports, so the realistic floor depends on your passport.",
    },
    {
      question: "Does buying property still give EU residence in 2026?",
      answer:
        "Among the EU programmes in the table, Greece is the only one where buying property is itself the qualifying investment. Malta MPRP requires buying or renting a home on top of government contributions. Portugal removed property in 2023, Spain closed its programme in 2025 and Hungary withdrew its property option before launch.",
    },
  ],
};

export function GoldenVisaComparePage({ locale }: { locale: InvestLocale }) {
  const t = COMPARE_COPY[locale];
  const faq = COMPARE_FAQ[locale];
  const faqSchema = buildFaqSchema(faq);

  return (
    <>
      <SiteHeader locale={locale === "en" ? "en" : "ru"} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(goldenVisaDatasetSchema(locale)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(investServiceSchema(locale)) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-3 sm:py-8">
        <Link
          href={investPagePath(locale, "hub")}
          className="inline-flex min-h-11 items-center text-sm font-medium text-corridor-700 hover:underline sm:min-h-0"
        >
          {t.back}
        </Link>

        <div className="mt-2 grid gap-5 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
          <header className="lg:self-start">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{t.h1}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-lg">{t.intro}</p>
            <LastCheckedLine locale={locale} className="mt-4 hidden sm:flex" />
          </header>
          <InvestQuickLead locale={locale} pageKey="compare" variant="compare" className="lg:self-start" />
        </div>

        <LastCheckedLine locale={locale} className="mt-8 sm:hidden" />
        <section id="table" className="mt-4 scroll-mt-24 sm:mt-10">
          <GoldenVisaCompareTable locale={locale} />
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">{t.faqTitle}</h2>
          <div className="mt-4 space-y-4">
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-medium text-slate-900">{item.question}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-6 text-sm">
          <Link href={t.pillarHref} className="font-semibold text-corridor-700 hover:underline">
            {t.pillar} →
          </Link>
        </p>

        <div className="mt-10">
          <InvestAssistOffers locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale === "en" ? "en" : "ru"} />
    </>
  );
}
