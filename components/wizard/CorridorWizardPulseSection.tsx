import { Suspense } from "react";
import { Activity, Laptop, MapPin, Route } from "lucide-react";
import Link from "next/link";
import { PulseCard, PulseHeader, PulseShareList } from "@/components/wizard/WizardPulseUi";
import { getCorridorWizardPulse } from "@/lib/wizard/pulse";
import type { NewsTopicConfig } from "@/lib/news/topics/types";

async function CorridorWizardPulseInner({ topic }: { topic: NewsTopicConfig }) {
  const pulse = await getCorridorWizardPulse(topic.urlSegment, topic.corridorSlug ?? null);
  if (!pulse) return null;

  const wizardHref = topic.sitePaths?.wizard ?? `/ru/${topic.urlSegment}/wizard`;

  return (
    <section
      className="mt-10 rounded-2xl border border-corridor-500/40 bg-gradient-to-br from-corridor-900 via-slate-900 to-slate-950 p-5 sm:p-6"
      aria-labelledby={`corridor-wizard-pulse-${topic.urlSegment}`}
    >
      <PulseHeader
        title={`Пульс: ${pulse.countryLabel}`}
        subtitle={`${pulse.corridorChecks} проверок по коридору · всего Emigro ${pulse.totalChecks} за ${pulse.periodDays} дней`}
        headingId={`corridor-wizard-pulse-${topic.urlSegment}`}
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PulseCard icon={Route} title="Топ программ">
          <PulseShareList
            items={pulse.topPrograms}
            emptyLabel="Пока мало данных по программам коридора"
          />
        </PulseCard>

        <PulseCard icon={MapPin} title="Паспорта">
          <PulseShareList items={pulse.topPassports} emptyLabel="Пока мало данных по паспортам" />
        </PulseCard>

        <PulseCard icon={Laptop} title="Удалёнка">
          {pulse.remoteIncomeShare !== null ? (
            <>
              <p className="text-3xl font-bold tabular-nums text-white">{pulse.remoteIncomeShare}%</p>
              <p className="mt-1 text-xs text-slate-200">указали удалённый доход</p>
            </>
          ) : (
            <p className="text-sm text-slate-200">Пока мало данных</p>
          )}
        </PulseCard>

        <PulseCard icon={Activity} title="Объём коридора">
          <p className="text-3xl font-bold tabular-nums text-white">{pulse.corridorChecks}</p>
          <p className="mt-1 text-xs text-slate-200">за {pulse.periodDays} дней</p>
        </PulseCard>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href={wizardHref}
          className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-corridor-900/30 hover:bg-corridor-500"
        >
          Проверить себя в {pulse.countryLabel}
        </Link>
      </div>
    </section>
  );
}

function CorridorWizardPulseFallback() {
  return (
    <section
      className="mt-10 animate-pulse rounded-2xl border border-corridor-500/20 bg-slate-900/90 p-6"
      aria-hidden
    >
      <div className="h-5 w-40 rounded bg-slate-700" />
      <div className="mt-3 h-7 w-64 rounded bg-slate-700" />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-slate-800" />
        ))}
      </div>
    </section>
  );
}

export function CorridorWizardPulseSectionSuspense({ topic }: { topic: NewsTopicConfig }) {
  return (
    <Suspense fallback={<CorridorWizardPulseFallback />}>
      <CorridorWizardPulseInner topic={topic} />
    </Suspense>
  );
}
