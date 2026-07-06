import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { youtubeShortsBucket, youtubeShortsGcsPrefix } from "./config";
import type { GeneratedArtifact } from "./types";
import type { TipShortTopic } from "./topics";

function normalizeGcsBase(raw: string): string {
  return raw.replace(/\/+$/g, "");
}

/** One canonical folder per topic — uploads overwrite previous artifacts. */
export function gcsDestination(topic: TipShortTopic): string {
  const base = normalizeGcsBase(youtubeShortsBucket());
  if (!base.startsWith("gs://")) {
    throw new Error(`GCS bucket must start with gs://, got: ${base}`);
  }
  return `${base}/${youtubeShortsGcsPrefix()}/tips/${topic.topic_key}/${topic.id}`;
}

function gcsEnv(): NodeJS.ProcessEnv {
  const gcsHome = process.env.GSUTIL_HOME || process.env.EMIGRO_YOUTUBE_STATE_DIR || path.join(process.cwd(), "data");
  const credentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), "data/gcs-upload-key.json");
  const cloudConfig = process.env.CLOUDSDK_CONFIG || path.join(process.cwd(), "data/gcloud-config");
  fs.mkdirSync(path.join(gcsHome, ".gsutil"), { recursive: true });
  return {
    ...process.env,
    HOME: gcsHome,
    GSUTIL_HOME: gcsHome,
    CLOUDSDK_CONFIG: cloudConfig,
    GOOGLE_APPLICATION_CREDENTIALS: credentials,
  };
}

function contentTypeForFile(fileName: string): string | undefined {
  // gsutil -h breaks on semicolons — keep headers simple (UTF-8 BOM in .txt where needed)
  if (fileName.endsWith(".json")) return "Content-Type:application/json";
  if (fileName.endsWith(".txt") || fileName.endsWith(".srt")) return "Content-Type:text/plain";
  if (fileName.endsWith(".mp4")) return "Content-Type:video/mp4";
  if (fileName.endsWith(".mp3")) return "Content-Type:audio/mpeg";
  if (fileName.endsWith(".png")) return "Content-Type:image/png";
  return undefined;
}

export function uploadArtifactsToGcs(artifacts: GeneratedArtifact[], destination: string): GeneratedArtifact[] {
  const existing = artifacts.filter((item) => fs.existsSync(item.path));
  if (existing.length === 0) return artifacts;

  const env = gcsEnv();
  for (const item of existing) {
    const contentType = contentTypeForFile(item.fileName);
    const args: string[] = [];
    if (contentType) args.push("-h", contentType);
    args.push("cp", item.path, `${destination}/${item.fileName}`);
    const result = spawnSync("gsutil", args, { stdio: "inherit", env });
    if (result.status !== 0) throw new Error(`GCS upload failed for ${item.fileName}: exit ${result.status}`);
  }

  return artifacts.map((item) => ({
    ...item,
    gcsUri: `${destination}/${item.fileName}`,
  }));
}

export function artifact(key: string, fileName: string, outputDir: string): GeneratedArtifact {
  return { key, fileName, path: path.join(outputDir, fileName) };
}
