import {
  EMIGRO_SCORE_AXIS_LABELS,
  EMIGRO_SCORE_AXIS_ORDER,
  type EmigroCountryScore,
  type EmigroScoreAxis,
  type EmigroScoreAxisId,
  type EmigroScoreTone,
  type EmigroScoreView,
} from "./types";

const WEIGHTS: Record<EmigroScoreAxisId, number> = {
  entry: 0.25,
  status: 0.3,
  banks: 0.15,
  tax: 0.15,
  next: 0.15,
};

export function emigroScoreTone(value: number): EmigroScoreTone {
  if (value >= 75) return "good";
  if (value >= 45) return "warn";
  return "critical";
}

export function emigroScoreOverall100(score: EmigroCountryScore): number {
  const byId = new Map(score.axes.map((a) => [a.id, a.value]));
  let sum = 0;
  for (const id of EMIGRO_SCORE_AXIS_ORDER) {
    const v = byId.get(id);
    if (v === undefined) throw new Error(`Emigro Score ${score.countryId}: missing axis ${id}`);
    sum += WEIGHTS[id] * v;
  }
  return Math.round(sum);
}

export function toEmigroScoreView(score: EmigroCountryScore): EmigroScoreView {
  const overall100 = emigroScoreOverall100(score);
  return {
    overall100,
    tone: emigroScoreTone(overall100),
    summary: score.summary,
    asOf: score.asOf,
    sourceGuide: score.sourceGuide,
    axes: EMIGRO_SCORE_AXIS_ORDER.map((id) => {
      const axis = score.axes.find((a) => a.id === id)!;
      return {
        id,
        label: EMIGRO_SCORE_AXIS_LABELS[id],
        value: axis.value,
        why: axis.why,
        tone: emigroScoreTone(axis.value),
      };
    }),
  };
}

export function axis(
  id: EmigroScoreAxisId,
  value: number,
  why: string
): EmigroScoreAxis {
  return { id, value, why };
}

export function validateEmigroCountryScore(score: EmigroCountryScore): string[] {
  const errors: string[] = [];
  if (!score.countryId.trim()) errors.push("countryId empty");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(score.asOf)) errors.push(`bad asOf: ${score.asOf}`);
  if (!score.summary.trim()) errors.push("summary empty");
  if (score.axes.length !== 5) errors.push(`expected 5 axes, got ${score.axes.length}`);

  const seen = new Set<string>();
  for (const a of score.axes) {
    if (seen.has(a.id)) errors.push(`duplicate axis ${a.id}`);
    seen.add(a.id);
    if (!Number.isInteger(a.value) || a.value < 0 || a.value > 100) {
      errors.push(`${a.id}: value ${a.value} out of 0–100 int`);
    }
    if (a.value % 10 !== 0) errors.push(`${a.id}: value ${a.value} not multiple of 10`);
    if (!a.why.trim() || a.why.length > 120) {
      errors.push(`${a.id}: why length ${a.why.length} (1–120)`);
    }
  }
  for (const id of EMIGRO_SCORE_AXIS_ORDER) {
    if (!seen.has(id)) errors.push(`missing axis ${id}`);
  }
  return errors;
}
