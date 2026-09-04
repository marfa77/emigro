/**
 * Lisbon weekday slots for @emigro2eu.
 * Mirrors @Emigro_news mix: guides are the backbone, news is rare/gated,
 * conversion is wizard (free) + Assist, city life is Porto chat / satellites.
 */
export type ThreadsSlot = "guide" | "wizard" | "city" | "assist" | "news";

/** Monday=1 … Sunday=7 in Europe/Lisbon. */
export function lisbonWeekday(isoDate: string): number {
  const wd = new Date(`${isoDate}T12:00:00.000Z`).toLocaleDateString("en-US", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
  });
  const map: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };
  return map[wd] ?? 1;
}

/**
 * What to post today.
 * Mon/Wed/Fri — any-country SEO guide → bait free corridor wizard.
 * Tue — dedicated free wizard slot.
 * Thu — satellite note or Porto chat (wizard when note is route-ish).
 * Sat — Assist Route Check €129 (paid, after free filter).
 * Sun — news only if already in @Emigro_news and not awaiting Threads; else guide→wizard.
 */
export function threadsSlotForDate(isoDate: string): ThreadsSlot {
  switch (lisbonWeekday(isoDate)) {
    case 1:
      return "guide";
    case 2:
      return "wizard";
    case 3:
      return "guide";
    case 4:
      return "city";
    case 5:
      return "guide";
    case 6:
      return "assist";
    default:
      return "news";
  }
}

/** Guide days always bait the free corridor wizard. Assist stays Saturday-only. */
export function guideCtaForDate(_isoDate: string): "wizard" | "assist" {
  return "wizard";
}
