"use client";

import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { CityChatPitch } from "@/components/satellite/CityChatPitch";
import { trackEvent } from "@/lib/analytics/client";
import {
  satelliteUrlFromWizard,
  type SatelliteCityChat,
} from "@/lib/satellite/city-chats";
import { cityChatCtaLabel } from "@/lib/satellite/city-chat-copy";
import { cityChatDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

export type WizardSatellitePracticePlacement = "wizard_hub_results" | "wizard_corridor_results";

type Props = {
  sessionId: string;
  placement: WizardSatellitePracticePlacement;
  countryKey: string;
  chat: SatelliteCityChat;
};

export function WizardSatellitePracticeCta({ sessionId, placement, chat }: Props) {
  const source = placement === "wizard_hub_results" ? "wizhub" : "wizcorr";
  const chatHref = cityChatDeepLink(chat, source);
  const hubHref = satelliteUrlFromWizard(chat, "/", placement, "hub");
  const noteHref = chat.featuredNoteSlug
    ? satelliteUrlFromWizard(chat, `/notes/${chat.featuredNoteSlug}`, placement, "note")
    : null;

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
      className="mt-8 rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/90 to-white p-5 sm:p-6"
      aria-labelledby="wizard-sat-practice-heading"
    >
      <CityChatPitch chat={chat} headingId="wizard-sat-practice-heading" />

      <a
        href={chatHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackOutbound(`${chat.countryKey}_city_chat`, chatHref);
          trackEvent("community_join_click", {
            source: placement,
            session_id: sessionId,
            country: chat.countryKey,
          });
        }}
        className={`mt-4 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {cityChatCtaLabel(chat)}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <a
          href={hubHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackOutbound(`${chat.countryKey}_satellite_hub`, hubHref)}
          className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:border-teal-500`}
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Практика на сателлите
        </a>
        {noteHref && chat.featuredNoteLabel ? (
          <a
            href={noteHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound(`${chat.countryKey}_satellite_note`, noteHref)}
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:border-teal-500`}
          >
            {chat.featuredNoteLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}
