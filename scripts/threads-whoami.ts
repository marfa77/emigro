#!/usr/bin/env npx tsx
/**
 * Confirm the connected Threads user is @emigro2eu, not a personal login.
 *
 *   npm run threads:whoami
 */
import { config } from "dotenv";
import { resolve } from "path";
import { fetchThreadsMe } from "../lib/threads";
import {
  assertThreadsBrandUsername,
  expectedThreadsBrandUsername,
} from "../lib/threads/config";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const me = await fetchThreadsMe();
  const want = expectedThreadsBrandUsername();
  console.log(JSON.stringify({ ...me, expected: want }, null, 2));
  assertThreadsBrandUsername(me.username);
  console.log(`\nOK — token is @${want}. Set THREADS_USER_ID to ${me.id}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
