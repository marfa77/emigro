import { ArrowRight } from "lucide-react";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { buildAssistUrl } from "@/lib/assist/build-url";

type Props = {
  placement: string;
  source: string;
  countrySegment?: string;
  variant?: "light" | "hero";
  /** Legacy prop from the paid Route Check era; ignored since Emigro is free for users (2026-11-19). */
  lead?: "route-check";
  className?: string;
};

const ASSIST_LABEL = "Подобрать специалиста — бесплатно";
const HEADING = "Нужна помощь с этим маршрутом?";

const STYLES = {
  light: {
    section: "rounded-2xl border border-corridor-200 bg-corridor-50 p-4 sm:p-5",
    heading: "text-base font-semibold text-slate-900",
    text: "text-slate-600",
    primary: "bg-corridor-600 text-white hover:bg-corridor-700",
  },
  hero: {
    section: "rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5",
    heading: "text-base font-semibold text-white",
    text: "text-corridor-50",
    primary: "bg-white text-corridor-800 hover:bg-corridor-50",
  },
} as const;

/** One free path to a specialist, right under the H1 of a guide or after a news lead. */
export function RouteNextStep({ placement, source, countrySegment, variant = "light", className = "" }: Props) {
  const assistHref = buildAssistUrl({ country: countrySegment, source });
  const styles = STYLES[variant];

  return (
    <section aria-label={HEADING} className={`${styles.section} ${className}`}>
      <p className={styles.heading}>{HEADING}</p>
      <p className={`mt-1 text-sm leading-relaxed ${styles.text}`}>
        Подберём юриста или агентство по вашей стране и задаче. Для вас бесплатно.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TrackedAssistLink
          href={assistHref}
          placement={`${placement}_assist`}
          linkLabel={ASSIST_LABEL}
          country={countrySegment}
          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${styles.primary}`}
        >
          {ASSIST_LABEL}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </TrackedAssistLink>
      </div>
    </section>
  );
}
