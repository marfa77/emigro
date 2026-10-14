#!/usr/bin/env npx tsx
/**
 * Daily publisher for the Italy satellite account.
 * Dry-run unless THREADS_IT_SAT_AUTO_PUBLISH=1 and --force-publish.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import {
  assertItalySatelliteAccountIsolated,
  composeItalySatelliteChain,
  expectedItalySatelliteUsername,
  loadItalySatelliteState,
  planItalySatellitePost,
  previewItalySatellite,
  saveItalySatelliteState,
} from "../lib/threads/italy-satellite";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3).trim() || undefined;
}

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const state = loadItalySatelliteState();
  const planned = planItalySatellitePost({ today: arg("today"), state });
  if (!planned.row) {
    console.log("[threads-it-sat]", planned.skip || "no_plan", planned.today);
    return;
  }
  const row = planned.row;
  console.log(
    `[threads-it-sat] day-${row.d} ${planned.today}\n${previewItalySatellite(row, planned.today)}`
  );
  if (!forcePublish) {
    console.log("[threads-it-sat] DRY-RUN: no API write.");
    return;
  }
  if (process.env.THREADS_IT_SAT_AUTO_PUBLISH !== "1") {
    throw new Error("THREADS_IT_SAT_AUTO_PUBLISH is not 1");
  }
  const token = (process.env.THREADS_IT_SAT_ACCESS_TOKEN || "").trim();
  const userId = (process.env.THREADS_IT_SAT_USER_ID || "").trim();
  const username = expectedItalySatelliteUsername();
  if (!token || !userId) {
    throw new Error("THREADS_IT_SAT_ACCESS_TOKEN and THREADS_IT_SAT_USER_ID required");
  }
  process.env.THREADS_ACCESS_TOKEN = token;
  process.env.THREADS_USER_ID = userId;
  process.env.THREADS_USERNAME = username;
  process.env.THREADS_AUTO_PUBLISH = "1";
  process.env.THREADS_ENABLE_REPLY_APPROVALS = "0";

  const { fetchThreadsMe, fetchThreadsPermalink, publishThreadsChain } = await import(
    "../lib/threads/client"
  );
  const me = await fetchThreadsMe();
  assertItalySatelliteAccountIsolated(me);
  const items = composeItalySatelliteChain(row, { today: planned.today });
  const result = await publishThreadsChain({ items, forcePublish: true });
  state.last_day = row.d;
  state.last_posted_on = planned.today;
  state.posts[`day-${row.d}`] = {
    at: new Date().toISOString(),
    ids: result.publishedIds,
    format: items[0]?.imageUrl ? "IMAGE" : "TEXT",
  };
  saveItalySatelliteState(state);
  for (const id of result.publishedIds) {
    console.log("published", (await fetchThreadsPermalink(id)) || id);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
