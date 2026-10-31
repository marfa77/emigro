"use client";

import { NewsBotSubscribeCta } from "@/components/news/NewsBotSubscribeCta";
import { TelegramCommunityCta } from "@/components/community/TelegramCommunityCta";
import { isPublicTelegramCommunityCountry } from "@/lib/telegram/public-communities";

type Props = {
  countryKey: string;
  source: string;
  noteSlug?: string;
  /** Country news-in-bot pitch. Off when a parent already shows the multi-country box. */
  includeNews?: boolean;
};

/** Hub/note CTA: public Telegram communities (PT/ES/IT) + news-in-bot pitch. */
export function SatelliteCityChatCta({ countryKey, source, noteSlug, includeNews = true }: Props) {
  const showPublic = isPublicTelegramCommunityCountry(countryKey);

  return (
    <>
      {showPublic ? (
        <TelegramCommunityCta
          countryKey={countryKey}
          source={noteSlug ? `${source}_${noteSlug}` : source}
          variant="inline"
          className="mt-8"
        />
      ) : null}
      {includeNews ? (
        <NewsBotSubscribeCta
          topicKey={countryKey}
          source={`${source}_news`}
          compact
          className="mt-8"
        />
      ) : null}
    </>
  );
}
