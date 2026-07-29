/**
 * Publish / update the driving-license exchange guide on portugal.emigro.online
 *
 *   npm run portugal:publish-license-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...DRIVING_LICENSE_EXCHANGE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
