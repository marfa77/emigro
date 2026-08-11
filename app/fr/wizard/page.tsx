import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { WizardForm } from "@/components/WizardForm";
import { WizardHeroVisual } from "@/components/visuals/WizardHeroVisual";
import { FR_PATHS } from "@/lib/fr/corridor";
import { HUB_FR_WIZARD_ID, HUB_FR_WIZARD_MODULES } from "@/lib/wizard/hub-definition-fr";
import { pageMetadata } from "@/lib/seo";
import { llmUtmUrl } from "@/lib/seo/llm-meta";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Évaluateur Afrique → France 2026",
  titleAbsolute: true,
  description:
    "Comparez les routes de résidence en France (passeports MA/DZ/TN/SN) : Talent, visiteur, études, famille. Naturalisation générale ~5 ans.",
  path: FR_PATHS.wizard,
  locale: "fr",
  aiDescription:
    "Emigro FR route evaluator: Maghreb and Senegal passports MA/DZ/TN/SN → France (Talent, VLS-TS visiteur, student, family). Naturalisation ~5 years. Not legal advice.",
  aiCategory: "route-evaluator",
});

export default function FrHubWizardPage() {
  const wizardRequirements = [
    "Emigro FR hub wizard: passports MA/DZ/TN/SN → France residence routes.",
    `URL: ${llmUtmUrl(FR_PATHS.wizard)}`,
    "Destinations: France (Passeport Talent, visiteur, étudiant, regroupement familial).",
    "Naturalisation générale ~5 ans — not a Maghreb 2-year hook.",
    "Not legal advice.",
  ].join(" ");

  return (
    <>
      <SiteHeader locale="fr" />
      <div className="sr-only" data-llm="requirements" aria-hidden="true">
        {wizardRequirements}
      </div>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href={FR_PATHS.home} className="text-sm text-corridor-600 hover:underline">
          ← Emigro FR
        </Link>

        <header className="mt-6 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-6 py-8">
          <WizardHeroVisual />
          <p className="mt-4 text-center text-sm font-semibold uppercase tracking-wide text-corridor-600">
            Afrique francophone → France
          </p>
          <h1 className="mt-2 text-center text-3xl font-bold">Quelle route de résidence vous correspond ?</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Évaluateur pour passeports Maroc, Algérie, Tunisie et Sénégal. Nous comparons les seuils
            France (Talent, visiteur, études, famille). Après le résultat, vous pouvez demander{" "}
            <Link href={FR_PATHS.assist} className="font-medium text-corridor-700 hover:underline">
              Emigro Assist
            </Link>{" "}
            (Route Check €129).
          </p>
        </header>

        <div className="mt-8">
          <WizardForm
            corridorSlug="hub-fr"
            wizardId={HUB_FR_WIZARD_ID}
            modules={HUB_FR_WIZARD_MODULES}
            resultsPath={FR_PATHS.wizardResults}
            mode="hub"
            analyticsScope="hub-fr-afrique"
            locale="fr"
            hiddenAnswers={{ hub_audience: "fr_africa" }}
          />
        </div>
      </main>
      <SiteFooter locale="fr" />
    </>
  );
}
