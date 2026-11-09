/**
 * Full collector list → Supabase. Telegram still posts one card per slot.
 */
import { createAdminClient } from "@/lib/admin/supabase";
import type { OutdoorEvent } from "@/lib/news/outdoor/types";
import { eventTags, eventTheme } from "@/lib/news/outdoor/themes";

export function eventSlug(sourceKey: string): string {
  const slug = sourceKey
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || "event";
}

export function eventCity(location: string): string {
  if (/lisboa|lisbon/i.test(location)) return "Lisboa";
  if (/\bporto\b/i.test(location)) return "Porto";
  if (/braga/i.test(location)) return "Braga";
  if (/ger[eê]s|peneda/i.test(location)) return "Gerês";
  return "Norte";
}

const CITY_TAG: Record<string, string> = {
  Porto: "porto",
  Lisboa: "lisboa",
  Braga: "braga",
  Gerês: "geres",
  Norte: "norte",
};

export function cityTag(city: string): string {
  return CITY_TAG[city] || "norte";
}

function tagsFor(ev: OutdoorEvent): string[] {
  const tags = new Set<string>(eventTags(ev));
  tags.add(cityTag(eventCity(ev.location)));
  return [...tags];
}

function rowFromEvent(ev: OutdoorEvent) {
  return {
    source_key: ev.key,
    slug: eventSlug(ev.key),
    country: "PT",
    city: eventCity(ev.location),
    theme: eventTheme(ev),
    title: ev.title,
    description: ev.description || null,
    start_at: ev.startIso,
    end_at: ev.endIso,
    location: ev.location,
    address: ev.address,
    lat: ev.lat,
    lng: ev.lng,
    maps_url: ev.mapsUrl,
    price_label: ev.priceLabel,
    source_url: ev.url,
    image_url: ev.imageUrl,
    source_id: ev.sourceId,
    organizer: ev.organizer || null,
    tags: tagsFor(ev),
    updated_at: new Date().toISOString(),
  };
}

export async function upsertOutdoorEvents(events: OutdoorEvent[]): Promise<number> {
  if (!events.length) return 0;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    console.warn("[outdoor] supabase env missing, calendar not updated");
    return 0;
  }
  try {
    const admin = createAdminClient();
    const rows = events.map(rowFromEvent);
    const { error } = await admin.from("outdoor_events").upsert(rows, { onConflict: "source_key" });
    if (error) {
      console.warn("[outdoor] store failed:", error.message);
      return 0;
    }
    console.log(`[outdoor] stored ${rows.length}`);
    return rows.length;
  } catch (error) {
    console.warn("[outdoor] store failed:", error instanceof Error ? error.message : error);
    return 0;
  }
}

/** Fill tags on rows already in the table. New collects write tags themselves. */
export async function retagStoredEvents(): Promise<number> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return 0;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("outdoor_events")
    .select("source_key,title,description,organizer,source_id,location,tags");
  if (error || !data) {
    console.warn("[outdoor] retag failed:", error?.message);
    return 0;
  }
  let updated = 0;
  for (const row of data) {
    const tags = eventTags({
      title: row.title,
      description: row.description,
      organizer: row.organizer,
      sourceId: row.source_id,
      tags: [...(row.tags || []), cityTag(eventCity(row.location || ""))],
    });
    const { error: updateError } = await admin.from("outdoor_events").update({ tags }).eq("source_key", row.source_key);
    if (!updateError) updated += 1;
  }
  console.log(`[outdoor] retagged ${updated}`);
  return updated;
}

/** Upcoming rows with a photo. The channel picks from this, not only from today's scrape. */
export async function listUpcomingOutdoorEvents(): Promise<OutdoorEvent[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return [];
  try {
    const admin = createAdminClient();
    const from = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const until = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await admin
      .from("outdoor_events")
      .select(
        "source_key,source_id,organizer,title,description,start_at,end_at,location,address,lat,lng,maps_url,price_label,source_url,image_url,tags"
      )
      .gte("start_at", from)
      .lte("start_at", until)
      .not("image_url", "is", null)
      .order("start_at", { ascending: true })
      .limit(400);
    if (error || !data) {
      console.warn("[outdoor] list failed:", error?.message);
      return [];
    }
    return data.map((row) => ({
      key: row.source_key,
      sourceId: row.source_id,
      organizer: row.organizer || "",
      title: row.title,
      description: row.description || "",
      aboutPt: null,
      includesPt: null,
      startIso: row.start_at,
      endIso: row.end_at,
      location: row.location,
      address: row.address,
      lat: row.lat,
      lng: row.lng,
      mapsUrl: row.maps_url,
      tickets: [],
      priceLabel: row.price_label,
      url: row.source_url,
      imageUrl: row.image_url,
      tags: row.tags || [],
    }));
  } catch (error) {
    console.warn("[outdoor] list failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

export async function markOutdoorTelegram(sourceKey: string, messageId: number): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) return;
  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("outdoor_events")
      .update({ telegram_message_id: messageId, updated_at: new Date().toISOString() })
      .eq("source_key", sourceKey);
    if (error) console.warn("[outdoor] telegram link failed:", error.message);
  } catch (error) {
    console.warn("[outdoor] telegram link failed:", error instanceof Error ? error.message : error);
  }
}
