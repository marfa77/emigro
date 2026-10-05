"use client";

import { Newspaper } from "lucide-react";
import { TelegramIcon } from "@/components/news/ShareIcons";
import { trackEvent } from "@/lib/analytics/client";
import { newsBotTopicByKey, SATELLITE_NEWS_TOPIC_KEYS } from "@/lib/news/bot-subscribe-topics";
import { newsBotDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  topicKey?: string;
  source: string;
  className?: string;
  compact?: boolean;
};

export function NewsBotSubscribeCta({ topicKey, source, className = "", compact = false }: Props) {
  const topic = newsBotTopicByKey(topicKey);
  const href = newsBotDeepLink(topic?.key);
  const country = topic?.countryRu ?? "страны";

  return (
    <aside
      className={`rounded-xl border border-amber-200 bg-amber-50/80 p-5 ${className}`}
      aria-label="Новости в Telegram"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Только в боте</p>
      <h2 className={`${compact ? "mt-1 text-base" : "mt-1 text-lg"} font-bold text-slate-900`}>
        <Newspaper className="mr-1.5 inline h-4 w-4 text-amber-700" aria-hidden />
        Новости {country} — в личку
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Как только выпуск появляется на{" "}
        <span className="whitespace-nowrap">emigro.online/ru/news</span>, бот присылает карточку в этот чат.
        На сайте подписаться нельзя — откройте бота и напишите{" "}
        <span className="font-medium">
          {topic ? `«новости ${topic.countryRu}»` : "«новости Португалия» / «Испания» / «Италия» / «Таиланд»"}
        </span>{" "}
        или нажмите кнопку ниже.
      </p>
      {!topic && (
        <p className="mt-2 text-xs text-slate-600">
          Сателлиты: {SATELLITE_NEWS_TOPIC_KEYS.map((key) => newsBotTopicByKey(key)?.countryRu).join(", ")}.
        </p>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("news_bot_subscribe_click", {
            source,
            country: topic?.key ?? "picker",
          })
        }
        className={`mt-4 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800`}
      >
        <TelegramIcon className="h-4 w-4" />
        {topic ? `Открыть бота · ${topic.countryRu}` : "Открыть бота и выбрать страну"}
      </a>
    </aside>
  );
}
