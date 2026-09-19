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
  check("robots.ts allows GPTBot + YandexAdditionalBot", () => {
    const robots = read("app/robots.ts");
    if (!robots.includes("GPTBot")) {
      throw new Error("app/robots.ts missing GPTBot allowlist");
    }
    if (!robots.includes("YandexAdditionalBot")) {
      throw new Error("app/robots.ts missing YandexAdditionalBot (Alice)");
    }
    if (!robots.includes("OAI-SearchBot")) {
      throw new Error("app/robots.ts missing OAI-SearchBot");
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

ok =
  check("llms lists all four satellites", () => {
    const src = read("lib/seo/llms-full.ts");
    for (const needle of ["italySatellitePublicUrl", "thailandSatellitePublicUrl", "portugalSatellitePublicUrl", "spainSatellitePublicUrl"]) {
      if (!src.includes(needle)) throw new Error(`llms-full missing ${needle}`);
    }
  }) && ok;

ok =
  check("guide FAQ helper shared RU/ES/FR", () => {
    const helper = read("lib/guides/extract-faq.ts");
    if (!helper.includes("FAQPage") || !helper.includes("Preguntas frecuentes") || !helper.includes("Foire aux questions")) {
      throw new Error("extract-faq must support ES/FR FAQ headings and FAQPage");
    }
    for (const rel of ["app/ru/guides/[slug]/page.tsx", "app/es/guides/[slug]/page.tsx", "app/fr/guides/[slug]/page.tsx"]) {
      if (!read(rel).includes("extractGuideFaq")) throw new Error(`${rel} must use extractGuideFaq`);
    }
  }) && ok;

ok =
  check("satellite llms emit utm_source=llm", () => {
    const src = read("lib/community-notes/seo-page.ts");
    const meta = read("lib/seo/llm-meta.ts");
    if (!meta.includes("llmUtmAbsolute")) {
      throw new Error("lib/seo/llm-meta.ts must export llmUtmAbsolute for satellite llms");
    }
    if (!src.includes("llmUtmAbsolute")) {
      throw new Error("satellite llms builders must stamp UTM via llmUtmAbsolute");
    }
  }) && ok;

ok =
  check("news articles do not fake FAQPage from takeaways", () => {
    const src = read("app/ru/news/[slug]/page.tsx");
    if (src.includes("buildNewsArticleFaq") || src.includes("buildNewsFaqSchema")) {
      throw new Error("news article pages must not emit FAQPage from takeaways");
    }
  }) && ok;

ok =
  check("ES DN household add-ons match SMI 2026", () => {
    const src = read("lib/engine/household.ts");
    if (!src.includes("adultAddon: 1068") || !src.includes("childAddon: 356")) {
      throw new Error("spain-digital-nomad family add-ons must be +€1068 / +€356 (SMI 2026)");
    }
    if (src.includes("adultAddon: 916")) {
      throw new Error("stale ES DN +€916 family add-on");
    }
    if (!src.includes("solo: 2334")) {
      throw new Error("italy-digital-nomad wizard floor must be consular ~€28k/12");
    }
  }) && ok;

const moneyPages: Array<{ rel: string; need: string[] }> = [
  {
    rel: "app/ru/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt"],
  },
  {
    rel: "app/ru/wizard/page.tsx",
    need: ["aiDescription", "data-llm"],
  },
  {
    rel: "app/ru/ukraine/page.tsx",
    need: ["aiDescription", "buildFaqSchema", "data-llm"],
  },
  {
    rel: "app/es/uruguay/page.tsx",
    need: ["OriginHubFaq"],
  },
  {
    rel: "app/ru/stories/page.tsx",
    need: ["aiDescription"],
  },
  {
    rel: "lib/uniprep2go/catalog.ts",
    need: ["vnj-italiya-2026-digital-nomad", "pervye-30-dnej-v-italii-2026"],
  },
  {
    rel: "app/es/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt", "extractGuideFaq"],
  },
  {
    rel: "app/fr/guides/[slug]/page.tsx",
    need: ["aiDescription", "ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms.txt", "extractGuideFaq"],
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
  {
    rel: "app/satellite/spain/notes/[slug]/page.tsx",
    need: ["ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms"],
  },
  {
    rel: "app/satellite/portugal/notes/[slug]/page.tsx",
    need: ["ai:description", 'data-llm="facts"', 'data-llm="commercial"', "/llms"],
  },
  {
    rel: "lib/community-notes/seo-page.ts",
    need: ["withAiMetadata", "withSatelliteAiMetadata", "llmUtmAbsolute", "aiCategory"],
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
