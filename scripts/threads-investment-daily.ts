#!/usr/bin/env npx tsx
/**
 * Dated publisher for @emigro_invest.
 *
 * Dry-run:
 *   npm run threads:investment:daily -- --phase=seed --today=2026-09-19
 *
 * Live requires all three:
 *   THREADS_INVESTMENT_PHASE=seed
 *   THREADS_INVESTMENT_AUTO_PUBLISH=1
 *   --force-publish
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import {
  composeInvestmentCalendarPost,
  configuredInvestmentPhase,
  loadInvestmentPostState,
  planInvestmentPost,
  saveInvestmentPostState,
  type InvestmentPhase,
} from "../lib/threads/investment-calendar";
import { formatThreadsChainPreview } from "../lib/threads/compose";
import { assertThreadsInvestmentAccountIsolated } from "../lib/threads/investment-vertical";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3).trim() || undefined;
}

function requestedPhase(): InvestmentPhase | "off" {
  return configuredInvestmentPhase(arg("phase") || process.env.THREADS_INVESTMENT_PHASE);
}

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const phase = requestedPhase();
  const state = loadInvestmentPostState();
  const planned = planInvestmentPost({
    today: arg("today"),
    id: arg("id"),
    phase,
    state,
  });
  if (!planned.row) {
    console.log("[threads-investment]", planned.skip || "no_plan", `phase=${phase}`);
    return;
  }

  const row = planned.row;
  const items = composeInvestmentCalendarPost(row);
  console.log(
    `[threads-investment] ${row.id} ${row.publishOn} phase=${row.phase}\n${formatThreadsChainPreview(items)}`
  );

  if (!forcePublish) {
    console.log("[threads-investment] DRY-RUN: no API write and no state change.");
    return;
  }
  if (process.env.THREADS_INVESTMENT_AUTO_PUBLISH !== "1") {
    throw new Error("THREADS_INVESTMENT_AUTO_PUBLISH is not 1");
  }

  assertThreadsInvestmentAccountIsolated();
  const token = (process.env.THREADS_INVESTMENT_ACCESS_TOKEN || "").trim();
  const userId = (process.env.THREADS_INVESTMENT_USER_ID || "").trim();
  const username = (process.env.THREADS_INVESTMENT_USERNAME || "emigro_invest").trim();
  if (!token || !userId) {
    throw new Error("THREADS_INVESTMENT_ACCESS_TOKEN and THREADS_INVESTMENT_USER_ID required");
  }

  process.env.THREADS_ACCESS_TOKEN = token;
  process.env.THREADS_USER_ID = userId;
  process.env.THREADS_USERNAME = username;
  process.env.THREADS_AUTO_PUBLISH = "1";
  process.env.THREADS_ENABLE_REPLY_APPROVALS = "0";
  process.env.THREADS_REPLY_CONTROL = "everyone";

  const {
    fetchThreadsMe,
    fetchThreadsPermalink,
    listMyThreads,
    publishThreadsChain,
  } = await import("../lib/threads/client");
  const { normalizeThreadsUsername } = await import("../lib/threads/config");

  const me = await fetchThreadsMe();
  if (normalizeThreadsUsername(me.username) !== normalizeThreadsUsername(username)) {
    throw new Error(`Token belongs to @${me.username || "unknown"}, expected @${username}`);
  }

  const rootPrefix = row.p1.slice(0, 90);
  const recent = await listMyThreads(50);
  const duplicate = recent.find((post) => post.text?.startsWith(rootPrefix));
  if (duplicate) {
    state.posts[row.id] = {
      ids: duplicate.id ? [duplicate.id] : [],
      at: duplicate.timestamp || new Date().toISOString(),
    };
    saveInvestmentPostState(state);
    console.log("[threads-investment] existing post recorded", duplicate.permalink || duplicate.id);
    return;
  }

  const result = await publishThreadsChain({ items, forcePublish: true });
  state.posts[row.id] = {
    ids: result.publishedIds,
    at: new Date().toISOString(),
  };
  saveInvestmentPostState(state);
  for (const id of result.publishedIds) {
    console.log("published", (await fetchThreadsPermalink(id)) || id);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
