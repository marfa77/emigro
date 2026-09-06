/**
 * Post one Spain satellite note into the private Valencia Telegram group.
 *
 *   npm run spain:post-group -- --dry-run
 *   npm run spain:post-group -- --slug=nie-empadronamiento-poryadok-2026
 *   npm run spain:post-group -- --force
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { ensureSpainCronEnv } from "@/lib/community-notes/cron-env";
import { postNextValenciaGroupNote } from "@/lib/community-notes/valencia-group-publish";

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const slug = slugArg ? slugArg.slice("--slug=".length).trim() : undefined;

async function main() {
  ensureSpainCronEnv();
  const result = await postNextValenciaGroupNote({ dryRun, slug: slug || undefined, force });
  if (result.skipped) {
    console.log("[valencia-group] skipped:", result.skipped);
    return;
  }
  console.log("[valencia-group]", {
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
