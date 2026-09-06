"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { CityChatPitch } from "@/components/satellite/CityChatPitch";
import { trackEvent } from "@/lib/analytics/client";
import { liveCityChatForCountry } from "@/lib/satellite/city-chats";
import { cityChatCtaLabel } from "@/lib/satellite/city-chat-copy";
import { cityChatDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  countryKey: string;
  source: string;
  noteSlug?: string;
};

/** Hub/note CTA into the owned city chat. Hidden until the registry row is live (chat id). */
export function SatelliteCityChatCta({ countryKey, source, noteSlug }: Props) {
  const chat = liveCityChatForCountry(countryKey);
  if (!chat) return null;

  const href = cityChatDeepLink(chat, source.replace(/[^a-z0-9_]/gi, "").slice(0, 24));

  return (
    <aside
      className="mt-8 rounded-xl border border-sky-200 bg-sky-50/80 p-5"
      aria-label={`Для своих · ${chat.chatTitleRu}`}
    >
      <CityChatPitch chat={chat} compact />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent("community_join_click", {
            source,
            note_slug: noteSlug ?? "",
            country: chat.countryKey,
          })
        }
        className={`mt-4 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {cityChatCtaLabel(chat)}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </aside>
  );
}
