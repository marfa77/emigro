/**
 * Publish / update Norte climate comfort guide on portugal.emigro.online
 *
 *   npm run portugal:publish-norte-climate-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { NORTE_CLIMATE_COMFORT_GUIDE } from "@/lib/community-notes/guides/norte-climate-comfort";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...NORTE_CLIMATE_COMFORT_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
