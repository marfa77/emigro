/**
 * Publish / update the foreign-passport replacement guide on portugal.emigro.online
 *
 *   npm run portugal:publish-passport-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { FOREIGN_PASSPORT_REPLACEMENT_GUIDE } from "@/lib/community-notes/guides/foreign-passport-replacement";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...FOREIGN_PASSPORT_REPLACEMENT_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
