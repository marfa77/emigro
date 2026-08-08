#!/usr/bin/env npx tsx
/**
 * Weekly soft promo → owner DM approve → @Emigro_news (no auto-publish).
 *
 *   npm run news:soft-promo -- --dry-run --force
 *   npm run news:soft-promo -- --force
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runWeeklySoftPromo } from "../lib/news/run-weekly-soft-promo";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  console.log(`📣 Soft promo${dryRun ? " [dry-run]" : ""}${force ? " [force]" : ""}`);
  const result = await runWeeklySoftPromo({ dryRun, force });
  console.log(JSON.stringify({ ...result, html: result.html ? "[see above]" : undefined }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
