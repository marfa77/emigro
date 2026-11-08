/**
 * Ask the ops DM before an Emigro Threads post goes live.
 * THREADS_APPROVAL_PUBLISH is not used here: the approve button publishes
 * the stored text, it does not re-plan the day.
 */
import { spawnSync } from "node:child_process";

export type HoldRequest = {
  accountId: string;
  handle: string;
  title: string;
  texts: string[];
  topicTag?: string;
  key: string;
  resume: Record<string, unknown>;
};

export type HoldResult = {
  id: string;
  status: "awaiting" | "already" | "rejected" | "published";
};

export function holdForOwnerApproval(req: HoldRequest): HoldResult {
  const texts = req.texts.map((part) => part.trim()).filter(Boolean);
  if (!req.key || !req.handle || texts.length === 0) {
    throw new Error("approval: empty post");
  }
  const proc = spawnSync(
    "/opt/barakhlo/parser/.venv/bin/python",
    ["threads_post_approval.py", "stage"],
    {
      cwd: "/opt/barakhlo/parser",
      input: JSON.stringify({
        family: "emigro",
        account_id: req.accountId,
        handle: req.handle,
        title: req.title,
        texts,
        topic_tag: req.topicTag || "",
        key: req.key,
        resume: req.resume,
      }),
      encoding: "utf8",
      timeout: 30_000,
    }
  );
  if (proc.status !== 0) {
    throw new Error((proc.stderr || proc.stdout || "approval stage failed").slice(-400));
  }
  return JSON.parse(proc.stdout) as HoldResult;
}
