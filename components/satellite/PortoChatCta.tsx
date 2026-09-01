"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  source: "portugal_satellite_hub" | "portugal_satellite_note";
  noteSlug?: string;
};

export function PortoChatCta({ source, noteSlug }: Props) {
  const href = portoChatDeepLink();

  return (
    <aside
      className="mt-8 rounded-xl border border-sky-200 bg-sky-50/80 p-5"
      aria-label="Закрытый чат Порту"
    >
      <p className="text-xs font-bold uppercase tracking-wide text-sky-900">Чат Порту и вокруг</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Закрытая группа, без публичного @. Бот пришлёт одноразовую ссылку в личку — её нельзя повесить
        «на всех». Быт, жильё, встречи; объявления не стеной.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("community_join_click", {
            source,
            note_slug: noteSlug ?? "",
            country: "portugal",
          })
        }
        className={`mt-4 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        Запросить вход
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </aside>
  );
}
