/**
 * Threads Graph API config.
 * Publishing is gated: THREADS_AUTO_PUBLISH must be "1" AND caller passes forcePublish.
 */
export const THREADS_GRAPH_BASE = "https://graph.threads.net/v1.0";
export const THREADS_OAUTH_TOKEN_URL = "https://graph.threads.net/oauth/access_token";
export const THREADS_EXCHANGE_URL = "https://graph.threads.net/access_token";
export const THREADS_REFRESH_URL = "https://graph.threads.net/refresh_access_token";

import { NEWS_TELEGRAM_URL } from "@/lib/community";

/** Default Telegram channel CTA target. */
export const THREADS_DEFAULT_TG_URL = NEWS_TELEGRAM_URL;

export type ThreadsEnv = {
  appId: string;
  appSecret: string;
  userId: string;
  accessToken: string;
  /** Soft gate — never publish unless true. */
  autoPublish: boolean;
  redirectUri: string;
  /**
   * Replies stay hidden until you approve in Threads / API.
   * Default ON — spam protection.
   */
  enableReplyApprovals: boolean;
  /**
   * Who may attempt a reply: everyone | accounts_you_follow | mentioned_only |
   * parent_post_author_only | followers_only
   */
  replyControl: string;
};

export function loadThreadsEnv(): ThreadsEnv {
  const replyControl = (process.env.THREADS_REPLY_CONTROL || "everyone").trim();
  const approvalsRaw = (process.env.THREADS_ENABLE_REPLY_APPROVALS || "1").trim();
  return {
    appId: (process.env.THREADS_APP_ID || "").trim(),
    appSecret: (process.env.THREADS_APP_SECRET || "").trim(),
    userId: (process.env.THREADS_USER_ID || "").trim(),
    accessToken: (process.env.THREADS_ACCESS_TOKEN || "").trim(),
    autoPublish: process.env.THREADS_AUTO_PUBLISH === "1",
    redirectUri: (process.env.THREADS_REDIRECT_URI || "").trim(),
    // Default ON: only "0" / "false" disables.
    enableReplyApprovals: !["0", "false", "no", "off"].includes(approvalsRaw.toLowerCase()),
    replyControl: replyControl || "everyone",
  };
}

export function assertThreadsPublishAllowed(forcePublish: boolean): void {
  const env = loadThreadsEnv();
  if (!env.autoPublish) {
    throw new Error(
      "THREADS_AUTO_PUBLISH is not 1 — dry-run / prep only. Set THREADS_AUTO_PUBLISH=1 to enable live posts."
    );
  }
  if (!forcePublish) {
    throw new Error("forcePublish=false — refusing live Threads publish (safety gate).");
  }
  if (!env.accessToken || !env.userId) {
    throw new Error("THREADS_ACCESS_TOKEN and THREADS_USER_ID required for publish");
  }
}

/** Authorization Window URL (user grants scopes → redirect with ?code=). */
export function threadsAuthorizationUrl(params?: {
  scope?: string[];
  state?: string;
}): string {
  const env = loadThreadsEnv();
  if (!env.appId || !env.redirectUri) {
    throw new Error("THREADS_APP_ID and THREADS_REDIRECT_URI required for OAuth URL");
  }
  const scope = (params?.scope ?? [
    "threads_basic",
    "threads_content_publish",
    "threads_manage_replies",
    "threads_read_replies",
  ]).join(",");
  const u = new URL("https://threads.net/oauth/authorize");
  u.searchParams.set("client_id", env.appId);
  u.searchParams.set("redirect_uri", env.redirectUri);
  u.searchParams.set("scope", scope);
  u.searchParams.set("response_type", "code");
  if (params?.state) u.searchParams.set("state", params.state);
  return u.toString();
}
