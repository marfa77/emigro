import { Briefcase, Coins, Users } from "lucide-react";

const CONFIG: Record<string, { label: string; Icon: typeof Briefcase; className: string }> = {
  LABOR: {
    label: "Работа / удалёнка",
    Icon: Briefcase,
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  CAPITAL: {
    label: "Капитал / инвестиции",
    Icon: Coins,
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  BOND: {
    label: "Семья / связи",
    Icon: Users,
    className: "bg-violet-50 text-violet-900 border-violet-200",
  },
};

export function ProgramTypeBadge({ type }: { type: string }) {
  const cfg = CONFIG[type] ?? {
    label: type,
    Icon: Briefcase,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };
  const { Icon, label, className } = cfg;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </span>
  );
}
