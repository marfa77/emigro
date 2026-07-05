import fs from "fs";
import path from "path";
import {
  RU_TTS_VOICE,
  canRunYoutubeShortsLocally,
  isDynamicVideoEnabled,
  isYoutubeShortsEnabled,
  youtubeShortsOutputRoot,
} from "./config";
import { artifact, gcsDestination, uploadArtifactsToGcs } from "./gcs";
import {
  buildTipShortMetadata,
  spokenLinesFromSegments,
  writeShortUploadFields,
} from "./metadata";
import {
  assertShortDuration,
  ffprobeDuration,
  renderAudio,
  renderShortFrames,
  renderShortThumbnail,
  renderVideo,
  writeFrameConcat,
  writeSrt,
} from "./render";
import { writeTipShortScript } from "./script-writer";
import { notifyYoutubeShortOwner, isYoutubeShortSkipMessage } from "./notify-owner";
import { markTopicPublished, pickNextTipTopic, alreadyGeneratedToday } from "./state";
import { assertTipDurationEstimate, buildTipSegments, estimateTipDurationSeconds, wordCount } from "./tip-script";
import { todayYmd } from "./text-utils";
import type { YoutubeShortResult } from "./types";
import type { TipShortTopic } from "./topics";
import { uploadShortToYoutube } from "./youtube-upload";
import { composeDynamicVideo } from "./video-compose";

export type GenerateTipShortOptions = {
  topicId?: string;
  outputDir?: string;
  uploadGcs?: boolean;
  uploadYoutube?: boolean;
  forceAudio?: boolean;
  skipState?: boolean;
  /** Bypass one-short-per-day guard (CLI --force). */
  force?: boolean;
};

function outputDirForTopic(topic: TipShortTopic, custom?: string): string {
  return custom ?? path.join(youtubeShortsOutputRoot(), `${topic.id}-${todayYmd()}`);
}

export async function generateTipYoutubeShort(options: GenerateTipShortOptions = {}): Promise<YoutubeShortResult> {
  if (!canRunYoutubeShortsLocally()) {
    throw new Error("YouTube Shorts requires ffmpeg/ffprobe and cannot run on Vercel serverless");
  }

  if (!options.force && !options.topicId && alreadyGeneratedToday()) {
    console.log(`[youtube-short] Already generated today (${todayYmd()}), skipping`);
    throw new Error(`Daily short already generated for ${todayYmd()}`);
  }

  const topic = pickNextTipTopic(options.topicId);
  const outputDir = outputDirForTopic(topic, options.outputDir);
  const existingVideo = path.join(outputDir, "short.mp4");

  if (fs.existsSync(existingVideo) && !options.forceAudio) {
    console.log(`[youtube-short] Cached: ${existingVideo}`);
    const metadataPath = path.join(outputDir, "short-youtube-metadata.json");
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    return {
      topicId: topic.id,
      outputDir,
      gcsUri: null,
      youtube: null,
      metadata,
      artifacts: [],
      report: {
        word_count: 0,
        video_duration_seconds: ffprobeDuration(existingVideo),
        voice: RU_TTS_VOICE,
        format: topic.format,
        files: { shortVideo: existingVideo },
      },
    };
  }

  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`[youtube-short] Topic: ${topic.id} — ${topic.title}`);

  const script = await writeTipShortScript(topic);
  fs.writeFileSync(path.join(outputDir, "short-script.json"), JSON.stringify(script, null, 2));
  fs.writeFileSync(
    path.join(outputDir, "short-script.txt"),
    [`[hook]\n${script.hook}`, `[body]\n${script.body}`, `[cta]\n${script.cta}`].join("\n\n") + "\n"
  );

  const segments = buildTipSegments(script, topic);
  assertTipDurationEstimate(segments);

  const dateYmd = todayYmd();
  const estimatedDuration = estimateTipDurationSeconds(segments);
  const shortMetadataPath = path.join(outputDir, "short-youtube-metadata.json");
  fs.writeFileSync(
    shortMetadataPath,
    JSON.stringify(buildTipShortMetadata(topic, script, estimatedDuration, dateYmd), null, 2),
    { encoding: "utf8" }
  );

  const { audioPath, segmentDurations } = await renderAudio(segments, outputDir, options.forceAudio ?? false);
  const shortFrames = await renderShortFrames(topic, segments, segmentDurations, outputDir);
  const shortCaptionsPath = path.join(outputDir, "short-captions.srt");
  writeSrt(shortFrames, shortCaptionsPath);

  const shortVideoPath = path.join(outputDir, "short.mp4");
  if (isDynamicVideoEnabled()) {
    await composeDynamicVideo({
      topic,
      frames: shortFrames,
      segments,
      segmentDurations,
      audioPath,
      outputPath: shortVideoPath,
      outputDir,
    });
  } else {
    const framesConcatPath = writeFrameConcat(shortFrames, outputDir);
    renderVideo(framesConcatPath, audioPath, shortVideoPath);
  }
  const videoDuration = ffprobeDuration(shortVideoPath);
  assertShortDuration(videoDuration);

  const shortThumbnailPath = path.join(outputDir, "short-thumbnail.png");
  await renderShortThumbnail(topic, shortThumbnailPath, script.visual_hook);

  const metadata = buildTipShortMetadata(topic, script, videoDuration, dateYmd);
  fs.writeFileSync(shortMetadataPath, JSON.stringify(metadata, null, 2), { encoding: "utf8" });

  const files = {
    shortScript: path.join(outputDir, "short-script.txt"),
    shortAudio: audioPath,
    shortCaptions: shortCaptionsPath,
    shortVideo: shortVideoPath,
    shortThumbnail: shortThumbnailPath,
    shortMetadata: shortMetadataPath,
  };

  const artifacts = [
    artifact("shortVideo", "short.mp4", outputDir),
    artifact("shortAudio", "short-voiceover.mp3", outputDir),
    artifact("shortCaptions", "short-captions.srt", outputDir),
    artifact("shortScript", "short-script.txt", outputDir),
    artifact("shortScriptJson", "short-script.json", outputDir),
    artifact("shortThumbnail", "short-thumbnail.png", outputDir),
    artifact("shortMetadata", "short-youtube-metadata.json", outputDir),
    artifact("shortUploadFields", "short-youtube-upload-fields.txt", outputDir),
  ];

  let gcsUri: string | null = null;
  let youtube = null;
  if (options.uploadYoutube !== false) {
    try {
      youtube = await uploadShortToYoutube({
        outputDir,
        videoPath: shortVideoPath,
        thumbnailPath: shortThumbnailPath,
        captionsPath: shortCaptionsPath,
        metadata,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[youtube-upload] Failed: ${msg}`);
      throw new Error(`YouTube upload failed: ${msg}`);
    }
  }

  if (options.uploadGcs !== false && process.env.EMIGRO_YOUTUBE_SHORTS_UPLOAD_GCS !== "0") {
    gcsUri = gcsDestination(topic, dateYmd);
  }

  writeShortUploadFields({
    topic,
    metadata,
    outputDir,
    files,
    gcsUri,
    guideSlug: topic.guide_slug,
    youtube,
  });

  if (gcsUri) {
    console.log(`[youtube-short] Uploading to ${gcsUri}`);
    uploadArtifactsToGcs(artifacts, gcsUri);
  }

  if (!options.skipState) {
    markTopicPublished(topic.id);
  }

  const report = {
    word_count: wordCount(`${script.hook} ${script.body} ${script.cta}`),
    video_duration_seconds: Number(videoDuration.toFixed(2)),
    voice: RU_TTS_VOICE,
    format: topic.format,
    files,
    youtube: youtube ?? undefined,
  };

  fs.writeFileSync(
    path.join(outputDir, "generation-report.json"),
    JSON.stringify({ topic_id: topic.id, gcs_uri: gcsUri, ...report, script }, null, 2)
  );

  const youtubeNote = youtube ? ` → ${youtube.shortsUrl}` : "";
  console.log(`[youtube-short] Done: ${videoDuration.toFixed(1)}s → ${outputDir}${youtubeNote}`);

  return {
    topicId: topic.id,
    outputDir,
    gcsUri,
    youtube,
    metadata,
    artifacts,
    report,
  };
}

export async function maybeGenerateDailyTipShort(): Promise<boolean> {
  if (!isYoutubeShortsEnabled()) {
    console.log("[youtube-short] Skipped: EMIGRO_YOUTUBE_SHORTS_ENABLED=0");
    return false;
  }
  if (!canRunYoutubeShortsLocally()) {
    console.log("[youtube-short] Skipped: no ffmpeg (run on VPS/local)");
    return false;
  }
  try {
    await generateTipYoutubeShort();
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (isYoutubeShortSkipMessage(msg)) {
      console.log(`[youtube-short] ${msg}`);
      await notifyYoutubeShortOwner({ status: "skipped", error: msg });
      return true;
    }
    console.error(`[youtube-short] Failed: ${msg}`);
    await notifyYoutubeShortOwner({ status: "error", error: msg });
    return false;
  }
}

/** @deprecated News-based shorts removed — use generateTipYoutubeShort */
export async function generateNewsYoutubeShort(): Promise<never> {
  throw new Error("News-based Shorts disabled. Use generateTipYoutubeShort() for evergreen tips.");
}

export async function maybeGenerateNewsYoutubeShort(): Promise<boolean> {
  return maybeGenerateDailyTipShort();
}

export { pickNextTipTopic, listTipTopics } from "./state";