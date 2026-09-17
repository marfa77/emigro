#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const token = (process.env.THREADS_INVESTMENT_ACCESS_TOKEN || "").trim();
  const userId = (process.env.THREADS_INVESTMENT_USER_ID || "").trim();
  const username = (process.env.THREADS_INVESTMENT_USERNAME || "emigro_invest").trim();
  const forcePublish = process.argv.includes("--force-publish");

  if (!token || !userId) {
    throw new Error(
      "THREADS_INVESTMENT_ACCESS_TOKEN and THREADS_INVESTMENT_USER_ID are required"
    );
  }

  // Reuse the audited client in this process only; never overwrite the primary account env.
  process.env.THREADS_ACCESS_TOKEN = token;
  process.env.THREADS_USER_ID = userId;
  process.env.THREADS_USERNAME = username;
  process.env.THREADS_AUTO_PUBLISH = forcePublish ? "1" : "0";
  process.env.THREADS_ENABLE_REPLY_APPROVALS = "0";
  process.env.THREADS_REPLY_CONTROL = "everyone";

  const {
    fetchThreadsMe,
    fetchThreadsPermalink,
    listMyThreads,
    publishThreadsChain,
  } = await import("../lib/threads/client");
  const { normalizeThreadsUsername } = await import("../lib/threads/config");
  const { THREADS_INVESTMENT_LAUNCH_CHAIN } = await import(
    "../lib/threads/investment-content"
  );

  const me = await fetchThreadsMe();
  if (normalizeThreadsUsername(me.username) !== normalizeThreadsUsername(username)) {
    throw new Error(`Token belongs to @${me.username || "unknown"}, expected @${username}`);
  }

  const recent = await listMyThreads(25);
  const firstLine = THREADS_INVESTMENT_LAUNCH_CHAIN[0].split("\n")[0];
  const duplicate = recent.find((post) => post.text?.startsWith(firstLine));
  if (duplicate) {
    console.log(
      "already published",
      duplicate.permalink || duplicate.id || "(permalink unavailable)"
    );
    return;
  }

  const result = await publishThreadsChain({
    items: THREADS_INVESTMENT_LAUNCH_CHAIN.map((text) => ({ text })),
    forcePublish,
  });
  if (result.dryRun) {
    console.log(result.preview.join("\n\n--- reply ---\n\n"));
    return;
  }

  for (const id of result.publishedIds) {
    console.log("published", (await fetchThreadsPermalink(id)) || id);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
