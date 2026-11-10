import { HouseholdBanner } from "@/components/wizard/HouseholdBanner";
import { WizardResultsActions } from "@/components/wizard/WizardResultsActions";
import { WizardOutcomeCard, readableReason, OUTCOME_LABELS, wizardOutcomeBarrier } from "@/components/wizard/WizardOutcomeCard";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { formatCountryProgramLabel } from "@/lib/wizard/format-country-program-label";
import Link from "next/link";
import { ArrowRight, ListChecks } from "lucide-react";

/**
 * Hub wizard results: one straight path — results → request. No city chats, provider grids,
 * corridor wizards or competing CTAs here (Pavel, 2026-11-10); the match list stays as information.
 */
export function HubWizardResults({
  sessionId,
  passportIso2,
  payload,
}: {
  sessionId: string;
  passportIso2: string;
  payload: GlobalEvalPayload;
}) {
  const { pick, byCountry, results, household } = payload;
  const matchCount = results.filter((r) => r.outcome !== "unlikely").length;
  const strongMatchCount = results.filter((r) => r.outcome === "likely_eligible").length;
  const pickLabel = pick ? formatCountryProgramLabel(pick.countryRu, pick.programTitleRu) : undefined;

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Ваши результаты</h1>
        <p className="mt-2 text-slate-600">
          Проверили {results.length} программ, совпадений: {matchCount}. Это предварительный подбор, не юридическая
          гарантия.
        </p>
      </header>

      <WizardResultsActions
        sessionId={sessionId}
        pickLabel={pickLabel}
        country={pick?.countrySegment}
        corridorSlug={pick?.corridorSlug}
        countryRu={pick?.countryRu}
        programTitle={pick?.programTitleRu}
        matchCount={matchCount}
        householdNote={household && !household.isSolo ? `Семья: ${household.labelRu}.` : undefined}
      />

      <div
        id="wizard-results-metrics"
        hidden
        data-match-count={matchCount}
        data-strong-match-count={strongMatchCount}
        data-pick-outcome={pick?.outcome ?? ""}
        data-pick-country={pick?.countrySegment ?? ""}
      />

      {passportIso2 === "UA" && (
        <section className="mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-800">Граждане Украины</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Временная защита vs ВНЖ</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Если у вас паспорт UA, сначала сравните Temporary Protection (TP) в Польше, Чехии или Германии с классическими
            маршрутами ВНЖ — TP быстрее, но не ведёт к ПМЖ и гражданству. Если вы уже живёте в ЕС по временной защите, часто реальнее сменить основание на месте, чем подаваться заново. Список ниже — классические EU-программы.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/ru/ukraine"
              className="inline-flex items-center gap-1 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Хаб Украина → ЕС
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ru/guides/ukraintsy-belorusy-vremennaya-zashchita-vs-vnj-2026"
              className="inline-flex items-center gap-1 rounded-lg border border-blue-300 bg-white px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-50"
            >
              TP vs ВНЖ — гайд
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      <HouseholdBanner household={household} />

      {pick ? (
        <section className="mt-8 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-corridor-600 p-2 text-white">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Почему этот маршрут</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{pickLabel}</h2>
              <p className="mt-2 inline-flex rounded-full border border-corridor-200 bg-white px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-corridor-800">
                {OUTCOME_LABELS[pick.outcome] ?? pick.outcome}
              </p>
              {pick.reasons?.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-slate-700">
                  {pick.reasons.slice(0, 3).map((reason) => (
                    <li key={reason}>✓ {readableReason(reason)}</li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-sm text-slate-700">⚠ {wizardOutcomeBarrier(pick.outcome, pick.reasons)}</p>
              <Link href={pick.programPath} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-corridor-700 hover:underline">
                Подробнее о программе <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {byCountry.length > 0 && (
        <section className="mt-12 space-y-10">
          <div>
            <h2 className="text-2xl font-semibold">Все совпадения</h2>
            <p className="mt-1 text-sm text-slate-600">
              Порядок — по силе совпадения с вашими ответами, а не рейтинг стран.
            </p>
          </div>
          {byCountry.slice(0, 3).map((group) => (
            <CountryGroup key={group.corridorSlug} group={group} />
          ))}
          {byCountry.length > 3 ? (
            <details className="rounded-2xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer list-none text-sm font-semibold text-corridor-700">
                Показать ещё {byCountry.length - 3}{" "}
                {byCountry.length - 3 === 1 ? "страну" : byCountry.length - 3 < 5 ? "страны" : "стран"} →
              </summary>
              <div className="mt-6 space-y-10">
                {byCountry.slice(3).map((group) => (
                  <CountryGroup key={group.corridorSlug} group={group} />
                ))}
              </div>
            </details>
          ) : null}
        </section>
      )}
    </>
  );
}

function CountryGroup({ group }: { group: GlobalEvalPayload["byCountry"][number] }) {
  return (
    <div className="w-full">
      <div className="flex w-full flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold">{group.countryRu}</h3>
        <Link href={group.landingPath} className="shrink-0 text-sm text-corridor-600 hover:underline">
          Коридор {group.countryRu} →
        </Link>
      </div>
      <div className="mt-4 grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))]">
        {group.matches.map((row) => (
          <WizardOutcomeCard
            key={`${row.programId}-${row.corridorSlug}`}
            title={row.programTitleRu}
            programType={row.programType}
            outcome={row.outcome}
            reasons={row.reasons}
            href={row.programPath}
            sourceUrl={row.sourceUrl}
            sourceLabel={row.sourceLabelRu}
          />
        ))}
      </div>
    </div>
  );
}
