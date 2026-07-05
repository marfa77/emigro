import type { HighlightStat } from "./highlight-stats";
export type { HighlightStat } from "./highlight-stats";

export type ScriptSegmentKind = "hook" | "tip" | "cta";

export type ScriptSegment = {
  kind: ScriptSegmentKind;
  visualTitle: string;
  visualBody: string;
  sourceLabel: string;
  text: string;
  pauseAfter: number;
  highlightStats?: HighlightStat[];
};

export type CaptionFrame = {
  imagePath: string;
  duration: number;
  segment: ScriptSegment;
  caption: string;
};

export type YoutubeShortMetadata = {
  title: string;
  description: string;
  tags: string[];
  playlist: string;
};

export type GeneratedArtifact = {
  key: string;
  fileName: string;
  path: string;
  gcsUri?: string;
};

export type YoutubeUploadInfo = {
  videoId: string;
  videoUrl: string;
  shortsUrl: string;
  privacyStatus: string;
  playlistId?: string;
};

export type YoutubeShortResult = {
  topicId: string;
  outputDir: string;
  gcsUri: string | null;
  youtube: YoutubeUploadInfo | null;
  metadata: YoutubeShortMetadata;
  artifacts: GeneratedArtifact[];
  report: {
    word_count: number;
    video_duration_seconds: number;
    voice: string;
    format: string;
    files: Record<string, string>;
    youtube?: YoutubeUploadInfo;
  };
};
