#!/usr/bin/env npx tsx
/**
 * Evergreen tip/lifehack YouTube Short for @Emigro_news (NOT news).
 *
 * Usage:
 *   npm run news:youtube-short:daily          # next topic from queue
 *   npm run news:youtube-short -- --topic=aima-agora-zapis-2026
 *   npm run news:youtube-short -- --topic=nif-lissabon-chto-puutayut --force
 *   npm run news:youtube-short -- --pick-next
 *   npm run news:youtube-short -- --list-topics
 *   npm run news:youtube-short -- --health
 */
import { config } from "dotenv";
import { resolve } from "path";
import { generateTipYoutubeShort } from "../lib/news/youtube-short/generate";
import { isYoutubeShortSkipMessage, notifyYoutubeShortOwner, notifyYoutubeShortPipelineStage } from "../lib/news/youtube-short/notify-owner";
import { listTipTopics, pickNextTipTopics } from "../lib/news/youtube-short/state";
import { writeTipShortScript } from "../lib/news/youtube-short/script-writer";
import { getCommunityTipTopic } from "../lib/news/youtube-short/community-topics";
import { buildTipSegments } from "../lib/news/youtube-short/tip-script";
import { printHealthReport, runHealthCheck } from "../lib/news/youtube-short/health";

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
  if (process.argv.includes("--health")) {
    const report = await runHealthCheck();
    printHealthReport(report);
    process.exit(report.ok ? 0 : 1);
  }

  if (process.argv.includes("--pick-next")) {
    const nextCount = Math.max(1, Number.parseInt(argValue("--next") ?? "1", 10) || 1);
    const topics = await pickNextTipTopics(nextCount);
    const payload =
      nextCount === 1
        ? {
            slug: topics[0].id,
            title: topics[0].title,
            note_url: topics[0].note_url,
            content_kind: topics[0].content_kind,
          }
        : topics.map((topic) => ({
            slug: topic.id,
            title: topic.title,
            note_url: topic.note_url,
            content_kind: topic.content_kind,
          }));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (process.argv.includes("--list-topics")) {
    const topics = await listTipTopics();
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
    const topic = topicId
      ? await getCommunityTipTopic(topicId)
      : (await listTipTopics()).find((t) => !t.published);
    if (!topic) {
      console.error("No topic found. Use --topic=note-slug from portugal.emigro.online");
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
    if (!isYoutubeShortSkipMessage(msg)) {
      await notifyYoutubeShortPipelineStage({ stage: "error", topicId, detail: msg });
    }
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
