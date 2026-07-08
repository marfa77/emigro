import fs from "fs";
import path from "path";
import { youtubeShortsOutputRoot } from "./config";

const STALE_MS = 2 * 60 * 60 * 1000;

function lockPath(): string {
  return path.join(path.dirname(youtubeShortsOutputRoot()), ".pipeline.lock");
}

function isStaleLock(file: string): boolean {
  try {
    const stat = fs.statSync(file);
    return Date.now() - stat.mtimeMs > STALE_MS;
  } catch {
    return true;
  }
}

function pidAlive(pid: number): boolean {
  if (!Number.isFinite(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export type PipelineLock = {
  release: () => void;
};

/** Exclusive lock shared by cron and manual CLI runs (prevents duplicate Telegram stage DMs). */
export function acquirePipelineLock(): PipelineLock {
  const file = lockPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });

  if (fs.existsSync(file)) {
    let holder = 0;
    try {
      holder = Number(fs.readFileSync(file, "utf8").trim());
    } catch {
      /* ignore */
    }
    if (pidAlive(holder) && !isStaleLock(file)) {
      throw new Error("YouTube Shorts pipeline already running");
    }
    try {
      fs.unlinkSync(file);
    } catch {
      /* ignore */
    }
  }

  const fd = fs.openSync(file, "wx");
  try {
    fs.writeFileSync(fd, String(process.pid), { encoding: "utf8" });
  } finally {
    fs.closeSync(fd);
  }

  return {
    release: () => {
      try {
        if (fs.existsSync(file)) {
          const current = Number(fs.readFileSync(file, "utf8").trim());
          if (current === process.pid) fs.unlinkSync(file);
        }
      } catch {
        /* ignore */
      }
    },
  };
}
