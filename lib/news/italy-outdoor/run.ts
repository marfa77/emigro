/**
 * Multi-source northern Italy outdoor experiences → @milan_echat.
 */
import { resolve } from "node:path";
import {
  buildItalyOutdoorCaption,
  materializeItalyEvent,
  publishItalyOutdoorPhoto,
  renderItalyOutdoorCard,
} from "@/lib/news/italy-outdoor/publish";
import { fingerprint, uniqueByFingerprint } from "@/lib/news/outdoor/due";
import { appendPosted, loadPosted, seenSets } from "@/lib/news/outdoor/posted";
import { eventTheme, isEventTheme, nextPosts } from "@/lib/news/outdoor/themes";
import { publishDue } from "@/lib/news/outdoor/publish-batch";
import { ITALY_OUTDOOR_SOURCES } from "@/lib/news/italy-outdoor/sources";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";

function seenPath(): string {
  return resolve(process.cwd(), "deploy/italy-outdoor/state/seen.json");
}

function remember(ev: OutdoorEvent, messageId: number): void {
  appendPosted(seenPath(), {
    key: ev.key,
    fingerprint: fingerprint(ev, "Europe/Rome"),
    messageId,
    startIso: ev.startIso,
    title: ev.title,
    location: ev.location,
    priceLabel: ev.priceLabel,
    url: ev.url,
    theme: eventTheme(ev),
  });
}

export async function collectItalyOutdoorEvents(options?: { sources?: string[] }): Promise<OutdoorEvent[]> {
  const allow = options?.sources?.length ? new Set(options.sources) : null;
  const all: OutdoorEvent[] = [];
  for (const src of ITALY_OUTDOOR_SOURCES) {
    if (allow && !allow.has(src.id)) continue;
    try {
      const items = await src.fetch();
      console.log(`[italy-outdoor] ${src.id}: ${items.length}`);
      all.push(...items);
    } catch (e) {
      console.warn(`[italy-outdoor] ${src.id} failed:`, e instanceof Error ? e.message : e);
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
    `[italy-outdoor] try ${ev.sourceId} ${ev.startIso} ${ev.title} · ${ev.priceLabel || "?"} · ${ev.location}`
  );
  const draft = await materializeItalyEvent(ev);
  if (!draft) {
    console.log(`[italy-outdoor] draft skip ${ev.title}`);
    return { published: false, reason: "draft-skip", url: ev.url, sourceId: ev.sourceId };
  }
  const card = await renderItalyOutdoorCard(draft.image, draft.cardLines);
  const caption = buildItalyOutdoorCaption(draft);
  if (options?.dryRun) {
    console.log(`[italy-outdoor] dry-run ${draft.title}\n${caption}`);
    return {
      published: false,
      reason: "dry-run",
      title: draft.title,
      url: ev.url,
      sourceId: ev.sourceId,
    };
  }
  const messageId = await publishItalyOutdoorPhoto(caption, card);
  remember(ev, messageId);
  console.log(`[italy-outdoor] published ${messageId} ${draft.title} (${ev.sourceId})`);
  return {
    published: true,
    messageId,
    title: draft.title,
    url: ev.url,
    sourceId: ev.sourceId,
  };
}

function sameEvent(ev: OutdoorEvent, url: string): boolean {
  const norm = (value: string) => value.split("?")[0]!.replace(/\/$/, "");
  return norm(ev.url) === norm(url) || ev.url.replace(/\/$/, "") === url.replace(/\/$/, "");
}

export async function runItalyOutdoorChannel(options?: {
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
  const events = await collectItalyOutdoorEvents({ sources: options?.sources });
  if (options?.forceUrl) {
    const url = options.forceUrl.trim();
    const hits = events.filter((ev) => sameEvent(ev, url));
    const dated = url.match(/date=(\d{4}-\d{2}-\d{2})/);
    const hit = dated ? hits.find((ev) => ev.startIso.startsWith(dated[1]!)) || hits[0] : hits[0];
    if (!hit) return { published: false, reason: "force-url-not-in-sources", url };
    return publishOne(hit, options);
  }

  const seen = seenSets([seenPath()]);
  const fresh = uniqueByFingerprint(
    events.filter(
      (ev) => !seen.keys.has(ev.key) && !seen.fingerprints.has(fingerprint(ev, "Europe/Rome"))
    ),
    "Europe/Rome"
  );
  const recent = loadPosted(seenPath()).posts.slice(-6).map((post) =>
    isEventTheme(post.theme) ? post.theme : eventTheme(post)
  );
  const batch = nextPosts(fresh, 3, recent);
  console.log(
    `[italy-outdoor] unseen ${fresh.length}, posting ${batch.map((ev) => eventTheme(ev)).join(",") || "none"}`
  );
  if (batch.length === 0) return { published: false, reason: "no-fresh-event" };
  return publishDue(batch, options, publishOne);
}
