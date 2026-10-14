import assert from "node:assert/strict";
import {
  assertPortugalSatelliteAccountIsolated,
  assertPortugalSatelliteBank,
  composePortugalSatelliteChain,
  lisbonWeekday,
  loadPortugalSatelliteDays,
  portugalSatelliteAttachImage,
  portugalSatelliteDueOn,
  portugalSatelliteImageExperimentActive,
  portugalSatelliteNoteImageUrl,
  THREADS_PT_SAT_LINK_STRIDE,
} from "../lib/threads/portugal-satellite";

assert.equal(lisbonWeekday("2026-09-21"), 0); // Mon
assert.equal(lisbonWeekday("2026-09-22"), 1);
assert.equal(portugalSatelliteDueOn("2026-09-21"), true);
assert.equal(portugalSatelliteDueOn("2026-09-22"), true);
assert.equal(portugalSatelliteDueOn("2026-09-23"), true);

assert.equal(portugalSatelliteImageExperimentActive("2026-09-20"), true);
assert.equal(portugalSatelliteImageExperimentActive("2026-09-30"), true);
assert.equal(portugalSatelliteImageExperimentActive("2026-10-01"), false);

assertPortugalSatelliteBank();
assert.throws(() => assertPortugalSatelliteAccountIsolated({ username: "emigro_assist" }));
assert.throws(() => assertPortugalSatelliteAccountIsolated({ username: "emigro_invest" }));
// Publisher stomps THREADS_USERNAME to the satellite handle before whoami —
// that must not trip the assist clash check.
process.env.THREADS_USERNAME = "emigro_portugal";
assert.doesNotThrow(() =>
  assertPortugalSatelliteAccountIsolated({ username: "emigro_portugal" })
);
delete process.env.THREADS_USERNAME;

const rows = loadPortugalSatelliteDays();
assert.equal(rows.length, 100);
const linked = composePortugalSatelliteChain(
  rows.find((r) => r.d % THREADS_PT_SAT_LINK_STRIDE === 0)!,
  { today: "2026-09-21" }
);
assert.ok(linked.some((item) => item.role === "cta" && /portugal\.emigro\.online/.test(item.text)));
const native = composePortugalSatelliteChain(rows[0]!, { today: "2026-09-21" });
assert.ok(!native.some((item) => /https?:\/\//.test(item.text)));
assert.equal(portugalSatelliteAttachImage(rows[0]!, "2026-09-21"), true);
assert.equal(native[0]?.imageUrl, portugalSatelliteNoteImageUrl(rows[0]!.dest));
assert.match(native[0]?.imageUrl || "", /nif-porto-kak-poluchit-2026\.webp$/);

const textDay = composePortugalSatelliteChain(rows[1]!, { today: "2026-09-23" });
assert.equal(portugalSatelliteAttachImage(rows[1]!, "2026-09-23"), false);
assert.equal(textDay[0]?.imageUrl, undefined);

const afterWindow = composePortugalSatelliteChain(rows[0]!, { today: "2026-10-01" });
assert.equal(afterWindow[0]?.imageUrl, undefined);
console.log("portugal satellite pipeline ok", rows.length);
