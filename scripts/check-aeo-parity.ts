#!/usr/bin/env tsx
/**
 * PixID-parity AEO gate for Emigro.
 *
 * Fails if:
 * - llms generator / route wiring lacks utm_source=llm
 * - robots missing GPTBot
 * - sample RU + ES + FR money pages missing ai layer helpers
 *
 * Usage: npm run check:aeo | npm run audit:aeo
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");

function read(rel: string): string {
  const p = path.join(ROOT, rel);
  if (!existsSync(p)) throw new Error(`missing file: ${rel}`);
  return readFileSync(p, "utf8");
}

function check(name: string, fn: () => void): boolean {
  try {
    fn();
    console.log("✓", name);
    return true;
  } catch (e) {
    console.error("✗", name, "—", e instanceof Error ? e.message : e);
    return false;
  }
}

let ok = true;

ok =
  check("llms generator has utm_source=llm", () => {
    const src = read("lib/seo/llms-full.ts");
    const meta = read("lib/seo/llm-meta.ts");
    if (!meta.includes("utm_source=llm") || !meta.includes("utm_medium=llms.txt")) {
      throw new Error("lib/seo/llm-meta.ts missing LLM UTM constants");
    }
    if (!src.includes("llmMarkdownLink") && !src.includes("llmUtmUrl")) {
      throw new Error("lib/seo/llms-full.ts must emit UTM via llmMarkdownLink/llmUtmUrl");
    }
    if (!src.includes("utm_source=llm") && !meta.includes("utm_source=llm")) {
      throw new Error("llms corpus must include utm_source=llm");
    }
  }) && ok;

ok =
  check("app/llms.txt/route.ts exists", () => {
    const route = read("app/llms.txt/route.ts");
    if (!route.includes("buildLlmsTxt")) {
      throw new Error("llms.txt route must call buildLlmsTxt");
    }
  }) && ok;

ok =
  check("robots.ts allows GPTBot", () => {
    const robots = read("app/robots.ts");
    if (!robots.includes("GPTBot")) {
      throw new Error("app/robots.ts missing GPTBot allowlist");
    }
  }) && ok;

ok =
  check("rootMetadata wires withAiMetadata + llms alternate", () => {
    const seo = read("lib/seo.ts");
    const meta = read("lib/seo/llm-meta.ts");
    if (!seo.includes("withAiMetadata") || !seo.includes("rootMetadata")) {
      throw new Error("lib/seo.ts must use withAiMetadata in rootMetadata");
    }
    if (!meta.includes("text/plain") || !meta.includes("/llms.txt")) {
      throw new Error("withAiMetadata must attach text/plain → /llms.txt");
    }
  }) && ok;

const moneyPages: Array<{ rel: string; need: string[] }> = [
  {
    rel: "app/ru/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt"],
  },
  {
    rel: "app/es/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt"],
  },
  {
    rel: "app/fr/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt"],
  },
  {
    rel: "app/es/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', "/llms.txt"],
  },
  {
    rel: "app/fr/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', "/llms.txt"],
  },
  {
    rel: "app/ru/rossiyane/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', "/llms.txt"],
  },
];

for (const page of moneyPages) {
  ok =
    check(`${page.rel} ai layer`, () => {
      const src = read(page.rel);
      for (const needle of page.need) {
        if (!src.includes(needle)) {
          throw new Error(`missing ${needle}`);
        }
      }
    }) && ok;
}

if (!ok) {
  console.error("\nAEO parity check failed.");
  process.exit(1);
}

console.log("\nAEO parity OK.");
