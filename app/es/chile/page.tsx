import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";
import { Disclaimer } from "@/components/Disclaimer";
import {
  ES_CL_GUIDE_SLUGS,
  ES_CL_SPAIN_CORRIDOR,
  ES_PATHS,
  esGuidePath,
} from "@/lib/es/corridor";
import { listGuides } from "@/lib/guides/load";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/seo/corridor-page-seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Residencia en España para chilenos 2026",
  description:
    "Cómo emigrar a España desde Chile 2026: Schengen 90 días ≠ residencia. Nómada digital (~€2.849), no lucrativa, Santiago y nacionalidad en 2 años (art. 22).",
  path: ES_PATHS.chile,
  locale: "es",
  esHreflang: { originIso: "CL", destinationIso: "ES" },
  aiDescription:
    "Chile→Spain hub: Schengen visa-free short stay vs national residence routes (digital nomad ~€2.849/mo, non-lucrative), Santiago Providencia consulate, Convenio 1958 dualidad, Spanish nationality ~2 years (art. 22).",
  aiCategory: "origin-corridor-hub",
});

export default function EsChileHubPage() {
  const guides = listGuides("es").filter((g) =>
    (ES_CL_GUIDE_SLUGS as readonly string[]).includes(g.slug),
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Emigro ES", item: pageUrl(ES_PATHS.home) },
    { name: "Chile" },
  ]);

  return (
    <>
      <SiteHeader locale="es" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <nav className="text-sm text-slate-500">
          <Link href={ES_PATHS.home} className="text-corridor-600 hover:underline">
            Emigro ES
          </Link>
          <span className="mx-2">/</span>
          <span>Chile</span>
        </nav>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-corridor-600">
          Corredor {ES_CL_SPAIN_CORRIDOR.slug}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Chile → España
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Pasaporte chileno: suele entrar a Schengen sin visado (90/180), pero{" "}
          <strong>visitar ≠ residir</strong>. Planifique una vía nacional (DN, NL, trabajo…) y el
          horizonte de nacionalidad española a ~2 años (art. 22).
        </p>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Qué cubrimos</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            <li>• Schengen corto vs residencia (visto D / UGE)</li>
            <li>• Rutas 2026 para pasaporte CL</li>
            <li>• Nómada digital y no lucrativa</li>
            <li>• Consulado Santiago, apostilla y primeros 30 días</li>
            <li>• Nacionalidad española (~2 años) + Beckham</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
            <Link href={ES_PATHS.wizard} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Evaluar mi ruta
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={ES_PATHS.spain} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Hub España
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={ES_PATHS.portugal} className="inline-flex items-center gap-2 text-corridor-700 hover:underline">
              Comparar con Portugal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Guías del corredor</h2>
          <ul className="mt-4 space-y-3">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={esGuidePath(guide.slug)}
                  className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 hover:border-corridor-300"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{guide.title}</p>
                    {guide.excerpt ? <p className="mt-1 text-sm text-slate-600">{guide.excerpt}</p> : null}
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-corridor-600" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p>
            Pasaportes: <strong>{ES_CL_SPAIN_CORRIDOR.passports.join(", ")}</strong>. También:{" "}
            <Link href={ES_PATHS.colombia} className="text-corridor-700 hover:underline">
              Colombia → España
            </Link>
            {" · "}
            <Link href={ES_PATHS.peru} className="text-corridor-700 hover:underline">
              Perú → España
            </Link>
            {" · "}
            <Link href={ES_PATHS.uruguay} className="text-corridor-700 hover:underline">
              Uruguay → España
            </Link>
            .
          </p>
        </section>

        <div className="mt-8">
          <Disclaimer locale="es" />
        </div>
      </main>
      <SiteFooter locale="es" />
    </>
  );
}
