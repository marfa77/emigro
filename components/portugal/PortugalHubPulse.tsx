import { Activity, Globe2, Laptop, MapPin, Route } from "lucide-react";
import { PulseCard, PulseShareList } from "@/components/wizard/WizardPulseUi";
import { getPortugalWizardPulse } from "@/lib/wizard/pulse";

export async function PortugalHubPulse() {
  const pulse = await getPortugalWizardPulse();
  if (!pulse) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-teal-400/20 bg-gradient-to-br from-teal-950/40 via-slate-900/80 to-slate-950/90 p-5 sm:p-6"
      aria-labelledby="portugal-hub-pulse-heading"
    >
      <PulseHeader
        title="Пульс маршрутов Emigro"
        subtitle={`${pulse.totalChecks} проверок за ${pulse.periodDays} дней · hub ${pulse.hubChecks} · коридоры ${pulse.corridorChecks}`}
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

      {pulse.topPortugalPrograms.length > 0 && (
        <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-teal-200">
              <Route className="mr-1.5 inline h-4 w-4 align-text-bottom" />
              Португалия · программы
            </h4>
            <p className="text-xs text-slate-500">{pulse.portugalChecks} проверок по PT-маршруту</p>
          </div>
          <ul className="mt-3 space-y-2">
            {pulse.topPortugalPrograms.map((item) => (
              <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-slate-200">{item.label}</span>
                <span className="shrink-0 font-semibold tabular-nums text-teal-300">{item.share}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function PulseHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-300">
          <Activity className="h-4 w-4" />
          Пульс маршрутов
        </p>
        <h3 id="portugal-hub-pulse-heading" className="mt-2 text-lg font-bold text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      <p className="max-w-xs text-xs leading-relaxed text-slate-500">
        Агрегированные тренды Emigro, не статистика миграции и не данные конкретных пользователей.
      </p>
    </div>
  );
}
