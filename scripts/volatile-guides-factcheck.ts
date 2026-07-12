/**
 * Lazy fact-check for volatile guides — stale dates, backlog patterns, contradictions.
 *
 *   npm run guides:volatile-factcheck
 *   npm run guides:volatile-factcheck -- --dry-run
 *   npm run guides:volatile-factcheck -- --notify
 *   npm run guides:volatile-factcheck -- --slug=ees-shengenskaya-sistema-2026 --json
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { listGuides } from "@/lib/guides/load";
import { listVolatileGuides } from "@/lib/guides/review-tiers";
import {
  notifyVolatileFactcheckIssues,
  factcheckNotifyTelegramChatId,
} from "@/lib/guides/volatile-factcheck-notify";
import { runVolatileGuideFactcheck } from "@/lib/guides/volatile-factcheck";

function parseArgs() {
  const args = process.argv.slice(2);
  let slug: string | undefined;
  let dryRun = false;
  let notify = false;
  let json = false;
  let skipCommunity = false;

  for (const arg of args) {
    if (arg.startsWith("--slug=")) slug = arg.slice(7);
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--notify") notify = true;
    else if (arg === "--json") json = true;
    else if (arg === "--skip-community") skipCommunity = true;
  }

  return { slug, dryRun, notify, json, skipCommunity };
}

function printReport(issues: typeof import("@/lib/guides/volatile-factcheck").VolatileFactcheckIssue[], scanned: number) {
  console.log("\n=== Volatile guides fact-check ===");
  console.log(`Scanned: ${scanned} volatile guides`);
  console.log(`Issues: ${issues.length}\n`);

  if (issues.length === 0) {
    console.log("No issues found.");
    return;
  }

  let currentSlug = "";
  for (const issue of issues) {
    if (issue.slug !== currentSlug) {
      currentSlug = issue.slug;
      console.log(`\n## ${issue.slug}`);
      console.log(`   content/guides/ru/${issue.slug}.md\n`);
    }
    console.log(`- [${issue.severity}] ${issue.issue}`);
    console.log(`  «${issue.excerpt}»`);
    console.log(`  → ${issue.suggestedAction}`);
  }
}

async function main() {
  const { slug, dryRun, notify, json, skipCommunity } = parseArgs();
  const volatile = listVolatileGuides(listGuides());
  const scanned = slug ? volatile.filter((g) => g.slug === slug).length : volatile.length;

  if (slug && scanned === 0) {
    console.error(`Slug not found or not volatile: ${slug}`);
    process.exit(1);
  }

  const issues = await runVolatileGuideFactcheck({
    slugs: slug ? [slug] : undefined,
    skipCommunitySignals: skipCommunity,
  });

  if (json) {
    console.log(JSON.stringify({ scanned, count: issues.length, issues }, null, 2));
  } else {
    printReport(issues, scanned);
  }

  if (dryRun) {
    console.log("\n--- dry-run: Telegram not sent ---");
    if (issues.length > 0) {
      const chatId = factcheckNotifyTelegramChatId();
      console.log(`Would notify chat_id=${chatId ?? "(not set)"}`);
    }
    return;
  }

  if (notify) {
    if (issues.length === 0) {
      console.log("\n--- notify: no issues, skipping Telegram ---");
      return;
    }

    const result = await notifyVolatileFactcheckIssues(issues, scanned);
    if (result.skipped) {
      console.warn(`\n--- notify skipped: ${result.error} ---`);
      process.exit(1);
    }
    if (!result.success) {
      console.error(`\n--- notify failed: ${result.error} ---`);
      process.exit(1);
    }
    console.log("\n--- Telegram DM sent ---");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
