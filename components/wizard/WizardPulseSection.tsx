import { Activity, Globe2, Laptop, MapPin } from "lucide-react";
import { PulseCard, PulseHeader, PulseShareList } from "@/components/wizard/WizardPulseUi";
import { getGlobalWizardPulse } from "@/lib/wizard/pulse";

export async function WizardPulseSection() {
  const pulse = await getGlobalWizardPulse();
  if (!pulse) return null;

  return (
    <section
      className="mt-10 rounded-2xl border border-teal-400/20 bg-gradient-to-br from-teal-950/40 via-slate-900/80 to-slate-950/90 p-5 sm:p-6"
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
              <p className="text-3xl font-bold tabular-nums text-teal-300">{pulse.remoteIncomeShare}%</p>
              <p className="mt-1 text-xs text-slate-400">указали удалённый доход</p>
            </>
          ) : (
            <p className="text-sm text-slate-400">Пока мало данных</p>
          )}
        </PulseCard>

        <PulseCard icon={Activity} title="Объём">
          <p className="text-3xl font-bold tabular-nums text-white">{pulse.totalChecks}</p>
          <p className="mt-1 text-xs text-slate-400">все коридоры за {pulse.periodDays} дней</p>
        </PulseCard>
      </div>
    </section>
  );
}
