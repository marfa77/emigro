/** Canonical public host — t.me may be blocked when .me registry suspends routing. */
export const TELEGRAM_PUBLIC_HOST = "telegram.me";

/** Build https://telegram.me/{username} or https://telegram.me/{username}/{postId}. */
export function telegramPublicUrl(usernameOrPath: string): string {
  const trimmed = usernameOrPath.trim();
  if (!trimmed) return `https://${TELEGRAM_PUBLIC_HOST}/Emigro_news`;
  if (/^https?:\/\//i.test(trimmed)) return normalizeTelegramPublicUrl(trimmed);

  let path = trimmed;
  if (path.startsWith("@")) path = path.slice(1);
  if (/^t\.me\//i.test(path)) path = path.slice(5);
  if (/^telegram\.me\//i.test(path)) path = path.slice(12);
  path = path.replace(/^\/+/, "");

  return `https://${TELEGRAM_PUBLIC_HOST}/${path}`;
}

/** Normalize t.me / telegram.me / @handle to telegram.me. Other https URLs pass through. */
export function normalizeTelegramPublicUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return telegramPublicUrl("Emigro_news");
  if (trimmed.startsWith("@")) return telegramPublicUrl(trimmed);

  const withScheme =
    /^https?:\/\//i.test(trimmed) || /^t\.me\//i.test(trimmed) || /^telegram\.me\//i.test(trimmed)
      ? /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`
      : telegramPublicUrl(trimmed);

  try {
    const url = new URL(withScheme);
    if (url.hostname === "t.me" || url.hostname === "telegram.me") {
      const normalized = new URL(`https://${TELEGRAM_PUBLIC_HOST}${url.pathname}`);
      normalized.search = url.search;
      normalized.hash = url.hash;
      const href = normalized.toString().replace(/\/$/, "");
      return href || `https://${TELEGRAM_PUBLIC_HOST}/`;
    }
    return trimmed.replace(/\/$/, "");
  } catch {
    return telegramPublicUrl(trimmed);
  }
}

export function telegramShareUrl(params: { url: string; text: string }): string {
  const share = new URL(`https://${TELEGRAM_PUBLIC_HOST}/share/url`);
  share.searchParams.set("url", params.url);
  share.searchParams.set("text", params.text);
  return share.toString();
}

export function looksLikeTelegramPublicContact(value: string): boolean {
  const contact = value.trim();
  return contact.startsWith("@") || /(?:^|\/\/)(?:t\.me|telegram\.me)\//i.test(contact);
}
