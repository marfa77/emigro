import assert from "node:assert/strict";
import { COUNTRY_ACCENTS } from "../lib/brand/country-accents";
import {
  EMIGRO_SCORE_REGISTRY,
  emigroScoreOverall100,
  getEmigroScore,
  listEmigroScoreCountryIds,
  toEmigroScoreView,
  validateEmigroCountryScore,
} from "../lib/emigro-score";
import { TRANSIT_HUBS } from "../lib/transit-hubs";

/** Aggregate / non-country keys in accents that do not need a Score. */
const ACCENT_SCORE_SKIP = new Set(["scandinavia"]);

for (const id of listEmigroScoreCountryIds()) {
  const score = EMIGRO_SCORE_REGISTRY[id];
  const errors = validateEmigroCountryScore(score);
  assert.equal(errors.length, 0, `${id}: ${errors.join("; ")}`);
  const overall = emigroScoreOverall100(score);
  assert.ok(overall >= 0 && overall <= 100, `${id} overall ${overall}`);
  const view = toEmigroScoreView(score);
  assert.equal(view.overall100, overall);
  assert.equal(view.axes.length, 5);
}

for (const segment of Object.keys(COUNTRY_ACCENTS)) {
  if (ACCENT_SCORE_SKIP.has(segment)) continue;
  assert.ok(getEmigroScore(segment), `missing score for country accent: ${segment}`);
}

for (const hub of TRANSIT_HUBS) {
  assert.ok(getEmigroScore(hub.slug), `missing transit score: ${hub.slug}`);
}

assert.equal(getEmigroScore("nope"), null);

console.log(`ok: ${listEmigroScoreCountryIds().length} Emigro Scores validated (full accent coverage)`);