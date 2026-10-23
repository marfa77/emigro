import assert from "node:assert/strict";
import { parseManualPresenceText } from "../lib/tax-cockpit/ingest";

const ptRange = parseManualPresenceText("PT 2026-01-10..2026-03-01", 2026);
assert.equal(ptRange.errors.length, 0);
assert.equal(ptRange.legs.length, 1);
assert.equal(ptRange.legs[0]?.countryIso2, "PT");
assert.equal(ptRange.legs[0]?.startDate, "2026-01-10");
assert.equal(ptRange.legs[0]?.endDate, "2026-03-01");
assert.equal(ptRange.legs[0]?.source, "manual");

const ruPortugal = parseManualPresenceText("Португалия 10.01.2026 - 01.03.2026", 2026);
assert.equal(ruPortugal.errors.length, 0);
assert.equal(ruPortugal.legs.length, 1);
assert.equal(ruPortugal.legs[0]?.countryIso2, "PT");
assert.equal(ruPortugal.legs[0]?.startDate, "2026-01-10");
assert.equal(ruPortugal.legs[0]?.endDate, "2026-03-01");

const multi = parseManualPresenceText(
  ["PT 2026-01-10..2026-03-01", "AE 2026-03-01..2026-06-15"].join("\n"),
  2026
);
assert.equal(multi.errors.length, 0);
assert.equal(multi.legs.length, 2);
assert.equal(multi.legs[1]?.countryIso2, "AE");

const bad = parseManualPresenceText("not a valid line at all", 2026);
assert.equal(bad.legs.length, 0);
assert.ok(bad.errors.length >= 1);

const mixed = parseManualPresenceText(
  ["PT 2026-01-10..2026-03-01", "garbage"].join("\n"),
  2026
);
assert.equal(mixed.legs.length, 1);
assert.ok(mixed.errors.length >= 1);

console.log("ok tax ingest manual");
