/**
 * Publish / update Porto vs Braga family schools guide on portugal.emigro.online
 *
 *   npm run portugal:publish-porto-braga-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTO_VS_BRAGA_FAMILY_SCHOOLS_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
