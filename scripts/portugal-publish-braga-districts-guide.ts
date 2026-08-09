/**
 * Publish Braga districts / rent / parks / sport guide.
 *
 *   npm run portugal:publish-braga-districts-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { BRAGA_DISTRICTS_GUIDE } from "@/lib/community-notes/guides/braga-districts-life";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...BRAGA_DISTRICTS_GUIDE, city: "braga" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
