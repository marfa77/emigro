/**
 * Publish / update tolls, fines & accidents guide on portugal.emigro.online
 *
 *   npm run portugal:publish-tolls-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { TOLLS_FINES_ACCIDENTS_GUIDE } from "@/lib/community-notes/guides/tolls-fines-accidents-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...TOLLS_FINES_ACCIDENTS_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
