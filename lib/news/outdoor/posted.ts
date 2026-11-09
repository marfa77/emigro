/**
 * Ledger of outdoor posts. Legacy files are a string[] of keys; new files keep
 * the Telegram message id so Friday's digest can link back into the feed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export type PostedEvent = {
  key: string;
  fingerprint: string;
  messageId: number;
  startIso: string;
  title: string;
  location: string;
  priceLabel: string | null;
  url: string;
  theme?: string;
};

export type PostedStore = {
  keys: string[];
  fingerprints: string[];
  posts: PostedEvent[];
  digestOn?: string;
};

function emptyStore(): PostedStore {
  return { keys: [], fingerprints: [], posts: [] };
}

function asPost(value: unknown): PostedEvent | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<PostedEvent>;
  if (typeof row.key !== "string" || typeof row.messageId !== "number") return null;
  if (typeof row.startIso !== "string" || typeof row.title !== "string") return null;
  return {
    key: row.key,
    fingerprint: typeof row.fingerprint === "string" ? row.fingerprint : "",
    messageId: row.messageId,
    startIso: row.startIso,
    title: row.title,
    location: typeof row.location === "string" ? row.location : "",
    priceLabel: typeof row.priceLabel === "string" ? row.priceLabel : null,
    url: typeof row.url === "string" ? row.url : "",
    theme: typeof row.theme === "string" ? row.theme : undefined,
  };
}

export function loadPosted(path: string): PostedStore {
  if (!existsSync(path)) return emptyStore();
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
    if (Array.isArray(parsed)) {
      return {
        keys: parsed.filter((x): x is string => typeof x === "string"),
        fingerprints: [],
        posts: [],
      };
    }
    if (!parsed || typeof parsed !== "object") return emptyStore();
    const row = parsed as Partial<PostedStore>;
    const posts = Array.isArray(row.posts) ? row.posts.map(asPost).filter((x): x is PostedEvent => !!x) : [];
    const keys = Array.isArray(row.keys) ? row.keys.filter((x): x is string => typeof x === "string") : [];
    for (const post of posts) if (!keys.includes(post.key)) keys.push(post.key);
    const fingerprints = Array.isArray(row.fingerprints)
      ? row.fingerprints.filter((x): x is string => typeof x === "string")
      : [];
    for (const post of posts) {
      if (post.fingerprint && !fingerprints.includes(post.fingerprint)) fingerprints.push(post.fingerprint);
    }
    return {
      keys,
      fingerprints,
      posts,
      digestOn: typeof row.digestOn === "string" ? row.digestOn : undefined,
    };
  } catch {
    return emptyStore();
  }
}

export function savePosted(path: string, store: PostedStore): void {
  mkdirSync(dirname(path), { recursive: true });
  const trimmed: PostedStore = {
    keys: store.keys.slice(-800),
    fingerprints: store.fingerprints.slice(-800),
    posts: store.posts.slice(-800),
    digestOn: store.digestOn,
  };
  writeFileSync(path, JSON.stringify(trimmed, null, 2) + "\n");
}

/** Keys already published. Extra paths are read-only legacy ledgers (geo2go). */
export function seenSets(paths: string[]): { keys: Set<string>; fingerprints: Set<string> } {
  const keys = new Set<string>();
  const fingerprints = new Set<string>();
  for (const path of paths) {
    const store = loadPosted(path);
    for (const key of store.keys) keys.add(key);
    for (const fp of store.fingerprints) fingerprints.add(fp);
  }
  return { keys, fingerprints };
}

export function appendPosted(path: string, post: PostedEvent): void {
  const store = loadPosted(path);
  if (!store.keys.includes(post.key)) store.keys.push(post.key);
  if (post.fingerprint && !store.fingerprints.includes(post.fingerprint)) {
    store.fingerprints.push(post.fingerprint);
  }
  store.posts = store.posts.filter((row) => row.key !== post.key);
  store.posts.push(post);
  savePosted(path, store);
}

export function markDigest(path: string, ymd: string): void {
  const store = loadPosted(path);
  store.digestOn = ymd;
  savePosted(path, store);
}
