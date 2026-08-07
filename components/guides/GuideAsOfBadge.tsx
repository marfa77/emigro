import { CalendarDays } from "lucide-react";
import { formatGuideAsOfDateRu } from "@/lib/guides/guide-dates";

type Variant = "hero" | "banner" | "sidebar" | "compact";

type Props = {
  dateIso: string;
  variant?: Variant;
  className?: string;
};

/**
 * Single-line “as of” chip — label and date share one visual rhythm
 * (no giant date + tiny eyebrow wrapping across lines).
 */
export function GuideAsOfBadge({ dateIso, variant = "banner", className = "" }: Props) {
  const dateRu = formatGuideAsOfDateRu(dateIso);
  if (!dateRu) return null;

  const wrap =
    variant === "hero"
      ? "mt-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm text-amber-50 backdrop-blur"
      : variant === "sidebar"
        ? "inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-2 text-sm text-amber-950"
        : variant === "compact"
          ? "inline-flex items-center gap-1.5 text-xs font-semibold text-amber-950"
          : "mt-0 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200/90 bg-amber-50 px-3.5 py-2 text-sm text-amber-950 shadow-sm";

  const labelClass =
    variant === "hero" ? "font-medium text-amber-100/90" : "font-medium text-amber-800/90";
  const dateClass =
    variant === "hero" ? "font-semibold tabular-nums text-white" : "font-semibold tabular-nums text-slate-900";

  return (
    <div className={`${wrap} ${className}`.trim()}>
      <CalendarDays className="h-4 w-4 flex-none opacity-80" aria-hidden />
      <span className={labelClass}>Актуально на</span>
      <time dateTime={dateIso} className={dateClass}>
        {dateRu}
      </time>
    </div>
  );
}
