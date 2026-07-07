/** Telegram channel — news, digests, route updates. Primary entry for linked discussion chat. */
export const NEWS_TELEGRAM_CHANNEL = "@Emigro_news";
export const NEWS_TELEGRAM_URL = "https://t.me/Emigro_news";

/**
 * Discussion chat linked to @Emigro_news — not a standalone joinable group.
 * Users access it via comments on channel posts after subscribing.
 */
export const DISCUSSION_GROUP_HANDLE = "@emigro_chat";
/** @deprecated Use DISCUSSION_GROUP_HANDLE */
export const RELOCATOR_CHAT_HANDLE = DISCUSSION_GROUP_HANDLE;

/** Public CTA always points to the channel — discussion opens from post comments. */
export const COMMUNITY_CTA_URL = NEWS_TELEGRAM_URL;
export const COMMUNITY_CTA_LABEL = "Подписаться на канал";

export const DISCUSSION_ACCESS_HINT =
  "Отдельно вступить в группу нельзя — чат привязан к каналу. Подпишитесь на @Emigro_news и пишите в комментариях к постам.";

const DISCUSSION_GROUP_DEFAULT = "https://t.me/emigro_chat";

/** @deprecated Not for public join CTAs — use COMMUNITY_CTA_URL. Kept for internal references. */
function resolveDiscussionGroupUrl(): string {
  const raw = process.env.NEXT_PUBLIC_RELOCATOR_CHAT_URL?.trim();
  if (!raw) return DISCUSSION_GROUP_DEFAULT;
  if (/emigro_chat_bot|\/[^/]*bot/i.test(raw)) return DISCUSSION_GROUP_DEFAULT;
  return raw;
}

/** @deprecated Use COMMUNITY_CTA_URL for user-facing links. */
export const RELOCATOR_CHAT_URL = resolveDiscussionGroupUrl();
/** @deprecated Use COMMUNITY_CTA_URL for user-facing links. */
export const DISCUSSION_GROUP_URL = RELOCATOR_CHAT_URL;

export const DISCUSSION_GROUP_LABEL = "Обсуждения при канале Emigro";
/** @deprecated Use DISCUSSION_GROUP_LABEL */
export const RELOCATOR_CHAT_LABEL = DISCUSSION_GROUP_LABEL;

/** Yandex Dzen — first-person relocation stories. */
export const DZEN_STORIES_URL = "https://dzen.ru/id/6a429faccdce4a6801ead62d";

export const COMMUNITY_PATH = "/ru/community";
