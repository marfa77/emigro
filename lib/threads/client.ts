/**
 * Threads Graph publish client.
 * Live posts require THREADS_AUTO_PUBLISH=1 and forcePublish=true.
 */
import {
  THREADS_GRAPH_BASE,
  assertThreadsBrandUsername,
  assertThreadsPublishAllowed,
  loadThreadsEnv,
} from "@/lib/threads/config";
import type { ThreadsChainItem } from "@/lib/threads/compose";
import { threadsTextCost, THREADS_TEXT_MAX_CHARS } from "@/lib/threads/compose";

export type ThreadsPublishResult = {
  dryRun: boolean;
  publishedIds: string[];
  containerIds: string[];
  preview: string[];
};

type GraphId = { id?: string; error?: { message?: string } };
type GraphError = { error?: { message?: string } };

export type ThreadsMediaItem = {
  id?: string;
  text?: string;
  username?: string;
  timestamp?: string;
  is_reply?: boolean;
  is_reply_owned_by_me?: boolean;
  hide_status?: string;
  has_replies?: boolean;
  permalink?: string;
  replied_to?: { id?: string } | string;
};

async function graphUrl(path: string, params: Record<string, string>): Promise<URL> {
  const env = loadThreadsEnv();
  if (!env.accessToken) throw new Error("THREADS_ACCESS_TOKEN required");
  const u = new URL(`${THREADS_GRAPH_BASE}/${path.replace(/^\//, "")}`);
  for (const [k, v] of Object.entries(params)) {
    if (v) u.searchParams.set(k, v);
  }
  u.searchParams.set("access_token", env.accessToken);
  return u;
}

async function postParams(
  path: string,
  params: Record<string, string>
): Promise<GraphId> {
  const u = await graphUrl(path, params);
  const res = await fetch(u.toString(), { method: "POST" });
  const data = (await res.json()) as GraphId;
  if (!res.ok || data.error || !data.id) {
    throw new Error(data.error?.message || `Threads Graph HTTP ${res.status}`);
  }
  return data;
}

async function getParams<T>(
  path: string,
  params: Record<string, string>
): Promise<T> {
  const u = await graphUrl(path, params);
  const res = await fetch(u.toString());
  const data = (await res.json()) as T & GraphError;
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Threads Graph HTTP ${res.status}`);
  }
  return data;
}

const CONVERSATION_FIELDS =
  "id,text,username,timestamp,is_reply,is_reply_owned_by_me,hide_status,has_replies,replied_to,permalink";

export async function listMyThreads(limit = 12): Promise<ThreadsMediaItem[]> {
  const env = loadThreadsEnv();
  const userId = env.userId || (await fetchThreadsMe()).id;
  const data = await getParams<{ data?: ThreadsMediaItem[] }>(`${userId}/threads`, {
    fields: "id,text,timestamp,is_reply,has_replies,permalink",
    limit: String(limit),
  });
  return data.data ?? [];
}

export async function listConversation(
  mediaId: string,
  limit = 50
): Promise<ThreadsMediaItem[]> {
  const data = await getParams<{ data?: ThreadsMediaItem[] }>(`${mediaId}/conversation`, {
    fields: CONVERSATION_FIELDS,
    limit: String(limit),
    reverse: "false",
  });
  return data.data ?? [];
}

/** Hidden comments when enable_reply_approvals=1. Soft-fail if the edge is missing. */
export async function listPendingReplies(
  mediaId: string,
  limit = 50
): Promise<ThreadsMediaItem[]> {
  try {
    const data = await getParams<{ data?: ThreadsMediaItem[] }>(`${mediaId}/pending_replies`, {
      fields: CONVERSATION_FIELDS,
      limit: String(limit),
    });
    return data.data ?? [];
  } catch (e) {
    console.warn(
      "[threads] pending_replies skipped:",
      e instanceof Error ? e.message : e
    );
    return [];
  }
}

/** Unhide a comment so our reply is visible (best-effort). */
export async function unhideThreadsReply(replyId: string): Promise<void> {
  const u = await graphUrl(`${replyId}/manage_reply`, { hide: "false" });
  const res = await fetch(u.toString(), { method: "POST" });
  const data = (await res.json()) as GraphError & { success?: boolean };
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || `Threads manage_reply HTTP ${res.status}`);
  }
}

/**
 * Publish a text reply to a comment. Live write: THREADS_AUTO_PUBLISH=1 and forcePublish.
 * Always whoami=@emigro2eu. Reply approvals OFF on our reply so it stays public.
 */
export async function publishThreadsReply(params: {
  text: string;
  replyToId: string;
  forcePublish?: boolean;
}): Promise<{ dryRun: boolean; id?: string }> {
  if (!params.forcePublish) {
    return { dryRun: true };
  }

  assertThreadsPublishAllowed(true);
  const me = await fetchThreadsMe();
  assertThreadsBrandUsername(me.username);

  try {
    await unhideThreadsReply(params.replyToId);
  } catch (e) {
    console.warn(
      "[threads] unhide parent failed (continuing):",
      e instanceof Error ? e.message : e
    );
  }

  const creationId = await createMediaContainer({
    text: params.text,
    replyToId: params.replyToId,
    enableReplyApprovals: false,
  });
  await waitForContainerFinished(creationId, { timeoutMs: 60_000 });
  const id = await publishContainer(creationId);
  return { dryRun: false, id };
}

/** Create TEXT or IMAGE container (optionally as reply). */
export async function createMediaContainer(params: {
  text: string;
  imageUrl?: string;
  topicTag?: string;
  replyToId?: string;
  enableReplyApprovals?: boolean;
  replyControl?: string;
}): Promise<string> {
  const env = loadThreadsEnv();
  const text = params.text;
  if (threadsTextCost(text) > THREADS_TEXT_MAX_CHARS) {
    throw new Error(
      `Threads text exceeds ${THREADS_TEXT_MAX_CHARS} chars (${threadsTextCost(text)})`
    );
  }

  const body: Record<string, string> = {
    text,
    reply_control: params.replyControl || env.replyControl,
  };
  if (params.imageUrl?.trim()) {
    body.media_type = "IMAGE";
    body.image_url = params.imageUrl.trim();
  } else {
    body.media_type = "TEXT";
  }
  if (params.topicTag?.trim()) {
    body.topic_tag = params.topicTag.trim().slice(0, 50);
  }

  const approvals = params.enableReplyApprovals ?? env.enableReplyApprovals;
  if (approvals) {
    body.enable_reply_approvals = "true";
  }
  if (params.replyToId) body.reply_to_id = params.replyToId;

  try {
    const data = await postParams(`${env.userId}/threads`, body);
    return data.id!;
  } catch (e) {
    // Soft-fallback: image fetch/format issues → plain text.
    if (params.imageUrl) {
      console.warn(
        "[threads] IMAGE container failed, falling back to TEXT:",
        e instanceof Error ? e.message : e
      );
      return createMediaContainer({ ...params, imageUrl: undefined });
    }
    throw e;
  }
}

/** @deprecated use createMediaContainer */
export async function createTextContainer(params: {
  text: string;
  replyToId?: string;
  enableReplyApprovals?: boolean;
  replyControl?: string;
}): Promise<string> {
  return createMediaContainer(params);
}

/** Publish a creation_id container → live post id. */
export async function publishContainer(creationId: string): Promise<string> {
  const env = loadThreadsEnv();
  const data = await postParams(`${env.userId}/threads_publish`, {
    creation_id: creationId,
  });
  return data.id!;
}

/** Best-effort warm of Next OG route so Meta can fetch a ready PNG. */
export async function warmPublicImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "image/png,image/*,*/*" },
      signal: AbortSignal.timeout(25_000),
    });
    return res.ok;
  } catch (e) {
    console.warn("[threads] warm image failed:", e instanceof Error ? e.message : e);
    return false;
  }
}

/**
 * Publish a reply-chain. Default is dry-run (no API write).
 * Live: THREADS_AUTO_PUBLISH=1 and forcePublish=true.
 * Waits until each container is FINISHED before publish.
 */
export async function publishThreadsChain(params: {
  items: ThreadsChainItem[];
  forcePublish?: boolean;
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
  const me = await fetchThreadsMe();
  assertThreadsBrandUsername(me.username);

  const pause = Math.max(0, params.pauseMs ?? 1500);
  const containerIds: string[] = [];
  const publishedIds: string[] = [];
  let replyTo: string | undefined;

  for (const item of params.items) {
    if (item.imageUrl) {
      await warmPublicImageUrl(item.imageUrl);
    }
    const creationId = await createMediaContainer({
      text: item.text,
      imageUrl: item.imageUrl,
      topicTag: item.topicTag,
      replyToId: replyTo,
    });
    containerIds.push(creationId);
    await waitForContainerFinished(creationId, {
      timeoutMs: item.imageUrl ? 90_000 : 60_000,
    });
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

type ContainerStatus = {
  status?: string;
  error_message?: string;
  id?: string;
  error?: { message?: string };
};

async function waitForContainerFinished(
  creationId: string,
  opts?: { timeoutMs?: number; intervalMs?: number }
): Promise<void> {
  const env = loadThreadsEnv();
  const timeoutMs = opts?.timeoutMs ?? 60_000;
  const intervalMs = opts?.intervalMs ?? 1500;
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    const u = new URL(`${THREADS_GRAPH_BASE}/${creationId}`);
    u.searchParams.set("fields", "status,error_message");
    u.searchParams.set("access_token", env.accessToken);
    const res = await fetch(u.toString());
    const data = (await res.json()) as ContainerStatus;
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || `Threads container status HTTP ${res.status}`);
    }
    const status = (data.status || "").toUpperCase();
    if (status === "FINISHED" || status === "PUBLISHED") return;
    if (status === "ERROR" || status === "EXPIRED") {
      throw new Error(
        `Threads container ${status}${data.error_message ? `: ${data.error_message}` : ""}`
      );
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Threads container ${creationId} not FINISHED within ${timeoutMs}ms`);
}

export async function fetchThreadsPermalink(id: string): Promise<string | undefined> {
  const env = loadThreadsEnv();
  if (!env.accessToken) throw new Error("THREADS_ACCESS_TOKEN required");
  const u = new URL(`${THREADS_GRAPH_BASE}/${id}`);
  u.searchParams.set("fields", "id,permalink");
  u.searchParams.set("access_token", env.accessToken);
  const res = await fetch(u.toString());
  const data = (await res.json()) as { permalink?: string; error?: { message?: string } };
  if (!res.ok || data.error) {
    console.warn("[threads] permalink lookup failed:", data.error?.message || `HTTP ${res.status}`);
    return undefined;
  }
  return data.permalink;
}

export async function fetchThreadsMe(): Promise<{ id: string; username?: string }> {
  const env = loadThreadsEnv();
  if (!env.accessToken) throw new Error("THREADS_ACCESS_TOKEN required");
  const u = new URL(`${THREADS_GRAPH_BASE}/me`);
  u.searchParams.set("fields", "id,username");
  u.searchParams.set("access_token", env.accessToken);
  const res = await fetch(u.toString());
  const data = (await res.json()) as {
    id?: string;
    username?: string;
    error?: { message?: string };
  };
  if (!res.ok || !data.id) {
    throw new Error(data.error?.message || `Threads /me HTTP ${res.status}`);
  }
  return { id: data.id, username: data.username };
}
