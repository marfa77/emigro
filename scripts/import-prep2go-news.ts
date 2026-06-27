#!/usr/bin/env npx tsx
/**
 * Migrate Prep2Go weekly news briefings → Emigro emigro_news_digests (RU).
 *
 * Usage:
 *   npx tsx scripts/import-prep2go-news.ts --dry-run --limit=3
 *   npx tsx scripts/import-prep2go-news.ts --topic=portugal
 *   npx tsx scripts/import-prep2go-news.ts --force
 */
import { config } from "dotenv";
import { resolve } from "path";
import { importPrep2GoNews } from "../lib/news/import-prep2go";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const force = process.argv.includes("--force");
  const topicArg = process.argv.find((a) => a.startsWith("--topic="))?.split("=")[1]?.trim().toLowerCase();
  const limitArg = process.argv.find((a) => a.startsWith("--limit="))?.split("=")[1];
  const limit = limitArg ? Math.max(1, Number(limitArg)) : undefined;
  const concurrencyArg = process.argv.find((a) => a.startsWith("--concurrency="))?.split("=")[1];
  const concurrency = concurrencyArg ? Math.max(1, Math.min(5, Number(concurrencyArg))) : 2;
  const daily = process.argv.includes("--daily");
  const skipTelegram = process.argv.includes("--skip-telegram");
  const maxAgeHours = daily ? 24 : undefined;
  return { dryRun, force, topicArg, limit: daily ? 1 : limit, concurrency, maxAgeHours, daily, skipTelegram };
}

async function main() {
  const { dryRun, force, topicArg, limit, concurrency, maxAgeHours, daily, skipTelegram } = parseArgs();

  console.log(`📰 Prep2Go import${daily ? " (daily mode)" : ""}`);
  console.log(
    `   concurrency=${concurrency}, dryRun=${dryRun}, force=${force}, skipTelegram=${skipTelegram || dryRun}\n`
  );

  const summary = await importPrep2GoNews({
    dryRun,
    force,
    topicKey: topicArg,
    limit,
    concurrency,
    maxAgeHours,
    skipTelegram,
  });

  const imported = summary.results.filter((r) => r.status === "imported");
  const skipped = summary.results.filter((r) => r.status === "skipped");
  const failed = summary.results.filter((r) => r.status === "failed");

  console.log("\n=== Summary ===");
  console.log(`Imported: ${summary.imported}`);
  console.log(`Skipped:  ${summary.skipped}`);
  console.log(`Failed:   ${summary.failed}`);

  if (imported[0]) {
    console.log(`\nSample translation:`);
    console.log(`  EN: ${imported[0].titleEn}`);
    console.log(`  RU: ${imported[0].titleRu}`);
  }

  const report = {
    total: summary.results.length,
    imported: summary.imported,
    skipped: summary.skipped,
    failed: summary.failed,
    storage: "Supabase emigro_news_digests",
    slugs: imported.map((r) => ({ slug: r.emigroSlug, url: `/ru/news/${r.emigroSlug}` })),
    skippedDetails: skipped.map((r) => ({ slug: r.emigroSlug, reason: r.reason })),
    failedDetails: failed.map((r) => ({ slug: r.emigroSlug, reason: r.reason })),
  };

  console.log("\n" + JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
