/**
 * Publish Portugal underground clubs / nightlife guide.
 *
 *   npm run portugal:publish-clubs-underground-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { CLUBS_PORTUGAL_UNDERGROUND_GUIDE } from "@/lib/community-notes/guides/clubs-portugal-underground-2026";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...CLUBS_PORTUGAL_UNDERGROUND_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
