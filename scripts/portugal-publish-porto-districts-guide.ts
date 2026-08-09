/**
 * Publish Porto districts / schools / rent / parks / sport guide.
 *
 *   npm run portugal:publish-porto-districts-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTO_DISTRICTS_GUIDE } from "@/lib/community-notes/guides/porto-districts-life";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTO_DISTRICTS_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
