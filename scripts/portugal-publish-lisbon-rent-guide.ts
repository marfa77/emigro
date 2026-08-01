/**
 * Publish / update Lisbon first-month rent guide on portugal.emigro.online
 *
 *   npm run portugal:publish-lisbon-rent-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { LISBON_RENT_FIRST_MONTH_GUIDE } from "@/lib/community-notes/guides/lisbon-rent-first-month";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...LISBON_RENT_FIRST_MONTH_GUIDE, city: "lisbon" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
