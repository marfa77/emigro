/**
 * Publish Porto newbuild clusters community guide.
 *
 *   npm run portugal:publish-porto-newbuild-clusters-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTO_NEWBUILD_CLUSTERS_GUIDE } from "@/lib/community-notes/guides/porto-newbuild-clusters-2026";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTO_NEWBUILD_CLUSTERS_GUIDE });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
