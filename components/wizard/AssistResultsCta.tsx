"use client";

import Link from "next/link";
import { ArrowRight, FileText, UserCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { buildAssistUrl } from "@/lib/assist/build-url";
import { formatCountryProgramLabel } from "@/lib/wizard/format-country-program-label";

export type AssistResultsPlacement = "wizard_hub_results" | "wizard_corridor_results";

type Props = {
  sessionId: string;
  placement: AssistResultsPlacement;
  country?: string;
  countryRu?: string;
  countryLabel?: string;
  programTitle?: string;
  locale?: "ru" | "es" | "fr";
  /** Potential matches (outcome !== unlikely). */
  matchCount?: number;
  /** likely_eligible count. */
  strongMatchCount?: number;
  pickOutcome?: string;
  /**
   * When true (ambiguous / no strong match), Route Check is the primary CTA —
   * monetize uncertainty, not just traffic.
   */
  preferRouteCheck?: boolean;
};

export function AssistResultsCta({
  sessionId,
  placement,
  country,
  countryRu,
  countryLabel,
  programTitle,
  locale = "ru",
  matchCount,
  strongMatchCount,
  pickOutcome,
  preferRouteCheck = false,
}: Props) {
  const assistHref = buildAssistUrl({
    sessionId,
    country,
    program: programTitle,
    locale,
  });
  const routeCheckHref = buildAssistUrl({
    sessionId,
    country,
    program: programTitle,
    locale,
    hash: "assist-form-route-check",
  });
  /** Sample PDF page exists only under /ru for now — hide for es/fr to avoid locale leak. */
  const samplePlanHref = locale === "ru" ? "/ru/assist/sample-plan" : null;
  const label = countryLabel ?? countryRu;
  const ctaVariant = preferRouteCheck ? "route_check_primary" : "partner_primary";

  function trackAssistClick(linkLabel: string, targetPath: string) {
    trackEvent("assist_cta_click", {
      session_id: sessionId,
      placement,
      link_label: linkLabel,
      target_path: targetPath,
      country: country ?? "",
      program: programTitle ?? "",
      locale,
      cta_variant: ctaVariant,
      match_count: matchCount ?? "",
      strong_match_count: strongMatchCount ?? "",
      pick_outcome: pickOutcome ?? "",
    });
  }

  const copy =
    locale === "es"
      ? {
          eyebrow: preferRouteCheck ? "Perfil ambiguo" : "Siguiente paso",
          title: preferRouteCheck
            ? "¿Varias rutas o requisitos poco claros?"
            : "¿Necesita ayuda con su caso?",
          context:
            label && programTitle
              ? `Según sus respuestas: ${formatCountryProgramLabel(label, programTitle)}.`
              : label
                ? `Corredor: ${label}.`
                : "Con el resultado del evaluador, Emigro puede encontrar un especialista para su caso.",
          body: preferRouteCheck
            ? "Route Check (€129) es un análisis independiente con PDF cuando el shortlist no es obvio."
            : "Describa su necesidad: seleccionaremos un partner por país y ruta y compartiremos la solicitud solo con su consentimiento.",
          call: "Selección e introducción gratuitas; los servicios del partner se acuerdan directamente",
          pdfPrefix: "Para un análisis independiente con PDF — ",
          sample: "ver muestra",
          sampleTrack: "Ver muestra PDF",
          cta: "Encontrar especialista",
          paidCta: "Route Check con PDF — €129",
        }
      : locale === "fr"
        ? {
            eyebrow: preferRouteCheck ? "Profil ambigu" : "Prochaine étape",
            title: preferRouteCheck
              ? "Plusieurs voies ou critères peu clairs ?"
              : "Besoin d’aide pour votre dossier ?",
            context:
              label && programTitle
                ? `Selon vos réponses : ${formatCountryProgramLabel(label, programTitle)}.`
                : label
                  ? `Corridor : ${label}.`
                  : "Avec le résultat de l’évaluateur, Emigro peut trouver un spécialiste pour votre cas.",
            body: preferRouteCheck
              ? "Route Check (€129) = analyse indépendante avec PDF lorsque le shortlist n’est pas évident."
              : "Décrivez votre besoin : nous sélectionnerons un partenaire par pays et voie, puis transmettrons la demande avec votre accord.",
            call: "Sélection et mise en relation gratuites ; services du partenaire convenus directement",
            pdfPrefix: "Pour une analyse indépendante avec PDF — ",
            sample: "voir un exemple",
            sampleTrack: "Voir exemple PDF",
            cta: "Trouver un spécialiste",
            paidCta: "Route Check avec PDF — €129",
          }
        : {
            eyebrow: preferRouteCheck ? "Неочевидный shortlist" : "Следующий шаг",
            title: preferRouteCheck
              ? "Несколько маршрутов или неясные требования?"
              : "Нужна помощь с вашим кейсом?",
            context:
              label && programTitle
                ? `По вашим ответам: ${formatCountryProgramLabel(label, programTitle)}.`
                : label
                  ? `Коридор: ${label}.`
                  : "По результатам wizard Emigro может найти специалиста под ваш кейс.",
            body: preferRouteCheck
              ? "Route Check (€129) — независимый разбор с PDF, когда shortlist не даёт одного очевидного шага."
              : "Опишите задачу — подберём партнёра по стране и маршруту и передадим запрос только с вашего согласия.",
            call: "Подбор и знакомство бесплатно; услуги партнёра обсуждаются напрямую",
            pdfPrefix: "Для независимого разбора с PDF — ",
            sample: "посмотреть образец",
            sampleTrack: "Образец PDF",
            cta: "Найти специалиста",
            paidCta: "Route Check с PDF — €129",
          };

  const primaryHref = preferRouteCheck ? routeCheckHref : assistHref;
  const primaryLabel = preferRouteCheck ? copy.paidCta : copy.cta;
  const secondaryHref = preferRouteCheck ? assistHref : routeCheckHref;
  const secondaryLabel = preferRouteCheck ? copy.cta : copy.paidCta;

  return (
    <section className="mt-8 rounded-2xl border-2 border-corridor-600 bg-gradient-to-br from-corridor-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{copy.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {copy.context} {copy.body}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>{copy.call}</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>
                {copy.pdfPrefix}
                {samplePlanHref ? (
                  <Link
                    href={samplePlanHref}
                    data-assist-tracked="true"
                    onClick={() => trackAssistClick(copy.sampleTrack, samplePlanHref)}
                    className="font-medium text-corridor-700 hover:underline"
                  >
                    {copy.sample}
                  </Link>
                ) : (
                  <span className="text-slate-600">
                    {locale === "es" ? "plan de caso" : locale === "fr" ? "plan de cas" : "план кейса"}
                  </span>
                )}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={primaryHref}
            data-assist-tracked="true"
            onClick={() => trackAssistClick(primaryLabel, primaryHref)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-corridor-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-corridor-700 sm:w-auto"
          >
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href={secondaryHref}
            data-assist-tracked="true"
            onClick={() => trackAssistClick(secondaryLabel, secondaryHref)}
            className="text-center text-sm font-medium text-corridor-700 hover:underline"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
