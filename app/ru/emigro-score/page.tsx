import Link from "next/link";
import { ArrowRight, BookOpen, Scale, ShieldAlert } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import {
  EMIGRO_SCORE_AXIS_DOCS,
  EMIGRO_SCORE_BASELINE_NOTE,
  EMIGRO_SCORE_PATH,
  listEmigroScoreCatalog,
} from "@/lib/emigro-score";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "Emigro Score — методология рейтинга стран для релокантов",
  description:
    "Как Emigro считает Score /100: оси Въезд, Статус, Банки, Налоги, Перспектива; база паспорт РФ; рубрика и таблица стран 2026. Не юридическая оценка.",
  path: EMIGRO_SCORE_PATH,
});

const TONE_PILL: Record<string, string> = {
  good: "bg-emerald-100 text-emerald-900",
  warn: "bg-amber-100 text-amber-900",
  critical: "bg-rose-100 text-rose-900",
};

export default function EmigroScoreMethodologyPage() {
  const catalog = listEmigroScoreCatalog();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Emigro Score" },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Что такое Emigro Score?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Редакционная оценка 0–100, насколько страна рабочая для типичного русскоязычного релоканта с удалённым доходом на горизонте 3–24 месяца. Не рейтинг «кайфа» и не юридическая гарантия.",
        },
      },
      {
        "@type": "Question",
        name: "Для какого паспорта считается Score?",
        acceptedAnswer: {
          "@type": "Answer",
          text: EMIGRO_SCORE_BASELINE_NOTE,
        },
      },
      {
        "@type": "Question",
        name: "Это как Nomad List?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Нет. Emigro Score не оценивает Wi‑Fi, тусовку или cost of living как lifestyle-индекс. Оси про въезд, легальный статус, банки, налоги и перспективу дальше.",
        },
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Все направления
          </Link>
          <span className="mx-2">/</span>
          <span>Emigro Score</span>
        </nav>

        <HeroShell visual={<HubHeroVisual />}>
          <p className="text-sm uppercase tracking-wide text-corridor-100">Методология · /100</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Emigro Score</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Редакционный рейтинг стран для релокантов: не «где веселее», а насколько реально въехать, легально
            остаться, открыть счёт и двигаться дальше.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#catalog"
              className="rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Таблица стран
            </a>
            <Link
              href="/ru#destinations"
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              К направлениям
            </Link>
          </div>
        </HeroShell>

        <section className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div className="text-sm leading-relaxed text-amber-950">
              <p className="font-semibold">Не юридическая и не налоговая консультация.</p>
              <p className="mt-1">
                Score — ориентир редакции Emigro. Пороги виз, work permit и банков меняются. Перед переездом
                сверяйте официальные источники и лицензированного специалиста. {EMIGRO_SCORE_BASELINE_NOTE}.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-corridor-600" />
            <h2 className="text-2xl font-semibold text-slate-900">Зачем это</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Сравнить на сетке",
                d: "Одно целое число /100 на карточке направления — сразу видно относительный порядок стран.",
              },
              {
                t: "Не путать с продуктом",
                d: "Раньше на плитках были «Покрытие / Wizard» — метрики полноты сайта. Score про страну, не про Emigro.",
              },
              {
                t: "Честная база",
                d: "Считаем медиану кейса с паспортом РФ и удалённым доходом, не Golden Visa на $500k.",
              },
            ].map((card) => (
              <div key={card.t} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900">{card.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Пять осей</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Каждая ось — целое 0–100 с шагом 10. Выше = лучше для релоканта. Overall — взвешенное среднее,
            округлённое до целого.
          </p>
          <div className="mt-6 space-y-4">
            {EMIGRO_SCORE_AXIS_DOCS.map((axis) => (
              <article key={axis.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{axis.label}</h3>
                  <span className="text-xs font-medium uppercase tracking-wide text-corridor-700">
                    вес {(axis.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{axis.blurb}</p>
                <table className="mt-4 w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3 font-medium">≈</th>
                      <th className="py-2 font-medium">Ориентир</th>
                    </tr>
                  </thead>
                  <tbody>
                    {axis.rubric.map((row) => (
                      <tr key={row.band} className="border-b border-slate-50 last:border-0">
                        <td className="py-2 pr-3 align-top font-semibold tabular-nums text-slate-800">{row.band}</td>
                        <td className="py-2 text-slate-600">{row.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Как считается overall</h2>
          <p className="mt-2 text-sm text-slate-600">
            Score /100 — взвешенное среднее пяти осей, округлённое до целого.
          </p>
          <ul className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100">
            {[
              { label: "Въезд", weight: "25%" },
              { label: "Статус", weight: "30%" },
              { label: "Банки", weight: "15%" },
              { label: "Налоги", weight: "15%" },
              { label: "Перспектива", weight: "15%" },
            ].map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <span className="font-medium text-slate-800">{row.label}</span>
                <span className="tabular-nums text-slate-500">{row.weight}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-900">≥75 зелёный</span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900">45–74 янтарный</span>
            <span className="rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-900">&lt;45 красный</span>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-900">Что Score не измеряет</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            <li>Климат, тусовку, Wi‑Fi и «кайф жизни» — это не lifestyle-индекс.</li>
            <li>Cost of living и зарплаты на локальном рынке.</li>
            <li>Индивидуальный кейс: другой паспорт, семья, оффер от работодателя могут сдвинуть картину.</li>
            <li>Юридическую гарантию одобрения визы или счёта в банке.</li>
          </ul>
        </section>

        <section id="catalog" className="mt-12 scroll-mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Текущие оценки</h2>
              <p className="mt-2 text-sm text-slate-600">Сортировка по overall · клик — страница направления</p>
            </div>
            <p className="text-xs text-slate-500">{catalog.length} стран · база РФ</p>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">Страна</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">Тезис</th>
                </tr>
              </thead>
              <tbody>
                {catalog.map((row, index) => (
                  <tr key={row.countryId} className="border-t border-slate-100">
                    <td className="px-4 py-3 tabular-nums text-slate-400">{index + 1}</td>
                    <td className="px-4 py-3">
                      <Link href={row.path} className="font-medium text-slate-900 hover:text-corridor-700">
                        <span aria-hidden>{row.flag} </span>
                        {row.countryRu}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-bold tabular-nums ${TONE_PILL[row.tone]}`}
                      >
                        {row.overall100}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                      <span className="line-clamp-2">{row.summary}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-corridor-700" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Дальше</h2>
              <p className="mt-2 text-sm text-slate-600">
                Score помогает выбрать хаб или коридор. Конкретный маршрут ВНЖ — через wizard и гайды.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/ru/wizard"
                  className="inline-flex items-center gap-1 rounded-lg bg-corridor-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-800"
                >
                  Wizard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/ru/guides"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:border-corridor-300"
                >
                  Гайды
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
