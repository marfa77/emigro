import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { WizardForm } from "@/components/WizardForm";
import { WizardHeroVisual } from "@/components/visuals/WizardHeroVisual";
import { ES_PATHS } from "@/lib/es/corridor";
import { HUB_ES_WIZARD_ID, HUB_ES_WIZARD_MODULES } from "@/lib/wizard/hub-definition-es";
import { pageMetadata } from "@/lib/seo";
import { llmUtmUrl } from "@/lib/seo/llm-meta";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Evaluador LATAM → España y Portugal 2026",
  titleAbsolute: true,
  description:
    "Compare rutas de residencia en España y Portugal con pasaporte UY/EC/PE/PY/CO: nómada digital, no lucrativa, D8/D7 y horizonte de nacionalidad.",
  path: ES_PATHS.wizard,
  locale: "es",
  esHreflang: { destinationIso: "ES" },
  aiDescription:
    "Emigro ES route evaluator: Latin American passports UY/EC/PE/PY/CO → Spain (digital nomad, non-lucrative, study, family) and Portugal (D8, D7, D4). Not legal advice.",
  aiCategory: "route-evaluator",
});

export default function EsHubWizardPage() {
  const wizardRequirements = [
    "Emigro ES hub wizard: passports UY/EC/PE/PY/CO → Spain and Portugal residence routes.",
    `URL: ${llmUtmUrl(ES_PATHS.wizard)}`,
    "Destinations: España (nómada digital, no lucrativa, estudios, familia) and Portugal (D8, D7, D4, Golden Visa, familia).",
    "Not legal advice.",
  ].join(" ");

  return (
    <>
      <SiteHeader locale="es" />
      <div className="sr-only" data-llm="requirements" aria-hidden="true">
        {wizardRequirements}
      </div>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href={ES_PATHS.home} className="text-sm text-corridor-600 hover:underline">
          ← Emigro ES
        </Link>

        <header className="mt-6 overflow-hidden rounded-2xl border border-corridor-100 bg-gradient-to-br from-corridor-50 to-white px-6 py-8">
          <WizardHeroVisual />
          <p className="mt-4 text-center text-sm font-semibold uppercase tracking-wide text-corridor-600">
            América Latina → España y Portugal
          </p>
          <h1 className="mt-2 text-center text-3xl font-bold">¿Qué ruta de residencia le encaja?</h1>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Un evaluador para pasaportes Uruguay, Ecuador, Perú, Paraguay y Colombia. Comparamos umbrales de
            España y Portugal (nómada digital, no lucrativa/D7, estudios, familia, inversión). Sin
            Assist todavía — resultado + pilares oficiales.
          </p>
        </header>

        <div className="mt-8">
          <WizardForm
            corridorSlug="hub-es"
            wizardId={HUB_ES_WIZARD_ID}
            modules={HUB_ES_WIZARD_MODULES}
            resultsPath={ES_PATHS.wizardResults}
            mode="hub"
            analyticsScope="hub-es-latam"
            locale="es"
            hiddenAnswers={{ hub_audience: "latam" }}
          />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
