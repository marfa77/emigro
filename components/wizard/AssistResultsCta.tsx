"use client";

import Link from "next/link";
import { ArrowRight, FileText, Phone } from "lucide-react";
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
  const samplePlanHref = "/ru/assist/sample-plan";
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
                : "Con el resultado del evaluador, el equipo Emigro revisa su caso en una llamada.",
          body: "Llamada con el equipo Emigro según checklist, PDF con ruta, timeline, presupuesto y riesgos en 48 h — más selección de partners para su corredor.",
          call: "Llamada estructurada en español — no consejos genéricos, sino su caso",
          pdfPrefix: "PDF tras la reunión — ",
          sample: "ver muestra",
          sampleTrack: "Ver muestra PDF",
          cta: "Solicitar Route Check — €129",
        }
      : locale === "fr"
        ? {
            eyebrow: "Prochaine étape",
            context:
              label && programTitle
                ? `Selon vos réponses : ${label} — ${programTitle}.`
                : label
                  ? `Corridor : ${label}.`
                  : "Avec le résultat de l'évaluateur, l'équipe Emigro revoit votre cas en appel.",
            body: "Appel avec l'équipe Emigro selon checklist, PDF avec route, timeline, budget et risques sous 48 h — plus sélection de partenaires pour votre corridor.",
            call: "Appel structuré en français — pas des conseils génériques, mais votre cas",
            pdfPrefix: "PDF après la réunion — ",
            sample: "voir un exemple",
            sampleTrack: "Voir exemple PDF",
            cta: "Demander Route Check — €129",
          }
        : {
            eyebrow: "Следующий шаг",
            context:
              label && programTitle
                ? `По вашим ответам: ${label} — ${programTitle}.`
                : label
                  ? `Коридор: ${label}.`
                  : "По результатам wizard команда Emigro разберёт ваш кейс на созвоне.",
            body: "Созвон с командой Emigro по чек-листу, PDF с маршрутом, таймлайном, бюджетом и рисками в течение 48 часов — плюс подбор партнёров под ваш коридор.",
            call: "Структурированный созвон на русском — не общие советы, а разбор вашей ситуации",
            pdfPrefix: "PDF-план после встречи — ",
            sample: "посмотреть образец",
            sampleTrack: "Образец PDF",
            cta: "Запросить Route Check — €129",
          };

  return (
    <section className="mt-8 rounded-2xl border-2 border-corridor-600 bg-gradient-to-br from-corridor-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Route Check — €129</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {copy.context} {copy.body}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>{copy.call}</span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>
                {copy.pdfPrefix}
                <Link
                  href={samplePlanHref}
                  onClick={() => trackAssistClick(copy.sampleTrack, samplePlanHref)}
                  className="font-medium text-corridor-700 hover:underline"
                >
                  {copy.sample}
                </Link>
              </span>
            </li>
          </ul>
        </div>

        <Link
          href={assistHref}
          onClick={() => trackAssistClick(copy.cta, assistHref)}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-corridor-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-corridor-700 sm:w-auto sm:self-start"
        >
          {copy.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
