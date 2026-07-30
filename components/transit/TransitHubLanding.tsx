import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Banknote, BookOpen, CheckCircle2, Clock, FileText, Globe2, Route } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import { getHubsByKind, hubKindLabel, type TransitHub } from "@/lib/transit-hubs";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";
import { pageUrl } from "@/lib/seo";

const EU_CORRIDORS = [
  { slug: "portugal", label: "Португалия", flag: "🇵🇹", path: "/ru/portugal" },
  { slug: "spain", label: "Испания", flag: "🇪🇸", path: "/ru/spain" },
  { slug: "france", label: "Франция", flag: "🇫🇷", path: "/ru/france" },
  { slug: "germany", label: "Германия", flag: "🇩🇪", path: "/ru/germany" },
  { slug: "italy", label: "Италия", flag: "🇮🇹", path: "/ru/italy" },
  { slug: "netherlands", label: "Нидерланды", flag: "🇳🇱", path: "/ru/netherlands" },
  { slug: "greece", label: "Греция", flag: "🇬🇷", path: "/ru/greece" },
  { slug: "cyprus", label: "Кипр", flag: "🇨🇾", path: "/ru/cyprus" },
  { slug: "hungary", label: "Венгрия", flag: "🇭🇺", path: "/ru/hungary" },
  { slug: "malta", label: "Мальта", flag: "🇲🇹", path: "/ru/malta" },
  { slug: "bulgaria", label: "Болгария", flag: "🇧🇬", path: "/ru/bulgaria" },
  { slug: "croatia", label: "Хорватия", flag: "🇭🇷", path: "/ru/croatia" },
  { slug: "slovenia", label: "Словения", flag: "🇸🇮", path: "/ru/slovenia" },
  { slug: "estonia", label: "Эстония", flag: "🇪🇪", path: "/ru/estonia" },
];

const TRANSIT_DESTINATION_GUIDES = [
  { label: "Как выбрать страну для ВНЖ — 2026", href: "/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj" },
  { label: "ВНЖ без работы: пассивный доход и сбережения", href: "/ru/guides/vnj-bez-raboty-passivnyy-dohod-sberezheniya-2026" },
  { label: "ВНЖ Греция 2026: Digital Nomad, FIP, Golden Visa", href: "/ru/guides/vnj-gretsiya-2026-digital-nomad-fip-golden-visa" },
  { label: "ВНЖ Кипр 2026: Digital Nomad, Category F, Non-Dom", href: "/ru/guides/vnj-kipr-2026-digital-nomad-fip-non-dom" },
  { label: "ВНЖ Венгрия 2026: White Card, Guest Investor", href: "/ru/guides/vnj-vengriya-2026-white-card-guest-investor" },
  { label: "ВНЖ Мальта 2026: NRP, MPRP, Non-Dom", href: "/ru/guides/vnj-malta-2026-nomad-mprp-non-dom" },
  { label: "ВНЖ Болгария 2026: Type D, DN, EOOD", href: "/ru/guides/vnj-bolgariya-2026-type-d-digital-nomad-eood" },
  { label: "ВНЖ Хорватия 2026: Digital Nomad", href: "/ru/guides/vnj-horvatiya-2026-digital-nomad" },
  { label: "ВНЖ Словения 2026: Digital Nomad + s.p.", href: "/ru/guides/vnj-sloveniya-2026-digital-nomad-sp" },
  { label: "Эстония 2026: Digital Nomad Visa + e-Residency", href: "/ru/guides/vnj-estoniya-2026-digital-nomad-e-residency" },
  { label: "Португалия vs Испания: что выбрать в 2026", href: "/ru/guides/portugaliya-vs-ispaniya-vnj-2026" },
  { label: "D7 vs Digital Nomad: полное сравнение", href: "/ru/guides/d7-vs-digital-nomad-visa-sravnenie" },
];

const SETTLE_DESTINATION_GUIDES = [
  { label: "ЮАР 2026: Critical Skills, школы, MBA UCT GSB", href: "/ru/guides/yuar-dlya-rossiyan-ukraintsev-belorusov-kazahstantsev-2026" },
  { label: "Таиланд для россиян 2026 — LTR, Elite, DTV", href: "/ru/guides/tailand-dlya-rossiyan-2026" },
  { label: "Бали / Индонезия для россиян 2026", href: "/ru/guides/bali-indoneziya-dlya-rossiyan-2026" },
  { label: "ОАЭ для россиян 2026 — резиденция, бизнес, банки", href: "/ru/guides/oae-dlya-rossiyan-2026" },
  { label: "Турция для россиян 2026 — ikamet, банки", href: "/ru/guides/turciya-dlya-rossiyan-2026" },
  { label: "Как выбрать страну для ВНЖ — 2026", href: "/ru/guides/kuda-pereehat-iz-rossii-2026-evropa-vnj" },
];

type Props = {
  hub: TransitHub;
};

export function TransitHubLanding({ hub }: Props) {
  const isSettle = hub.kind === "settle";
  const heroTitle =
    hub.heroTitle ??
    (isSettle ? `${hub.countryRu}: страна для жизни` : `${hub.countryRu}: транзитный хаб на 3–12 месяцев`);
  const eyebrow = hub.eyebrow ?? (isSettle ? "Страна для жизни · вне ЕС" : "Транзитный хаб · первый шаг");
  const articleHeadline =
    hub.articleHeadline ??
    (isSettle ? `${hub.countryRu}: страна для жизни вне ЕС` : `${hub.countryRu}: транзитный хаб для первого шага`);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Все направления", item: pageUrl("/ru") },
    { name: hub.countryRu },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleHeadline,
    description: hub.quickAnswer,
    inLanguage: "ru-RU",
    mainEntityOfPage: pageUrl(hub.path),
    publisher: {
      "@type": "Organization",
      name: "Emigro",
      url: pageUrl("/ru"),
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const otherHubs = getHubsByKind(hub.kind).filter((item) => item.slug !== hub.slug);
  const relatedGuides = isSettle ? SETTLE_DESTINATION_GUIDES : TRANSIT_DESTINATION_GUIDES;

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="sr-only" aria-label="AI description">
        <h2>ai:description</h2>
        <p>{hub.quickAnswer}</p>
        <p>{hub.llmSummary}</p>
        <a href="/llms.txt">llms.txt</a>
      </section>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Все направления
          </Link>
          <span className="mx-2">/</span>
          <span>{hub.countryRu}</span>
        </nav>

        <HeroShell visual={<HubHeroVisual />}>
          <p className="text-sm uppercase tracking-wide text-corridor-100">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {hub.flag} {heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">{hub.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {hub.guideHref ? (
              <Link
                href={hub.guideHref}
                className="rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
              >
                {isSettle ? "Читать pillar-гайд" : "Гайд по направлению"}
              </Link>
            ) : (
              <Link
                href="/ru/wizard"
                className="rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
              >
                Проверить EU-маршрут
              </Link>
            )}
            <Link
              href={isSettle ? "/ru/wizard" : "/ru/assist"}
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              {isSettle ? "Опционально: EU wizard" : "Route Check — €129"}
            </Link>
          </div>
        </HeroShell>

        <section className="mt-8 rounded-2xl border border-corridor-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Короткий ответ</p>
          <p className="mt-2 text-lg leading-relaxed text-slate-800">{hub.quickAnswer}</p>
          <p className="mt-3 text-sm text-slate-500">
            {isSettle
              ? "Это не EU-коридор Emigro. Направление в категории «Страны для жизни»: долгий статус, быт и интеграция вне Европы. EU-маршрут — опция, не обязательная цель."
              : "Это не EU-коридор для ВНЖ или гражданства. Хаб нужен, чтобы спокойно закрыть первые бытовые, финансовые и документальные задачи перед отдельным европейским маршрутом."}
          </p>
          {hub.guideHref && hub.guideAnchor && (
            <Link
              href={hub.guideHref}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-corridor-200 bg-corridor-50 px-4 py-2.5 text-sm font-medium text-corridor-800 hover:border-corridor-400 hover:bg-corridor-100"
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              {hub.guideAnchor}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          )}
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <InfoCard icon={<Clock className="h-5 w-5" />} title="Горизонт пребывания" text={hub.stayHorizon} />
          <InfoCard icon={<Banknote className="h-5 w-5" />} title="Бюджет" text={hub.costRange} />
          <InfoCard icon={<AlertTriangle className="h-5 w-5" />} title="Риски" text={hub.riskSummary} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {hub.sections.map((section) => (
              <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Route className="h-5 w-5 text-corridor-600" />
                <h2 className="text-2xl font-semibold text-slate-900">
                  {isSettle ? "Если позже нужен Европа" : "Путь дальше в Европу"}
                </h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{hub.onwardEu}</p>
              <Link
                href="/ru/wizard"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-corridor-700 hover:underline"
              >
                {isSettle ? "Опционально: программы EU в wizard" : "Проверить программы EU в wizard"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white p-6">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-corridor-600" />
                <h2 className="text-2xl font-semibold text-slate-900">
                  {isSettle ? "Сравните с EU-коридорами" : "Следующий шаг: выбери страну назначения"}
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {isSettle
                  ? `${hub.countryRu} — страна для жизни вне ЕС. Если цель всё же европейский ВНЖ — сравните коридоры ниже.`
                  : `${hub.countryRu} — транзитный хаб, а не финальная цель. Выберите EU-коридор для постоянного ВНЖ.`}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EU_CORRIDORS.map((corridor) => (
                  <Link
                    key={corridor.slug}
                    href={corridor.path}
                    className="flex items-center gap-2 rounded-xl border border-corridor-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 shadow-sm transition-colors hover:border-corridor-400 hover:text-corridor-700"
                  >
                    <span className="text-base">{corridor.flag}</span>
                    <span>{corridor.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <BookOpen className="h-4 w-4 text-corridor-600" />
                  {isSettle ? "Гайды по странам для жизни и EU" : "Полезные гайды по выбору страны"}
                </div>
                <div className="mt-2 space-y-1.5">
                  {relatedGuides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      className="flex items-center gap-1.5 text-sm text-corridor-700 hover:underline"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                      {guide.label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
              <div className="mt-4 space-y-4">
                {hub.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-corridor-600" />
                <h2 className="font-semibold text-slate-900">LLM-summary</h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{hub.llmSummary}</p>
            </section>

            <ServiceProvidersSection
              placement="transit_hub_landing"
              topicKey={hub.slug}
              variant="compact"
              title="Emigro Assist"
            />

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold text-slate-900">
                {isSettle ? "Другие страны для жизни" : "Другие транзитные хабы"}
              </h2>
              <div className="mt-3 space-y-2">
                {otherHubs.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.path}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-corridor-300 hover:text-corridor-700"
                  >
                    <span>
                      {item.flag} {item.countryRu}
                      <span className="ml-1.5 text-xs text-slate-400">{hubKindLabel(item.kind)}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 text-corridor-700">
        {icon}
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{text}</p>
    </article>
  );
}
