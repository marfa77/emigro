/**
 * Threads Graph publish client.
 * Live posts require THREADS_AUTO_PUBLISH=1 and forcePublish=true.
 */
import {
  THREADS_GRAPH_BASE,
  assertThreadsPublishAllowed,
  loadThreadsEnv,
} from "@/lib/threads/config";
import type { ThreadsChainItem } from "@/lib/threads/compose";

export type ThreadsPublishResult = {
  dryRun: boolean;
  publishedIds: string[];
  containerIds: string[];
  preview: string[];
};

type GraphId = { id?: string; error?: { message?: string } };

async function postParams(
  path: string,
  params: Record<string, string>
): Promise<GraphId> {
  const env = loadThreadsEnv();
  const u = new URL(`${THREADS_GRAPH_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v) u.searchParams.set(k, v);
  }
  u.searchParams.set("access_token", env.accessToken);

  const res = await fetch(u.toString(), { method: "POST" });
  const data = (await res.json()) as GraphId;
  if (!res.ok || data.error || !data.id) {
    throw new Error(data.error?.message || `Threads Graph HTTP ${res.status}`);
  }
  return data;
}

/** Create TEXT media container (optionally as reply). */
export async function createTextContainer(params: {
  text: string;
  replyToId?: string;
  /** Override env default for this container. */
  enableReplyApprovals?: boolean;
  replyControl?: string;
}): Promise<string> {
  const env = loadThreadsEnv();
  const body: Record<string, string> = {
    media_type: "TEXT",
    text: params.text,
    reply_control: params.replyControl || env.replyControl,
  };
  const approvals = params.enableReplyApprovals ?? env.enableReplyApprovals;
  if (approvals) {
    body.enable_reply_approvals = "true";
  }
  if (params.replyToId) body.reply_to_id = params.replyToId;
  const data = await postParams(`${env.userId}/threads`, body);
  return data.id!;
}

/** Publish a creation_id container → live post id. */
export async function publishContainer(creationId: string): Promise<string> {
  const env = loadThreadsEnv();
  const data = await postParams(`${env.userId}/threads_publish`, {
    creation_id: creationId,
  });
  return data.id!;
}

/**
 * Publish a reply-chain. Default is dry-run (no API write).
 * Live: THREADS_AUTO_PUBLISH=1 and forcePublish=true.
 */
export async function publishThreadsChain(params: {
  items: ThreadsChainItem[];
  forcePublish?: boolean;
  /** Sleep between publishes (ms) — Threads rate limits. */
  pauseMs?: number;
}): Promise<ThreadsPublishResult> {
  const texts = params.items.map((i) => i.text);
  const force = Boolean(params.forcePublish);

  if (!force) {
    return {
      dryRun: true,
      publishedIds: [],
      containerIds: [],
      preview: texts,
    };
  }

  assertThreadsPublishAllowed(true);

  const pause = Math.max(0, params.pauseMs ?? 1500);
  const containerIds: string[] = [];
  const publishedIds: string[] = [];
  let replyTo: string | undefined;

  for (const text of texts) {
    const creationId = await createTextContainer({ text, replyToId: replyTo });
    containerIds.push(creationId);
    const postId = await publishContainer(creationId);
    publishedIds.push(postId);
    replyTo = postId;
    if (pause > 0) await new Promise((r) => setTimeout(r, pause));
  }

  const env = loadThreadsEnv();
  if (env.enableReplyApprovals) {
    console.log(
      "[threads] reply approvals ON — чужие ответы скрыты, пока не апрувнешь в Threads"
    );
  }

  return {
    dryRun: false,
    publishedIds,
    containerIds,
    preview: texts,
  };
}

/** Fetch current user id for the token (debug / setup). */
export async function fetchThreadsMe(): Promise<{ id: string; username?: string }> {
  const env = loadThreadsEnv();
  if (!env.accessToken) throw new Error("THREADS_ACCESS_TOKEN required");
  const u = new URL(`${THREADS_GRAPH_BASE}/me`);
  u.searchParams.set("fields", "id,username");
  u.searchParams.set("access_token", env.accessToken);
  const res = await fetch(u.toString());
  const data = (await res.json()) as { id?: string; username?: string; error?: { message?: string } };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || `Threads /me HTTP ${res.status}`);
  }
  return { id: data.id, username: data.username };
}
