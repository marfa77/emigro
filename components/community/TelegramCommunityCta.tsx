"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TelegramIcon } from "@/components/news/ShareIcons";
import { trackEvent } from "@/lib/analytics/client";
import { COMMUNITY_PATH } from "@/lib/community";
import {
  isPublicTelegramCommunityCountry,
  publicTelegramCountryLabel,
  publicTelegramLinksForCountry,
  type PublicTelegramCommunityCountry,
} from "@/lib/telegram/public-communities";

type Variant = "inline" | "banner";

type Props = {
  countryKey: string | undefined;
  source: string;
  variant?: Variant;
  className?: string;
  showDirectoryLink?: boolean;
};

function trackLinkClick(source: string, country: string, url: string) {
  trackEvent("community_join_click", { source, country, url });
}

export function TelegramCommunityCta({
  countryKey,
  source,
  variant = "inline",
  className = "",
  showDirectoryLink = true,
}: Props) {
  if (!isPublicTelegramCommunityCountry(countryKey)) return null;

  const links = publicTelegramLinksForCountry(countryKey);
  const countryLabel = publicTelegramCountryLabel(countryKey);

  const inner = (
    <>
      <div className="flex gap-3">
        <TelegramIcon className="mt-0.5 h-6 w-6 shrink-0 text-sky-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Telegram · {countryLabel}</p>
          <p className="mt-1 text-sm font-medium text-slate-900">
            {links.length === 1 ? links[0].title : `Сообщества Emigro · ${countryLabel}`}
          </p>
          <ul className="mt-3 space-y-2">
            {links.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(source, countryKey, link.url)}
                  className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-sky-800 hover:text-sky-950"
                >
                  <span className="font-medium underline decoration-sky-300 underline-offset-2 group-hover:decoration-sky-600">
                    {link.title}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-70" aria-hidden />
                </a>
                {variant === "banner" ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{link.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
          {showDirectoryLink ? (
            <Link href={COMMUNITY_PATH} className="mt-3 inline-block text-xs text-sky-700 hover:underline">
              Все сообщества Emigro
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );

  if (variant === "banner") {
    return (
      <section
        className={`rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-corridor-50/30 p-6 sm:p-8 ${className}`}
        aria-label={`Telegram-сообщества · ${countryLabel}`}
      >
        {inner}
      </section>
    );
  }

  return (
    <aside
      className={`rounded-xl border border-sky-200 bg-sky-50/60 px-5 py-4 ${className}`}
      aria-label={`Telegram-сообщества · ${countryLabel}`}
    >
      {inner}
    </aside>
  );
}

export type { PublicTelegramCommunityCountry };
