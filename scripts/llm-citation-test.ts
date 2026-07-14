#!/usr/bin/env tsx
/**
 * LLM citation smoke test — checks llms.txt contains expected prompts (PixID pattern).
 *
 * Usage:
 *   npm run llm:citation-test
 *   npm run llm:citation-test -- --url https://www.emigro.online
 */
import { buildLlmCitationPrompts } from "../lib/seo/llm-citation-prompts";

const baseUrl = process.argv.includes("--url")
  ? process.argv[process.argv.indexOf("--url") + 1]
  : process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.emigro.online";

async function main() {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/llms.txt`);
  if (!res.ok) {
    console.error(`FAIL: /llms.txt returned ${res.status}`);
    process.exit(1);
  }
  const body = await res.text();
  const prompts = buildLlmCitationPrompts();

  let passed = 0;
  let failed = 0;

  for (const prompt of prompts) {
    const hasQuery = body.includes(prompt.question);
    const hasPath = body.includes(prompt.path);
    const ok = hasQuery && hasPath;
    if (ok) {
      passed++;
      console.log(`✓ ${prompt.question.slice(0, 60)}…`);
    } else {
      failed++;
      console.log(`✗ ${prompt.question} — query:${hasQuery} path:${hasPath}`);
    }
  }

  const hasAiCard = body.includes("AI Answer Card");
  const hasUtm = body.includes("utm_source=llm");
  const hasHighIntent = body.includes("LLM High-Intent");
  const hasOriginHub = body.includes("/ru/rossiyane");
  const hasProgramIndex = body.includes("Программы ВНЖ — индекс для AI");
  console.log(`\nAI Answer Card: ${hasAiCard ? "✓" : "✗"}`);
  console.log(`UTM links: ${hasUtm ? "✓" : "✗"}`);
  console.log(`High-Intent section: ${hasHighIntent ? "✓" : "✗"}`);
  console.log(`Origin hub (/ru/rossiyane): ${hasOriginHub ? "✓" : "✗"}`);
  console.log(`Program index table: ${hasProgramIndex ? "✓" : "✗"}`);
  console.log(`\nPrompts: ${passed}/${prompts.length} passed`);

  if (failed > 0 || !hasAiCard || !hasUtm || !hasHighIntent || !hasOriginHub || !hasProgramIndex) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
