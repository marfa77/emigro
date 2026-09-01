#!/usr/bin/env npx tsx
/**
 * Poll Threads comments on @emigro2eu, draft RU replies, ask owner in Telegram.
 * Publish happens only after ✅ (tr:ok:) on the news-bot webhook.
 *
 *   npm run threads:replies -- --dry-run
 *   npm run threads:replies -- --ask-owner
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runThreadsReplies } from "../lib/threads/replies";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "parser/.env") });

async function main() {
  if (process.argv.includes("--force-publish")) {
    throw new Error(
      "threads:replies does not publish from the CLI. Approve in Telegram (tr:ok:). Use --ask-owner to send DMs."
    );
  }

  const askOwner = process.argv.includes("--ask-owner");
  const dryRun = !askOwner || process.argv.includes("--dry-run");
  const result = await runThreadsReplies({ dryRun, askOwner: askOwner && !dryRun });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
