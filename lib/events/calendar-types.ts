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
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(start);
  if ((clock === "00:00" || clock === "23:59") && !endIso) return day;
  if (endIso) {
    const end = new Date(endIso);
    if (Number.isFinite(end.getTime())) {
      const endClock = new Intl.DateTimeFormat("en-GB", {
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

const DOT: Record<string, string> = {
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

export function themeDot(theme: string): string {
  return DOT[theme] || "bg-slate-400";
}

const THEME_ORDER = [
  "night",
  "sport",
  "music",
  "theatre",
  "cinema",
  "dance",
  "exhibition",
  "culture",
  "food",
  "family",
  "city",
  "water",
  "bike",
  "wellness",
  "literature",
  "hike",
];

export const FILTER_TAGS = [
  "hike",
  "night",
  "food",
  "sport",
  "music",
  "theatre",
  "cinema",
  "dance",
  "exhibition",
  "culture",
  "family",
  "water",
  "bike",
  "city",
  "wellness",
  "literature",
  "porto",
  "lisboa",
  "braga",
  "geres",
  "norte",
] as const;

export const CITY_TAGS = ["porto", "lisboa", "braga", "geres", "norte"] as const;

/** Chips for a type. Culture is the parent of music, theatre, cinema and the rest. */
export const TYPE_TAGS = ["hike", "night", "food", "sport", "music", "theatre", "cinema", "dance", "exhibition", "family"] as const;

/** Cities a person can filter. "север" stays on the row data, not as a chip. */
export const PLACE_TAGS = ["porto", "lisboa", "braga", "geres"] as const;

export function isCityTag(tag: string): boolean {
  return (CITY_TAGS as readonly string[]).includes(tag);
}

const TAG_LABEL: Record<string, string> = {
  hike: "поход",
  night: "ночь",
  food: "еда",
  water: "вода",
  family: "семья",
  city: "город",
  culture: "культура",
  sport: "спорт",
  bike: "велосипед",
  wellness: "спокойный день",
  music: "музыка",
  theatre: "театр",
  cinema: "кино",
  dance: "танец",
  exhibition: "выставка",
  literature: "чтение",
  porto: "Порту",
  lisboa: "Лиссабон",
  braga: "Брага",
  geres: "Жереш",
  norte: "север",
};

export function tagLabel(tag: string): string {
  return TAG_LABEL[tag] || tag;
}

export function eventTagsOf(event: { tags?: string[] | null; theme: string }): string[] {
  return event.tags?.length ? event.tags : [event.theme];
}

const SPECIFIC_TAGS = new Set(["music", "theatre", "cinema", "dance", "exhibition", "literature"]);

/** Tags worth showing. Drops the parent "культура" when a precise one is already there. */
/** The one type a pictogram should show. Music beats the parent «культура». */
export function eventKind(event: { tags?: string[] | null; theme: string }): string {
  const tags = displayTags(event);
  return tags.find((tag) => tag !== "culture") || tags[0] || event.theme;
}

export function displayTags(event: { tags?: string[] | null; theme: string }): string[] {
  const tags = eventTagsOf(event).filter((tag) => !isCityTag(tag));
  if (tags.some((tag) => SPECIFIC_TAGS.has(tag))) return tags.filter((tag) => tag !== "culture");
  return tags;
}

export function themeOrder(theme: string): number {
  const index = THEME_ORDER.indexOf(theme);
  return index === -1 ? THEME_ORDER.length : index;
}

export function placeLabel(city: string | null): string {
  if (!city || city === "Norte") return "север";
  if (city === "Lisboa") return "Лиссабон";
  if (city === "Porto") return "Порту";
  if (city === "Gerês") return "Жереш";
  if (city === "Braga") return "Брага";
  return city;
}

export function lisbonWeekIndex(day: string): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Lisbon",
    weekday: "short",
  }).format(new Date(`${day}T12:00:00Z`));
  return { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }[name] ?? 0;
}

export function addLisbonDays(day: string, amount: number): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return lisbonDay(date.toISOString());
}

export function planDays(now = new Date()): { today: string; weekend: string[]; nextWeekend: string[] } {
  const today = lisbonDay(now.toISOString());
  const index = lisbonWeekIndex(today);
  const weekend =
    index === 6 ? [today] : index === 5 ? [today, addLisbonDays(today, 1)] : [addLisbonDays(today, 5 - index), addLisbonDays(today, 6 - index)];
  const nextSat = index === 6 ? addLisbonDays(today, 6) : addLisbonDays(weekend[0]!, 7);
  return { today, weekend, nextWeekend: [nextSat, addLisbonDays(nextSat, 1)] };
}

export function formatClock(iso: string, endIso?: string | null): string | null {
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(iso));
  if ((clock === "00:00" || clock === "23:59") && !endIso) return null;
  if (!endIso) return clock;
  const end = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(endIso));
  return `${clock}–${end}`;
}

function inPlace(name: string): string {
  if (/^porto$/i.test(name)) return "Порту";
  if (/^lisboa$/i.test(name)) return "Лиссабоне";
  if (/^ger[eê]s$/i.test(name)) return "Жереше";
  return name;
}

export function venueName(event: CalendarEvent): string {
  let name = event.location.trim();
  if (event.city) name = name.replace(new RegExp(`,\\s*${event.city}$`, "i"), "").trim();
  return name || placeLabel(event.city);
}

function readablePlace(event: CalendarEvent): string {
  const name = venueName(event);
  if (/^-?\d{1,3}\.\d+/.test(name)) return placeLabel(event.city);
  return name;
}

/** One scannable line: hour, place, city, price. The name stays the title. */
export function eventMeta(event: CalendarEvent): string {
  const clock = formatClock(event.start_at, event.end_at);
  const where = readablePlace(event);
  const city = eventTagsOf(event).find((tag) => (PLACE_TAGS as readonly string[]).includes(tag));
  const cityName = city ? tagLabel(city) : "";
  const bareCity = /^(porto|lisboa|lisbon|braga)$/i.test(where.trim());
  const whereHasCity = cityName && where.toLowerCase().includes(cityName.toLowerCase());
  return [clock, bareCity || where === "север" ? "" : where, whereHasCity ? "" : cityName, event.price_label]
    .filter(Boolean)
    .join(" · ");
}

export function eventLeadRu(event: CalendarEvent): string {
  const where = inPlace(readablePlace(event));
  if (where === "север") {
    if (event.theme === "night") return "Вечером на севере.";
    if (event.theme === "food") return "За едой на севере.";
  }
  if (event.theme === "night") return `Вечером в ${where}.`;
  if (event.theme === "sport") return `Матч: ${where}.`;
  if (event.theme === "culture") return `На афише: ${where}.`;
  if (event.theme === "food") return `За едой: ${where}.`;
  const start = /^-?\d{1,3}\.\d+/.test(event.location.trim()) ? placeLabel(event.city) : event.location;
  return `Поход, старт: ${start}.`;
}
