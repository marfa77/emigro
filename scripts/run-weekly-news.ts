#!/usr/bin/env npx tsx
/**
 * Weekly news digests — topics loaded from emigro_news_topics (DB).
 *
 * Usage:
 *   npm run news:weekly                    # all countries
 *   npm run news:weekly -- --topic=spain   # one country
 *   npm run news:weekly -- --dry-run
 *   npm run news:weekly -- --topic=portugal --force
 *   npm run news:weekly -- --topic=portugal --force --skip-telegram
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runWeeklyNewsForAllTopics, runWeeklyNewsForTopic } from "../lib/news/generate-weekly";
import { getNewsTopicKeys } from "../lib/news/topics";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function parseTopicArg(): Promise<string | null> {
  const arg = process.argv.find((a) => a.startsWith("--topic="));
  if (!arg) return null;
  const key = arg.split("=")[1]?.trim().toLowerCase();
  const valid = await getNewsTopicKeys();
  if (!key || !valid.includes(key)) {
    throw new Error(`Invalid --topic. Valid: ${valid.join(", ")}`);
  }
  return key;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const skipTelegram = process.argv.includes("--skip-telegram");
  const topic = await parseTopicArg();

  console.log("📰 Emigro weekly news…");

  if (topic) {
    const result = await runWeeklyNewsForTopic(topic, { dryRun, force, skipTelegram });
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const results = await runWeeklyNewsForAllTopics({ dryRun, force, skipTelegram });
  console.log(JSON.stringify(results, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
