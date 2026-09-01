/**
 * Publish Camino Portugués from Porto guide.
 *
 *   npm run portugal:publish-camino-porto-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { CAMINO_PORTUGUES_PORTO_GUIDE } from "@/lib/community-notes/guides/camino-portugues-porto";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...CAMINO_PORTUGUES_PORTO_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
