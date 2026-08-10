import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { WizardOutcomeCard } from "@/components/wizard/WizardOutcomeCard";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import {
  esCountryLabel,
  esLatamLandingHref,
  esLatamProgramHref,
  esProgramTitle,
} from "@/lib/es/program-labels";
import { ES_PATHS } from "@/lib/es/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";

export function EsHubWizardResults({
  payload,
}: {
  sessionId: string;
  passportIso2: string;
  payload: GlobalEvalPayload;
}) {
  const { pick, byCountry, results } = payload;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Sus rutas: España y Portugal</h1>
        <p className="mt-2 text-slate-600">
          Revisamos {results.length} programas. Coincidencias: {matchCount}. Navegación previa, no
          asesoría jurídica.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Marco Emigro ES
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          América Latina → <strong>España y Portugal</strong>. El evaluador reutiliza los umbrales
          oficiales de esos destinos para pasaportes UY/EC/PE/PY. Confirme siempre el consulado y el
          régimen Schengen corto (y ETIAS si aplica).
        </p>
      </section>

      {pick ? (
        <section className="mt-8 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-corridor-600 p-2 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
                Mejor encaje
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {esCountryLabel(pick.countrySegment, pick.countryRu)} —{" "}
                {esProgramTitle(pick.programSlug, pick.programTitleRu)}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {pick.outcome === "likely_eligible"
                  ? "Encaja con sus respuestas básicas"
                  : pick.outcome === "needs_review"
                    ? "Requiere revisión (umbral o consulado)"
                    : "Por ahora no encaja"}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={esLatamProgramHref(pick.countrySegment, pick.programSlug)}
                  className="inline-flex items-center gap-1 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
                >
                  Ver en Emigro ES
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {pick.sourceUrl ? (
                  <a
                    href={pick.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                  >
                    Fuente oficial
                  </a>
                ) : null}
                <Link
                  href={esLatamLandingHref(pick.countrySegment)}
                  className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                >
                  Hub {esCountryLabel(pick.countrySegment, pick.countryRu)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-medium">No hay coincidencias claras con estas respuestas.</p>
          <p className="mt-2 text-sm leading-relaxed">
            Suele ayudar: subir ingresos o ahorros demostrables, una oferta laboral, la vía de
            estudios, o reagrupación si ya hay familia legal en ES/PT. Revise los pilares o
            escríbanos.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            <Link href={ES_PATHS.spain} className="text-corridor-700 underline">
              Hub España →
            </Link>
            <Link href={ES_PATHS.portugal} className="text-corridor-700 underline">
              Hub Portugal →
            </Link>
            <a href={MAILTO_CONTACT} className="text-corridor-700 underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Siguiente paso</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          <li>
            {matchCount > 0
              ? "Elija 1–2 rutas realistas (España y/o Portugal)."
              : "Decida qué puede cambiar: ingresos, ahorros, estudios u oferta."}
          </li>
          <li>Abra el hub o el pilar y contraste con la fuente oficial — los umbrales cambian.</li>
          <li>Reúna pruebas: extractos, contratos, oferta, parentesco o admisión.</li>
          <li>Confirme dónde presentar: consulado según residencia y si necesita Schengen corto.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href={ES_PATHS.guides}
            className="rounded-lg bg-corridor-600 px-4 py-2 text-white hover:bg-corridor-700"
          >
            Ver pilares
          </Link>
          <a
            href={MAILTO_CONTACT}
            className="rounded-lg border border-corridor-300 px-4 py-2 text-corridor-800 hover:bg-corridor-50"
          >
            Contacto
          </a>
        </div>
      </section>

      {byCountry.length > 0 ? (
        <section className="mt-12 space-y-10">
          <h2 className="text-2xl font-semibold">Por país</h2>
          {byCountry.map((group) => (
            <div key={group.corridorSlug} className="w-full">
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">
                  {esCountryLabel(group.countrySegment, group.countryRu)}
                </h3>
                <Link
                  href={esLatamLandingHref(group.countrySegment)}
                  className="shrink-0 text-sm text-corridor-600 hover:underline"
                >
                  Hub {esCountryLabel(group.countrySegment, group.countryRu)} →
                </Link>
              </div>
              <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
                {group.matches.map((row) => (
                  <WizardOutcomeCard
                    key={`${row.programId}-${row.corridorSlug}`}
                    title={esProgramTitle(row.programSlug, row.programTitleRu)}
                    programType={row.programType}
                    outcome={row.outcome}
                    reasons={[]}
                    href={esLatamProgramHref(row.countrySegment, row.programSlug)}
                    sourceUrl={row.sourceUrl}
                    sourceLabel={row.sourceLabelRu ? "Fuente oficial" : null}
                    locale="es"
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
