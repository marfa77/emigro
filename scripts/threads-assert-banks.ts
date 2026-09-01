#!/usr/bin/env npx tsx
/**
 * Assert Emigro Threads banks: 42 days + 21 guides, ≤500 chars after URL,
 * Assist / Porto-chat CTAs, no t.me/+ and no invented “guaranteed VNJ”.
 */
import { config } from "dotenv";
import { resolve } from "path";
import { existsSync } from "fs";
import { assertEmigroThreadsBanks, loadThreadsGuides } from "../lib/threads/banks";
import { listGuides } from "../lib/guides/load";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const errors = assertEmigroThreadsBanks();
const known = new Set(listGuides().map((g) => g.slug));
for (const row of loadThreadsGuides()) {
  if (!known.has(row.guide) && !existsSync(resolve(process.cwd(), `content/guides/ru/${row.guide}.md`))) {
    errors.push(`guide ${row.id}: missing content/guides/ru/${row.guide}.md`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => ` - ${e}`).join("\n"));
  process.exit(1);
}
console.log("threads banks ok: 42 days + 21 guides + 12 wizard");
