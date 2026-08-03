"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, Check, Loader2, ThumbsUp } from "lucide-react";
import { storySubmitPath } from "@/lib/stories/paths";

type GuideFeedbackButtonsProps = {
  slug: string;
  title: string;
  path: string;
  className?: string;
};

type Kind = "liked" | "outdated";
type Status = "idle" | "sending" | "done" | "error";

export function GuideFeedbackButtons({ slug, title, path, className = "" }: GuideFeedbackButtonsProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [sentKind, setSentKind] = useState<Kind | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function send(kind: Kind, withNote = false) {
    if (status === "sending" || status === "done") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/v1/guides/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          kind,
          title,
          path,
          note: withNote ? note.trim() : undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Ошибка отправки");
      }
      setSentKind(kind);
      setStatus("done");
      setShowNote(false);
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Ошибка отправки");
    }
  }

  if (status === "done" && sentKind) {
    return (
      <section
        className={`rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-4 text-sm text-emerald-900 sm:px-5 ${className}`}
        aria-live="polite"
      >
        <p className="inline-flex items-center gap-2 font-medium">
          <Check className="h-4 w-4" aria-hidden />
          {sentKind === "liked"
            ? "Спасибо — отметили, что гайд полезен."
            : "Спасибо — сигнал об устаревшей информации отправлен."}
        </p>
        {sentKind === "outdated" ? (
          <p className="mt-3 leading-relaxed text-emerald-900/90">
            Если у вас есть 10 минут — напишите краткую историю, что изменилось. Опубликуем как дополнение к гайду с
            вашим именем.{" "}
            <Link
              href={storySubmitPath({ guide: slug, disagree: true })}
              className="font-semibold underline decoration-emerald-700/40 underline-offset-2 hover:decoration-emerald-900"
            >
              Добавить мою версию событий
            </Link>
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 sm:px-5 ${className}`}
      aria-label="Оценка гайда"
    >
      <p className="text-sm font-medium text-slate-800">Этот гайд помог?</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        Короткий сигнал уходит редакции Emigro в Telegram — без регистрации.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={status === "sending"}
          onClick={() => void send("liked")}
          className="inline-flex items-center gap-2 rounded-full border border-corridor-200 bg-white px-3.5 py-2 text-sm font-medium text-corridor-800 shadow-sm transition hover:border-corridor-300 hover:bg-corridor-50 disabled:opacity-60"
        >
          {status === "sending" && !showNote ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <ThumbsUp className="h-4 w-4" aria-hidden />
          )}
          Понравилось
        </button>

        <button
          type="button"
          disabled={status === "sending"}
          onClick={() => {
            setShowNote((v) => !v);
            setError(null);
          }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3.5 py-2 text-sm font-medium text-amber-900 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 disabled:opacity-60"
        >
          <AlertTriangle className="h-4 w-4" aria-hidden />
          Информация устарела
        </button>
      </div>

      {showNote ? (
        <div className="mt-3 space-y-2">
          <label htmlFor={`guide-outdated-${slug}`} className="sr-only">
            Что устарело
          </label>
          <textarea
            id={`guide-outdated-${slug}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={800}
            placeholder="Необязательно: что именно устарело (порог, срок, ссылка)…"
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none ring-corridor-500/30 placeholder:text-slate-400 focus:ring-2"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={status === "sending"}
              onClick={() => void send("outdated", true)}
              className="inline-flex items-center gap-2 rounded-full bg-amber-700 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-amber-800 disabled:opacity-60"
            >
              {status === "sending" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              Отправить сигнал
            </button>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-slate-700"
              onClick={() => setShowNote(false)}
            >
              Отмена
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
