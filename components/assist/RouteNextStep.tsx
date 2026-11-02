import { ArrowRight } from "lucide-react";
import { TrackedAssistLink } from "@/components/assist/TrackedAssistLink";
import { buildAssistUrl } from "@/lib/assist/build-url";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";

type Props = {
  placement: string;
  source: string;
  countrySegment?: string;
  variant?: "light" | "hero";
  /** Italy visa guides: €129 audit is the first button, free matching stays second. */
  lead?: "route-check";
  className?: string;
};

const ASSIST_LABEL = "Подобрать специалиста — €0";
const ROUTE_CHECK_LABEL = "Route Check — €129: созвон + PDF-маршрут за 48 часов";
const ROUTE_CHECK_LEAD_HEADING = "Аудит отказа / выбор типа визы за 48 часов";
const ROUTE_CHECK_LEAD_LABEL = "Route Check €129 — за 48 часов";
const HEADING = "Нужна помощь с этим маршрутом?";

const STYLES = {
  light: {
    section: "rounded-2xl border border-corridor-200 bg-corridor-50 p-4 sm:p-5",
    heading: "text-base font-semibold text-slate-900",
    primary: "bg-corridor-600 text-white hover:bg-corridor-700",
    secondary: "border border-corridor-300 bg-white text-corridor-800 hover:bg-corridor-50",
  },
  hero: {
    section: "rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm sm:p-5",
    heading: "text-base font-semibold text-white",
    primary: "bg-white text-corridor-800 hover:bg-corridor-50",
    secondary: "border border-white/40 text-white hover:bg-white/10",
  },
} as const;

/** Assist matching + Route Check offer right under the H1 of a guide or after a news lead. */
export function RouteNextStep({
  placement,
  source,
  countrySegment,
  variant = "light",
  lead,
  className = "",
}: Props) {
  const assistHref = buildAssistUrl({ country: countrySegment, source });
  const styles = STYLES[variant];
  const routeCheckLead = lead === "route-check";
  const heading = routeCheckLead ? ROUTE_CHECK_LEAD_HEADING : HEADING;
  const routeCheckHref = routeCheckLead
    ? assistBotDeepLink({ tier: "route-check", country: countrySegment })
    : "/ru/route-check";
  const routeCheckLabel = routeCheckLead ? ROUTE_CHECK_LEAD_LABEL : "Route Check — €129";
  const routeCheckText = routeCheckLead ? ROUTE_CHECK_LEAD_LABEL : ROUTE_CHECK_LABEL;

  const assistLink = (
    <TrackedAssistLink
      href={assistHref}
      placement={`${placement}_assist`}
      linkLabel={ASSIST_LABEL}
      country={countrySegment}
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${
        routeCheckLead ? styles.secondary : styles.primary
      }`}
    >
      {ASSIST_LABEL}
      {routeCheckLead ? null : <ArrowRight className="h-4 w-4" aria-hidden />}
    </TrackedAssistLink>
  );

  const routeCheckLink = (
    <TrackedAssistLink
      href={routeCheckHref}
      placement={`${placement}_route_check`}
      linkLabel={routeCheckLabel}
      country={countrySegment}
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium ${
        routeCheckLead ? styles.primary : styles.secondary
      }`}
    >
      {routeCheckText}
      {routeCheckLead ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
    </TrackedAssistLink>
  );

  return (
    <section aria-label={heading} className={`${styles.section} ${className}`}>
      <p className={styles.heading}>{heading}</p>
      {routeCheckLead ? (
        <p className={`mt-1 text-sm leading-relaxed ${variant === "hero" ? "text-corridor-50" : "text-slate-600"}`}>
          Созвон и PDF с маршрутом, таймлайном и рисками. Оплата после согласования слота. Не гарантия визы.
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {routeCheckLead ? routeCheckLink : assistLink}
        {routeCheckLead ? assistLink : routeCheckLink}
      </div>
    </section>
  );
}
