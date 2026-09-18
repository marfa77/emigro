import type { ReactNode } from "react";

export function percentDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return Math.round(((current - previous) / previous) * 100);
}

export function DeltaBadge({ current, previous }: { current: number; previous: number }) {
  const delta = percentDelta(current, previous);
  const positive = current > previous;
  const negative = current < previous;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : negative
            ? "bg-rose-50 text-rose-700"
            : "bg-slate-100 text-slate-500"
      }`}
    >
      {delta == null ? "новое" : `${delta > 0 ? "+" : ""}${delta}%`}
    </span>
  );
}

export function Section({
  title,
  subtitle,
  children,
  id,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function KpiCard({
  label,
  value,
  previous,
  hint,
  children,
}: {
  label: string;
  value: number | string;
  previous?: number;
  hint?: string;
  children?: ReactNode;
}) {
  const numeric = typeof value === "number" ? value : null;
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {numeric != null && previous != null ? <DeltaBadge current={numeric} previous={previous} /> : null}
      </div>
      <p className="mt-2 truncate text-2xl font-bold tabular-nums text-slate-950">
        {typeof value === "number" ? value.toLocaleString("ru-RU") : value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
      {children}
    </article>
  );
}

export function Sparkline({
  values,
  label,
  className = "text-corridor-600",
}: {
  values: number[];
  label: string;
  className?: string;
}) {
  if (values.length < 2) return <div className="mt-3 h-12 rounded bg-slate-50" aria-label={`${label}: недостаточно данных`} />;
  const width = 240;
  const height = 52;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = Math.max(max - min, 1);
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - 4 - ((value - min) / span) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className={`mt-3 h-12 w-full ${className}`}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Funnel({
  steps,
}: {
  steps: Array<{ label: string; value: number; hint?: string }>;
}) {
  const max = Math.max(...steps.map((step) => step.value), 1);
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const previous = index > 0 ? steps[index - 1].value : 0;
        const conversion = previous > 0 ? Math.round((step.value / previous) * 100) : null;
        return (
          <div key={step.label}>
            <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
              <span className="text-slate-600">{step.label}</span>
              <span className="font-semibold tabular-nums text-slate-950">
                {step.value.toLocaleString("ru-RU")}
                {conversion != null ? <span className="ml-2 text-xs font-normal text-slate-400">{conversion}%</span> : null}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-corridor-600"
                style={{ width: `${Math.max((step.value / max) * 100, step.value > 0 ? 3 : 0)}%` }}
              />
            </div>
            {step.hint ? <p className="mt-1 text-xs text-slate-400">{step.hint}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function TopList({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {rows.length ? (
        <ol className="mt-3 space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <li key={`${title}-${label}`} className="flex justify-between gap-3">
              <span className="min-w-0 truncate text-slate-700" title={label}>{label}</span>
              <strong className="shrink-0 tabular-nums text-slate-950">{value.toLocaleString("ru-RU")}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-3 text-sm text-slate-400">Пока нет данных</p>
      )}
    </div>
  );
}

export function HealthBadge({ active, total }: { active: number; total: number }) {
  const ratio = total > 0 ? active / total : 0;
  const style =
    ratio >= 0.8
      ? "bg-emerald-50 text-emerald-700"
      : ratio >= 0.5
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${style}`}>{active}/{total} свежих</span>;
}
