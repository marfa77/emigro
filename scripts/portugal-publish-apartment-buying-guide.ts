/**
 * Publish / update apartment buying Norte guide on portugal.emigro.online
 *
 *   npm run portugal:publish-apartment-buying-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { APARTMENT_BUY_NORTE_GUIDE } from "@/lib/community-notes/guides/apartment-buy-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...APARTMENT_BUY_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
