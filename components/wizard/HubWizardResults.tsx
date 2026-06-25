import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { ServiceProvidersSection } from "@/components/providers/ServiceProvidersSection";
import { HouseholdBanner } from "@/components/wizard/HouseholdBanner";
import { WizardOutcomeCard } from "@/components/wizard/WizardOutcomeCard";
import { corridorWizardPath } from "@/lib/corridor/paths";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { corridorSlugForTopic, findFirstProviderTopicKey } from "@/lib/providers/registry";

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
  const providerTopicKey = findFirstProviderTopicKey([
    ...results.map((r) => r.countrySegment),
    ...byCountry.map((g) => g.corridorSlug?.replace(/^ru-speaking-to-/, "") ?? ""),
  ]);

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold">Ваши маршруты по Европе</h1>
        <p className="mt-2 text-slate-600">
          Проверено {results.length} программ в {byCountry.length} странах. Совпадений: {matchCount}. Не
          юридическая оценка.
        </p>
      </header>

      <HouseholdBanner household={household} />

      {providerTopicKey && (
        <ServiceProvidersSection
          className="mt-8"
          corridorSlug={corridorSlugForTopic(providerTopicKey)}
          topicKey={providerTopicKey}
          placement="wizard_hub_results"
          variant="compact"
          title="Сервисы на маршруте"
        />
      )}

      {pick ? (
        <section className="mt-8 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 to-white p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-corridor-600 p-2 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">Наш выбор</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {pick.countryRu} — {pick.programTitleRu}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {pick.outcome === "likely_eligible"
                  ? "Вероятно подходит"
                  : pick.outcome === "needs_review"
                    ? "Требует проверки"
                    : "Маловероятно"}
              </p>
              {pick.reasons?.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm opacity-90">
                  {pick.reasons.slice(0, 3).map((reason) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={pick.programPath}
                  className="inline-flex items-center gap-1 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
                >
                  Подробнее о программе
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={corridorWizardPath(pick.corridorSlug)}
                  className="inline-flex items-center gap-1 rounded-lg border border-corridor-300 px-4 py-2 text-sm text-corridor-800 hover:bg-corridor-50"
                >
                  <Compass className="h-4 w-4" />
                  Wizard {pick.countryRu}
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-medium">Явных совпадений по порогам 2026 не найдено.</p>
          <p className="mt-2 text-sm">
            Попробуйте скорректировать доход или проверьте маршрут воссоединения семьи. Можно пройти wizard по
            конкретной стране для детальной проверки.
          </p>
          <Link href="/ru#destinations" className="mt-4 inline-block text-sm font-medium text-corridor-700 underline">
            Все направления →
          </Link>
        </section>
      )}

      {byCountry.length > 0 && (
        <section className="mt-12 space-y-10">
          <h2 className="text-2xl font-semibold">По странам</h2>
          {byCountry.map((group) => (
            <div key={group.corridorSlug}>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <h3 className="text-xl font-semibold">{group.countryRu}</h3>
                <Link href={group.landingPath} className="text-sm text-corridor-600 hover:underline">
                  Коридор {group.countryRu} →
                </Link>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.matches.map((row) => (
                  <WizardOutcomeCard
                    key={`${row.programId}-${row.corridorSlug}`}
                    title={row.programTitleRu}
                    programType={row.programType}
                    outcome={row.outcome}
                    reasons={row.reasons}
                    href={row.programPath}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {pick && (
        <div className="mt-12 max-w-lg">
          <LeadForm
            corridorSlug={pick.corridorSlug}
            sessionId={sessionId}
            programSlugs={[pick.programSlug]}
            defaultPassport={passportIso2}
            countryRu={pick.countryRu}
          />
        </div>
      )}
    </>
  );
}
