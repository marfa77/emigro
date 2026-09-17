#!/usr/bin/env npx tsx
/**
 * Preview the isolated Emigro partner-recruitment chain.
 *
 * Default is dry-run. Live publication requires both:
 *   THREADS_AUTO_PUBLISH=1 npm run threads:partner-pin -- --force-publish
 *
 * This script does not touch the daily inventory or its posting state.
 * Pinning remains a manual action in Threads after publication.
 */
import { config } from "dotenv";
import { resolve } from "path";
import {
  fetchThreadsPermalink,
  publishThreadsChain,
} from "../lib/threads/client";
import { formatThreadsChainPreview } from "../lib/threads/compose";
import { composeThreadsPartnerPin } from "../lib/threads/partner-pin";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const items = composeThreadsPartnerPin();

  console.log(formatThreadsChainPreview(items));
  console.log("\n———\n");

  const result = await publishThreadsChain({ items, forcePublish });
  if (result.dryRun) {
    console.log("DRY-RUN: daily Threads inventory and state were not changed.");
    return;
  }

  for (const id of result.publishedIds) {
    const permalink = await fetchThreadsPermalink(id);
    console.log(permalink ? `${id} ${permalink}` : id);
  }
  console.log("Published outside the reach rotation. Pin the root manually in Threads.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
