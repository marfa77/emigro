import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, Banknote, CheckCircle2, Clock, FileText, Route } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HeroShell } from "@/components/visuals/HeroShell";
import { HubHeroVisual } from "@/components/visuals/HubHeroVisual";
import { TRANSIT_HUBS, type TransitHub } from "@/lib/transit-hubs";
import { SITE_URL } from "@/lib/site-url";

type Props = {
  hub: TransitHub;
};

export function TransitHubLanding({ hub }: Props) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Emigro", item: `${SITE_URL}/ru` },
      { "@type": "ListItem", position: 2, name: hub.countryRu, item: `${SITE_URL}${hub.path}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${hub.countryRu}: транзитный хаб для первого шага`,
    description: hub.quickAnswer,
    inLanguage: "ru-RU",
    mainEntityOfPage: `${SITE_URL}${hub.path}`,
    publisher: {
      "@type": "Organization",
      name: "Emigro",
      url: SITE_URL,
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

  const otherHubs = TRANSIT_HUBS.filter((item) => item.slug !== hub.slug);

  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href="/ru" className="text-corridor-600 hover:underline">
            Все направления
          </Link>
          <span className="mx-2">/</span>
          <span>{hub.countryRu}</span>
        </nav>

        <HeroShell visual={<HubHeroVisual />}>
          <p className="text-sm uppercase tracking-wide text-corridor-100">Транзитный хаб · первый шаг</p>
          <h1 className="mt-2 text-4xl font-bold">
            {hub.flag} {hub.countryRu}: транзитный хаб на 3–12 месяцев
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-corridor-100">{hub.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ru/wizard"
              className="rounded-lg bg-white px-5 py-3 font-medium text-corridor-900 hover:bg-corridor-50"
            >
              Проверить EU-маршрут
            </Link>
            <Link
              href="/ru/contact"
              className="rounded-lg border border-white/40 px-5 py-3 font-medium text-white hover:bg-white/10"
            >
              Обсудить Emigro Assist
            </Link>
          </div>
        </HeroShell>

        <section className="mt-8 rounded-2xl border border-corridor-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Короткий ответ</p>
          <p className="mt-2 text-lg leading-relaxed text-slate-800">{hub.quickAnswer}</p>
          <p className="mt-3 text-sm text-slate-500">
            Это не EU-коридор для ВНЖ или гражданства. Хаб нужен, чтобы спокойно закрыть первые бытовые,
            финансовые и документальные задачи перед отдельным европейским маршрутом.
          </p>
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
                <h2 className="text-2xl font-semibold text-slate-900">Путь дальше в Европу</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">{hub.onwardEu}</p>
              <Link href="/ru/wizard" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-corridor-700 hover:underline">
                Проверить программы EU в wizard
                <ArrowRight className="h-4 w-4" />
              </Link>
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
              <h2 className="font-semibold text-slate-900">Другие транзитные хабы</h2>
              <div className="mt-3 space-y-2">
                {otherHubs.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.path}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700 hover:border-corridor-300 hover:text-corridor-700"
                  >
                    <span>
                      {item.flag} {item.countryRu}
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
