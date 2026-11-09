/**
 * Multi-source outdoor experiences → @emigro_portugal.
 */
import { resolve } from "node:path";
import {
  buildOutdoorCaption,
  calendarPageIsLive,
  materializeEvent,
  publishOutdoorPhoto,
  renderOutdoorCard,
} from "@/lib/news/outdoor/publish";
import { fingerprint, uniqueByFingerprint } from "@/lib/news/outdoor/due";
import { appendPosted, seenSets } from "@/lib/news/outdoor/posted";
import { channelPicks, eventTheme } from "@/lib/news/outdoor/themes";
import { activeSlot, markSlot, slotTaken, themesPostedToday } from "@/lib/news/outdoor/slots";
import { listUpcomingOutdoorEvents, markOutdoorTelegram, upsertOutdoorEvents } from "@/lib/news/outdoor/store";
import { OUTDOOR_SOURCES, parseGeo2goEventHtml } from "@/lib/news/outdoor/sources";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";
import { fetchText } from "@/lib/news/outdoor/util";

function seenPath(): string {
  return resolve(process.cwd(), "deploy/portugal-outdoor/state/seen.json");
}

function seenPaths(): string[] {
  return [seenPath(), resolve(process.cwd(), "deploy/geo2go-events/state/seen.json")];
}

function slotsPath(): string {
  return resolve(process.cwd(), "deploy/portugal-outdoor/state/channel-slots.json");
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
  options?: { dryRun?: boolean; mentionSite?: boolean }
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
  const caption = buildOutdoorCaption(draft, { mentionSite: options?.mentionSite });
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
  await markOutdoorTelegram(ev.key, messageId);
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
  /** Write the full list and do not post. */
  storeOnly?: boolean;
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

  const slot = activeSlot();
  if (!options?.dryRun && !options?.storeOnly && !slot) {
    return { published: false, reason: "outside-slot" };
  }
  if (!options?.dryRun && !options?.storeOnly && slotTaken(slotsPath())) {
    return { published: false, reason: "slot-used" };
  }

  const seen = seenSets(seenPaths());
  const collected = await collectOutdoorEvents({ sources: options?.sources });
  if (!options?.dryRun) await upsertOutdoorEvents(collected);
  if (options?.storeOnly) return { published: false, reason: "stored" };

  const stored = await listUpcomingOutdoorEvents();
  const pool = stored.length ? stored : collected;
  const events = uniqueByFingerprint(
    pool.filter((e) => !seen.keys.has(e.key) && !seen.fingerprints.has(fingerprint(e, "Europe/Lisbon"))),
    "Europe/Lisbon"
  );
  const recent = themesPostedToday(slotsPath());
  const batch = channelPicks(events, 3, recent);
  const next = batch[0];
  const wantSiteLine = slot === "19:30" || recent.length >= 2 || batch.length <= 1;
  const mentionSite = wantSiteLine && (await calendarPageIsLive());
  if (wantSiteLine && !mentionSite) console.log("[outdoor] calendar page is not live, site line skipped");
  console.log(
    `[outdoor] stored-pool ${pool.length}, unseen ${events.length}, slot ${slot ?? "dry"}, site-line ${mentionSite}, queue ${batch.map((ev) => `${eventTheme(ev)}:${ev.title}`).join(" | ") || "none"}`
  );
  if (!next) return { published: false, reason: "no-fresh-event" };
  const result = await publishOne(next, { ...options, mentionSite });
  if (result.published && next) markSlot(slotsPath(), next.key, eventTheme(next));
  return result;
}
