/**
 * Publish / update nationwide destination atlas on portugal.emigro.online
 *
 *   npm run portugal:publish-destination-tips-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTUGAL_DESTINATION_TIPS_GUIDE } from "@/lib/community-notes/guides/portugal-destination-tips-2026";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTUGAL_DESTINATION_TIPS_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
