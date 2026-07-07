"use client";

import { Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { wizardTelegramDeepLink, type WizardTelegramMode } from "@/lib/telegram/deep-link";

type Props = {
  mode: WizardTelegramMode;
  sessionId: string;
  topRecommendation?: string;
  matchCount?: number;
};

export function WizardTelegramDelivery({ mode, sessionId, topRecommendation, matchCount }: Props) {
  const botHref = wizardTelegramDeepLink({ mode, sessionId });

  return (
    <section className="mt-8 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Получить отчёт в Telegram</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Откройте бота и нажмите <span className="font-medium">Start</span> — пришлём персональный разбор с
            топ-маршрутами и вашим профилем. Так мы сохраним контакт и сможем прислать обновления по маршрутам.
          </p>
          {topRecommendation ? (
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-medium">Топ сейчас:</span> {topRecommendation}
            </p>
          ) : null}
        </div>

        <a
          href={botHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("wizard_results_click", {
              session_id: sessionId,
              result_mode: mode,
              target_path: botHref,
              link_label: "Получить отчёт в Telegram",
              top_recommendation: topRecommendation ?? "",
              matches: matchCount ?? 0,
            })
          }
          className="inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-[#2AABEE] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#229ED9] lg:w-auto"
        >
          <Send className="h-4 w-4" />
          Получить отчёт в Telegram
        </a>
      </div>
    </section>
  );
}
