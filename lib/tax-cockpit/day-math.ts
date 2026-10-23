import type { DayCountRule, PresenceInterval } from "./types";

export const DEFAULT_DAY_RULE: DayCountRule = {
  arriveInclusive: true,
  departInclusive: false,
};

const MS_PER_DAY = 86_400_000;

function parseUtcDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addUtcDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * MS_PER_DAY);
}

function compareUtcDates(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

/** Inclusive calendar-day count between two UTC dates (both ends count). */
function inclusiveDaySpan(first: Date, last: Date): number {
  if (compareUtcDates(first, last) > 0) return 0;
  return Math.floor((last.getTime() - first.getTime()) / MS_PER_DAY) + 1;
}

/** Count nights-as-days in [year-01-01, year-12-31] for one interval. */
export function countDaysInYear(
  interval: Pick<PresenceInterval, "startDate" | "endDate">,
  year: number,
  rule: DayCountRule = DEFAULT_DAY_RULE
): number {
  const start = parseUtcDate(interval.startDate);
  const end = parseUtcDate(interval.endDate);

  const firstCounted = rule.arriveInclusive ? start : addUtcDays(start, 1);
  const lastCounted = rule.departInclusive ? end : addUtcDays(end, -1);

  if (compareUtcDates(firstCounted, lastCounted) > 0) return 0;

  const yearStart = parseUtcDate(`${year}-01-01`);
  const yearEnd = parseUtcDate(`${year}-12-31`);

  const clipFirst =
    compareUtcDates(firstCounted, yearStart) < 0 ? yearStart : firstCounted;
  const clipLast =
    compareUtcDates(lastCounted, yearEnd) > 0 ? yearEnd : lastCounted;

  return inclusiveDaySpan(clipFirst, clipLast);
}

/** Overlap in counted presence days between two intervals (same rule). */
export function overlapDays(
  a: Pick<PresenceInterval, "startDate" | "endDate">,
  b: Pick<PresenceInterval, "startDate" | "endDate">,
  rule: DayCountRule = DEFAULT_DAY_RULE
): number {
  const startA = parseUtcDate(a.startDate);
  const endA = parseUtcDate(a.endDate);
  const startB = parseUtcDate(b.startDate);
  const endB = parseUtcDate(b.endDate);

  const firstA = rule.arriveInclusive ? startA : addUtcDays(startA, 1);
  const lastA = rule.departInclusive ? endA : addUtcDays(endA, -1);
  const firstB = rule.arriveInclusive ? startB : addUtcDays(startB, 1);
  const lastB = rule.departInclusive ? endB : addUtcDays(endB, -1);

  const overlapFirst =
    compareUtcDates(firstA, firstB) < 0 ? firstB : firstA;
  const overlapLast = compareUtcDates(lastA, lastB) < 0 ? lastA : lastB;

  return inclusiveDaySpan(overlapFirst, overlapLast);
}
