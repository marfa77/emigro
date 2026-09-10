"use client";

import Link from "next/link";
import { ArrowRight, FileText, UserCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { buildAssistUrl } from "@/lib/assist/build-url";

export type AssistResultsPlacement = "wizard_hub_results" | "wizard_corridor_results";

type Props = {
  sessionId: string;
  placement: AssistResultsPlacement;
  country?: string;
  countryRu?: string;
  countryLabel?: string;
  programTitle?: string;
  locale?: "ru" | "es" | "fr";
};

export function AssistResultsCta({
  sessionId,
  placement,
  country,
  countryRu,
  countryLabel,
  programTitle,
  locale = "ru",
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

  function trackAssistClick(linkLabel: string, targetPath: string) {
    trackEvent("assist_cta_click", {
      session_id: sessionId,
      placement,
      link_label: linkLabel,
      target_path: targetPath,
      country: country ?? "",
      program: programTitle ?? "",
      locale,
    });
  }

  const copy =
    locale === "es"
      ? {
          eyebrow: "Siguiente paso",
          context:
            label && programTitle
              ? `Según sus respuestas: ${label} — ${programTitle}.`
              : label
                ? `Corredor: ${label}.`
                : "Con el resultado del evaluador, Emigro puede encontrar un especialista para su caso.",
          body: "Describa su necesidad: seleccionaremos un partner por país y ruta y compartiremos la solicitud solo con su consentimiento.",
          call: "Selección e introducción gratuitas; los servicios del partner se acuerdan directamente",
          pdfPrefix: "Para un análisis independiente con PDF — ",
          sample: "ver muestra",
          sampleTrack: "Ver muestra PDF",
          cta: "Solicitar ayuda gratis",
          paidCta: "Route Check con PDF — €129",
        }
      : locale === "fr"
        ? {
            eyebrow: "Prochaine étape",
            context:
              label && programTitle
                ? `Selon vos réponses : ${label} — ${programTitle}.`
                : label
                  ? `Corridor : ${label}.`
                  : "Avec le résultat de l’évaluateur, Emigro peut trouver un spécialiste pour votre cas.",
            body: "Décrivez votre besoin : nous sélectionnerons un partenaire par pays et voie, puis transmettrons la demande avec votre accord.",
            call: "Sélection et mise en relation gratuites ; services du partenaire convenus directement",
            pdfPrefix: "Pour une analyse indépendante avec PDF — ",
            sample: "voir un exemple",
            sampleTrack: "Voir exemple PDF",
            cta: "Demander de l’aide gratuitement",
            paidCta: "Route Check avec PDF — €129",
          }
        : {
            eyebrow: "Следующий шаг",
            context:
              label && programTitle
                ? `По вашим ответам: ${label} — ${programTitle}.`
                : label
                  ? `Коридор: ${label}.`
                  : "По результатам wizard Emigro может найти специалиста под ваш кейс.",
            body: "Опишите задачу — подберём партнёра по стране и маршруту и передадим запрос только с вашего согласия.",
            call: "Подбор и знакомство бесплатно; услуги партнёра обсуждаются напрямую",
            pdfPrefix: "Для независимого разбора с PDF — ",
            sample: "посмотреть образец",
            sampleTrack: "Образец PDF",
            cta: "Получить помощь бесплатно",
            paidCta: "Route Check с PDF — €129",
          };

  return (
    <section className="mt-8 rounded-2xl border-2 border-corridor-600 bg-gradient-to-br from-corridor-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
            {locale === "es"
              ? "¿Necesita ayuda con su caso?"
              : locale === "fr"
                ? "Besoin d’aide pour votre dossier ?"
                : "Нужна помощь с вашим кейсом?"}
          </h2>
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
            href={assistHref}
            onClick={() => trackAssistClick(copy.cta, assistHref)}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-corridor-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-corridor-700 sm:w-auto"
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href={routeCheckHref}
            onClick={() => trackAssistClick(copy.paidCta, routeCheckHref)}
            className="text-center text-sm font-medium text-corridor-700 hover:underline"
          >
            {copy.paidCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
