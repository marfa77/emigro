export type EmigroScoreAxisId = "entry" | "status" | "banks" | "tax" | "next";

export type EmigroScoreTone = "good" | "warn" | "critical";

export type EmigroScoreAxis = {
  id: EmigroScoreAxisId;
  value: number;
  why: string;
};

export type EmigroCountryScore = {
  countryId: string;
  asOf: string;
  validUntil?: string;
  sourceGuide?: string;
  axes: EmigroScoreAxis[];
  summary: string;
};

export type EmigroScoreAxisView = {
  id: EmigroScoreAxisId;
  label: string;
  value: number;
  why: string;
  tone: EmigroScoreTone;
};

export type EmigroScoreView = {
  overall100: number;
  tone: EmigroScoreTone;
  summary: string;
  asOf: string;
  sourceGuide?: string;
  axes: EmigroScoreAxisView[];
};

export const EMIGRO_SCORE_AXIS_ORDER: EmigroScoreAxisId[] = [
  "entry",
  "status",
  "banks",
  "tax",
  "next",
];

export const EMIGRO_SCORE_AXIS_LABELS: Record<EmigroScoreAxisId, string> = {
  entry: "Въезд",
  status: "Статус",
  banks: "Банки",
  tax: "Налоги",
  next: "Перспектива",
};

export const EMIGRO_SCORE_BASELINE_NOTE =
  "Emigro Score — редакционный ориентир для паспорта РФ. Для BY/UA/KZ цифры могут отличаться; eligibility смотрите в wizard, не в Score.";
