#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { getNewsDisplaySeoTitle } from "../lib/news/digests";
import { fitNewsSeoTitleAbsolute } from "../lib/seo";

const longSweden =
  "Выборы Швеции 2026: программы партий для иностранцев — иммиграция и налоги";
const fitted = fitNewsSeoTitleAbsolute(longSweden);
assert.ok(!fitted.endsWith("…"), `title must not end with ellipsis: ${fitted}`);
assert.ok(fitted.length <= 60, `title length ${fitted.length}`);

const generic = getNewsDisplaySeoTitle(
  {
    format: "story",
    slug: "austria-story-2026-09-14-x",
    seo_title: "Пересмотр шенгенских виз…",
    title: "Пересмотр шенгенских виз…",
    week_end: "2026-09-14",
    country: "Австрия",
  },
  "Австрия",
);
assert.match(generic, /Австрия/);

console.log("test-news-seo-title: ok");