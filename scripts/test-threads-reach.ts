#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { composeReachGuideThread, composeReachRoot } from "../lib/threads/banks";

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

console.log("threads reach-first chain ok");
