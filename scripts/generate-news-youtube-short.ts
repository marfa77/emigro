#!/usr/bin/env npx tsx
/**
 * Evergreen tip/lifehack YouTube Short for @Emigro_news (NOT news).
 *
 * Usage:
 *   npm run news:youtube-short:daily          # next topic from queue
 *   npm run news:youtube-short -- --topic=nif-one-day
 *   npm run news:youtube-short -- --topic=lisbon-rent-2026 --force
 *   npm run news:youtube-short -- --list-topics
 *   npm run news:youtube-short -- --script-only --topic=d7-vs-d8-one-minute
 */
import { config } from "dotenv";
import { resolve } from "path";
import { generateTipYoutubeShort } from "../lib/news/youtube-short/generate";
import { isYoutubeShortSkipMessage, notifyYoutubeShortOwner } from "../lib/news/youtube-short/notify-owner";
import { listTipTopics } from "../lib/news/youtube-short/state";
import { writeTipShortScript } from "../lib/news/youtube-short/script-writer";
import { getTipTopic } from "../lib/news/youtube-short/topics";
import { buildTipSegments } from "../lib/news/youtube-short/tip-script";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

if (process.argv.includes("--static")) {
  process.env.EMIGRO_YOUTUBE_SHORTS_DYNAMIC = "0";
}

function argValue(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);
  const idx = process.argv.indexOf(name);
  if (idx >= 0) return process.argv[idx + 1];
  return undefined;
}

async function main() {
  if (process.argv.includes("--list-topics")) {
    const topics = listTipTopics();
    for (const t of topics) {
      console.log(`${t.published ? "✓" : "·"} ${t.id} — ${t.title}`);
    }
    return;
  }

  const topicId = argValue("--topic");
  const scriptOnly = process.argv.includes("--script-only");
  const noUpload = process.argv.includes("--no-upload");
  const noYoutubeUpload = process.argv.includes("--no-youtube-upload");
  const staticVideo = process.argv.includes("--static");
  const forceAudio = process.argv.includes("--force-audio");
  const force = process.argv.includes("--force");
  const outDir = argValue("--out");

  if (scriptOnly) {
    const topic = topicId ? getTipTopic(topicId) : listTipTopics().find((t) => !t.published);
    if (!topic) {
      console.error("No topic found. Use --topic=id");
      process.exit(1);
    }
    const script = await writeTipShortScript(topic);
    const segments = buildTipSegments(script, topic);
    console.log(JSON.stringify(script, null, 2));
    console.log("\n--- segments ---");
    for (const s of segments) console.log(`[${s.kind}] ${s.text}`);
    return;
  }

  try {
    const result = await generateTipYoutubeShort({
      topicId,
      outputDir: outDir,
      uploadGcs: !noUpload,
      uploadYoutube: !noYoutubeUpload,
      forceAudio,
      force,
    });
    await notifyYoutubeShortOwner({ status: "success", result });
    console.log(JSON.stringify({ ...result.report, youtube: result.youtube }, null, 2));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await notifyYoutubeShortOwner({
      status: isYoutubeShortSkipMessage(msg) ? "skipped" : "error",
      topicId,
      error: msg,
    });
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
