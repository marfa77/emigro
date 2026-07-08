import { Activity, Globe2, Laptop, MapPin } from "lucide-react";
import Link from "next/link";
import { PulseCard, PulseHeader, PulseShareList } from "@/components/wizard/WizardPulseUi";
import { getGlobalWizardPulse } from "@/lib/wizard/pulse";

export async function WizardPulseSection() {
  const pulse = await getGlobalWizardPulse();
  if (!pulse) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-corridor-500/40 bg-gradient-to-br from-corridor-900 via-slate-900 to-slate-950 p-5 sm:p-6"
      aria-labelledby="hub-wizard-pulse-heading"
    >
      <PulseHeader
        title="Пульс маршрутов Emigro"
        subtitle={`${pulse.totalChecks} проверок за ${pulse.periodDays} дней · hub ${pulse.hubChecks} · коридоры ${pulse.corridorChecks}`}
        headingId="hub-wizard-pulse-heading"
      />

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PulseCard icon={Globe2} title="Страны">
          <PulseShareList items={pulse.topCountries} emptyLabel="Пока мало данных по странам" />
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

        <PulseCard icon={Activity} title="Объём">
          <p className="text-3xl font-bold tabular-nums text-white">{pulse.totalChecks}</p>
          <p className="mt-1 text-xs text-slate-200">все коридоры за {pulse.periodDays} дней</p>
        </PulseCard>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href="/ru/wizard"
          className="inline-flex items-center gap-2 rounded-lg bg-corridor-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-corridor-900/30 hover:bg-corridor-500"
        >
          Запустить wizard
        </Link>
      </div>
    </section>
  );
}
