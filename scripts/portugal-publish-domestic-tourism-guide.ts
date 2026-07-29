/**
 * Publish / update domestic tourism guide on portugal.emigro.online
 *
 *   npm run portugal:publish-domestic-tourism-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { DOMESTIC_TOURISM_NORTE_GUIDE } from "@/lib/community-notes/guides/domestic-tourism-portugal-norte";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...DOMESTIC_TOURISM_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
