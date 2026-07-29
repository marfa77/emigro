/**
 * Publish / update land build Norte guide on portugal.emigro.online
 *
 *   npm run portugal:publish-land-build-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { LAND_BUILD_NORTE_GUIDE } from "@/lib/community-notes/guides/land-build-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...LAND_BUILD_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
