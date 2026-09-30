import assert from "node:assert/strict";
import {
  assertThreadsSosBank,
  composeThreadsSosChain,
  loadThreadsSosBank,
  planThreadsSosPost,
  type ThreadsSosState,
} from "../lib/threads/sos";

const rows = loadThreadsSosBank();
assert.deepEqual(assertThreadsSosBank(rows), []);
assert.equal(rows.length, 16);
assert.equal(new Set(rows.map((r) => r.p1.slice(0, 20))).size, rows.length, "openings must differ");

const empty: ThreadsSosState = { last_id: 0, last_posted_on: "", posts: {} };
// 2026-10-06 is a Tuesday, 2026-10-07 a Wednesday.
assert.equal(planThreadsSosPost({ today: "2026-10-07", state: empty, rows }).skip, "not_sos_weekday");
assert.equal(planThreadsSosPost({ today: "2026-10-06", state: empty, rows }).row?.id, 1);

const afterFirst: ThreadsSosState = { last_id: 1, last_posted_on: "2026-10-06", posts: {} };
assert.equal(planThreadsSosPost({ today: "2026-10-06", state: afterFirst, rows }).skip, "already_posted_today");
assert.equal(planThreadsSosPost({ today: "2026-10-13", state: afterFirst, rows }).row?.id, 2);

const done: ThreadsSosState = { last_id: 16, last_posted_on: "2026-01-19", posts: {} };
assert.equal(planThreadsSosPost({ today: "2026-10-06", state: done, rows }).skip, "sos_bank_exhausted");

const chain = composeThreadsSosChain(rows[0]!);
assert.equal(chain.length, 2);
assert.equal(chain[0]?.role, "root");
assert.ok(chain[0]?.topicTag);
assert.ok(!/https?:\/\//.test(chain[0]!.text));
assert.match(chain[1]!.text, /https:\/\//);
console.log("threads sos ok", rows.length);
