/**
 * Publish / update the VNJ renewal guide on portugal.emigro.online
 *
 *   npm run portugal:publish-vnj-renewal-guide
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { VNJ_RENEWAL_GUIDE } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide(VNJ_RENEWAL_GUIDE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
