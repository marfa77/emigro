/** Telegram channel — news, digests, route updates. */
export const NEWS_TELEGRAM_CHANNEL = "@Emigro_news";
export const NEWS_TELEGRAM_URL = "https://t.me/Emigro_news";

/**
 * Discussion group linked to @Emigro_news — questions, experience, country topics.
 * NOT a third-party relocant community chat (those are @chatlisboa, @por_tugal, etc.).
 */
const DISCUSSION_GROUP_DEFAULT = "https://t.me/emigro_chat";

/** Never use @emigro_chat_bot here — that bot is for wizard deep links only. */
function resolveDiscussionGroupUrl(): string {
  const raw = process.env.NEXT_PUBLIC_RELOCATOR_CHAT_URL?.trim();
  if (!raw) return DISCUSSION_GROUP_DEFAULT;
  if (/emigro_chat_bot|\/[^/]*bot/i.test(raw)) return DISCUSSION_GROUP_DEFAULT;
  return raw;
}

/** @deprecated Use DISCUSSION_GROUP_URL — env key kept for backward compatibility. */
export const RELOCATOR_CHAT_URL = resolveDiscussionGroupUrl();
export const DISCUSSION_GROUP_URL = RELOCATOR_CHAT_URL;

export const DISCUSSION_GROUP_HANDLE = "@emigro_chat";
/** @deprecated Use DISCUSSION_GROUP_HANDLE */
export const RELOCATOR_CHAT_HANDLE = DISCUSSION_GROUP_HANDLE;

export const DISCUSSION_GROUP_LABEL = "Дискуссионная группа Emigro";
/** @deprecated Use DISCUSSION_GROUP_LABEL */
export const RELOCATOR_CHAT_LABEL = DISCUSSION_GROUP_LABEL;

/** Yandex Dzen — first-person relocation stories. */
export const DZEN_STORIES_URL = "https://dzen.ru/id/6a429faccdce4a6801ead62d";

export const COMMUNITY_PATH = "/ru/community";
