"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { TelegramIcon } from "@/components/news/ShareIcons";
import { trackEvent } from "@/lib/analytics/client";
import { COMMUNITY_PATH, RELOCATOR_CHAT_LABEL, RELOCATOR_CHAT_URL } from "@/lib/community";

type Variant = "banner" | "inline" | "sidebar";

type Props = {
  variant?: Variant;
  source: string;
  className?: string;
};

function trackJoinClick(source: string) {
  trackEvent("community_join_click", { source });
}

export function RelocatorChatPromo({ variant = "banner", source, className = "" }: Props) {
  if (variant === "inline") {
    return (
      <aside
        className={`flex flex-wrap items-center gap-4 rounded-xl border border-sky-200 bg-sky-50/60 px-5 py-4 ${className}`}
      >
        <TelegramIcon className="h-6 w-6 shrink-0 text-sky-600" />
        <p className="min-w-0 flex-1 text-sm text-slate-700">
          Есть вопрос по переезду?{" "}
          <span className="font-medium text-slate-900">Спросите в чате релокантов</span>
        </p>
        <a
          href={RELOCATOR_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackJoinClick(source)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          В Telegram
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </aside>
    );
  }

  if (variant === "sidebar") {
    return (
      <section className={`rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 ${className}`}>
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-sky-600" />
          <h2 className="font-semibold text-slate-900">{RELOCATOR_CHAT_LABEL}</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Есть вопрос по переезду? Спросите в чате релокантов — обмен опытом без спама.
        </p>
        <a
          href={RELOCATOR_CHAT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackJoinClick(source)}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
        >
          <TelegramIcon className="h-4 w-4" />
          Вступить в Telegram
        </a>
        <Link href={COMMUNITY_PATH} className="mt-2 block text-center text-xs text-sky-700 hover:underline">
          Подробнее о сообществе
        </Link>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-corridor-50/40 p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="hidden rounded-xl bg-sky-100 p-3 text-sky-600 sm:block">
            <TelegramIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">{RELOCATOR_CHAT_LABEL}</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">Есть вопрос по переезду?</h2>
            <p className="mt-2 max-w-lg text-sm text-slate-600">
              Спросите в чате релокантов — обмен опытом, ответы на вопросы и новости маршрутов. Без спама и рекламы.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <a
            href={RELOCATOR_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackJoinClick(source)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white hover:bg-sky-700"
          >
            <TelegramIcon className="h-5 w-5" />
            Вступить в Telegram
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link href={COMMUNITY_PATH} className="text-center text-sm text-sky-700 hover:underline sm:text-right">
            Правила сообщества
          </Link>
        </div>
      </div>
    </section>
  );
}
