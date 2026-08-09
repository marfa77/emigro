import assert from "node:assert/strict";
import {
  EMIGRO_SCORE_REGISTRY,
  emigroScoreOverall100,
  getEmigroScore,
  listEmigroScoreCountryIds,
  toEmigroScoreView,
  validateEmigroCountryScore,
} from "../lib/emigro-score";
import { TRANSIT_HUBS } from "../lib/transit-hubs";

const CORRIDOR_SEGMENTS = [
  "portugal",
  "spain",
  "france",
  "italy",
  "germany",
  "netherlands",
  "sweden",
  "norway",
  "finland",
  "denmark",
  "austria",
  "greece",
  "cyprus",
  "hungary",
  "malta",
  "bulgaria",
  "croatia",
  "slovenia",
  "estonia",
];

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

for (const segment of CORRIDOR_SEGMENTS) {
  assert.ok(getEmigroScore(segment), `missing corridor score: ${segment}`);
}

for (const hub of TRANSIT_HUBS) {
  assert.ok(getEmigroScore(hub.slug), `missing transit score: ${hub.slug}`);
}

assert.equal(getEmigroScore("nope"), null);

console.log(`ok: ${listEmigroScoreCountryIds().length} Emigro Scores validated`);
