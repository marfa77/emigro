import type { EmigroScoreTone } from "@/lib/emigro-score";

const TONE_GLOW: Record<EmigroScoreTone, string> = {
  good: "from-emerald-400/40 via-teal-300/20 to-transparent",
  warn: "from-amber-400/40 via-orange-300/15 to-transparent",
  critical: "from-rose-500/45 via-red-400/20 to-transparent",
};

const TONE_NUMBER: Record<EmigroScoreTone, string> = {
  good: "text-emerald-300",
  warn: "text-amber-300",
  critical: "text-rose-300",
};

type Props = {
  overall100: number;
  tone: EmigroScoreTone;
  /** Compact for small cards */
  size?: "hero" | "card" | "chip";
  className?: string;
};

export function EmigroScoreFace({ overall100, tone, size = "hero", className = "" }: Props) {
  if (size === "chip") {
    return (
      <div
        className={`inline-flex items-baseline gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-sm ${className}`}
        aria-label={`Emigro Score ${overall100} из 100`}
      >
        <span className={`text-lg font-bold tabular-nums leading-none ${TONE_NUMBER[tone]}`}>{overall100}</span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-white/55">/100</span>
      </div>
    );
  }

  if (size === "card") {
    return (
      <div className={`relative ${className}`} aria-label={`Emigro Score ${overall100} из 100`}>
        <div
          className={`pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-br ${TONE_GLOW[tone]} blur-xl`}
          aria-hidden
        />
        <div className="relative flex flex-col items-start">
          <span className={`text-5xl font-bold tabular-nums tracking-tight sm:text-6xl ${TONE_NUMBER[tone]}`}>
            {overall100}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
            Emigro · /100
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} aria-label={`Emigro Score ${overall100} из 100`}>
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${TONE_GLOW[tone]} blur-2xl`}
        aria-hidden
      />
      <div className="relative flex flex-col items-center text-center">
        <span className={`text-6xl font-bold tabular-nums tracking-tight sm:text-7xl ${TONE_NUMBER[tone]}`}>
          {overall100}
        </span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
          Emigro Score · /100
        </span>
      </div>
    </div>
  );
}
