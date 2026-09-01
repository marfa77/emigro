/** Notes that belong on the Porto city-chat CTA — not Lisboa-only rent. */
const PORTO_HINT = /porto|norte|matosinhos|gaia|braga|gondomar|leça|leca\b|foz/i;

export function shouldShowPortoChatCta(note: {
  slug: string;
  city: string;
  topic_tags?: string[] | null;
}): boolean {
  if (note.city === "porto") return true;
  const hay = [note.slug, note.city, ...(note.topic_tags ?? [])].join(" ");
  return PORTO_HINT.test(hay);
}
