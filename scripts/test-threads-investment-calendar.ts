#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  assertInvestmentCalendar,
  composeInvestmentCalendarPost,
  investmentDestinationUrl,
  loadInvestmentCalendar,
  planInvestmentPost,
} from "../lib/threads/investment-calendar";

const rows = loadInvestmentCalendar();
assertInvestmentCalendar(rows);
assert.equal(rows.length, 100);

assert.equal(
  planInvestmentPost({ today: "2026-09-19", phase: "off", state: { posts: {} } }).skip,
  "phase_off"
);

const seed = planInvestmentPost({
  today: "2026-09-19",
  phase: "seed",
  state: { posts: {} },
}).row;
assert.equal(seed?.id, "invest-001");
assert.deepEqual(
  composeInvestmentCalendarPost(seed!).map((item) => item.role),
  ["root"]
);

// Daily cadence from 2026-09-26: traffic/lead rows exist every day.
const locked = planInvestmentPost({
  today: "2026-09-26",
  phase: "seed",
  state: { posts: {} },
});
// The seed-phase traffic lock was removed; seed day now plans a seed row.
assert.equal(locked.skip, undefined);
assert.equal(locked.row?.phase, "seed");

const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
// The planner catches up overdue rows in order and keeps a 2-day root gap: mark earlier rows as posted long ago.
const postedBefore = (id: string) =>
  Object.fromEntries(
    rows.filter((row) => row.id < id).map((row) => [row.id, { at: "2026-09-01", ids: ["x"] }])
  ) as any;
assert.equal(byId["invest-004"]?.publishOn, "2026-09-26");
assert.equal(byId["invest-006"]?.publishOn, "2026-09-28");
assert.equal(byId["invest-009"]?.publishOn, "2026-10-01");

const portugal = planInvestmentPost({
  today: byId["invest-006"]!.publishOn,
  phase: "traffic",
  state: { posts: postedBefore("invest-006") },
}).row;
assert.equal(portugal?.id, "invest-006");
assert.deepEqual(
  composeInvestmentCalendarPost(portugal!).map((item) => item.role),
  ["root", "slide", "cta"]
);
assert.match(investmentDestinationUrl(portugal!) || "", /utm_content=invest-006/);

const thailand = planInvestmentPost({
  today: byId["invest-009"]!.publishOn,
  phase: "lead",
  state: { posts: postedBefore("invest-009") },
}).row;
assert.equal(thailand?.id, "invest-009");
assert.equal(thailand?.publicationMode, "auto");
assert.match(thailand?.p1 || "", /237\/2568/);
assert.doesNotMatch(thailand?.p1 || "", /гарантиру/);

// Posted today: the 2-day root gap now answers first; either way nothing posts twice.
assert.ok(
  ["already_published", "gap_not_elapsed"].includes(
    String(
      planInvestmentPost({
        today: "2026-09-19",
        phase: "seed",
        state: { posts: { "invest-001": { ids: ["1"], at: "2026-09-19" } } },
      }).skip
    )
  )
);

// Daily continuity for remaining bank (no gaps after seed catch-up start).
const pending = rows.filter((row) => !["invest-001", "invest-002", "invest-003"].includes(row.id));
for (let i = 1; i < pending.length; i += 1) {
  const prev = Date.parse(pending[i - 1]!.publishOn);
  const cur = Date.parse(pending[i]!.publishOn);
  assert.equal(cur - prev, 86_400_000, `${pending[i]!.id} not daily after ${pending[i - 1]!.id}`);
}

const primaryInventory = readFileSync(
  new URL("../lib/threads/inventory.ts", import.meta.url),
  "utf8"
);
assert.doesNotMatch(primaryInventory, /investment-calendar|emigro-investment-days/);

console.log("investment Threads calendar ok");
