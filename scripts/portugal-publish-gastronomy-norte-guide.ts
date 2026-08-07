/**
 * Publish Norte gastronomy guide (dishes, recipes, restaurants).
 *
 *   npm run portugal:publish-gastronomy-norte-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { GASTRONOMY_NORTE_GUIDE } from "@/lib/community-notes/guides/gastronomy-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...GASTRONOMY_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
