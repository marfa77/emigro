#!/usr/bin/env npx tsx
/**
 * Daily Threads: weekday slots (guides / wizard / city / assist / news).
 *
 *   npm run threads:daily -- --dry-run
 *   npm run threads:daily -- --kind=guide --dry-run
 *   npm run threads:daily -- --force-publish
 */
import { config } from "dotenv";
import { resolve } from "path";
import { fetchThreadsPermalink } from "../lib/threads/client";
import { normalizeThreadsKind, runThreadsDaily } from "../lib/threads/daily-pipeline";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

async function main() {
  const rawKind = arg("kind");
  const forceKind = normalizeThreadsKind(rawKind);
  if (rawKind && !forceKind) {
    throw new Error("--kind must be guide|wizard|city|assist|news|day");
  }
  const result = await runThreadsDaily({
    dryRun: process.argv.includes("--dry-run") || !process.argv.includes("--force-publish"),
    forcePublish: process.argv.includes("--force-publish"),
    forceKind,
  });
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
