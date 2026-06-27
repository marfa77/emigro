"use client";

import { ArrowRight } from "lucide-react";
import { TelegramIcon } from "@/components/news/ShareIcons";
import { trackEvent } from "@/lib/analytics/client";
import { RELOCATOR_CHAT_URL } from "@/lib/community";

type Props = {
  source: string;
  size?: "md" | "lg";
  className?: string;
};

export function CommunityJoinButton({ source, size = "md", className = "" }: Props) {
  const sizeClass =
    size === "lg"
      ? "inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-corridor-900 hover:bg-corridor-50"
      : "inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-3 font-medium text-white hover:bg-sky-700";

  return (
    <a
      href={RELOCATOR_CHAT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("community_join_click", { source })}
      className={`${sizeClass} ${className}`}
    >
      <TelegramIcon className="h-5 w-5" />
      Вступить в Telegram
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}
