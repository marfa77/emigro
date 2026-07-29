/**
 * Publish / update Porto/Braga long-term rent guide on portugal.emigro.online
 *
 *   npm run portugal:publish-porto-braga-rent-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PORTO_BRAGA_LONG_TERM_RENT_GUIDE } from "@/lib/community-notes/guides/porto-braga-long-term-rent";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide({ ...PORTO_BRAGA_LONG_TERM_RENT_GUIDE, city: "porto" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
