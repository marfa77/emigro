import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarCheck, ExternalLink, Scale } from "lucide-react";
import {
  GOLDEN_VISA_LAST_CHECKED,
  GOLDEN_VISA_ROWS,
  PORTUGAL_2026_CALLOUT,
  PORTUGAL_2026_CALLOUT_NOTE,
  VERIFY_BADGE,
  investPagePath,
  type FactCell,
  type GoldenVisaRow,
  type InvestLocale,
  isVerifyOnly,
} from "@/lib/investment/golden-visa-2026";
import { INVEST_ASSIST_OFFERS } from "@/lib/investment/invest-seo";
import { INVEST_QUICK_ANCHOR } from "@/lib/investment/quick-lead";

const L = {
  ru: {
    lastChecked: "Последняя проверка",
    disclaimer: "Не юридическая консультация. Правила меняются — проверяйте по официальному источнику.",
    country: "Страна",
    minInvestment: "Мин. инвестиция",
    routes: "Маршруты",
    citizenship: "Срок до гражданства",
    ruBy: "Паспорта РФ/РБ",
    source: "Официальный источник",
    checked: "Проверено",
    closed: "закрыта",
    factsTitle: "Факты программы",
    compare: "Сравнить все программы →",
    calloutSources: "Источники",
    calloutGuide: "Разбор когорт ARI 2021–2022",
  },
  en: {
    lastChecked: "Last checked",
    disclaimer: "Not legal advice. Rules change — verify with the official source.",
    country: "Country",
    minInvestment: "Min investment",
    routes: "Routes",
    citizenship: "Time to citizenship",
    ruBy: "RU/BY passports",
    source: "Official source",
    checked: "Last checked",
    closed: "closed",
    factsTitle: "Programme facts",
    compare: "Compare all programmes →",
    calloutSources: "Sources",
    calloutGuide: "ARI 2021–2022 cohort breakdown (RU)",
  },
} as const;

export function VerifyBadge({ locale }: { locale: InvestLocale }) {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-wide text-amber-900 ring-1 ring-amber-200">
      {VERIFY_BADGE[locale]}
    </span>
  );
}

function Cell({ cell, locale }: { cell: FactCell; locale: InvestLocale }) {
  if (isVerifyOnly(cell, locale)) return <VerifyBadge locale={locale} />;
  return (
    <>
      {cell[locale]}
      {cell.verify ? <VerifyBadge locale={locale} /> : null}
    </>
  );
}

function CheckedValue({ row, locale }: { row: GoldenVisaRow; locale: InvestLocale }) {
  return row.lastChecked ? <time dateTime={row.lastChecked}>{row.lastChecked}</time> : <VerifyBadge locale={locale} />;
}

function Sources({ row }: { row: GoldenVisaRow }) {
  return (
    <ul className="space-y-1">
      {row.sources.map((source) => (
        <li key={source.url}>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-corridor-700 underline-offset-2 hover:underline"
          >
            {source.label}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LastCheckedLine({ locale, className = "" }: { locale: InvestLocale; className?: string }) {
  const t = L[locale];
  return (
    <div className={`flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-4 ${className}`}>
      <p className="inline-flex items-center gap-1.5 font-medium text-slate-800">
        <CalendarCheck className="h-4 w-4 text-corridor-600" />
        {t.lastChecked}: <time dateTime={GOLDEN_VISA_LAST_CHECKED}>{GOLDEN_VISA_LAST_CHECKED}</time>
      </p>
      <p className="inline-flex items-start gap-1.5">
        <Scale className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
        {t.disclaimer}
      </p>
    </div>
  );
}

/** Dated fact table for a single country page. */
export function GoldenVisaFactTable({ row, locale }: { row: GoldenVisaRow; locale: InvestLocale }) {
  const t = L[locale];
  const items: Array<[string, React.ReactNode]> = [
    [t.minInvestment, <Cell key="min" cell={row.minInvestment} locale={locale} />],
    [t.routes, <Cell key="routes" cell={row.routes} locale={locale} />],
    [t.citizenship, <Cell key="cit" cell={row.citizenship} locale={locale} />],
    [t.ruBy, <Cell key="ruby" cell={row.ruBy} locale={locale} />],
    [t.source, <Sources key="src" row={row} />],
    [t.checked, <CheckedValue key="checked" row={row} locale={locale} />],
  ];
  return (
    <section id="facts" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-slate-950">
        {row.flag} {row.country[locale]} · {row.programme[locale]}
        {row.status === "closed" ? (
          <span className="ml-2 rounded-full bg-rose-100 px-2.5 py-0.5 align-middle text-xs font-semibold text-rose-800">
            {t.closed}
          </span>
        ) : null}
      </h2>
      <table className="mt-4 w-full border-collapse text-sm">
        <caption className="sr-only">{t.factsTitle}</caption>
        <tbody>
          {items.map(([label, value]) => (
            <tr key={label} className="border-t border-slate-100 align-top">
              <th scope="row" className="w-1/3 py-2.5 pr-3 text-left font-medium text-slate-500 sm:w-1/4">
                {label}
              </th>
              <td className="py-2.5 leading-relaxed text-slate-800">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <LastCheckedLine locale={locale} className="mt-4 border-t border-slate-100 pt-4" />
    </section>
  );
}

/** Full comparison table (compare pages). Plain HTML so search and LLMs can cite it. */
export function GoldenVisaCompareTable({ locale }: { locale: InvestLocale }) {
  const t = L[locale];
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-[960px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {[t.country, t.minInvestment, t.routes, t.citizenship, t.ruBy, t.source, t.checked].map((head) => (
              <th key={head} scope="col" className="px-4 py-3 font-semibold">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {GOLDEN_VISA_ROWS.map((row) => (
            <tr key={row.slug} id={`row-${row.slug}`} className="border-t border-slate-100 align-top">
              <th scope="row" className="px-4 py-3 font-semibold text-slate-950">
                <Link href={investPagePath(locale, row.slug)} className="hover:text-corridor-700 hover:underline">
                  {row.flag} {row.country[locale]}
                </Link>
                <span className="mt-0.5 block text-xs font-normal text-slate-500">{row.programme[locale]}</span>
              </th>
              <td className="px-4 py-3 font-medium text-slate-900">
                <Cell cell={row.minInvestment} locale={locale} />
              </td>
              <td className="px-4 py-3 leading-relaxed text-slate-700">
                <Cell cell={row.routes} locale={locale} />
              </td>
              <td className="px-4 py-3 leading-relaxed text-slate-700">
                <Cell cell={row.citizenship} locale={locale} />
              </td>
              <td
                className={`px-4 py-3 leading-relaxed ${
                  row.ruBy.status === "restricted" ? "font-medium text-rose-800" : "text-slate-700"
                }`}
              >
                <Cell cell={row.ruBy} locale={locale} />
              </td>
              <td className="px-4 py-3 text-xs">
                <Sources row={row} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                <CheckedValue row={row} locale={locale} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Compact dated table for hubs: the full comparison lives on /invest/compare. */
export function GoldenVisaSummaryTable({ locale }: { locale: InvestLocale }) {
  const t = L[locale];
  return (
    <section id="facts" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <h2 className="text-xl font-bold text-slate-950">{locale === "en" ? "8 programmes at a glance" : "8 программ коротко"}</h2>
        <CompareAllLink locale={locale} />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="py-2 pr-3 font-semibold">{t.country}</th>
              <th scope="col" className="py-2 pr-3 font-semibold">{t.minInvestment}</th>
              <th scope="col" className="py-2 pr-3 font-semibold">{t.ruBy}</th>
              <th scope="col" className="py-2 font-semibold">{t.checked}</th>
            </tr>
          </thead>
          <tbody>
            {GOLDEN_VISA_ROWS.map((row) => (
              <tr key={row.slug} className="border-t border-slate-100 align-top">
                <th scope="row" className="py-2.5 pr-3 font-semibold text-slate-950">
                  <Link href={investPagePath(locale, row.slug)} className="hover:text-corridor-700 hover:underline">
                    {row.flag} {row.country[locale]}
                  </Link>
                </th>
                <td className="py-2.5 pr-3 text-slate-800">
                  <Cell cell={row.minInvestment} locale={locale} />
                </td>
                <td className={`py-2.5 pr-3 ${row.ruBy.status === "restricted" ? "font-medium text-rose-800" : "text-slate-700"}`}>
                  <Cell cell={row.ruBy} locale={locale} />
                </td>
                <td className="whitespace-nowrap py-2.5 text-slate-700">
                  <CheckedValue row={row} locale={locale} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <LastCheckedLine locale={locale} className="mt-4 border-t border-slate-100 pt-4" />
    </section>
  );
}

export function PortugalCallout({ locale }: { locale: InvestLocale }) {
  const t = L[locale];
  return (
    <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-relaxed text-amber-950 sm:p-6">
      <p className="flex gap-2.5">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <span>{PORTUGAL_2026_CALLOUT[locale]}</span>
      </p>
      <p className="mt-3 pl-7 text-amber-900">
        {PORTUGAL_2026_CALLOUT_NOTE[locale]}{" "}
        <Link
          href="/ru/guides/grazhdanstvo-portugalii-golden-visa-ari-2021-2022-2026"
          className="font-semibold underline"
        >
          {t.calloutGuide}
        </Link>
      </p>
      <p className="mt-3 pl-7 text-xs text-amber-900">
        {t.calloutSources}:{" "}
        <a
          href="https://vistos.mne.gov.pt/pt/ari-autorizacao-de-residencia-para-actividade-de-investimento"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          vistos.mne.gov.pt — ARI
        </a>
        {" · "}
        <a href="https://diariodarepublica.pt" target="_blank" rel="noopener noreferrer" className="underline">
          Diário da República n.º 95/2026
        </a>
      </p>
    </aside>
  );
}

const SPAIN_ALTERNATIVES = {
  ru: {
    title: "Что работает вместо Golden Visa",
    cards: [
      {
        title: "ВНЖ без права работы (no lucrativa)",
        text: "Пассивный доход или сбережения, без работы в Испании. Первичная подача — через консульство Испании.",
        href: "/ru/spain/programs/spain-non-lucrative",
      },
      {
        title: "Виза цифрового кочевника",
        text: "Удалённая работа на иностранного работодателя или клиентов; подача через UGE и/или консульство.",
        href: "/ru/spain/programs/spain-digital-nomad",
      },
      {
        title: "ВНЖ предпринимателя",
        text: "Инновационный бизнес-проект по закону о стартапах (Ley 14/2013 / 28/2022) с заключением ENISA.",
        href: "/ru/guides/vnj-ispaniya-2026",
      },
      {
        title: "Португалия: фондовый маршрут как EU-альтернатива",
        text: "ARI от €500 000 в квалифицированные фонды — ближайшая открытая инвест-программа на полуострове.",
        href: "/ru/invest/portugal",
      },
    ],
    cta: "Подобрать альтернативу Испании — бесплатно",
    source: "Источник: BOE-A-2025-76 (LO 1/2025), в силе с 03.04.2025.",
  },
  en: {
    title: "What works instead",
    cards: [
      {
        title: "Non-lucrative residence",
        text: "Passive income or savings, no work in Spain. The first application goes through a Spanish consulate.",
        href: "/ru/spain/programs/spain-non-lucrative",
      },
      {
        title: "Digital nomad visa",
        text: "Remote work for a foreign employer or clients; filed with UGE and/or a consulate.",
        href: "/ru/spain/programs/spain-digital-nomad",
      },
      {
        title: "Entrepreneur / startup residence",
        text: "An innovative business project under the startup law (Ley 14/2013 / 28/2022) with an ENISA report.",
        href: "/ru/guides/vnj-ispaniya-2026",
      },
      {
        title: "Portugal fund route as EU alternative",
        text: "ARI from €500,000 in qualifying funds — the nearest open investment programme on the peninsula.",
        href: "/en/invest/portugal",
      },
    ],
    cta: "Find my Spain alternative — free",
    source: "Source: BOE-A-2025-76 (LO 1/2025), in force 03.04.2025.",
  },
} as const;

export function SpainAlternatives({ locale }: { locale: InvestLocale }) {
  const t = SPAIN_ALTERNATIVES[locale];
  return (
    <section id="alternatives" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-slate-950">{t.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {t.cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-xl border border-slate-200 p-4 transition hover:border-corridor-300 hover:shadow-sm"
          >
            <h3 className="font-semibold text-slate-950 group-hover:text-corridor-800">{card.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{card.text}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-corridor-700">
              {locale === "en" && card.href.startsWith("/ru/") ? "Read (RU)" : locale === "en" ? "Open" : "Подробнее"}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
      <a
        href={`#${INVEST_QUICK_ANCHOR}`}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-corridor-700 px-5 py-3 font-semibold text-white hover:bg-corridor-800 sm:w-auto"
      >
        {t.cta} <ArrowRight className="h-4 w-4" />
      </a>
      <p className="mt-3 text-xs text-slate-500">
        <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2025-76" target="_blank" rel="noopener noreferrer" className="underline">
          {t.source}
        </a>
      </p>
    </section>
  );
}

export function CompareAllLink({ locale, className = "" }: { locale: InvestLocale; className?: string }) {
  return (
    <Link
      href={investPagePath(locale, "compare")}
      className={`inline-flex min-h-11 items-center gap-1 font-semibold text-corridor-700 hover:underline ${className}`}
    >
      {L[locale].compare}
    </Link>
  );
}

const ASSIST = {
  ru: {
    title: "Нужна помощь с маршрутом?",
    offers: [
      { name: "Подбор партнёра", price: "€0", note: "юрист или агентство по стране и задаче", href: INVEST_ASSIST_OFFERS.match.path },
      { name: "Route Check", price: "€129", note: "разово: созвон + PDF-маршрут за 48 часов", href: INVEST_ASSIST_OFFERS.routeCheck.path },
      { name: "Сопровождение", price: "€100/час", note: "переписка, письма, формы, разбор отказов", href: INVEST_ASSIST_OFFERS.hourly.path },
    ],
  },
  en: {
    title: "Need help with your route?",
    offers: [
      { name: "Partner match", price: "€0", note: "a lawyer or agency for your country and task", href: INVEST_ASSIST_OFFERS.match.path },
      { name: "Route Check", price: "€129", note: "one-off: call + PDF route within 48 hours", href: INVEST_ASSIST_OFFERS.routeCheck.path },
      { name: "Accompaniment", price: "€100/hour", note: "emails, letters, forms, refusal reviews", href: INVEST_ASSIST_OFFERS.hourly.path },
    ],
  },
} as const;

export function InvestAssistOffers({ locale }: { locale: InvestLocale }) {
  const t = ASSIST[locale];
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-slate-950">Emigro Assist · {t.title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {t.offers.map((offer) => (
          <Link
            key={offer.name}
            href={offer.href}
            className="rounded-xl border border-slate-200 p-4 transition hover:border-corridor-300 hover:shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">{offer.name}</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{offer.price}</p>
            <p className="mt-1 text-sm text-slate-600">{offer.note}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
