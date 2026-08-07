/** Format guide `date_modified` / `date_published` (YYYY-MM-DD) for RU display. */
export function formatGuideAsOfDateRu(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return iso;

  // Noon UTC avoids off-by-one when formatting date-only ISO in local TZ.
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function guideAsOfIso(guide: {
  date_modified?: string;
  date_published?: string;
}): string | undefined {
  return guide.date_modified ?? guide.date_published;
}
