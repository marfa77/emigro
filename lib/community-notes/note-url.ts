import { portugalSatellitePublicUrl, spainSatellitePublicUrl } from "@/lib/site-url";

const LOCALHOST_NOTE_RE =
  /https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/satellite\/(?:portugal|spain)\/notes\/([a-z0-9-]+)/gi;
const WWW_PATH_NOTE_RE =
  /https?:\/\/(?:www\.)?emigro\.online\/satellite\/(?:portugal|spain)\/notes\/([a-z0-9-]+)/gi;

/** Canonical public URL for a published community note (never localhost). */
export function communityNotePublicUrl(slug: string, countryKey = "portugal"): string {
  const resolved = countryKey === "spain" ? "spain" : "portugal";
  if (resolved === "spain") {
    return spainSatellitePublicUrl(`/notes/${slug}`);
  }
  return portugalSatellitePublicUrl(`/notes/${slug}`);
}

/** Replace dev / legacy path URLs with the correct satellite subdomain. */
export function sanitizeEmigroNoteUrls(text: string, countryKey = "portugal"): string {
  const resolved = countryKey === "spain" ? "spain" : "portugal";
  return text
    .replace(LOCALHOST_NOTE_RE, (_, slug: string) => communityNotePublicUrl(slug, resolved))
    .replace(WWW_PATH_NOTE_RE, (_, slug: string) => communityNotePublicUrl(slug, resolved));
}

export function sanitizeStringArray(
  items: string[],
  countryKey = "portugal"
): { items: string[]; changed: boolean } {
  const resolved = countryKey === "spain" ? "spain" : "portugal";
  let changed = false;
  const next = items.map((item) => {
    const sanitized = sanitizeEmigroNoteUrls(item, resolved);
    if (sanitized !== item) changed = true;
    return sanitized;
  });
  return { items: next, changed };
}
