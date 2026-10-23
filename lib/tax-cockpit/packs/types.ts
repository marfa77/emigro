import type { DayCountRule } from "../types";

export type CountryPlaybook = {
  id: string;
  titleRu: string;
  bodyRu: string;
};

/** gte: days >= threshold. gt: statute says "more than" the published figure. */
export type ThresholdCompare = "gte" | "gt";

export type OfficialSource = {
  labelRu: string;
  url: string;
};

/**
 * Country orienter. Thresholds are not a filing position.
 * `complete: false` → residency engine stays yellow (never green or red).
 */
export type CountryPack = {
  iso2: string;
  nameRu: string;
  complete: boolean;
  /** Override the cockpit default (arrive inclusive, depart exclusive) only when the statute counts days differently. */
  dayRule?: DayCountRule;
  presenceThresholdDays: number | null;
  thresholdCompare?: ThresholdCompare;
  /** Leap year: majority of 366 days is threshold + 1. */
  majorityOfLeapYear?: boolean;
  /**
   * Formula needs data we do not store (US lookback).
   * Crossing or nearing the line stays yellow, never a confident red.
   */
  abbreviatedFormula?: boolean;
  notesRu: string[];
  tieBreakerQuestionsRu: string[];
  playbooks?: CountryPlaybook[];
  officialSource?: OfficialSource;
};
