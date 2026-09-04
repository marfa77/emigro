/**
 * Emigro Threads — three independent streams (not exclusive weekday mix):
 *
 * 1. Main: SEO guides every Lisbon day (CTA = free corridor wizard)
 * 2. On top: Portugal satellites / Porto chat (own timer + gap)
 * 3. On top: RU-relevant news via Telegram DM ✅ (lightning webhook) — not this calendar
 */
export type ThreadsMainSlot = "guide";

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

/** Main brand feed: one guide every Lisbon calendar day. */
export function threadsMainSlotForDate(_isoDate: string): ThreadsMainSlot {
  return "guide";
}

/** @deprecated Use threadsMainSlotForDate — kept for scripts that still pass --kind. */
export type ThreadsSlot = "guide" | "wizard" | "city" | "assist" | "news";

export function threadsSlotForDate(isoDate: string): ThreadsSlot {
  return threadsMainSlotForDate(isoDate);
}

/** Guide posts always bait the free corridor wizard. */
export function guideCtaForDate(_isoDate: string): "wizard" | "assist" {
  return "wizard";
}

/** Satellite stream: default gap between Portugal-on-top posts. */
export const SATELLITE_GAP_DAYS = 2;
