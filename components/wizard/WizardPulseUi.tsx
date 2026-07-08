import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import type { PulseShare } from "@/lib/wizard/pulse";

export function PulseShareList({ items, emptyLabel }: { items: PulseShare[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-200">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate font-medium text-white">{item.label}</span>
          <span className="shrink-0 font-bold tabular-nums text-corridor-100">{item.share}%</span>
        </li>
      ))}
    </ul>
  );
}

export function PulseCard({
  icon: Icon,
  title,
  children,
  tone = "dark",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  const titleClass = tone === "light" ? "text-corridor-700" : "text-white";
  const shellClass =
    tone === "light"
      ? "rounded-xl border border-corridor-100 bg-white p-4 shadow-sm"
      : "rounded-xl border border-slate-600/60 bg-slate-800/80 p-4";

  return (
    <article className={shellClass}>
      <div className={`flex items-center gap-2 ${titleClass}`}>
        <Icon className="h-4 w-4" />
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </article>
  );
}

export function PulseHeader({
  title,
  subtitle,
  headingId,
}: {
  title: string;
  subtitle: string;
  headingId: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-corridor-100">
          <Activity className="h-4 w-4 text-corridor-100" />
          Пульс маршрутов
        </p>
        <h2 id={headingId} className="mt-2 text-lg font-bold text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-200">{subtitle}</p>
      </div>
      <p className="max-w-xs text-xs leading-relaxed text-slate-300">
        Агрегированные тренды Emigro, не статистика миграции и не данные конкретных пользователей.
      </p>
    </div>
  );
}
