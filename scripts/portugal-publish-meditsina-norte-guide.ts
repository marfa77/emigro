/**
 * Publish / update Norte healthcare guide on portugal.emigro.online
 *
 *   npm run portugal:publish-meditsina-norte-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { MEDITSINA_NORTE_HEALTHCARE_GUIDE } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...MEDITSINA_NORTE_HEALTHCARE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
