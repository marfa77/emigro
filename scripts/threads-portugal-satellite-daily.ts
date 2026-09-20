#!/usr/bin/env npx tsx
/**
 * Soft M/W/F publisher for the Portugal satellite account.
 * Dry-run unless THREADS_PT_SAT_AUTO_PUBLISH=1 and --force-publish.
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import {
  assertPortugalSatelliteAccountIsolated,
  composePortugalSatelliteChain,
  expectedPortugalSatelliteUsername,
  loadPortugalSatelliteState,
  planPortugalSatellitePost,
  previewPortugalSatellite,
  savePortugalSatelliteState,
} from "../lib/threads/portugal-satellite";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3).trim() || undefined;
}

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const state = loadPortugalSatelliteState();
  const planned = planPortugalSatellitePost({ today: arg("today"), state });
  if (!planned.row) {
    console.log("[threads-pt-sat]", planned.skip || "no_plan", planned.today);
    return;
  }
  const row = planned.row;
  console.log(`[threads-pt-sat] day-${row.d} ${planned.today}\n${previewPortugalSatellite(row)}`);
  if (!forcePublish) {
    console.log("[threads-pt-sat] DRY-RUN: no API write.");
    return;
  }
  if (process.env.THREADS_PT_SAT_AUTO_PUBLISH !== "1") {
    throw new Error("THREADS_PT_SAT_AUTO_PUBLISH is not 1");
  }
  const token = (process.env.THREADS_PT_SAT_ACCESS_TOKEN || "").trim();
  const userId = (process.env.THREADS_PT_SAT_USER_ID || "").trim();
  const username = expectedPortugalSatelliteUsername();
  if (!token || !userId) {
    throw new Error("THREADS_PT_SAT_ACCESS_TOKEN and THREADS_PT_SAT_USER_ID required");
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
  assertPortugalSatelliteAccountIsolated(me);
  const items = composePortugalSatelliteChain(row);
  const result = await publishThreadsChain({ items, forcePublish: true });
  state.last_day = row.d;
  state.last_posted_on = planned.today;
  state.posts[`day-${row.d}`] = { at: new Date().toISOString(), ids: result.publishedIds };
  savePortugalSatelliteState(state);
  for (const id of result.publishedIds) {
    console.log("published", (await fetchThreadsPermalink(id)) || id);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
