"use client";

import { useEffect } from "react";
import { NEWS_TELEGRAM_URL } from "@/lib/community";

/** Browser-only redirect so crawlers still see Emigro OG HTML. */
export function TelegramGoRedirect() {
  useEffect(() => {
    window.location.replace(NEWS_TELEGRAM_URL);
  }, []);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center gap-4 px-6 py-16 text-center">
      <p className="text-sm uppercase tracking-wide text-slate-500">Emigro</p>
      <h1 className="text-2xl font-semibold text-slate-900">Открываем Telegram…</h1>
      <p className="text-slate-600">
        Канал{" "}
        <a className="font-medium text-sky-700 underline" href={NEWS_TELEGRAM_URL}>
          @Emigro_news
        </a>{" "}
        — новости релокации и виз.
      </p>
      <p>
        <a
          className="inline-flex rounded-full bg-sky-700 px-5 py-2.5 text-sm font-medium text-white"
          href={NEWS_TELEGRAM_URL}
        >
          Открыть канал
        </a>
      </p>
    </main>
  );
}
