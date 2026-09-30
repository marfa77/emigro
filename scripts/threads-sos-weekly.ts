#!/usr/bin/env npx tsx
/**
 * Weekly SOS post on @emigro_assist (Tuesday, Europe/Lisbon).
 * Dry-run unless --force-publish (plus THREADS_AUTO_PUBLISH=1 inside publishThreadsChain).
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import {
  assertThreadsSosBank,
  composeThreadsSosChain,
  loadThreadsSosState,
  planThreadsSosPost,
  previewThreadsSos,
  saveThreadsSosState,
} from "../lib/threads/sos";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3).trim() || undefined;
}

async function main() {
  const forcePublish = process.argv.includes("--force-publish");
  const errors = assertThreadsSosBank();
  if (errors.length) throw new Error(`sos bank invalid:\n${errors.join("\n")}`);

  const state = loadThreadsSosState();
  const planned = planThreadsSosPost({ today: arg("today"), state });
  if (!planned.row) {
    console.log("[threads-sos]", planned.skip || "no_plan", planned.today);
    if (planned.skip === "sos_bank_exhausted") throw new Error("sos bank exhausted — add verified rows");
    return;
  }
  const row = planned.row;
  console.log(`[threads-sos] sos-${row.id} ${row.country} ${planned.today}\n${previewThreadsSos(row)}`);
  if (!forcePublish) {
    console.log("[threads-sos] DRY-RUN: no API write.");
    return;
  }

  const { fetchThreadsPermalink, publishThreadsChain } = await import("../lib/threads/client");
  const result = await publishThreadsChain({ items: composeThreadsSosChain(row), forcePublish: true });
  state.last_id = row.id;
  state.last_posted_on = planned.today;
  state.posts[`sos-${row.id}`] = { at: new Date().toISOString(), ids: result.publishedIds };
  saveThreadsSosState(state);
  for (const id of result.publishedIds) {
    console.log("published", (await fetchThreadsPermalink(id)) || id);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
