/**
 * Multi-source outdoor experiences → @emigro_portugal.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  buildOutdoorCaption,
  materializeEvent,
  publishOutdoorPhoto,
  renderOutdoorCard,
} from "@/lib/news/outdoor/publish";
import { OUTDOOR_SOURCES, parseGeo2goEventHtml } from "@/lib/news/outdoor/sources";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";
import { fetchText } from "@/lib/news/outdoor/util";

function seenPath(): string {
  return resolve(process.cwd(), "deploy/portugal-outdoor/state/seen.json");
}

function loadSeen(): Set<string> {
  // Merge legacy geo2go seen keys so we don't re-post those.
  const keys = new Set<string>();
  for (const path of [
    seenPath(),
    resolve(process.cwd(), "deploy/geo2go-events/state/seen.json"),
  ]) {
    if (!existsSync(path)) continue;
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as unknown;
      if (Array.isArray(parsed)) {
        for (const x of parsed) if (typeof x === "string") keys.add(x);
      }
    } catch {
      /* ignore */
    }
  }
  return keys;
}

function remember(key: string): void {
  const path = seenPath();
  mkdirSync(dirname(path), { recursive: true });
  const prev = loadSeen();
  prev.add(key);
  writeFileSync(path, JSON.stringify([...prev].slice(-800), null, 2) + "\n");
}

export async function collectOutdoorEvents(options?: {
  sources?: string[];
}): Promise<OutdoorEvent[]> {
  const allow = options?.sources?.length ? new Set(options?.sources) : null;
  const all: OutdoorEvent[] = [];
  for (const src of OUTDOOR_SOURCES) {
    if (allow && !allow.has(src.id)) continue;
    try {
      const items = await src.fetch();
      console.log(`[outdoor] ${src.id}: ${items.length}`);
      all.push(...items);
    } catch (e) {
      console.warn(`[outdoor] ${src.id} failed:`, e instanceof Error ? e.message : e);
    }
  }
  all.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
  return all;
}

async function publishOne(
  ev: OutdoorEvent,
  options?: { dryRun?: boolean }
): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
  sourceId?: string;
}> {
  console.log(
    `[outdoor] try ${ev.sourceId} ${ev.startIso} ${ev.title} · ${ev.priceLabel || "?"} · ${ev.location}`
  );
  const draft = await materializeEvent(ev);
  if (!draft) {
    console.log(`[outdoor] draft skip ${ev.title}`);
    return { published: false, reason: "draft-skip", url: ev.url, sourceId: ev.sourceId };
  }
  const card = await renderOutdoorCard(draft.image, draft.cardLines);
  const caption = buildOutdoorCaption(draft);
  if (options?.dryRun) {
    console.log(`[outdoor] dry-run ${draft.title}\n${caption}`);
    return {
      published: false,
      reason: "dry-run",
      title: draft.title,
      url: ev.url,
      sourceId: ev.sourceId,
    };
  }
  const messageId = await publishOutdoorPhoto(caption, card);
  remember(ev.key);
  console.log(`[outdoor] published ${messageId} ${draft.title} (${ev.sourceId})`);
  return {
    published: true,
    messageId,
    title: draft.title,
    url: ev.url,
    sourceId: ev.sourceId,
  };
}

export async function runPortugalOutdoorChannel(options?: {
  dryRun?: boolean;
  forceUrl?: string;
  sources?: string[];
}): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
  sourceId?: string;
}> {
  if (options?.forceUrl) {
    const url = options.forceUrl.trim();
    // Prefer dedicated parsers by host
    if (/geo2go\.pt/i.test(url)) {
      const html = await fetchText(url);
      const ev = html ? await parseGeo2goEventHtml(html, url) : null;
      if (!ev) return { published: false, reason: "force-url-fetch-failed", url };
      return publishOne(ev, options);
    }
    // Generic: try collecting and matching URL
    const all = await collectOutdoorEvents({ sources: options?.sources });
    const hit = all.find((e) => e.url.replace(/\/$/, "") === url.replace(/\/$/, ""));
    if (hit) return publishOne(hit, options);
    return { published: false, reason: "force-url-not-in-sources", url };
  }

  const seen = loadSeen();
  const events = (await collectOutdoorEvents({ sources: options?.sources })).filter(
    (e) => !seen.has(e.key) && !seen.has(e.url)
  );
  console.log(`[outdoor] upcoming unseen ${events.length}`);
  if (events.length === 0) return { published: false, reason: "no-fresh-event" };

  for (const ev of events) {
    const result = await publishOne(ev, options);
    if (result.published || result.reason === "dry-run") return result;
  }
  return { published: false, reason: "no-draftable-event" };
}
