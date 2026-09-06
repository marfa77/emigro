/**
 * Post one Italy satellite note into the private Milan Telegram group.
 *
 *   npm run italy:post-group -- --dry-run
 *   npm run italy:post-group -- --slug=codice-fiscale-milano-2026
 *   npm run italy:post-group -- --force
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { ensureItalyCronEnv } from "@/lib/community-notes/cron-env";
import { postNextMilanGroupNote } from "@/lib/community-notes/milan-group-publish";

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const slug = slugArg ? slugArg.slice("--slug=".length).trim() : undefined;

async function main() {
  ensureItalyCronEnv();
  const result = await postNextMilanGroupNote({ dryRun, slug: slug || undefined, force });
  if (result.skipped) {
    console.log("[milan-group] skipped:", result.skipped);
    return;
  }
  console.log("[milan-group]", {
    dryRun: result.dryRun ?? false,
    slug: result.slug,
    title: result.title,
    messageId: result.messageId,
  });
  if (dryRun && result.html) {
    console.log("--- html ---");
    console.log(result.html);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
