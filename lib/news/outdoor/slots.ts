/**
 * Portugal channel slots in Europe/Lisbon. systemd OnCalendar is UTC and
 * ignores Timezone=, so the timer fires both winter and summer UTC hours
 * and this module decides whether Lisbon is actually in a slot.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { isEventTheme, type EventTheme } from "@/lib/news/outdoor/themes";

export const CHANNEL_SLOTS = ["11:30", "15:30", "19:30"] as const;
export type ChannelSlot = (typeof CHANNEL_SLOTS)[number];

const WINDOW_MIN = 40;

type SlotMark = { key: string; theme: string };
type SlotFile = Record<string, Partial<Record<ChannelSlot, SlotMark>>>;

export function lisbonClock(now = new Date()): { date: string; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value])
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function activeSlot(now = new Date()): ChannelSlot | null {
  const { minutes } = lisbonClock(now);
  for (const slot of CHANNEL_SLOTS) {
    const [hour, minute] = slot.split(":").map(Number);
    const start = hour! * 60 + minute!;
    if (minutes >= start && minutes < start + WINDOW_MIN) return slot;
  }
  return null;
}

function readSlots(path: string): SlotFile {
  if (!existsSync(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as SlotFile;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeSlots(path: string, data: SlotFile): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function slotTaken(path: string, now = new Date()): boolean {
  const slot = activeSlot(now);
  if (!slot) return false;
  const { date } = lisbonClock(now);
  return Boolean(readSlots(path)[date]?.[slot]);
}

export function markSlot(path: string, key: string, theme: string, now = new Date()): void {
  const slot = activeSlot(now);
  if (!slot) return;
  const { date } = lisbonClock(now);
  const data = readSlots(path);
  const day = data[date] ?? {};
  day[slot] = { key, theme };
  data[date] = day;
  const dates = Object.keys(data).sort();
  for (const old of dates.slice(0, Math.max(0, dates.length - 21))) delete data[old];
  writeSlots(path, data);
}

export function themesPostedToday(path: string, now = new Date()): EventTheme[] {
  const { date } = lisbonClock(now);
  const day = readSlots(path)[date];
  if (!day) return [];
  return CHANNEL_SLOTS.map((slot) => day[slot]?.theme).filter((theme): theme is EventTheme => isEventTheme(theme));
}
