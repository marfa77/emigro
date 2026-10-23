import { countDaysInYear, DEFAULT_DAY_RULE } from "./day-math";
import { canonicalIso2, getPack } from "./packs";
import type { CountryPack } from "./packs/types";
import type { DayCountRule, PresenceInterval, TrafficLight } from "./types";

export const RESIDENCY_DISCLAIMER_RU =
  "Не налоговая консультация / не замена бухгалтеру. Светофор — ориентир по дням и черновикам правил, не вывод «вы налоговый резидент» и не позиция для декларации.";

export type LightReason =
  | "stub"
  | "no-threshold"
  | "abbreviated"
  | "over-threshold"
  | "close"
  | "under-threshold";

export type CountryResidency = {
  iso2: string;
  nameRu: string;
  days: number;
  light: TrafficLight;
  reason: LightReason;
  /** Resolved orienter for this calendar year (leap-year majority already applied). */
  threshold: number | null;
  thresholdCompare: "gte" | "gt";
  complete: boolean;
  openQuestions: string[];
};

export type ResidencyEvaluation = {
  year: number;
  byCountry: CountryResidency[];
  topCountries: CountryResidency[];
  disclaimerRu: string;
};

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function resolvedThreshold(pack: CountryPack, year: number): number | null {
  if (pack.presenceThresholdDays == null) return null;
  if (pack.majorityOfLeapYear && isLeapYear(year)) return pack.presenceThresholdDays + 1;
  return pack.presenceThresholdDays;
}

function meetsThreshold(days: number, threshold: number, compare: "gte" | "gt"): boolean {
  return compare === "gt" ? days > threshold : days >= threshold;
}

/**
 * Stubs never leave yellow.
 * Complete pack at/over the line → red, except an abbreviated formula (US) which stays yellow.
 * At or over 75% of the line → yellow.
 * Further below → green only when the pack is complete.
 */
export function lightForPack(
  pack: CountryPack,
  days: number,
  year: number
): { light: TrafficLight; reason: LightReason; threshold: number | null } {
  const threshold = resolvedThreshold(pack, year);
  if (!pack.complete) return { light: "yellow", reason: "stub", threshold };
  if (threshold == null) return { light: "yellow", reason: "no-threshold", threshold };

  const compare = pack.thresholdCompare ?? "gte";
  const over = meetsThreshold(days, threshold, compare);
  const close = days >= threshold * 0.75;

  if (pack.abbreviatedFormula) {
    if (over || close) return { light: "yellow", reason: "abbreviated", threshold };
    return { light: "green", reason: "under-threshold", threshold };
  }
  if (over) return { light: "red", reason: "over-threshold", threshold };
  if (close) return { light: "yellow", reason: "close", threshold };
  return { light: "green", reason: "under-threshold", threshold };
}

function daysFor(intervals: PresenceInterval[], year: number, rule: DayCountRule): number {
  // v1 sums each interval. Overlapping stays in one country are not merged;
  // the confirm step owns uniqueness.
  return intervals.reduce((sum, interval) => sum + countDaysInYear(interval, year, rule), 0);
}

export function evaluateResidency(year: number, intervals: PresenceInterval[]): ResidencyEvaluation {
  const grouped = new Map<string, PresenceInterval[]>();
  for (const interval of intervals) {
    const iso = canonicalIso2(interval.countryIso2);
    if (!iso) continue;
    const list = grouped.get(iso) ?? [];
    list.push(interval);
    grouped.set(iso, list);
  }

  const byCountry: CountryResidency[] = [];
  for (const [iso2, rows] of Array.from(grouped.entries())) {
    const pack = getPack(iso2);
    const rule = pack.dayRule ?? DEFAULT_DAY_RULE;
    const days = daysFor(rows, year, rule);
    const judged = lightForPack(pack, days, year);
    const compare = pack.thresholdCompare ?? "gte";
    byCountry.push({
      iso2: pack.iso2,
      nameRu: pack.nameRu,
      days,
      light: judged.light,
      reason: judged.reason,
      threshold: judged.threshold,
      thresholdCompare: compare,
      complete: pack.complete,
      openQuestions: pack.complete
        ? pack.tieBreakerQuestionsRu
        : [
            "Порог 183 дня — ориентир, pack incomplete. Нужен консультант: уверенный зелёный или красный по этой стране не ставим.",
            ...pack.tieBreakerQuestionsRu,
          ],
    });
  }

  byCountry.sort((a, b) => b.days - a.days || a.iso2.localeCompare(b.iso2));
  const topCountries = byCountry.filter((row) => row.days > 0).slice(0, 3);

  return {
    year,
    byCountry,
    topCountries,
    disclaimerRu: RESIDENCY_DISCLAIMER_RU,
  };
}
