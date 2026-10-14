import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { InvestmentQualifier } from "@/components/investment/InvestmentQualifier";
import { InvestQuickLead } from "@/components/investment/InvestQuickLead";
import {
  CompareAllLink,
  GoldenVisaFactTable,
  InvestAssistOffers,
  PortugalCallout,
  SpainAlternatives,
} from "@/components/investment/InvestPageBlocks";
import {
  INVEST_COUNTRY_SLUGS,
  goldenVisaRow,
  investPagePath,
  isInvestCountrySlug,
} from "@/lib/investment/golden-visa-2026";
import { INVEST_EN_COUNTRY } from "@/lib/investment/invest-en-copy";
import { investMetadata, investServiceSchema } from "@/lib/investment/invest-seo";
import { buildFaqSchema } from "@/lib/seo/corridor-page-seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return INVEST_COUNTRY_SLUGS.map((country) => ({ country }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  if (!isInvestCountrySlug(params.country)) return {};
  const copy = INVEST_EN_COUNTRY[params.country];
  return investMetadata({
    locale: "en",
    key: params.country,
    title: copy.title,
    description: copy.description,
    aiDescription: copy.aiDescription,
  });
}

export default function EnInvestCountryPage({ params }: { params: { country: string } }) {
  if (!isInvestCountrySlug(params.country)) notFound();
  const slug = params.country;
  const copy = INVEST_EN_COUNTRY[slug];
  const row = goldenVisaRow(slug);
  if (!row) notFound();
  const faqSchema = buildFaqSchema(copy.faq);

  return (
    <>
      <SiteHeader locale="en" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(investServiceSchema("en")) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <main className="mx-auto max-w-6xl px-4 py-3 sm:py-8">
        <Link
          href={investPagePath("en", "hub")}
          className="inline-flex min-h-11 items-center text-sm font-medium text-corridor-700 hover:underline sm:min-h-0"
        >
          ← All investment routes
        </Link>

        <div className="mt-2 grid gap-5 sm:mt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-corridor-900 to-corridor-800 p-5 text-white sm:p-8 lg:self-start">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
            />
            <div className="relative hidden flex-wrap items-center gap-3 sm:flex">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-2xl ring-1 ring-white/15 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-3xl"
                aria-hidden
              >
                {row.flag}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                  row.status === "closed"
                    ? "bg-rose-300/20 text-rose-100 ring-rose-300/30"
                    : "bg-emerald-300/20 text-emerald-100 ring-emerald-300/30"
                }`}
              >
                {row.status === "closed" ? "Closed to new applications" : "Open"}
              </span>
            </div>
            <h1 className="relative text-2xl font-bold leading-tight tracking-tight sm:mt-5 sm:text-4xl">{copy.h1}</h1>
            <p className="relative mt-3 line-clamp-4 text-sm leading-relaxed text-slate-200/90 sm:mt-4 sm:line-clamp-none sm:text-lg">
              {copy.intro}
            </p>
            <p className="relative mt-4 hidden sm:block">
              <Link href={investPagePath("en", "compare")} className="text-sm font-semibold text-amber-200 hover:underline">
                Compare all programmes →
              </Link>
            </p>
          </header>
          <InvestQuickLead
            locale="en"
            pageKey={slug}
            defaultOutcome={slug === "spain" ? "residence" : undefined}
            className="lg:self-start"
          />
        </div>

        {slug === "portugal" ? (
          <div className="mt-8">
            <PortugalCallout locale="en" />
          </div>
        ) : null}

        <div className="mt-8">
          <GoldenVisaFactTable row={row} locale="en" />
        </div>

        {slug === "spain" ? (
          <div className="mt-8">
            <SpainAlternatives locale="en" />
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Who it suits</h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700">
              {copy.suits.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">Who it doesn&apos;t suit</h2>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-700">
              {copy.notSuits.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-rose-950">
            <ShieldAlert className="h-5 w-5 text-rose-600" /> Russian and Belarusian passports
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-rose-950">{copy.ruByNote}</p>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-950">Steps</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
            {copy.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950">FAQ</h2>
          <div className="mt-4 space-y-4">
            {copy.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-medium text-slate-900">{item.question}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
          <CompareAllLink locale="en" />
          <Link href={copy.ruGuidePath} className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-slate-600 hover:underline">
            In-depth guide (Russian) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10">
          <InvestmentQualifier id="qualifier" defaultPreferredCountry={slug} locale="en" />
        </div>

        <div className="mt-10">
          <InvestAssistOffers locale="en" />
        </div>
      </main>
      <SiteFooter locale="en" />
    </>
  );
}
