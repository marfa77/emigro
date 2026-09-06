#!/usr/bin/env npx tsx
/**
 * Stream 2 — Portugal satellites / Porto chat (on top of daily guides).
 *
 *   npm run threads:satellites -- --dry-run
 *   npm run threads:satellites -- --force-publish
 */
import { config } from "dotenv";
import { resolve } from "path";
import { fetchThreadsPermalink } from "../lib/threads/client";
import { runThreadsSatellites } from "../lib/threads/satellite-pipeline";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const result = await runThreadsSatellites({
    dryRun: process.argv.includes("--dry-run") || !process.argv.includes("--force-publish"),
    forcePublish: process.argv.includes("--force-publish"),
  });
  if (result.skip) {
    const soft = new Set(["already_posted_today", "daily_budget_exhausted", "not_due"]);
    if (process.argv.includes("--force-publish") && !soft.has(result.skip)) {
      throw new Error(`threads-satellites soft-fail: ${result.skip}`);
    }
    console.log("[threads-satellites] skip", result.skip);
    return;
  }
  if (result.published) {
    for (const row of result.published) {
      const links: string[] = [];
      for (const id of row.ids) {
        const permalink = await fetchThreadsPermalink(id);
        links.push(permalink ? `${id} ${permalink}` : id);
      }
      console.log("published", row.kind, row.slug, links.join(" | "));
    }
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
