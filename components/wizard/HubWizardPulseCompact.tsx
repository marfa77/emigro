import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";
import { getGlobalWizardPulse } from "@/lib/wizard/pulse";

export async function HubWizardPulseCompact() {
  const pulse = await getGlobalWizardPulse();
  if (!pulse) return null;

  const topCountries = pulse.topCountries.slice(0, 3);

  return (
    <section
      className="mt-8 rounded-2xl border border-corridor-200 bg-gradient-to-br from-corridor-50 via-white to-slate-50 p-5 shadow-sm ring-1 ring-corridor-100/80"
      aria-labelledby="hub-wizard-pulse-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-corridor-700">
            <Activity className="h-4 w-4" />
            Пульс Emigro
          </p>
          <h2 id="hub-wizard-pulse-heading" className="mt-2 text-lg font-bold text-slate-900">
            {pulse.totalChecks} проверок wizard за {pulse.periodDays} дней
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Hub wizard и коридорные проверки · анонимные агрегаты, не статистика миграции
          </p>
        </div>
        <Link
          href={HUB_WIZARD_PATH}
          className="inline-flex items-center gap-1.5 rounded-lg bg-corridor-600 px-4 py-2 text-sm font-medium text-white hover:bg-corridor-700"
        >
          Подобрать маршрут
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {topCountries.length > 0 && (
        <p className="mt-4 text-sm text-slate-700">
          <span className="font-medium text-slate-900">Чаще смотрят:</span>{" "}
          {topCountries.map((c, i) => (
            <span key={c.label}>
              {i > 0 ? " · " : ""}
              {c.label} {c.share}%
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
