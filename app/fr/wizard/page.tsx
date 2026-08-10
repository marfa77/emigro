import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { FR_PATHS } from "@/lib/fr/corridor";
import { pageMetadata } from "@/lib/seo";
import { llmUtmUrl } from "@/lib/seo/llm-meta";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Évaluateur FR — bientôt (Maghreb → France)",
  titleAbsolute: true,
  description:
    "L'évaluateur complet Afrique francophone → France arrive en Phase 2. En attendant : hubs MA/DZ/TN/SN, piliers et Emigro Assist.",
  path: FR_PATHS.wizard,
  locale: "fr",
  aiDescription:
    "Emigro FR wizard stub: full Maghreb/Senegal → France evaluator is Phase 2. Use origin hubs, pillars, and Assist Route Check.",
  aiCategory: "route-evaluator",
});

export default function FrWizardStubPage() {
  const note = [
    "Emigro FR Phase 1: thin wizard stub. Full FR evaluator = Phase 2.",
    `URL: ${llmUtmUrl(FR_PATHS.wizard)}`,
    "Origins: MA, DZ, TN, SN → France. Not legal advice.",
  ].join(" ");

  return (
    <>
      <SiteHeader locale="fr" />
      <div className="sr-only" data-llm="requirements" aria-hidden="true">
        {note}
      </div>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href={FR_PATHS.home} className="text-sm text-corridor-600 hover:underline">
          ← Emigro FR
        </Link>

        <header className="mt-6 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-6 py-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-corridor-600">
            Afrique francophone → France
          </p>
          <h1 className="mt-2 text-center text-3xl font-bold">Évaluateur FR — bientôt</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Phase 1 livre les piliers et hubs. L&apos;évaluateur complet (comme le wizard ES) arrive en Phase 2.
            En attendant, ouvrez votre hub d&apos;origine ou demandez un Route Check Assist.
          </p>
        </header>

        <ul className="mt-8 space-y-3">
          {[
            { href: FR_PATHS.maroc, label: "Hub Maroc → France" },
            { href: FR_PATHS.algerie, label: "Hub Algérie → France" },
            { href: FR_PATHS.tunisie, label: "Hub Tunisie → France" },
            { href: FR_PATHS.senegal, label: "Hub Sénégal → France" },
            { href: FR_PATHS.france, label: "Hub France" },
            { href: FR_PATHS.guides, label: "Tous les piliers" },
            { href: "/ru/assist", label: "Emigro Assist — Route Check €129" },
            { href: FR_PATHS.contact, label: "Contact FR" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-corridor-300"
              >
                {item.label}
                <span className="text-corridor-600">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}
