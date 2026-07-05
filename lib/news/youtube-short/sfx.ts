import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { bgmVolume } from "./bgm";
import { ffprobeDuration } from "./render";

const SWISH_NAME = "sfx-swish.mp3";
const AUDIO_SAMPLE_RATE = 48_000;

/** Generate a short whoosh SFX with ffmpeg (no bundled assets). */
export function ensureSwishSfx(outputDir: string): string {
  const sfxPath = path.join(outputDir, SWISH_NAME);
  if (fs.existsSync(sfxPath) && fs.statSync(sfxPath).size > 500) return sfxPath;

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anoisesrc=d=0.14:c=pink:r=${AUDIO_SAMPLE_RATE}:a=0.35`,
      "-af",
      "highpass=f=1800,lowpass=f=9000,afade=t=in:st=0:d=0.02,afade=t=out:st=0.07:d=0.07,volume=0.22",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "96k",
      sfxPath,
    ],
    { stdio: "ignore" }
  );

  if (result.status !== 0) throw new Error("Failed to generate swish SFX");
  return sfxPath;
}

export function segmentTransitionTimes(segmentDurations: number[], pauseAfter: number[]): number[] {
  const times: number[] = [];
  let cursor = 0;
  for (let i = 0; i < segmentDurations.length - 1; i++) {
    cursor += segmentDurations[i] + (pauseAfter[i] ?? 0);
    times.push(cursor);
  }
  return times;
}

export type MixFinalAudioOptions = {
  voicePath: string;
  outputPath: string;
  sfxPath: string;
  transitionTimes: number[];
  voiceDuration: number;
  bgmPath?: string | null;
};

/**
 * Mix voiceover + optional BGM (−20 dB) + swish SFX at segment transitions.
 */
export function mixFinalAudio(opts: MixFinalAudioOptions): void {
  const { voicePath, outputPath, sfxPath, transitionTimes, voiceDuration, bgmPath } = opts;
  const dur = Math.max(1, voiceDuration);
  const fadeOutStart = Math.max(0, dur - 1.5).toFixed(3);
  const bgmVol = bgmVolume();

  const inputs: string[] = ["-i", voicePath];
  const filters: string[] = [`[0:a]aresample=${AUDIO_SAMPLE_RATE}[vo]`];
  let mixChain = "[vo]";
  let nextInput = 1;

  if (bgmPath && fs.existsSync(bgmPath)) {
    inputs.push("-stream_loop", "-1", "-i", bgmPath);
    filters.push(
      `[${nextInput}:a]aresample=${AUDIO_SAMPLE_RATE},atrim=0:${dur.toFixed(3)},volume=${bgmVol},afade=t=in:st=0:d=1.2,afade=t=out:st=${fadeOutStart}:d=1.2[bgm]`
    );
    filters.push(`${mixChain}[bgm]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[withbgm]`);
    mixChain = "[withbgm]";
    nextInput += 1;
  }

  const swLabels: string[] = [];
  for (let i = 0; i < transitionTimes.length; i++) {
    const ms = Math.max(0, Math.round(transitionTimes[i] * 1000));
    inputs.push("-i", sfxPath);
    const label = `sw${i}`;
    filters.push(
      `[${nextInput}:a]aresample=${AUDIO_SAMPLE_RATE},adelay=${ms}|${ms},volume=0.9[${label}]`
    );
    swLabels.push(`[${label}]`);
    nextInput += 1;
  }

  if (swLabels.length > 0) {
    filters.push(
      `${mixChain}${swLabels.join("")}amix=inputs=${1 + swLabels.length}:duration=first:dropout_transition=0:normalize=0[aout]`
    );
  } else {
    filters.push(`${mixChain}asetpts=PTS-STARTPTS[aout]`);
  }

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      ...inputs,
      "-filter_complex",
      filters.join(";"),
      "-map",
      "[aout]",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      String(AUDIO_SAMPLE_RATE),
      outputPath,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) throw new Error(`Final audio mix failed: ${result.status}`);
}

/** @deprecated Use mixFinalAudio */
export function mixAudioWithSfx(
  voicePath: string,
  sfxPath: string,
  transitionTimes: number[],
  outputPath: string
): void {
  mixFinalAudio({
    voicePath,
    sfxPath,
    transitionTimes,
    outputPath,
    voiceDuration: ffprobeDuration(voicePath),
    bgmPath: null,
  });
}
