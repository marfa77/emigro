#!/usr/bin/env npx tsx
/**
 * Daily SEO-guide soft post → owner DM approval → @Emigro_news.
 *
 *   npm run news:guide-promo -- --dry-run
 *   npm run news:guide-promo
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runGuideTelegramQueue } from "../lib/news/run-guide-telegram-queue";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`📘 Guide telegram queue${dryRun ? " [dry-run]" : ""}`);
  const result = await runGuideTelegramQueue({ dryRun });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
