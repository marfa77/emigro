"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { wizardTelegramDeepLink, type WizardTelegramMode } from "@/lib/telegram/deep-link";
import { TelegramLoginWidget, type TelegramLoginPayload } from "@/components/wizard/TelegramLoginWidget";

type Props = {
  mode: WizardTelegramMode;
  sessionId: string;
  topRecommendation?: string;
  matchCount?: number;
};

export function WizardTelegramDelivery({ mode, sessionId, topRecommendation, matchCount }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const botHref = wizardTelegramDeepLink({ mode, sessionId });

  async function deliverViaWidget(user: TelegramLoginPayload) {
    setStatus("sending");
    setMessage(null);
    trackEvent("wizard_results_click", {
      session_id: sessionId,
      result_mode: mode,
      target_path: "/api/v1/wizard/telegram/deliver",
      link_label: "Telegram Login Widget",
      top_recommendation: topRecommendation ?? "",
      matches: matchCount ?? 0,
    });

    const res = await fetch("/api/v1/wizard/telegram/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        mode,
        ...user,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
    if (!res.ok) {
      setStatus("error");
      setMessage(data.error ?? "Не удалось отправить отчёт");
      return;
    }
    setStatus("sent");
    setMessage(data.message ?? "Отчёт отправлен в Telegram");
  }

  return (
    <section className="mt-8 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-lg font-semibold text-slate-900">Получить отчёт в Telegram</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Войдите через Telegram — бот пришлёт персональный разбор с топ-маршрутами и вашим профилем. Как в Barakhlo:
            без пароля, только официальный виджет Telegram или кнопка «Открыть бота».
          </p>
          {topRecommendation ? (
            <p className="mt-3 text-sm text-slate-700">
              <span className="font-medium">Топ сейчас:</span> {topRecommendation}
            </p>
          ) : null}
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3">
          <TelegramLoginWidget
            onAuth={deliverViaWidget}
            onError={(err) => {
              setStatus("error");
              setMessage(err);
            }}
          />

          <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            или
            <span className="h-px flex-1 bg-slate-200" />
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
                link_label: "Открыть бота",
                top_recommendation: topRecommendation ?? "",
                matches: matchCount ?? 0,
              })
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-300 bg-white px-4 py-3 text-sm font-medium text-sky-800 hover:bg-sky-50"
          >
            <Send className="h-4 w-4" />
            Открыть @emigro_chat_bot
          </a>
        </div>
      </div>

      {status === "sending" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-sky-800">
          <Loader2 className="h-4 w-4 animate-spin" />
          Отправляем отчёт в Telegram…
        </p>
      )}
      {status === "sent" && message && (
        <p className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </p>
      )}
      {status === "error" && message && <p className="mt-4 text-sm text-red-700">{message}</p>}
    </section>
  );
}
