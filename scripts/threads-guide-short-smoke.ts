#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "node:path";
import { composeGuideShortPlan, type GuideShortAccount } from "../lib/threads/guide-short";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const accounts = (process.argv.includes("--all")
    ? (["assist", "invest", "portugal", "italy"] as GuideShortAccount[])
    : (["assist"] as GuideShortAccount[]));
  for (const account of accounts) {
    const plan = await composeGuideShortPlan({
      account,
      usedSlugs: [],
      publishedCount: 1,
      campaignContent: `${account}-smoke`,
    });
    console.log(account, "=>", plan?.slug, "link=", plan?.withLink);
    console.log(plan?.preview || "(empty)");
    console.log("---");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
