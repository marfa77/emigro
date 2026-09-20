import assert from "node:assert/strict";
import {
  assertPortugalSatelliteAccountIsolated,
  assertPortugalSatelliteBank,
  composePortugalSatelliteChain,
  lisbonWeekday,
  loadPortugalSatelliteDays,
  portugalSatelliteDueOn,
  THREADS_PT_SAT_LINK_STRIDE,
} from "../lib/threads/portugal-satellite";

assert.equal(lisbonWeekday("2026-09-21"), 0); // Mon
assert.equal(lisbonWeekday("2026-09-22"), 1);
assert.equal(portugalSatelliteDueOn("2026-09-21"), true);
assert.equal(portugalSatelliteDueOn("2026-09-22"), false);
assert.equal(portugalSatelliteDueOn("2026-09-23"), true);

assertPortugalSatelliteBank();
assert.throws(() => assertPortugalSatelliteAccountIsolated({ username: "emigro_assist" }));
assert.throws(() => assertPortugalSatelliteAccountIsolated({ username: "emigro_invest" }));

const rows = loadPortugalSatelliteDays();
assert.equal(rows.length, 100);
const linked = composePortugalSatelliteChain(rows.find((r) => r.d % THREADS_PT_SAT_LINK_STRIDE === 0)!);
assert.ok(linked.some((item) => item.role === "cta" && /portugal\.emigro\.online/.test(item.text)));
const native = composePortugalSatelliteChain(rows[0]!);
assert.ok(!native.some((item) => /https?:\/\//.test(item.text)));
console.log("portugal satellite pipeline ok", rows.length);
