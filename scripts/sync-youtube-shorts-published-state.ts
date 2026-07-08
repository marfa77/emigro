#!/usr/bin/env npx tsx
/**
 * Backfill published[] from legacy state, local artifacts, and GCS; notify owner.
 *
 *   npm run youtube-shorts:sync-published
 *   npm run youtube-shorts:sync-published -- --notify
 */
import { config } from "dotenv";
import { resolve } from "path";
import { getPublishedTopicSlugs, pickNextTipTopics } from "../lib/news/youtube-short/state";
import { notifyYoutubeShortPublishedSync } from "../lib/news/youtube-short/notify-owner";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  process.env.EMIGRO_YOUTUBE_SHORTS_SYNC_GCS = "1";

  const published = getPublishedTopicSlugs();
  const nextTopics = await pickNextTipTopics(3);

  console.log(JSON.stringify({ published, next: nextTopics }, null, 2));

  if (process.argv.includes("--notify")) {
    await notifyYoutubeShortPublishedSync({
      syncedSlugs: published,
      nextSlug: nextTopics[0].id,
      nextTitle: nextTopics[0].title,
      nextCandidates: nextTopics.map((topic) => ({ slug: topic.id, title: topic.title })),
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
