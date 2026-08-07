import { CalendarDays } from "lucide-react";
import { formatGuideAsOfDateRu } from "@/lib/guides/guide-dates";

type Variant = "hero" | "banner" | "sidebar" | "compact";

type Props = {
  dateIso: string;
  variant?: Variant;
  className?: string;
};

const variants: Record<
  Variant,
  { wrap: string; label: string; date: string; hint?: string }
> = {
  hero: {
    wrap: "mt-6 inline-flex max-w-full flex-col gap-1 rounded-2xl border border-amber-300/40 bg-amber-300/15 px-4 py-3 text-left backdrop-blur sm:px-5",
    label: "text-xs font-semibold uppercase tracking-[0.16em] text-amber-100",
    date: "text-2xl font-bold leading-tight text-white sm:text-3xl",
    hint: "text-sm text-amber-50/90",
  },
  banner: {
    wrap: "rounded-[1.5rem] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-sky-50 px-5 py-4 shadow-sm ring-1 ring-amber-100 sm:px-6 sm:py-5",
    label: "text-xs font-semibold uppercase tracking-[0.16em] text-amber-800",
    date: "text-2xl font-bold leading-tight text-slate-950 sm:text-3xl",
    hint: "mt-1 text-sm text-slate-600",
  },
  sidebar: {
    wrap: "rounded-2xl border border-amber-200 bg-amber-50 p-5",
    label: "text-xs font-semibold uppercase tracking-wide text-amber-800",
    date: "mt-1 text-xl font-bold text-slate-950",
    hint: "mt-2 text-sm leading-relaxed text-slate-600",
  },
  compact: {
    wrap: "inline-flex items-center gap-1.5 text-xs font-bold text-amber-950",
    label: "",
    date: "tabular-nums",
  },
};

export function GuideAsOfBadge({ dateIso, variant = "banner", className = "" }: Props) {
  const styles = variants[variant];
  const dateRu = formatGuideAsOfDateRu(dateIso);

  if (variant === "compact") {
    return (
      <span className={`${styles.wrap} ${className}`.trim()}>
        <CalendarDays className="h-3.5 w-3.5 flex-none" aria-hidden />
        <time dateTime={dateIso} className={styles.date}>
          Актуально на {dateRu}
        </time>
      </span>
    );
  }

  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      <p className={`inline-flex items-center gap-2 ${styles.label}`}>
        <CalendarDays className="h-4 w-4" aria-hidden />
        Актуально на
      </p>
      <time dateTime={dateIso} className={styles.date}>
        {dateRu}
      </time>
      {styles.hint ? (
        <p className={styles.hint}>
          Цифры и процедуры сверяйте с официальными источниками на дату подачи.
        </p>
      ) : null}
    </div>
  );
}
