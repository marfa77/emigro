/**
 * Day events around Valencia → @valencia_echat.
 */
import { resolve } from "node:path";
import {
  buildValenciaOutdoorCaption,
  materializeValenciaEvent,
  publishValenciaOutdoorPhoto,
  renderValenciaOutdoorCard,
} from "@/lib/news/valencia-outdoor/publish";
import { fingerprint, uniqueByFingerprint } from "@/lib/news/outdoor/due";
import { appendPosted, loadPosted, seenSets } from "@/lib/news/outdoor/posted";
import { eventTheme, isEventTheme, nextPosts } from "@/lib/news/outdoor/themes";
import { publishDue } from "@/lib/news/outdoor/publish-batch";
import { VALENCIA_OUTDOOR_SOURCES } from "@/lib/news/valencia-outdoor/sources";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";

function seenPath(): string {
  return resolve(process.cwd(), "deploy/valencia-outdoor/state/seen.json");
}

function remember(ev: OutdoorEvent, messageId: number): void {
  appendPosted(seenPath(), {
    key: ev.key,
    fingerprint: fingerprint(ev, "Europe/Madrid"),
    messageId,
    startIso: ev.startIso,
    title: ev.title,
    location: ev.location,
    priceLabel: ev.priceLabel,
    url: ev.url,
    theme: eventTheme(ev),
  });
}

export async function collectValenciaOutdoorEvents(options?: { sources?: string[] }): Promise<OutdoorEvent[]> {
  const allow = options?.sources?.length ? new Set(options.sources) : null;
  const all: OutdoorEvent[] = [];
  for (const src of VALENCIA_OUTDOOR_SOURCES) {
    if (allow && !allow.has(src.id)) continue;
    try {
      const items = await src.fetch();
      console.log(`[valencia-outdoor] ${src.id}: ${items.length}`);
      all.push(...items);
    } catch (e) {
      console.warn(`[valencia-outdoor] ${src.id} failed:`, e instanceof Error ? e.message : e);
    }
  }
  all.sort((a, b) => Date.parse(a.startIso) - Date.parse(b.startIso));
  return all;
}

async function publishOne(ev: OutdoorEvent, options?: { dryRun?: boolean }) {
  console.log(
    `[valencia-outdoor] try ${ev.sourceId} ${ev.startIso} ${ev.title} · ${ev.priceLabel || "?"} · ${ev.location}`
  );
  const draft = await materializeValenciaEvent(ev);
  if (!draft) {
    console.log(`[valencia-outdoor] draft skip ${ev.title}`);
    return { published: false, reason: "draft-skip", url: ev.url, sourceId: ev.sourceId };
  }
  const card = await renderValenciaOutdoorCard(draft.image, draft.cardLines);
  const caption = buildValenciaOutdoorCaption(draft);
  if (options?.dryRun) {
    console.log(`[valencia-outdoor] dry-run ${draft.title}\n${caption}`);
    return { published: false, reason: "dry-run", title: draft.title, url: ev.url, sourceId: ev.sourceId };
  }
  const messageId = await publishValenciaOutdoorPhoto(caption, card);
  remember(ev, messageId);
  console.log(`[valencia-outdoor] published ${messageId} ${draft.title}`);
  return { published: true, messageId, title: draft.title, url: ev.url, sourceId: ev.sourceId };
}

export async function runValenciaOutdoorChannel(options?: {
  dryRun?: boolean;
  forceUrl?: string;
  sources?: string[];
}) {
  const events = await collectValenciaOutdoorEvents({ sources: options?.sources });
  if (options?.forceUrl) {
    const url = options.forceUrl.trim().replace(/\/$/, "");
    const hit = events.find((ev) => ev.url.replace(/\/$/, "") === url);
    if (!hit) return { published: false, reason: "force-url-not-in-sources", url };
    return publishOne(hit, options);
  }
  const seen = seenSets([seenPath()]);
  const fresh = uniqueByFingerprint(
    events.filter(
      (ev) => !seen.keys.has(ev.key) && !seen.fingerprints.has(fingerprint(ev, "Europe/Madrid"))
    ),
    "Europe/Madrid"
  );
  const recent = loadPosted(seenPath()).posts.slice(-6).map((post) =>
    isEventTheme(post.theme) ? post.theme : eventTheme(post)
  );
  const batch = nextPosts(fresh, 3, recent);
  console.log(
    `[valencia-outdoor] unseen ${fresh.length}, posting ${batch.map((ev) => eventTheme(ev)).join(",") || "none"}`
  );
  if (batch.length === 0) return { published: false, reason: "no-fresh-event" };
  return publishDue(batch, options, publishOne);
}
