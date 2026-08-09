"use client";

import Link from "next/link";
import type { EmigroScoreAxisView, EmigroScoreTone } from "@/lib/emigro-score";
import { EMIGRO_SCORE_BASELINE_NOTE, EMIGRO_SCORE_PATH } from "@/lib/emigro-score";

const BAR: Record<EmigroScoreTone, string> = {
  good: "bg-emerald-400",
  warn: "bg-amber-400",
  critical: "bg-rose-500",
};

type Props = {
  axes: EmigroScoreAxisView[];
  asOf: string;
  summary?: string;
  showBaseline?: boolean;
};

export function EmigroScoreAxes({ axes, asOf, summary, showBaseline = true }: Props) {
  return (
    <div className="flex h-full flex-col">
      {summary && <p className="mb-2 text-[11px] leading-snug text-white/80 sm:text-xs">{summary}</p>}
      <div className="space-y-2 sm:space-y-2.5">
        {axes.map((axis) => (
          <div
            key={axis.id}
            className="flex items-center gap-2 text-xs text-white/90"
            aria-label={`${axis.label}: ${axis.value} из 100. ${axis.why}`}
          >
            <span className="w-16 shrink-0 truncate sm:w-[4.75rem]">{axis.label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className={`h-full rounded-full ${BAR[axis.tone]}`}
                style={{ width: `${Math.min(100, Math.max(0, axis.value))}%` }}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-[10px] tabular-nums text-white/70">{axis.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto space-y-1 pt-3">
        {showBaseline && (
          <p className="text-[9px] leading-snug text-white/45 sm:text-[10px]">{EMIGRO_SCORE_BASELINE_NOTE}</p>
        )}
        <p className="text-[9px] uppercase tracking-wider text-white/40 sm:text-[10px]">
          Emigro Score · ориентир, не юр. оценка · {asOf}
        </p>
        <Link
          href={EMIGRO_SCORE_PATH}
          className="inline-block text-[10px] font-medium text-emerald-300/90 underline-offset-2 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          Методология
        </Link>
      </div>
    </div>
  );
}
