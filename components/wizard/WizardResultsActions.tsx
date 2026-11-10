"use client";

import { useEffect, useState } from "react";
import { QuickRequestForm } from "@/components/assist/QuickRequestForm";

type Props = {
  sessionId: string;
  pickLabel?: string;
  country?: string;
  corridorSlug?: string;
  countryRu?: string;
  programTitle?: string;
  matchCount: number;
  householdNote?: string;
};

/**
 * Wizard results → request, nothing in between. The request carries the wizard context
 * (top route, matches, household) so the visitor only types a name and a contact.
 */
export function WizardResultsActions({
  sessionId,
  pickLabel,
  country,
  corridorSlug,
  countryRu,
  programTitle,
  matchCount,
  householdNote,
}: Props) {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const form = document.getElementById("results-request");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0), {
      threshold: 0,
    });
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const contextNote = [
    "Заявка после подбора маршрута.",
    pickLabel ? `Лучшее совпадение: ${pickLabel}.` : "Явных совпадений нет.",
    `Совпадений: ${matchCount}.`,
    householdNote,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section id="results-request" className="mt-5 scroll-mt-24 rounded-2xl border border-corridor-200 bg-corridor-50 p-5 sm:p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-corridor-700">
          {pickLabel ? "Лучшее совпадение" : "Явных совпадений нет"}
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-950 sm:text-2xl">
          {pickLabel ?? "Подскажем, что можно сделать"}
        </h2>
        <p className="mt-2 mb-4 max-w-2xl text-sm leading-relaxed text-slate-700">
          Оставьте контакт — разберём ваш профиль и подберём специалиста по маршруту. Бесплатно; контакт передаём
          партнёру только с вашего согласия.
        </p>
        <QuickRequestForm
          source="wizard_hub_results"
          countryLabel={countryRu ?? "не указано"}
          countrySegment={country}
          corridorSlug={corridorSlug}
          programRoute={programTitle}
          sessionId={sessionId}
          contextNote={contextNote}
          submitLabel="Получить разбор и специалиста"
        />
      </section>

      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur transition-transform duration-200 md:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <div className="mx-auto max-w-5xl px-4 py-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <a
            href="#results-request"
            tabIndex={showBar ? 0 : -1}
            className="flex w-full items-center justify-center rounded-lg bg-corridor-600 px-3 py-3 text-center text-sm font-semibold text-white"
          >
            Оставить заявку — бесплатно
          </a>
        </div>
      </div>
    </>
  );
}
