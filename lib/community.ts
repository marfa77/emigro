/** Telegram channel — news, digests, route updates. */
export const NEWS_TELEGRAM_CHANNEL = "@Emigro_news";
export const NEWS_TELEGRAM_URL = "https://t.me/Emigro_news";

/** Discussion group linked to @Emigro_news — questions, experience, country topics. */
const RELOCATOR_CHAT_DEFAULT = "https://t.me/emigro_chat";

/** Never use @emigro_chat_bot here — that bot is for wizard deep links only. */
function resolveRelocatorChatUrl(): string {
  const raw = process.env.NEXT_PUBLIC_RELOCATOR_CHAT_URL?.trim();
  if (!raw) return RELOCATOR_CHAT_DEFAULT;
  if (/emigro_chat_bot|\/[^/]*bot/i.test(raw)) return RELOCATOR_CHAT_DEFAULT;
  return raw;
}

export const RELOCATOR_CHAT_URL = resolveRelocatorChatUrl();

export const RELOCATOR_CHAT_HANDLE = "@emigro_chat";

export const RELOCATOR_CHAT_LABEL = "Чат релокантов Emigro";

/** Yandex Dzen — first-person relocation stories. */
export const DZEN_STORIES_URL = "https://dzen.ru/id/6a429faccdce4a6801ead62d";

export const COMMUNITY_PATH = "/ru/community";
