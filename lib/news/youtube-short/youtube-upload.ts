import fs from "fs";
import path from "path";
import { isYoutubeUploadEnabled, youtubeUploadPrivacy } from "./config";
import type { YoutubeShortMetadata } from "./types";
import {
  addVideoToPlaylist,
  findPlaylistIdByTitle,
  setYoutubeThumbnail,
  uploadYoutubeCaptions,
  uploadYoutubeVideo,
  youtubeShortsUrl,
  youtubeVideoUrl,
  type YoutubePrivacyStatus,
} from "./youtube-api";

export type YoutubeUploadResult = {
  videoId: string;
  videoUrl: string;
  shortsUrl: string;
  privacyStatus: YoutubePrivacyStatus;
  playlistId?: string;
};

function readExistingUpload(outputDir: string): YoutubeUploadResult | null {
  const reportPath = path.join(outputDir, "generation-report.json");
  if (!fs.existsSync(reportPath)) return null;
  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
      youtube?: YoutubeUploadResult;
    };
    if (report.youtube?.videoId) return report.youtube;
  } catch {
    return null;
  }
  return null;
}

export async function uploadShortToYoutube(opts: {
  outputDir: string;
  videoPath: string;
  thumbnailPath: string;
  captionsPath: string;
  metadata: YoutubeShortMetadata;
}): Promise<YoutubeUploadResult | null> {
  if (!isYoutubeUploadEnabled()) {
    console.log("[youtube-upload] Skipped: EMIGRO_YOUTUBE_UPLOAD_ENABLED=0 or missing OAuth credentials");
    return null;
  }

  const existing = readExistingUpload(opts.outputDir);
  if (existing) {
    console.log(`[youtube-upload] Already uploaded: ${existing.shortsUrl}`);
    return existing;
  }

  const privacyStatus = youtubeUploadPrivacy();
  console.log(`[youtube-upload] Uploading as ${privacyStatus}: ${opts.metadata.title}`);

  const video = await uploadYoutubeVideo({
    videoPath: opts.videoPath,
    title: opts.metadata.title,
    description: opts.metadata.description,
    tags: opts.metadata.tags,
    privacyStatus,
  });

  const videoId = video.id;
  console.log(`[youtube-upload] Video ID: ${videoId}`);

  if (fs.existsSync(opts.thumbnailPath)) {
    await setYoutubeThumbnail(videoId, opts.thumbnailPath);
    console.log("[youtube-upload] Thumbnail set");
  }

  if (fs.existsSync(opts.captionsPath)) {
    await uploadYoutubeCaptions({
      videoId,
      captionsPath: opts.captionsPath,
    });
    console.log("[youtube-upload] Captions uploaded");
  }

  let playlistId =
    process.env.EMIGRO_YOUTUBE_PLAYLIST_ID?.trim() || process.env.YOUTUBE_PLAYLIST_ID?.trim();

  if (!playlistId && opts.metadata.playlist) {
    playlistId = (await findPlaylistIdByTitle(opts.metadata.playlist)) ?? undefined;
    if (playlistId) {
      console.log(`[youtube-upload] Found playlist "${opts.metadata.playlist}": ${playlistId}`);
    }
  }

  if (playlistId) {
    await addVideoToPlaylist(videoId, playlistId);
    console.log("[youtube-upload] Added to playlist");
  }

  const result: YoutubeUploadResult = {
    videoId,
    videoUrl: youtubeVideoUrl(videoId),
    shortsUrl: youtubeShortsUrl(videoId),
    privacyStatus,
    playlistId,
  };

  console.log(`[youtube-upload] Done: ${result.shortsUrl}`);
  return result;
}
