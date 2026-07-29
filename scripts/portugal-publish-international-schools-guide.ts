/**
 * Publish / update the international schools guide on portugal.emigro.online
 *
 *   npm run portugal:publish-schools-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { INTERNATIONAL_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/international-schools-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...INTERNATIONAL_SCHOOLS_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
