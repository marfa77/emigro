/**
 * Publish / update first-month checklist (GV family, Norte) on portugal.emigro.online
 *
 *   npm run portugal:publish-first-month-checklist
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { PERVYJ_MESYAC_CHECKLIST_GUIDE } from "@/lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";

async function main() {
  await publishHandGuide(PERVYJ_MESYAC_CHECKLIST_GUIDE);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
