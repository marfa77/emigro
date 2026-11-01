import { createClient } from "@supabase/supabase-js";

export const CALENDAR_THEMES = [
  "hike",
  "night",
  "food",
  "water",
  "family",
  "city",
  "culture",
  "sport",
  "music",
  "theatre",
  "cinema",
  "dance",
  "exhibition",
  "literature",
  "bike",
  "wellness",
] as const;

export type CalendarTheme = (typeof CALENDAR_THEMES)[number];

export const CALENDAR_CITIES = ["Porto", "Lisboa", "Braga", "Gerês", "Norte"] as const;

export const THEME_LABEL: Record<CalendarTheme, string> = {
  hike: "поход",
  night: "ночь",
  food: "еда",
  water: "вода",
  family: "семья",
  city: "город",
  culture: "культура",
  sport: "спорт",
  music: "музыка",
  theatre: "театр",
  cinema: "кино",
  dance: "танец",
  exhibition: "выставка",
  literature: "чтение",
  bike: "велосипед",
  wellness: "спокойный день",
};

export type CalendarEvent = {
  slug: string;
  title: string;
  theme: string;
  city: string | null;
  start_at: string;
  end_at: string | null;
  location: string;
  address: string | null;
  maps_url: string | null;
  price_label: string | null;
  source_url: string;
  image_url: string | null;
  source_id: string;
  organizer: string | null;
  telegram_message_id: number | null;
  description: string | null;
  tags?: string[] | null;
};

const COLUMNS =
  "slug,title,theme,city,tags,start_at,end_at,location,address,maps_url,price_label,source_url,image_url,source_id,organizer,telegram_message_id,description";

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function isCalendarTheme(value: string | undefined): value is CalendarTheme {
  return !!value && (CALENDAR_THEMES as readonly string[]).includes(value);
}

const THEME_DOT: Record<string, string> = {
  hike: "bg-emerald-500",
  night: "bg-violet-500",
  food: "bg-amber-500",
  water: "bg-sky-500",
  family: "bg-rose-500",
  city: "bg-stone-500",
  culture: "bg-indigo-500",
  sport: "bg-orange-500",
  music: "bg-fuchsia-500",
  theatre: "bg-red-600",
  cinema: "bg-slate-500",
  dance: "bg-pink-500",
  exhibition: "bg-indigo-400",
  literature: "bg-amber-700",
  bike: "bg-lime-600",
  wellness: "bg-teal-500",
};

const THEME_CHIP: Record<string, string> = {
  hike: "bg-emerald-50 text-emerald-900",
  night: "bg-violet-50 text-violet-900",
  food: "bg-amber-50 text-amber-950",
  water: "bg-sky-50 text-sky-950",
  family: "bg-rose-50 text-rose-900",
  city: "bg-stone-100 text-stone-800",
  culture: "bg-indigo-50 text-indigo-950",
  sport: "bg-orange-50 text-orange-950",
  music: "bg-fuchsia-50 text-fuchsia-950",
  theatre: "bg-red-50 text-red-950",
  cinema: "bg-slate-100 text-slate-800",
  dance: "bg-pink-50 text-pink-950",
  exhibition: "bg-indigo-50 text-indigo-950",
  literature: "bg-amber-50 text-amber-950",
  bike: "bg-lime-50 text-lime-950",
  wellness: "bg-teal-50 text-teal-950",
};

export function themeDot(theme: string): string {
  return THEME_DOT[theme] || "bg-slate-400";
}

export function themeChip(theme: string): string {
  return THEME_CHIP[theme] || "bg-slate-100 text-slate-800";
}

export function themeLabel(theme: string): string {
  return isCalendarTheme(theme) ? THEME_LABEL[theme] : theme;
}

export function lisbonDay(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function formatLisbonDayLabel(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(iso));
}

export function formatEventWhen(iso: string, endIso?: string | null): string {
  const start = new Date(iso);
  if (!Number.isFinite(start.getTime())) return iso;
  const day = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(start);
  const clock = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(start);
  if (/00:00|23:59/.test(clock) && !endIso) return day;
  if (endIso) {
    const end = new Date(endIso);
    if (Number.isFinite(end.getTime())) {
      const endClock = new Intl.DateTimeFormat("ru-RU", {
        timeZone: "Europe/Lisbon",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(end);
      return `${day}, ${clock}–${endClock}`;
    }
  }
  return `${day}, ${clock}`;
}

export async function listPortugalEvents(filter?: {
  city?: string;
  theme?: string;
}): Promise<CalendarEvent[]> {
  const db = client();
  if (!db) return [];
  const from = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
  const to = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString();
  let query = db
    .from("outdoor_events")
    .select(COLUMNS)
    .gte("start_at", from)
    .lte("start_at", to)
    .order("start_at", { ascending: true })
    .limit(400);
  if (filter?.city) query = query.eq("city", filter.city);
  if (filter?.theme) query = query.eq("theme", filter.theme);
  const { data, error } = await query;
  if (error) {
    console.warn("[calendar] list failed:", error.message);
    return [];
  }
  return (data ?? []) as CalendarEvent[];
}

export async function getPortugalEvent(slug: string): Promise<CalendarEvent | null> {
  const db = client();
  if (!db) return null;
  const { data, error } = await db.from("outdoor_events").select(COLUMNS).eq("slug", slug).maybeSingle();
  if (error) {
    console.warn("[calendar] event failed:", error.message);
    return null;
  }
  return (data as CalendarEvent | null) ?? null;
}

function icsStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export function eventIcs(ev: CalendarEvent, pageUrl: string): string {
  const placeholder = /T23:59:00|T00:00:00/.test(ev.start_at) && !ev.end_at;
  const start = placeholder ? `DTSTART;VALUE=DATE:${lisbonDay(ev.start_at).replace(/-/g, "")}` : `DTSTART:${icsStamp(ev.start_at)}`;
  const end = ev.end_at && !placeholder ? `DTEND:${icsStamp(ev.end_at)}` : "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Emigro//Portugal calendar//RU",
    "BEGIN:VEVENT",
    start,
    end,
    `SUMMARY:${ev.title.replace(/\n/g, " ")}`,
    `LOCATION:${(ev.address || ev.location).replace(/\n/g, " ")}`,
    `URL:${pageUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
