import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AssistResultsCta } from "@/components/wizard/AssistResultsCta";
import { WizardOutcomeCard } from "@/components/wizard/WizardOutcomeCard";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import {
  frAfriqueLandingHref,
  frAfriqueProgramHref,
  frCountryLabel,
  frProgramTitle,
} from "@/lib/fr/program-labels";
import { FR_PATHS } from "@/lib/fr/corridor";
import { CONTACT_EMAIL, MAILTO_CONTACT } from "@/lib/site-contact";

export function FrHubWizardResults({
  sessionId,
  passportIso2,
  payload,
}: {
  sessionId: string;
  passportIso2: string;
  payload: GlobalEvalPayload;
}) {
  const { pick, byCountry, results } = payload;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;
  const pickCountryLabel = pick
    ? frCountryLabel(pick.countrySegment, pick.countryRu)
    : undefined;
  const pickProgramTitle = pick
    ? frProgramTitle(pick.programSlug, pick.programTitleRu)
    : undefined;

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Vos routes : France</h1>
        <p className="mt-2 text-slate-600">
          Nous avons passé {results.length} programmes. Correspondances : {matchCount}.
          Navigation préalable, pas un conseil juridique. Passeport : {passportIso2}.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Cadre Emigro FR
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Afrique francophone → <strong>France</strong> (Maroc, Algérie, Tunisie, Sénégal). L’évaluateur
          réutilise les seuils officiels des programmes France. Confirmez toujours le consulat compétent
          et le visa Schengen court séjour. Naturalisation générale ≈ <strong>5 ans</strong> — pas un
          raccourci « 2 ans Maghreb ».
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
                Meilleur encadrement
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {pickCountryLabel} — {pickProgramTitle}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {pick.outcome === "likely_eligible"
                  ? "Correspond à vos réponses de base"
                  : pick.outcome === "needs_review"
                    ? "Nécessite une revue (seuil ou consulat)"
                    : "Ne correspond pas pour l’instant"}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={frAfriqueProgramHref(pick.countrySegment, pick.programSlug)}
                  className="inline-flex items-center gap-1 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
                >
                  Voir sur Emigro FR
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {pick.sourceUrl ? (
                  <a
                    href={pick.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                  >
                    Source officielle
                  </a>
                ) : null}
                <Link
                  href={frAfriqueLandingHref(pick.countrySegment)}
                  className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                >
                  Hub {pickCountryLabel}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-medium">Pas de correspondance claire avec ces réponses.</p>
          <p className="mt-2 text-sm leading-relaxed">
            Souvent utile : revenus ou épargne prouvables, une offre d’emploi, la voie études, ou un
            regroupement si de la famille est déjà en situation régulière en France. Consultez les
            piliers ou écrivez-nous.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
            <Link href={FR_PATHS.france} className="text-corridor-700 underline">
              Hub France →
            </Link>
            <Link href={FR_PATHS.guides} className="text-corridor-700 underline">
              Piliers →
            </Link>
            <a href={MAILTO_CONTACT} className="text-corridor-700 underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>
      )}

      <AssistResultsCta
        sessionId={sessionId}
        placement="wizard_hub_results"
        country="france"
        countryLabel={pickCountryLabel}
        programTitle={pickProgramTitle}
        locale="fr"
      />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Prochaine étape</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
          <li>
            {matchCount > 0
              ? "Choisissez 1–2 routes réalistes (France)."
              : "Décidez ce que vous pouvez changer : revenus, épargne, études ou offre."}
          </li>
          <li>Ouvrez le hub ou le pilier et croisez avec la source officielle — les seuils bougent.</li>
          <li>Réunissez les preuves : relevés, contrats, offre, parenté ou admission.</li>
          <li>Confirmez où déposer : consulat selon votre résidence et besoin de visa Schengen court.</li>
        </ol>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href={FR_PATHS.guides}
            className="rounded-lg bg-corridor-600 px-4 py-2 text-white hover:bg-corridor-700"
          >
            Voir les piliers
          </Link>
          <Link
            href={FR_PATHS.assist}
            className="rounded-lg border border-corridor-300 px-4 py-2 text-corridor-800 hover:bg-corridor-50"
          >
            Assist
          </Link>
          <a
            href={MAILTO_CONTACT}
            className="rounded-lg border border-corridor-300 px-4 py-2 text-corridor-800 hover:bg-corridor-50"
          >
            Contact
          </a>
        </div>
      </section>

      {byCountry.length > 0 ? (
        <section className="mt-12 space-y-10">
          <h2 className="text-2xl font-semibold">Par pays</h2>
          {byCountry.map((group) => (
            <div key={group.corridorSlug} className="w-full">
              <div className="flex w-full flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-semibold">
                  {frCountryLabel(group.countrySegment, group.countryRu)}
                </h3>
                <Link
                  href={frAfriqueLandingHref(group.countrySegment)}
                  className="shrink-0 text-sm text-corridor-600 hover:underline"
                >
                  Hub {frCountryLabel(group.countrySegment, group.countryRu)} →
                </Link>
              </div>
              <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
                {group.matches.map((row) => (
                  <WizardOutcomeCard
                    key={`${row.programId}-${row.corridorSlug}`}
                    title={frProgramTitle(row.programSlug, row.programTitleRu)}
                    programType={row.programType}
                    outcome={row.outcome}
                    reasons={[]}
                    href={frAfriqueProgramHref(row.countrySegment, row.programSlug)}
                    sourceUrl={row.sourceUrl}
                    sourceLabel={row.sourceLabelRu ? "Source officielle" : null}
                    locale="fr"
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
