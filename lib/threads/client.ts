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
import { threadsUtf8ByteLength, THREADS_TEXT_MAX_BYTES } from "@/lib/threads/compose";

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
  if (threadsUtf8ByteLength(text) > THREADS_TEXT_MAX_BYTES) {
    throw new Error(
      `Threads text exceeds ${THREADS_TEXT_MAX_BYTES} UTF-8 bytes (${threadsUtf8ByteLength(text)})`
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
