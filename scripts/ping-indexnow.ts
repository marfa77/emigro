#!/usr/bin/env npx tsx
/** Ping IndexNow for all guide URLs (initial Yandex/Bing indexing). */
import { config } from "dotenv";
import { resolve } from "path";
import { guidePath, listGuides } from "../lib/guides/load";
import { pingIndexNow } from "../lib/seo/indexnow";
import { SITE_URL } from "../lib/site-url";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const guides = listGuides();
  const urls = [
    `${SITE_URL}/ru`,
    `${SITE_URL}/ru/guides`,
    ...guides.map((g) => `${SITE_URL}${guidePath(g.slug)}`),
  ];
  console.log(`Pinging IndexNow for ${urls.length} URLs…`);
  await pingIndexNow(urls);
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
