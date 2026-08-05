/**
 * Publish yellow pages relocant contacts guide.
 *
 *   npm run portugal:publish-yellow-pages-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { YELLOW_PAGES_RELOCANT_GUIDE } from "@/lib/community-notes/guides/yellow-pages-relocant-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...YELLOW_PAGES_RELOCANT_GUIDE, city: "lisbon" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
