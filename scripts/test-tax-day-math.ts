import assert from "node:assert/strict";
import { countDaysInYear, DEFAULT_DAY_RULE } from "../lib/tax-cockpit/day-math";

// Lisbon overnight: arrive 2026-03-01, leave 2026-03-03 → 2 days (1st, 2nd)
assert.equal(
  countDaysInYear({ startDate: "2026-03-01", endDate: "2026-03-03" }, 2026),
  2
);
// Same calendar day → 0 under default rule
assert.equal(
  countDaysInYear({ startDate: "2026-03-01", endDate: "2026-03-01" }, 2026),
  0
);
// Spans year boundary: only days in 2026
assert.equal(
  countDaysInYear({ startDate: "2025-12-30", endDate: "2026-01-03" }, 2026),
  2
);
assert.equal(
  countDaysInYear({ startDate: "2025-12-30", endDate: "2026-01-03" }, 2025),
  2
);

// Both inclusive: same-day trip counts as 1 night
assert.equal(
  countDaysInYear(
    { startDate: "2026-03-01", endDate: "2026-03-01" },
    2026,
    { arriveInclusive: true, departInclusive: true }
  ),
  1
);

console.log("ok tax day-math");
