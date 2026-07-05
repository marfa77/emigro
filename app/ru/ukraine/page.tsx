import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, FileText, Route } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageMetadata, pageUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Украина → ЕС: временная защита и маршруты ВНЖ 2026",
  description:
    "Хаб для граждан Украины: Temporary Protection vs классический ВНЖ, коридоры Польша/Чехия/Германия, wizard подбора маршрута с учётом UA-паспорта. Emigro.",
  path: "/ru/ukraine",
  ogImage: "/images/og/corridor-germany.jpg",
  ogImageAlt: "Украина → ЕС: маршруты релокации Emigro",
});

const EU_CORRIDORS = [
  {
    flag: "🇵🇱",
    label: "Польша",
    hint: "TP + work permit, EU Blue Card, B2B IT",
    path: "/ru/poland",
    wizard: "/ru/poland/wizard",
  },
  {
    flag: "🇨🇿",
    label: "Чехия",
    hint: "TP + employee card, Blue Card, živnost IT",
    path: "/ru/czechia",
    wizard: "/ru/czechia/wizard",
  },
  {
    flag: "🇩🇪",
    label: "Германия",
    hint: "TP + Blue Card, Chancenkarte, family",
    path: "/ru/germany",
    wizard: "/ru/germany/wizard",
  },
] as const;

const RELATED_GUIDES = [
  {
    label: "Украина → ЕС: pillar-гайд 2026",
    href: "/ru/guides/ukraina-evropa-vnj-marshruty-2026",
    primary: true,
  },
  {
    label: "Временная защита vs ВНЖ (UA + BY)",
    href: "/ru/guides/ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026",
  },
  {
    label: "Куда переехать из России 2026 — обзор EU-коридоров",
    href: "/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj",
  },
  {
    label: "Первые 30 дней в Германии — чек-лист",
    href: "/ru/guides/pervye-30-dnej-v-germanii-2026",
  },
  {
    label: "Воссоединение семьи в Европе",
    href: "/ru/guides/vossoedinenie-semi-evropa-2026",
  },
] as const;

export default function UkraineHubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: "Украина → ЕС" },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Украина → ЕС: временная защита и маршруты ВНЖ",
    description:
      "Навигация для граждан Украины: сравнение Temporary Protection с классическими ВНЖ, коридоры Польша/Чехия/Германия и wizard подбора маршрута.",
    inLanguage: "ru-RU",
    mainEntityOfPage: pageUrl("/ru/ukraine"),
    publisher: { "@type": "Organization", name: "Emigro", url: pageUrl("/ru") },
  };

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Emigro
          </Link>
          <span className="mx-2">/</span>
          <span>Украина → ЕС</span>
        </nav>

        <HeroShell visual={<HubHeroVisual />} className="mt-6">
          <p className="text-sm uppercase tracking-wide text-corridor-100">Аудитория UA · не EU-коридор</p>
          <h1 className="mt-2 text-4xl font-bold">🇺🇦 Украина → ЕС: TP и маршруты ВНЖ</h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">
            Для граждан Украины часто доступна <strong>временная защита (TP)</strong> — быстрый легальный статус в
            Польше, Чехии, Германии и других странах ЕС. Для долгосрочного планирования (ПМЖ, гражданство) TP не
            заменяет классический ВНЖ — сравните оба пути.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ru/guides/ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              <BookOpen className="h-5 w-5" />
              TP vs ВНЖ — полный разбор
            </Link>
            <Link
              href="/ru/wizard"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              <Compass className="h-5 w-5" />
              Wizard (выберите паспорт UA)
            </Link>
          </div>
        </HeroShell>

        <section className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/60 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Temporary Protection vs ВНЖ — в двух словах</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-blue-100 bg-white p-4">
              <p className="font-semibold text-blue-900">Temporary Protection (TP)</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Быстрая регистрация после прибытия в ЕС</li>
                <li>Доступ к рынку труда (зависит от страны)</li>
                <li>Не ведёт напрямую к ПМЖ и гражданству</li>
                <li>Срок действия привязан к директиве ЕС</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-semibold text-slate-900">Классический ВНЖ</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Work permit, Blue Card, family, study</li>
                <li>Дольше оформление, но путь к ПМЖ</li>
                <li>Нужен employer / основание и документы</li>
                <li>Wizard Emigro проверяет пороги по программам</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Подробное сравнение, страны TP и когда переходить на ВНЖ:{" "}
            <Link
              href="/ru/guides/ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026"
              className="font-medium text-corridor-700 hover:underline"
            >
              гайд «Временная защита vs ВНЖ»
            </Link>
            .
          </p>
        </section>

        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <Route className="h-6 w-6 text-corridor-600" />
            Популярные EU-коридоры для UA
          </h2>
          <p className="mt-2 text-slate-600">
            Страны с большим числом украинских релокантов и параллельными маршрутами TP + work/study ВНЖ.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {EU_CORRIDORS.map((c) => (
              <article
                key={c.path}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl" aria-hidden>
                  {c.flag}
                </p>
                <h3 className="mt-2 font-semibold text-slate-900">{c.label}</h3>
                <p className="mt-1 flex-1 text-sm text-slate-500">{c.hint}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={c.path}
                    className="rounded-lg bg-corridor-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-corridor-800"
                  >
                    Коридор
                  </Link>
                  <Link
                    href={c.wizard}
                    className="rounded-lg border border-corridor-200 px-3 py-1.5 text-sm font-medium text-corridor-700 hover:bg-corridor-50"
                  >
                    Wizard
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900">
            <FileText className="h-6 w-6 text-corridor-600" />
            Гайды и материалы
          </h2>
          <ul className="mt-4 space-y-2">
            {RELATED_GUIDES.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-corridor-50 ${
                    "primary" in g && g.primary ? "font-semibold text-corridor-800" : "text-corridor-700"
                  }`}
                >
                  {g.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6 text-center sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Подберите EU-маршрут</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-600">
            В глобальном wizard выберите паспорт <strong>Украина (UA)</strong> — Emigro покажет подходящие программы
            по всем активным коридорам и напомнит про Temporary Protection.
          </p>
          <Link
            href="/ru/wizard"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-corridor-700 px-6 py-3 font-medium text-white hover:bg-corridor-800"
          >
            Открыть wizard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
