/**
 * Post one Thailand satellite guide into the private Phuket Telegram group.
 *
 *   npm run thailand:post-group -- --dry-run
 *   npm run thailand:post-group -- --slug=phuket-rajony-arenda-shkoly-bolnicy-2026
 *   npm run thailand:post-group -- --force
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { ensureThailandCronEnv } from "@/lib/community-notes/cron-env";
import { postNextPhuketGroupNote } from "@/lib/community-notes/phuket-group-publish";

const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const slugArg = process.argv.find((arg) => arg.startsWith("--slug="));
const slug = slugArg ? slugArg.slice("--slug=".length).trim() : undefined;

async function main() {
  ensureThailandCronEnv();
  const result = await postNextPhuketGroupNote({ dryRun, slug: slug || undefined, force });
  if (result.skipped) {
    console.log("[phuket-group] skipped:", result.skipped);
    return;
  }
  console.log("[phuket-group]", {
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

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
