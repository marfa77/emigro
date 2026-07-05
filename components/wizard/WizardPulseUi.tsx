import type { ReactNode } from "react";
import type { PulseShare } from "@/lib/wizard/pulse";

export function PulseShareList({ items, emptyLabel }: { items: PulseShare[]; emptyLabel: string }) {
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
  const titleClass = tone === "light" ? "text-corridor-700" : "text-teal-200";
  const shellClass =
    tone === "light"
      ? "rounded-xl border border-corridor-100 bg-white p-4 shadow-sm"
      : "rounded-xl border border-white/10 bg-white/5 p-4";

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
