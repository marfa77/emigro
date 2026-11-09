/** Calendar helpers for outdoor posts. Dates are local to the city's timezone. */

export function eventDay(iso: string, timeZone: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(t));
}

export function zonedWeekday(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(now);
}

export function isFriday(now: Date, timeZone: string): boolean {
  return zonedWeekday(now, timeZone) === "Fri";
}

function addCalendarDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y || 1970, (m || 1) - 1, d || 1));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/** Saturday and Sunday of the weekend this Friday is announcing. */
export function weekendDates(
  timeZone: string,
  now = new Date()
): { saturday: string; sunday: string } {
  const today = eventDay(now.toISOString(), timeZone);
  const plus: Record<string, number> = { Fri: 1, Sat: 0, Thu: 2, Wed: 3, Tue: 4, Mon: 5, Sun: 6 };
  const shift = plus[zonedWeekday(now, timeZone)] ?? 1;
  const saturday = addCalendarDays(today, shift);
  return { saturday, sunday: addCalendarDays(saturday, 1) };
}

function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Same day + same title + same place, so two sources don't post one hike twice. */
export function fingerprint(
  ev: { startIso: string; title: string; location: string },
  timeZone: string
): string {
  return `${eventDay(ev.startIso, timeZone)}|${fold(ev.title).slice(0, 60)}|${fold(ev.location).slice(0, 32)}`;
}

export function uniqueByFingerprint<
  T extends { key: string; startIso: string; title: string; location: string },
>(events: T[], timeZone: string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const ev of events) {
    const fp = fingerprint(ev, timeZone);
    if (seen.has(ev.key) || seen.has(fp)) continue;
    seen.add(ev.key);
    seen.add(fp);
    out.push(ev);
  }
  return out;
}
