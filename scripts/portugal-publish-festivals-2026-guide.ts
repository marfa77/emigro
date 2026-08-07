/**
 * Publish Portugal festivals 2026 guide.
 *
 *   npm run portugal:publish-festivals-2026-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { FESTIVALS_PORTUGAL_2026_GUIDE } from "@/lib/community-notes/guides/festivals-portugal-2026";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...FESTIVALS_PORTUGAL_2026_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
