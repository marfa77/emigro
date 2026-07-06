import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";
import { loadCommunityTipTopics } from "./community-topics";
import {
  canRunYoutubeShortsLocally,
  ensureEnv,
  youtubeShortsOutputRoot,
} from "./config";
import { statePath, testStateWritable } from "./state";

export type HealthCheckItem = {
  name: string;
  ok: boolean;
  detail: string;
};

export type HealthReport = {
  ok: boolean;
  checks: HealthCheckItem[];
};

const MIN_DISK_BYTES = 2 * 1024 * 1024 * 1024;
const MIN_RAM_BYTES = 1024 * 1024 * 1024;

function checkBinary(name: string, args: string[] = ["-version"]): HealthCheckItem {
  const result = spawnSync(name, args, { encoding: "utf8", timeout: 15_000 });
  const ok = result.status === 0 && !result.error;
  return {
    name,
    ok,
    detail: ok ? "ok" : result.error?.message || result.stderr?.slice(0, 120) || `exit ${result.status}`,
  };
}

function checkEnv(name: string, required = true): HealthCheckItem {
  const value = process.env[name]?.trim();
  const ok = Boolean(value);
  if (!required && !ok) {
    return { name: `env:${name}`, ok: true, detail: "optional (not set)" };
  }
  return {
    name: `env:${name}`,
    ok,
    detail: ok ? "set" : required ? "missing" : "not set",
  };
}

export async function runHealthCheck(): Promise<HealthReport> {
  const checks: HealthCheckItem[] = [];

  checks.push(checkBinary("ffmpeg"));
  checks.push(checkBinary("ffprobe"));
  checks.push(checkBinary("gsutil", ["version"]));

  checks.push(checkEnv("OPENAI_API_KEY"));
  checks.push(checkEnv("NEXT_PUBLIC_SUPABASE_URL"));
  checks.push(checkEnv("SUPABASE_SERVICE_ROLE_KEY"));
  checks.push(checkEnv("GOOGLE_APPLICATION_CREDENTIALS", false));
  checks.push(checkEnv("EMIGRO_YOUTUBE_REFRESH_TOKEN", false));

  const outputRoot = youtubeShortsOutputRoot();
  try {
    fs.mkdirSync(outputRoot, { recursive: true });
    const probe = path.join(outputRoot, ".health-probe");
    fs.writeFileSync(probe, "ok");
    fs.unlinkSync(probe);
    checks.push({ name: "output_root", ok: true, detail: outputRoot });
  } catch (error) {
    checks.push({
      name: "output_root",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  const stateWritable = testStateWritable();
  checks.push({
    name: "state_file",
    ok: stateWritable.ok,
    detail: stateWritable.ok ? statePath() : stateWritable.error,
  });

  try {
    const topics = await loadCommunityTipTopics();
    checks.push({
      name: "supabase_notes",
      ok: topics.length > 0,
      detail: `${topics.length} published note(s) for Shorts`,
    });
  } catch (error) {
    checks.push({
      name: "supabase_notes",
      ok: false,
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  checks.push({
    name: "ffmpeg_runtime",
    ok: canRunYoutubeShortsLocally(),
    detail: canRunYoutubeShortsLocally() ? "local render available" : "ffmpeg/ffprobe unavailable",
  });

  const ok = checks.every((c) => c.ok);
  return { ok, checks };
}

export function printHealthReport(report: HealthReport): void {
  for (const check of report.checks) {
    console.log(`${check.ok ? "OK" : "FAIL"}  ${check.name}: ${check.detail}`);
  }
  console.log(report.ok ? "\nHealth: OK" : "\nHealth: FAIL");
}

export function runPreflight(outputDir: string): void {
  if (!process.env.OPENAI_API_KEY?.trim()) {
    throw new Error("Pre-flight: OPENAI_API_KEY is required for TTS");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const probe = path.join(outputDir, ".preflight-probe");
  fs.writeFileSync(probe, "ok");
  fs.unlinkSync(probe);

  try {
    const statfs = (fs as NodeJS.FsStatic & { statfsSync?: (p: string) => { bavail: number; bsize: number } })
      .statfsSync;
    if (statfs) {
      const stat = statfs(outputDir);
      const freeBytes = stat.bavail * stat.bsize;
      if (freeBytes < MIN_DISK_BYTES) {
        throw new Error(
          `Pre-flight: low disk space (${Math.round(freeBytes / 1024 / 1024)}MB free, need ${MIN_DISK_BYTES / 1024 / 1024}MB)`
        );
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Pre-flight:")) throw error;
  }

  const freeRam = os.freemem();
  if (freeRam < MIN_RAM_BYTES) {
    console.warn(
      `[youtube-short] Pre-flight warning: low free RAM (${Math.round(freeRam / 1024 / 1024)}MB) — render may be killed (SIGTERM)`
    );
  }
}
