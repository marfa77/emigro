/**
 * Publish Norte wines & wineries guide (Douro / Port / Vinho Verde).
 *
 *   npm run portugal:publish-wines-norte-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { WINES_WINERIES_NORTE_GUIDE } from "@/lib/community-notes/guides/wines-wineries-norte-portugal";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...WINES_WINERIES_NORTE_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
