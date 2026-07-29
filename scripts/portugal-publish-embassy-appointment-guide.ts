/**
 * Publish / update the embassy appointment booking guide on portugal.emigro.online
 *
 *   npm run portugal:publish-embassy-appointment-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { EMBASSY_APPOINTMENT_GUIDE } from "@/lib/community-notes/guides/embassy-appointment-booking";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...EMBASSY_APPOINTMENT_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
