"use client";

import { Send } from "lucide-react";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/client";
import { wizardTelegramDeepLink, type WizardTelegramMode } from "@/lib/telegram/deep-link";

type TelegramResultsCtaProps = {
  mode: WizardTelegramMode;
  sessionId: string;
  topRecommendation?: string;
  matchCount?: number;
};

export function TelegramResultsCta({
  mode,
  sessionId,
  topRecommendation,
  matchCount,
}: TelegramResultsCtaProps) {
  const href = wizardTelegramDeepLink({ mode, sessionId });
  const label = "Получить разбор в Telegram";

  useEffect(() => {
    try {
      window.sessionStorage.setItem("wizard_session_id", sessionId);
      window.sessionStorage.setItem("wizard_session_mode", mode);
    } catch {
      /* optional local context */
    }
  }, [mode, sessionId]);

  return (
    <section className="mt-8 rounded-2xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Сохранить результат</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Откроем Telegram и привяжем этот результат к чату. Регистрация не нужна.
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("wizard_results_click", {
              session_id: sessionId,
              result_mode: mode,
              target_path: href,
              link_label: label,
              top_recommendation: topRecommendation ?? "",
              matches: matchCount ?? 0,
            })
          }
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Send className="h-4 w-4" />
          {label}
        </a>
      </div>
    </section>
  );
}
