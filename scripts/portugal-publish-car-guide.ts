/**
 * Publish / update the car buy/rent/import guide on portugal.emigro.online
 *
 *   npm run portugal:publish-car-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { CAR_PORTUGAL_GUIDE } from "@/lib/community-notes/guides/car-portugal-buy-rent-import";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...CAR_PORTUGAL_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
