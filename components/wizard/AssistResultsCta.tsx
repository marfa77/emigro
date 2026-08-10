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
  locale?: "ru" | "es";
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
  const isEs = locale === "es";
  const assistHref = buildAssistUrl({
    sessionId,
    country,
    program: programTitle,
    locale,
  });
  const samplePlanHref = isEs ? "/ru/assist/sample-plan" : "/ru/assist/sample-plan";
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

  const contextLine = isEs
    ? label && programTitle
      ? `Según sus respuestas: ${label} — ${programTitle}.`
      : label
        ? `Corredor: ${label}.`
        : "Con el resultado del evaluador, el equipo Emigro revisa su caso en una llamada."
    : label && programTitle
      ? `По вашим ответам: ${label} — ${programTitle}.`
      : label
        ? `Коридор: ${label}.`
        : "По результатам wizard команда Emigro разберёт ваш кейс на созвоне.";

  return (
    <section className="mt-8 rounded-2xl border-2 border-corridor-600 bg-gradient-to-br from-corridor-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
            {isEs ? "Siguiente paso" : "Следующий шаг"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Route Check — €129</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {contextLine}{" "}
            {isEs
              ? "Llamada con el equipo Emigro según checklist, PDF con ruta, timeline, presupuesto y riesgos en 48 h — más selección de partners para su corredor."
              : "Созвон с командой Emigro по чек-листу, PDF с маршрутом, таймлайном, бюджетом и рисками в течение 48 часов — плюс подбор партнёров под ваш коридор."}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>
                {isEs
                  ? "Llamada estructurada en español — no consejos genéricos, sino su caso"
                  : "Структурированный созвон на русском — не общие советы, а разбор вашей ситуации"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-corridor-600" aria-hidden />
              <span>
                {isEs ? "PDF tras la reunión — " : "PDF-план после встречи — "}
                <Link
                  href={samplePlanHref}
                  onClick={() =>
                    trackAssistClick(isEs ? "Ver muestra PDF" : "Образец PDF", samplePlanHref)
                  }
                  className="font-medium text-corridor-700 hover:underline"
                >
                  {isEs ? "ver muestra" : "посмотреть образец"}
                </Link>
              </span>
            </li>
          </ul>
        </div>

        <Link
          href={assistHref}
          onClick={() =>
            trackAssistClick(
              isEs ? "Solicitar Route Check — €129" : "Запросить Route Check — €129",
              assistHref
            )
          }
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-corridor-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-corridor-700 sm:w-auto sm:self-start"
        >
          {isEs ? "Solicitar Route Check — €129" : "Запросить Route Check — €129"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
