#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  composeDaysReachChain,
  composeReachGuideThread,
  composeReachRoot,
} from "../lib/threads/banks";
import { pickDaysBankPlan } from "../lib/threads/inventory";
import { composeThreadsPartnerPin } from "../lib/threads/partner-pin";

const root = composeReachRoot("Польша: €1 080 vs €3 020 — порог почти ×3.", "Польша");
assert.equal(root.length, 1);
assert.equal(root[0]?.role, "root");
assert.equal(root[0]?.topicTag, "Польша");
assert.doesNotMatch(root[0]?.text || "", /https?:\/\//);

const withoutLink = composeReachGuideThread({
  p1: "Грузия 2026: было → стало.",
  slides: ["Правило, срок и практическое исключение."],
  topic: "Грузия",
});
assert.deepEqual(
  withoutLink.map((item) => item.role),
  ["root", "slide"]
);
assert.ok(withoutLink.every((item) => !/визард|route check|€129/i.test(item.text)));

const withSource = composeReachGuideThread({
  p1: "Испания: 30 дней — жёсткий срок.",
  slides: ["Сначала факты и порядок действий."],
  topic: "Испания",
  sourceUrl: "https://www.emigro.online/ru/guides/example",
});
assert.deepEqual(
  withSource.map((item) => item.role),
  ["root", "slide", "cta"]
);
assert.match(withSource.at(-1)?.text || "", /Полный разбор и источники/);
assert.doesNotMatch(withSource.at(-1)?.text || "", /визард|route check|€129/i);

const partnerPin = composeThreadsPartnerPin();
assert.deepEqual(
  partnerPin.map((item) => item.role),
  ["root", "cta"]
);
assert.doesNotMatch(partnerPin[0]?.text || "", /https?:\/\//);
assert.match(partnerPin[1]?.text || "", /\/ru\/partners\?/);
assert.doesNotMatch(partnerPin.map((item) => item.text).join(" "), /гарантируем лиды|недвижимость.*ВНЖ/i);

const inventorySource = readFileSync(
  new URL("../lib/threads/inventory.ts", import.meta.url),
  "utf8"
);
assert.doesNotMatch(inventorySource, /partner-pin|composeThreadsPartnerPin/);
assert.match(inventorySource, /composeDaysReachChain/);

const dayNoLink = composeDaysReachChain({
  d: 1,
  pillar: "assist",
  cta: "assist",
  p1: "Польша: €1 080 vs €3 020 — порог почти ×3.",
  p2: "Сначала основание, потом документы.",
});
assert.deepEqual(
  dayNoLink.map((item) => item.role),
  ["root", "slide"]
);
assert.ok(dayNoLink.every((item) => !/https?:\/\//.test(item.text)));

const dayWithLink = composeDaysReachChain({
  d: 3,
  pillar: "assist",
  cta: "assist",
  p1: "Грузия 2026: было → стало.",
  p2: "Правило, срок и практическое исключение.",
});
assert.equal(dayWithLink.at(-1)?.role, "cta");
assert.match(dayWithLink.at(-1)?.text || "", /https?:\/\//);

const cronPlan = pickDaysBankPlan({ last_day: 0, chat_cursor: 0, assist_cursor: 0 });
assert.ok(cronPlan?.slug.startsWith("day-"));
assert.match(inventorySource, /withAssistImage|assistCorridorImageUrl/);

const dailySource = readFileSync(new URL("../lib/threads/daily-pipeline.ts", import.meta.url), "utf8");
assert.match(dailySource, /const plan = pickDaysBankPlan\(state\);/);
assert.match(dailySource, /forceKind && forceKind !== "day"/);

console.log("threads reach-first chain ok");
