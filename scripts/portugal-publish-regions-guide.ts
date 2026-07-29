/**
 * Publish / update Portugal regions expat guide on portugal.emigro.online
 *
 *   npm run portugal:publish-regions-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTUGAL_REGIONS_EXPAT_GUIDE } from "@/lib/community-notes/guides/portugal-regions-expat-guide";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTUGAL_REGIONS_EXPAT_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
