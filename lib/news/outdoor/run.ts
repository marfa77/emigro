/**
 * Multi-source outdoor experiences → @emigro_portugal.
 */
import { resolve } from "node:path";
import {
  buildOutdoorCaption,
  materializeEvent,
  publishOutdoorPhoto,
  renderOutdoorCard,
} from "@/lib/news/outdoor/publish";
import { fingerprint, uniqueByFingerprint } from "@/lib/news/outdoor/due";
import { appendPosted, loadPosted, seenSets } from "@/lib/news/outdoor/posted";
import { eventTheme, isEventTheme, nextPosts } from "@/lib/news/outdoor/themes";
import { publishDue } from "@/lib/news/outdoor/publish-batch";
import { OUTDOOR_SOURCES, parseGeo2goEventHtml } from "@/lib/news/outdoor/sources";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";
import { fetchText } from "@/lib/news/outdoor/util";

function seenPath(): string {
  return resolve(process.cwd(), "deploy/portugal-outdoor/state/seen.json");
}

function seenPaths(): string[] {
  return [seenPath(), resolve(process.cwd(), "deploy/geo2go-events/state/seen.json")];
}

function remember(ev: OutdoorEvent, messageId: number): void {
  appendPosted(seenPath(), {
    key: ev.key,
    fingerprint: fingerprint(ev, "Europe/Lisbon"),
    messageId,
    startIso: ev.startIso,
    title: ev.title,
    location: ev.location,
    priceLabel: ev.priceLabel,
    url: ev.url,
    theme: eventTheme(ev),
  });
}

export async function collectOutdoorEvents(options?: {
  sources?: string[];
}): Promise<OutdoorEvent[]> {
  const allow = options?.sources?.length ? new Set(options.sources) : null;
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
  remember(ev, messageId);
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
    const all = await collectOutdoorEvents({ sources: options.sources });
    const hit = all.find((e) => e.url.replace(/\/$/, "") === url.replace(/\/$/, ""));
    if (hit) return publishOne(hit, options);
    return { published: false, reason: "force-url-not-in-sources", url };
  }

  const seen = seenSets(seenPaths());
  const events = uniqueByFingerprint(
    (await collectOutdoorEvents({ sources: options?.sources })).filter(
      (e) => !seen.keys.has(e.key) && !seen.fingerprints.has(fingerprint(e, "Europe/Lisbon"))
    ),
    "Europe/Lisbon"
  );
  const recent = loadPosted(seenPath()).posts.slice(-6).map((post) =>
    isEventTheme(post.theme) ? post.theme : eventTheme(post)
  );
  const batch = nextPosts(events, 3, recent);
  console.log(
    `[outdoor] unseen ${events.length}, posting ${batch.map((ev) => eventTheme(ev)).join(",") || "none"}`
  );
  if (batch.length === 0) return { published: false, reason: "no-fresh-event" };
  return publishDue(batch, options, publishOne);
}
