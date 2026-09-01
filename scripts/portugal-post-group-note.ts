/**
 * Post one Portugal satellite note into the private Porto Telegram group.
 *
 *   npm run portugal:post-group -- --dry-run
 *   npm run portugal:post-group -- --slug=nif-porto-kak-poluchit-2026
 *   npm run portugal:post-group -- --news --dry-run
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), "parser/.env") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { postPortoGroupNewsIfRelevant } from "@/lib/community-notes/porto-group-news";
import { postNextPortoGroupNote } from "@/lib/community-notes/porto-group-publish";

const dryRun = process.argv.includes("--dry-run");
const newsOnly = process.argv.includes("--news");
const slugArg = process.argv.find((a) => a.startsWith("--slug="));
const slug = slugArg ? slugArg.slice("--slug=".length).trim() : undefined;

async function main() {
  ensurePortugalCronEnv();
  if (newsOnly) {
    const result = await postPortoGroupNewsIfRelevant({ dryRun });
    if (result.skipped) {
      console.log("[porto-group-news] skipped:", result.skipped);
      return;
    }
    console.log("[porto-group-news]", {
      dryRun: result.dryRun ?? false,
      kind: result.kind,
      slug: result.slug,
      title: result.title,
      messageId: result.messageId,
    });
    if (dryRun && result.html) {
      console.log("--- html ---");
      console.log(result.html);
    }
    return;
  }

  const result = await postNextPortoGroupNote({ dryRun, slug: slug || undefined });
  if (result.skipped) {
    console.log("[porto-group] skipped:", result.skipped);
    return;
  }
  console.log("[porto-group]", {
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
