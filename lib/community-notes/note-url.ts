import { portugalSatellitePublicUrl } from "@/lib/site-url";

const LOCALHOST_NOTE_RE =
  /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/satellite\/portugal\/notes\/([a-z0-9-]+)/gi;
const WWW_PATH_NOTE_RE =
  /https?:\/\/(?:www\.)?emigro\.online\/satellite\/portugal\/notes\/([a-z0-9-]+)/gi;

/** Canonical public URL for a published community note (never localhost). */
export function communityNotePublicUrl(slug: string): string {
  return portugalSatellitePublicUrl(`/notes/${slug}`);
}

/** Replace dev / legacy path URLs with portugal.emigro.online. */
export function sanitizeEmigroNoteUrls(text: string): string {
  return text
    .replace(LOCALHOST_NOTE_RE, (_, slug: string) => communityNotePublicUrl(slug))
    .replace(WWW_PATH_NOTE_RE, (_, slug: string) => communityNotePublicUrl(slug));
}

export function sanitizeStringArray(items: string[]): { items: string[]; changed: boolean } {
  let changed = false;
  const next = items.map((item) => {
    const sanitized = sanitizeEmigroNoteUrls(item);
    if (sanitized !== item) changed = true;
    return sanitized;
  });
  return { items: next, changed };
}
