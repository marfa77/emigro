import type { ReactNode } from "react";
import { Activity, Globe2, Laptop, Route } from "lucide-react";
import type { PortugalWizardPulse, PulseShare } from "@/lib/portugal/wizard-pulse";
import { getPortugalWizardPulse } from "@/lib/portugal/wizard-pulse";

function ShareList({ items, emptyLabel }: { items: PulseShare[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-slate-200">{item.label}</span>
          <span className="shrink-0 font-semibold tabular-nums text-teal-300">{item.share}%</span>
        </li>
      ))}
    </ul>
  );
}

function PulseCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Activity;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-teal-200">
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </article>
  );
}

export async function PortugalHubPulse() {
  const pulse = await getPortugalWizardPulse();
  if (!pulse) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-teal-400/20 bg-gradient-to-br from-teal-950/40 via-slate-900/80 to-slate-950/90 p-5 sm:p-6"
      aria-labelledby="portugal-hub-pulse-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-teal-300">
            <Activity className="h-4 w-4" />
            Пульс маршрутов
          </p>
          <h3 id="portugal-hub-pulse-heading" className="mt-2 text-lg font-bold text-white">
            Что проверяют в wizard за {pulse.periodDays} дней
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {pulse.totalChecks} анонимных проверок · hub wizard и wizard Португалии
          </p>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-slate-500">
          Агрегированные тренды Emigro, не статистика миграции и не данные конкретных пользователей.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <PulseCard icon={Route} title="Программы">
          <ShareList items={pulse.topPrograms} emptyLabel="Пока мало данных по программам" />
        </PulseCard>

        <PulseCard icon={Globe2} title="Паспорта">
          <ShareList items={pulse.topPassports} emptyLabel="Пока мало данных по паспортам" />
        </PulseCard>

        <PulseCard icon={Laptop} title="Удалёнка">
          {pulse.remoteIncomeShare !== null ? (
            <p className="text-3xl font-bold tabular-nums text-teal-300">{pulse.remoteIncomeShare}%</p>
          ) : (
            <p className="text-sm text-slate-400">Пока мало данных</p>
          )}
          {pulse.remoteIncomeShare !== null && (
            <p className="mt-1 text-xs text-slate-400">указали удалённый доход</p>
          )}
        </PulseCard>

        <PulseCard icon={Activity} title="Объём">
          <p className="text-3xl font-bold tabular-nums text-white">{pulse.totalChecks}</p>
          <p className="mt-1 text-xs text-slate-400">проверок за {pulse.periodDays} дней</p>
        </PulseCard>
      </div>
    </section>
  );
}
