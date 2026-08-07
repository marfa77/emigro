/**
 * One-off: force-refresh OG stock for recent guides (bright pinned Pexels).
 *   npx tsx scripts/refresh-note-og-bright.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";

const notes = [
  {
    slug: "narkotiki-portugaliya-norte-zakon-mify-2026",
    title: "Наркотики в Португалии закон",
    topic_tags: ["portugal", "norte", "bezopasnost"],
    content_kind: "guide" as const,
    country_key: "portugal" as const,
  },
  {
    slug: "festivali-portugalii-2026-muzyka-porto-norte",
    title: "Фестивали Португалии 2026",
    topic_tags: ["portugal", "norte", "dosug"],
    content_kind: "guide" as const,
    country_key: "portugal" as const,
  },
  {
    slug: "kluby-portugalii-tehno-underground-2026",
    title: "Клубы техно Португалия",
    topic_tags: ["portugal", "norte", "dosug"],
    content_kind: "guide" as const,
    country_key: "portugal" as const,
  },
];

async function main() {
  for (const n of notes) {
    const r = await ensureNoteOgImage(n, { force: true });
    console.log(n.slug, r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
