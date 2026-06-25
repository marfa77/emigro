import Link from "next/link";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";

export const OUTCOME_LABELS: Record<string, string> = {
  likely_eligible: "Вероятно подходит",
  needs_review: "Требует проверки",
  unlikely: "Маловероятно",
};

export const OUTCOME_COLORS: Record<string, string> = {
  likely_eligible: "bg-green-100 text-green-800 border-green-200",
  needs_review: "bg-amber-100 text-amber-800 border-amber-200",
  unlikely: "bg-slate-100 text-slate-600 border-slate-200",
};

export function WizardOutcomeCard({
  title,
  programType,
  outcome,
  reasons,
  href,
}: {
  title: string;
  programType?: string;
  outcome: string;
  reasons?: string[];
  href?: string;
}) {
  return (
    <div className={`rounded-xl border p-5 ${OUTCOME_COLORS[outcome] ?? "border-slate-200 bg-white"}`}>
      {programType && <ProgramTypeBadge type={programType} />}
      <h2 className={`font-semibold ${programType ? "mt-3" : ""}`}>{title}</h2>
      <p className="mt-2 text-sm">{OUTCOME_LABELS[outcome] ?? outcome}</p>
      {reasons && reasons.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm opacity-90">
          {reasons.slice(0, 4).map((reason) => (
            <li key={reason}>• {reason}</li>
          ))}
        </ul>
      )}
      {href && (
        <Link href={href} className="mt-4 inline-block text-sm text-corridor-700 underline">
          Подробнее →
        </Link>
      )}
    </div>
  );
}
