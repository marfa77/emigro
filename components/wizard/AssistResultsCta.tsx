"use client";

import { ArrowRight, UserCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { buildAssistUrl } from "@/lib/assist/build-url";
import { assistBotDeepLink } from "@/lib/telegram/deep-link";
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
  /** Ambiguous / no strong match: changes the heading only (no paid CTA since 2026-11-19). */
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
  const assistHref =
    locale === "ru"
      ? assistBotDeepLink({ country })
      : buildAssistUrl({
          sessionId,
          country,
          program: programTitle,
          locale,
        });
  const label = countryLabel ?? countryRu;
  // Free for users since 2026-11-19: one free CTA; preferRouteCheck only changes the heading.
  const ctaVariant = "partner_primary";

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
          body: "Describa su necesidad: seleccionaremos un especialista por país y ruta y compartiremos la solicitud solo con su consentimiento.",
          call: "Gratis para usted: el especialista paga la comisión a Emigro; sus servicios se acuerdan directamente",
          cta: "Encontrar especialista — gratis",
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
            body: "Décrivez votre besoin : nous sélectionnerons un spécialiste par pays et voie, puis transmettrons la demande avec votre accord.",
            call: "Gratuit pour vous : le spécialiste verse la commission à Emigro ; ses services se négocient directement",
                  cta: "Trouver un spécialiste — gratuit",
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
            body: "Опишите задачу — подберём специалиста по стране и маршруту и передадим запрос только с вашего согласия.",
            call: "Для вас бесплатно: комиссию Emigro платит специалист; его услуги обсуждаете напрямую",
                  cta: "Подобрать специалиста — бесплатно",
            };

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
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={assistHref}
            data-assist-tracked="true"
            onClick={() => trackAssistClick(copy.cta, assistHref)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-corridor-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-corridor-700 sm:w-auto"
            {...(assistHref.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
