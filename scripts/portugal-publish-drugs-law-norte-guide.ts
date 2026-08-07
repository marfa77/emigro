/**
 * Publish Norte drugs law / myths guide (anti-use stance).
 *
 *   npm run portugal:publish-drugs-law-norte-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { DRUGS_LAW_NORTE_GUIDE } from "@/lib/community-notes/guides/drugs-law-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...DRUGS_LAW_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
