import assert from "node:assert/strict";
import {
  filterLegsByConfidence,
  presenceLegsFromTicketExtract,
  TICKET_CONFIDENCE_MIN,
} from "../lib/tax-cockpit/ingest";

assert.equal(TICKET_CONFIDENCE_MIN, 0.6);

const mixed = [
  { countryIso2: "PT", startDate: "2026-01-10", endDate: "2026-01-20", confidence: 0.95 },
  { countryIso2: "AE", startDate: "2026-02-01", endDate: "2026-02-10", confidence: 0.55 },
  { countryIso2: "GB", startDate: "2026-03-01", endDate: "2026-03-05", confidence: 0.6 },
];

const kept = filterLegsByConfidence(mixed);
assert.equal(kept.length, 2);
assert.equal(kept[0].countryIso2, "PT");
assert.equal(kept[1].countryIso2, "GB");

assert.equal(filterLegsByConfidence([{ countryIso2: "PT", startDate: "2026-01-01", endDate: "2026-01-02", confidence: 0.1 }]).length, 0);

const converted = presenceLegsFromTicketExtract(kept, "via LIS");
assert.equal(converted.legs.length, 2);
assert.equal(converted.legs[0].source, "ticket");
assert.equal(converted.legs[0].countryIso2, "PT");
assert.match(converted.legs[0].note ?? "", /via LIS/);

const emptyAfterFilter = presenceLegsFromTicketExtract([], "unreadable");
assert.equal(emptyAfterFilter.legs.length, 0);

console.log("ok tax ingest ticket");
