import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { InvestmentQualifier } from "@/components/investment/InvestmentQualifier";
import { InvestQuickLead } from "@/components/investment/InvestQuickLead";
import {
  CompareAllLink,
  GoldenVisaSummaryTable,
  InvestAssistOffers,
} from "@/components/investment/InvestPageBlocks";
import { GOLDEN_VISA_ROWS, investPagePath } from "@/lib/investment/golden-visa-2026";
import { INVEST_EN_COUNTRY, INVEST_EN_HUB, INVEST_EN_HUB_FAQ } from "@/lib/investment/invest-en-copy";
import { investMetadata, investServiceSchema } from "@/lib/investment/invest-seo";
import { INVEST_QUICK_ANCHOR } from "@/lib/investment/quick-lead";
import { pageUrl } from "@/lib/seo";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";

export const metadata: Metadata = investMetadata({
  locale: "en",
  key: "hub",
  title: INVEST_EN_HUB.title,
  description: INVEST_EN_HUB.description,
  aiDescription: INVEST_EN_HUB.aiDescription,
});

export default function EnInvestHubPage() {
  const faqSchema = buildFaqSchema(INVEST_EN_HUB_FAQ);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Investment residency 2026 — Emigro",
    url: pageUrl("/en/invest"),
    inLanguage: "en",
    hasPart: GOLDEN_VISA_ROWS.map((row) => ({
      "@type": "WebPage",
      name: INVEST_EN_COUNTRY[row.slug].h1,
      url: pageUrl(investPagePath("en", row.slug)),
    })),
  };

  return (
    <>
      <SiteHeader locale="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(investServiceSchema("en")) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-950 via-corridor-900 to-corridor-800 text-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl gap-6 px-4 py-5 sm:py-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-x-12 lg:py-12">
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-300 sm:inline-flex">
                <span className="h-px w-8 bg-gradient-to-r from-amber-300 to-transparent" />
                Private Capital · Investment Migration
              </p>
              <h1 className="text-2xl font-bold leading-[1.12] tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
                {INVEST_EN_HUB.h1}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200/90 sm:mt-5 sm:text-lg">
                {INVEST_EN_HUB.intro}
              </p>
              <div className="mt-4 hidden flex-wrap gap-3 sm:flex">
                <a
                  href={`#${INVEST_QUICK_ANCHOR}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-3 font-semibold text-slate-950 hover:from-amber-200 hover:to-amber-300"
                >
                  Get my free match <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  href={investPagePath("en", "compare")}
                  className="inline-flex min-h-12 items-center rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white hover:border-white/40 hover:bg-white/10"
                >
                  Compare all programmes →
                </Link>
              </div>
            </div>
            <InvestQuickLead locale="en" pageKey="hub" className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start" />
            <p className="text-sm sm:hidden">
              <Link href={investPagePath("en", "compare")} className="font-semibold text-amber-200 underline">
                Compare all programmes →
              </Link>
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-12">
          <GoldenVisaSummaryTable locale="en" />

          <section className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">Programme pages</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {GOLDEN_VISA_ROWS.map((row) => (
                <Link
                  key={row.slug}
                  href={investPagePath("en", row.slug)}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-corridor-300 hover:shadow-sm"
                >
                  <p className="text-lg font-bold text-slate-950 group-hover:text-corridor-800">
                    {row.flag} {INVEST_EN_COUNTRY[row.slug].h1}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{INVEST_EN_COUNTRY[row.slug].description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-corridor-700">
                    Read <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-slate-950">FAQ</h2>
            <div className="mt-4 space-y-4">
              {INVEST_EN_HUB_FAQ.map((item) => (
                <div key={item.question}>
                  <h3 className="font-medium text-slate-900">{item.question}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
            <CompareAllLink locale="en" className="mt-4" />
          </section>

          <div className="mt-12">
            <InvestmentQualifier locale="en" />
          </div>

          <div className="mt-12">
            <InvestAssistOffers locale="en" />
          </div>
        </div>
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
