import fs from "fs";
import path from "path";
import {
  SHORT_DURATION_MAX,
  RU_TTS_VOICE,
  canRunYoutubeShortsLocally,
  isDynamicVideoEnabled,
  isYoutubeShortsEnabled,
  youtubeShortsOutputRoot,
} from "./config";
import { runPreflight } from "./health";
import { artifact, gcsDestination, uploadArtifactsToGcs } from "./gcs";
import {
  buildTipShortMetadata,
  spokenLinesFromSegments,
  writeShortUploadFields,
} from "./metadata";
import {
  fitVoiceoverToMaxDuration,
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
import {
  notifyYoutubeShortOwner,
  notifyYoutubeShortPipelineStage,
  isYoutubeShortSkipMessage,
} from "./notify-owner";
import {
  alreadyGeneratedToday,
  isTopicPublished,
  markTopicPublished,
  pickNextTipTopic,
} from "./state";
import { assertTipDurationEstimate, buildTipSegments, countSpokenWords, estimateTipDurationSeconds } from "./tip-script";
import { todayYmd } from "./text-utils";
import type { YoutubeShortResult } from "./types";
import type { TipShortTopic } from "./topics";
import { uploadShortToYoutube } from "./youtube-upload";
import { acquirePipelineLock } from "./pipeline-lock";
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

function stageError(stage: string, error: unknown): Error {
  const detail =
    error instanceof Error
      ? error.message || error.name || "unknown error"
      : error == null
        ? "unknown error"
        : String(error);
  return new Error(`[${stage}] ${detail}`);
}

export async function generateTipYoutubeShort(options: GenerateTipShortOptions = {}): Promise<YoutubeShortResult> {
  if (!canRunYoutubeShortsLocally()) {
    throw new Error("YouTube Shorts requires ffmpeg/ffprobe and cannot run on Vercel serverless");
  }

  if (!options.force && !options.topicId && alreadyGeneratedToday()) {
    console.log(`[youtube-short] Already generated today (${todayYmd()}), skipping`);
    throw new Error(`Daily short already generated for ${todayYmd()}`);
  }

  const topic = await pickNextTipTopic(options.topicId);
  const explicitTopic = Boolean(options.topicId);
  if (isTopicPublished(topic.id)) {
    if (explicitTopic && options.force) {
      console.log(`[youtube-short] Re-rendering published topic ${topic.id} (--topic --force)`);
    } else {
      const nextHint = explicitTopic
        ? `Use --topic=${topic.id} --force to re-render intentionally.`
        : `--force alone does not repeat published topics. Use --topic=${topic.id} --force to re-render, or omit --topic for the next unpublished topic.`;
      console.error(`[youtube-short] REFUSED: "${topic.id}" is already published. ${nextHint}`);
      throw new Error(`Topic already published: ${topic.id}. ${nextHint}`);
    }
  }

  const lock = acquirePipelineLock();
  try {
    await notifyYoutubeShortPipelineStage({ stage: "start" });
    await notifyYoutubeShortPipelineStage({
      stage: "topic",
      topicId: topic.id,
      topicTitle: topic.title,
    });

    return await generateTipYoutubeShortLocked(topic, options);
  } finally {
    lock.release();
  }
}

async function generateTipYoutubeShortLocked(
  topic: TipShortTopic,
  options: GenerateTipShortOptions
): Promise<YoutubeShortResult> {

  const outputDir = outputDirForTopic(topic, options.outputDir);
  const existingVideo = path.join(outputDir, "short.mp4");

  if (fs.existsSync(existingVideo) && !options.forceAudio && !options.force) {
    if (!isTopicPublished(topic.id)) {
      console.log(`[youtube-short] Stale cache for unpublished topic ${topic.id}, regenerating`);
    } else {
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
  }

  fs.mkdirSync(outputDir, { recursive: true });
  runPreflight(outputDir);
  console.log(`[youtube-short] Topic: ${topic.id} — ${topic.title}`);

  let script;
  try {
    script = await writeTipShortScript(topic);
  } catch (error) {
    throw stageError("script", error);
  }

  fs.writeFileSync(path.join(outputDir, "short-script.json"), JSON.stringify(script, null, 2));
  fs.writeFileSync(
    path.join(outputDir, "short-script.txt"),
    [`[hook]\n${script.hook}`, `[body]\n${script.body}`, `[cta]\n${script.cta}`].join("\n\n") + "\n"
  );
  await notifyYoutubeShortPipelineStage({
    stage: "script",
    topicId: topic.id,
    topicTitle: topic.title,
    detail: `${countSpokenWords(script)} слов`,
  });

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

  let audioPath: string;
  let segmentDurations: number[];
  try {
    const audio = await renderAudio(segments, outputDir, options.forceAudio ?? false);
    audioPath = audio.audioPath;
    segmentDurations = audio.segmentDurations;
  } catch (error) {
    throw stageError("audio", error);
  }

  const voiceBeforeFit = ffprobeDuration(audioPath);
  fitVoiceoverToMaxDuration(audioPath, SHORT_DURATION_MAX - 0.25);
  const tempoScale = ffprobeDuration(audioPath) / voiceBeforeFit;
  const scaledSegmentDurations =
    tempoScale < 0.999 ? segmentDurations.map((d) => d * tempoScale) : segmentDurations;
  const timedSegments =
    tempoScale < 0.999
      ? segments.map((segment) => ({ ...segment, pauseAfter: segment.pauseAfter * tempoScale }))
      : segments;

  let shortFrames;
  try {
    shortFrames = await renderShortFrames(topic, timedSegments, scaledSegmentDurations, outputDir);
  } catch (error) {
    throw stageError("frames", error);
  }

  const shortCaptionsPath = path.join(outputDir, "short-captions.srt");
  writeSrt(shortFrames, shortCaptionsPath);

  const shortVideoPath = path.join(outputDir, "short.mp4");
  try {
    if (isDynamicVideoEnabled()) {
      await composeDynamicVideo({
        topic,
        frames: shortFrames,
        segments: timedSegments,
        segmentDurations: scaledSegmentDurations,
        audioPath,
        outputPath: shortVideoPath,
        outputDir,
      });
    } else {
      const framesConcatPath = writeFrameConcat(shortFrames, outputDir);
      renderVideo(framesConcatPath, audioPath, shortVideoPath);
    }
  } catch (error) {
    throw stageError("video", error);
  }

  const videoDuration = ffprobeDuration(shortVideoPath);
  assertShortDuration(videoDuration);
  await notifyYoutubeShortPipelineStage({
    stage: "render",
    topicId: topic.id,
    topicTitle: topic.title,
    detail: `${videoDuration.toFixed(1)} сек`,
  });

  const shortThumbnailPath = path.join(outputDir, "short-thumbnail.png");
  try {
    await renderShortThumbnail(topic, shortThumbnailPath, script.visual_hook);
  } catch (error) {
    throw stageError("thumbnail", error);
  }

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
      await notifyYoutubeShortPipelineStage({
        stage: "youtube",
        topicId: topic.id,
        topicTitle: topic.title,
        detail: youtube?.shortsUrl ?? youtube?.videoId ?? "uploaded",
      });
    } catch (error) {
      throw stageError("youtube-upload", error);
    }
  }

  if (options.uploadGcs !== false && process.env.EMIGRO_YOUTUBE_SHORTS_UPLOAD_GCS !== "0") {
    gcsUri = gcsDestination(topic);
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
    try {
      console.log(`[youtube-short] Uploading to ${gcsUri}`);
      uploadArtifactsToGcs(artifacts, gcsUri);
      await notifyYoutubeShortPipelineStage({
        stage: "gcs",
        topicId: topic.id,
        topicTitle: topic.title,
        detail: `${gcsUri}/short.mp4`,
      });
    } catch (error) {
      throw stageError("gcs-upload", error);
    }
  }

  if (!options.skipState) {
    markTopicPublished(topic.id);
  }

  const report = {
    word_count: countSpokenWords(script),
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
    const result = await generateTipYoutubeShort();
    await notifyYoutubeShortOwner({ status: "success", result });
    return true;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (isYoutubeShortSkipMessage(msg)) {
      console.log(`[youtube-short] ${msg}`);
      await notifyYoutubeShortOwner({ status: "skipped", error: msg });
      return true;
    }
    console.error(`[youtube-short] Failed: ${msg}`);
    await notifyYoutubeShortPipelineStage({ stage: "error", detail: msg });
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