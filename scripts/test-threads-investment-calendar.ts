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

assert.equal(
  planInvestmentPost({
    today: "2026-09-28",
    phase: "seed",
    state: { posts: {} },
  }).skip,
  "phase_traffic_locked"
);

const portugal = planInvestmentPost({
  today: "2026-10-02",
  phase: "traffic",
  state: { posts: {} },
}).row;
assert.equal(portugal?.id, "invest-006");
assert.deepEqual(
  composeInvestmentCalendarPost(portugal!).map((item) => item.role),
  ["root", "slide", "cta"]
);
assert.match(investmentDestinationUrl(portugal!) || "", /utm_content=invest-006/);

const thailand = planInvestmentPost({
  today: "2026-10-06",
  phase: "lead",
  state: { posts: {} },
}).row;
assert.equal(thailand?.id, "invest-009");
assert.equal(thailand?.publicationMode, "auto");
assert.match(thailand?.p1 || "", /237\/2568/);
assert.doesNotMatch(thailand?.p1 || "", /гарантиру/);

assert.equal(
  planInvestmentPost({
    today: "2026-09-19",
    phase: "seed",
    state: { posts: { "invest-001": { ids: ["1"], at: "2026-09-19" } } },
  }).skip,
  "already_published"
);

const primaryInventory = readFileSync(
  new URL("../lib/threads/inventory.ts", import.meta.url),
  "utf8"
);
assert.doesNotMatch(primaryInventory, /investment-calendar|emigro-investment-days/);

console.log("investment Threads calendar ok");
