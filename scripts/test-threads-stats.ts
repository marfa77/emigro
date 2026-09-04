#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import {
  aggregateThreadsSessions,
  classifyThreadsLanding,
  followersFromInsightsPayload,
  formatThreadsReferralsTelegram,
  isThreadsUtmSource,
  type ThreadsTouchRow,
} from "../lib/analytics/threads-stats";

assert.equal(isThreadsUtmSource("threads"), true);
assert.equal(isThreadsUtmSource("Threads"), true);
assert.equal(isThreadsUtmSource("telegram"), false);
assert.equal(isThreadsUtmSource(null), false);

assert.equal(classifyThreadsLanding("/ru/portugal/wizard"), "wizard");
assert.equal(classifyThreadsLanding("/ru/assist?utm_source=threads"), "assist");
assert.equal(classifyThreadsLanding("/ru/guides/d7-vs-digital-nomad-visa-sravnenie"), "guide");
assert.equal(classifyThreadsLanding("/ru/go/telegram"), "news");
assert.equal(classifyThreadsLanding("/ru"), "other");

assert.equal(
  followersFromInsightsPayload({
    data: [{ name: "followers_count", total_value: { value: 42 } }],
  }),
  42
);
assert.equal(followersFromInsightsPayload({ data: [] }), null);

const empty = formatThreadsReferralsTelegram({
  handle: "emigro2eu",
  followers: null,
  clicks7d: { wizard: 0, assist: 0, guide: 0, news: 0, other: 0 },
  trend: [
    { dayLabel: "23.08", sessions: 0 },
    { dayLabel: "24.08", sessions: 0 },
  ],
});
assert.deepEqual(empty, [
  "<b>Threads</b> (клики с наших ссылок)",
  "7д: визард <b>0</b> · Assist <b>0</b> · гайды <b>0</b>",
  "  — пока нет",
]);

const filled = formatThreadsReferralsTelegram({
  handle: "emigro2eu",
  followers: 9,
  clicks7d: { wizard: 2, assist: 1, guide: 0, news: 0, other: 0 },
  trend: [
    { dayLabel: "23.08", sessions: 0 },
    { dayLabel: "24.08", sessions: 3 },
  ],
});
assert.equal(filled[0], "<b>Threads</b> (клики с наших ссылок)");
assert.equal(filled[1], "Подписчики @emigro2eu: <b>9</b> <i>(Graph)</i>");
assert.equal(filled[2], "7д: визард <b>2</b> · Assist <b>1</b> · гайды <b>0</b>");
assert.ok(filled[3].includes("23.08: <b>0</b> ·"));
assert.ok(filled[4].includes("24.08: <b>3</b> ▪▪▪"));

const windows = [
  { start: "2026-08-23T00:00:00.000Z", end: "2026-08-24T00:00:00.000Z", label: "23.08" },
  { start: "2026-08-24T00:00:00.000Z", end: "2026-08-25T00:00:00.000Z", label: "24.08" },
];
const rows: ThreadsTouchRow[] = [
  {
    session_id: "a",
    page_path: "/ru/wizard",
    utm_source: "threads",
    created_at: "2026-08-24T10:00:00.000Z",
  },
  {
    session_id: "a",
    page_path: "/ru/assist",
    utm_source: "threads",
    created_at: "2026-08-24T10:01:00.000Z",
  },
  {
    session_id: "b",
    page_path: "/ru/guides/foo",
    utm_source: "threads",
    created_at: "2026-08-24T11:00:00.000Z",
  },
  {
    session_id: "c",
    page_path: "/ru/wizard",
    utm_source: "threads",
    created_at: "2026-08-24T12:00:00.000Z",
    properties: { is_bot: true },
  },
  {
    session_id: "d",
    page_path: "/ru/wizard",
    utm_source: "telegram",
    created_at: "2026-08-24T12:00:00.000Z",
  },
];
const agg = aggregateThreadsSessions(rows, windows);
assert.equal(agg.clicks7d.wizard, 1);
assert.equal(agg.clicks7d.guide, 1);
assert.equal(agg.clicks7d.assist, 0);
assert.equal(agg.trend[0].sessions, 0);
assert.equal(agg.trend[1].sessions, 2);

console.log("test-threads-stats: ok");
