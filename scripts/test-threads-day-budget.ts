/**
 * Unit checks for shared ≤1 root post / Lisbon day budget.
 * Run: npx tsx scripts/test-threads-day-budget.ts
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  confirmThreadsRootSlot,
  loadThreadsDayBudget,
  releaseThreadsRootSlot,
  tryClaimThreadsRootSlot,
} from "../lib/threads/day-budget";

const dir = mkdtempSync(join(tmpdir(), "emigro-day-budget-"));
const path = join(dir, "budget.json");
const today = "2026-09-06";

try {
  const a = tryClaimThreadsRootSlot({ stream: "guide", today, note: "g1", path });
  assert.equal(a.ok, true);

  const b = tryClaimThreadsRootSlot({ stream: "satellite", today, path });
  assert.equal(b.ok, false);
  if (!b.ok) {
    assert.equal(b.skip, "daily_budget_exhausted");
    assert.equal(b.holder, "guide");
  }

  const c = tryClaimThreadsRootSlot({ stream: "lightning", today, path });
  assert.equal(c.ok, false);

  releaseThreadsRootSlot({ stream: "guide", today, path });
  const afterRelease = loadThreadsDayBudget(path);
  assert.equal(afterRelease.last_on, "");

  const d = tryClaimThreadsRootSlot({ stream: "lightning", today, note: "n1", path });
  assert.equal(d.ok, true);
  confirmThreadsRootSlot({ today, path });
  releaseThreadsRootSlot({ stream: "lightning", today, path });
  const confirmed = loadThreadsDayBudget(path);
  assert.equal(confirmed.last_on, today);
  assert.equal(confirmed.confirmed, true);

  const e = tryClaimThreadsRootSlot({ stream: "guide", today, path });
  assert.equal(e.ok, false);

  const next = tryClaimThreadsRootSlot({
    stream: "guide",
    today: "2026-09-07",
    path,
  });
  assert.equal(next.ok, true);

  console.log("OK threads day-budget");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
