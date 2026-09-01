"use client";

import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { portugalSatelliteUrlFromWizard } from "@/lib/portugal/hub";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

export type WizardPortugalPracticePlacement = "wizard_hub_results" | "wizard_corridor_results";

type Props = {
  sessionId: string;
  placement: WizardPortugalPracticePlacement;
};

export function WizardPortugalPracticeCta({ sessionId, placement }: Props) {
  const hubHref = portugalSatelliteUrlFromWizard("/", placement, "hub");
  const nifHref = portugalSatelliteUrlFromWizard("/notes/nif-porto-kak-poluchit-2026", placement, "nif");
  const chatHref = portoChatDeepLink(placement === "wizard_hub_results" ? "wizhub" : "wizcorr");

  function trackOutbound(label: string, href: string) {
    trackEvent("wizard_results_click", {
      session_id: sessionId,
      placement,
      link_label: label,
      target_path: href,
    });
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-5 sm:p-6"
      aria-labelledby="wizard-pt-practice-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Практика в Norte</p>
      <h2 id="wizard-pt-practice-heading" className="mt-1 text-xl font-semibold text-slate-900">
        Чат «Порту и вокруг» — без загадок
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Городской быт, жильё, встречи. Бот сразу пришлёт ссылку в личку. Документы и AIMA — выше, в Route Check, не в
        чате.
      </p>

      <a
        href={chatHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackOutbound("portugal_porto_chat", chatHref);
          trackEvent("community_join_click", {
            source: placement,
            session_id: sessionId,
            country: "portugal",
          });
        }}
        className={`mt-4 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Войти в чат «Порту и вокруг»
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={hubHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutbound("portugal_satellite_hub", hubHref)}
          className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:border-teal-500`}
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Практика на сателлите
        </a>
        <a
          href={nifHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutbound("portugal_satellite_nif", nifHref)}
          className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:border-teal-500`}
        >
          NIF в Porto
        </a>
      </div>
    </section>
  );
}
