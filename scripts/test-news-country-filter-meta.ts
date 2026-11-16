#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { ruCountryIn } from "../lib/ru-country-cases";

function newsFilterDescription(countryRu: string) {
  return `Еженедельные обзоры по релокации ${ruCountryIn(countryRu)}. Не юридическая консультация — ориентиры с источниками.`;
}

for (const [country, fragment] of [
  ["Португалия", "в Португалии"],
  ["Франция", "во Франции"],
  ["Испания", "в Испании"],
  ["Нидерланды", "в Нидерландах"],
] as const) {
  const desc = newsFilterDescription(country);
  assert.ok(desc.includes(fragment), `${country}: ${desc}`);
  assert.ok(!desc.includes("в в "), `${country}: double preposition in ${desc}`);
  assert.ok(!desc.includes("в во "), `${country}: double preposition in ${desc}`);
}

console.log("test-news-country-filter-meta: ok");