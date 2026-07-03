import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";

async function main() {
  const s = await refreshDailySpotlight("portugal");
  if (!s) {
    console.log("[spotlight] no published notes");
    return;
  }
  console.log("[spotlight]", s.note_slug, s.headline);
  console.log("---");
  console.log(s.threads_text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
