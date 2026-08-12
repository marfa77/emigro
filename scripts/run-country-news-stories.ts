#!/usr/bin/env npx tsx
/**
 * Multi-country single-story tiles (Observador + The Local).
 *
 *   npm run news:stories -- --dry-run
 *   npm run news:stories
 *   npm run news:stories -- --topic=netherlands --max=2
 *   npm run news:portugal-stories   # alias → portugal only
 */
import { config } from "dotenv";
import { resolve } from "path";
import {
  generateAllCountryStories,
  generateCountryStories,
  STORY_SOURCES,
} from "../lib/news/generate-country-stories";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const maxArg = process.argv.find((a) => a.startsWith("--max="))?.split("=")[1];
  const maxPublish = maxArg ? Math.max(1, Number(maxArg)) : undefined;
  const topicArg = process.argv.find((a) => a.startsWith("--topic="))?.split("=")[1]?.trim().toLowerCase();
  const topics = topicArg
    ? topicArg.split(",").map((t) => t.trim()).filter(Boolean)
    : undefined;
  return { dryRun, maxPublish, topics };
}

async function main() {
  const { dryRun, maxPublish, topics } = parseArgs();
  const label = topics?.length ? topics.join(",") : STORY_SOURCES.map((s) => s.topicKey).join(",");
  console.log(`📰 Country stories [${label}]${dryRun ? " [dry-run]" : ""}`);

  if (topics?.length === 1) {
    const sources = STORY_SOURCES.filter((s) => s.topicKey === topics[0]);
    if (sources.length === 0) {
      console.error(`Unknown topic ${topics[0]}. Known: ${[...new Set(STORY_SOURCES.map((s) => s.topicKey))].join(", ")}`);
      process.exit(1);
    }
    const result = await generateCountryStories(sources, { dryRun, maxPublish });
    console.log("\n=== Result ===");
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const results = await generateAllCountryStories({ dryRun, maxPublish, topics });
  console.log("\n=== Results ===");
  console.log(JSON.stringify(results, null, 2));
  const published = results.reduce((n, r) => n + r.published.length, 0);
  console.log(`\nTotal published: ${published}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
