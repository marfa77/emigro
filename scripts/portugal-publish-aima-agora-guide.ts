/**
 * Publish / update AIMA Agora slot-hunting guide.
 *
 *   npm run portugal:publish-aima-agora-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { AIMA_AGORA_GUIDE } from "@/lib/community-notes/guides/aima-agora-zapis";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...AIMA_AGORA_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
