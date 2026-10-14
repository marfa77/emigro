import assert from "node:assert/strict";
import {
  assertItalySatelliteAccountIsolated,
  assertItalySatelliteBank,
  composeItalySatelliteChain,
  italySatelliteDueOn,
  loadItalySatelliteDays,
  romeWeekday,
  THREADS_IT_SAT_LINK_STRIDE,
} from "../lib/threads/italy-satellite";

assert.equal(romeWeekday("2026-09-21"), 0); // Mon
assert.equal(romeWeekday("2026-09-22"), 1);
assert.equal(italySatelliteDueOn("2026-09-21"), true);
assert.equal(italySatelliteDueOn("2026-09-22"), true);
assert.equal(italySatelliteDueOn("2026-09-23"), true);

assert.throws(() => assertItalySatelliteAccountIsolated({ username: "emigro_assist" }));
assert.throws(() => assertItalySatelliteAccountIsolated({ username: "emigro_invest" }));
assert.throws(() => assertItalySatelliteAccountIsolated({ username: "emigro_portugal" }));
process.env.THREADS_USERNAME = "emigro_italy";
assert.doesNotThrow(() =>
  assertItalySatelliteAccountIsolated({ username: "emigro_italy" })
);
delete process.env.THREADS_USERNAME;

assertItalySatelliteBank();

const rows = loadItalySatelliteDays();
assert.equal(rows.length, 100);
const linked = composeItalySatelliteChain(
  rows.find((r) => r.d % THREADS_IT_SAT_LINK_STRIDE === 0)!,
  { today: "2026-09-21" }
);
assert.ok(linked.some((item) => item.role === "cta" && /italy\.emigro\.online/.test(item.text)));
assert.equal(linked[0]?.topicTag, "Италия");
const native = composeItalySatelliteChain(rows[0]!, { today: "2026-09-21" });
assert.ok(!native.some((item) => /https?:\/\//.test(item.text)));
assert.equal(native[0]?.imageUrl, undefined);

console.log("italy satellite pipeline ok", rows.length);
