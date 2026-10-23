import { createAdminClient } from "@/lib/admin/supabase";
import { countDaysInYear, DEFAULT_DAY_RULE } from "./day-math";
import { canonicalIso2, getPack } from "./packs";
import type { Iso2, PresenceInterval, PresenceSource } from "./types";

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type TaxLedger = {
  id: string;
  telegramUserId: number;
  taxYear: number;
  createdAt: string;
  updatedAt: string;
};

export type CountryDayTotal = {
  iso2: Iso2;
  days: number;
};

function parseUtcDate(iso: string): Date | null {
  if (!ISO_DATE_RE.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return dt;
}

/** Uppercase ISO2; UK → GB. Throws if not a valid 2-letter code. */
export function normalizePresenceIso2(raw: string): Iso2 {
  const iso = canonicalIso2(raw);
  if (!iso) {
    throw new Error(`invalid country ISO2: ${raw}`);
  }
  return iso;
}

/** Validates YYYY-MM-DD calendar date. Throws on invalid. */
export function assertValidIsoDate(label: string, value: string): string {
  if (!parseUtcDate(value)) {
    throw new Error(`invalid ${label} date: ${value}`);
  }
  return value;
}

function assertValidInterval(interval: PresenceInterval): PresenceInterval {
  const countryIso2 = normalizePresenceIso2(interval.countryIso2);
  const startDate = assertValidIsoDate("start", interval.startDate);
  const endDate = assertValidIsoDate("end", interval.endDate);
  if (endDate < startDate) {
    throw new Error(`end_date before start_date: ${startDate}..${endDate}`);
  }
  return {
    ...interval,
    countryIso2,
    startDate,
    endDate,
    note: interval.note ?? null,
  };
}

type LedgerRow = {
  id: string;
  telegram_user_id: number;
  tax_year: number;
  created_at: string;
  updated_at: string;
};

type PresenceRow = {
  id: string;
  ledger_id: string;
  country_iso2: string;
  start_date: string;
  end_date: string;
  source: string;
  note: string | null;
  created_at: string;
};

function rowToLedger(row: LedgerRow): TaxLedger {
  return {
    id: row.id,
    telegramUserId: row.telegram_user_id,
    taxYear: row.tax_year,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToInterval(row: PresenceRow): PresenceInterval {
  return {
    id: row.id,
    countryIso2: row.country_iso2.toUpperCase(),
    startDate: row.start_date,
    endDate: row.end_date,
    source: row.source as PresenceSource,
    note: row.note,
  };
}

export async function ensureLedger(telegramUserId: number, taxYear: number): Promise<TaxLedger> {
  const supabase = createAdminClient();
  const { data: existing, error: selectError } = await supabase
    .from("emigro_tax_ledgers")
    .select("id, telegram_user_id, tax_year, created_at, updated_at")
    .eq("telegram_user_id", telegramUserId)
    .eq("tax_year", taxYear)
    .maybeSingle();

  if (selectError) {
    throw new Error(`ensureLedger select failed: ${selectError.message}`);
  }
  if (existing) return rowToLedger(existing as LedgerRow);

  const { data: inserted, error: insertError } = await supabase
    .from("emigro_tax_ledgers")
    .insert({ telegram_user_id: telegramUserId, tax_year: taxYear })
    .select("id, telegram_user_id, tax_year, created_at, updated_at")
    .single();

  if (insertError || !inserted) {
    throw new Error(`ensureLedger insert failed: ${insertError?.message ?? "no row"}`);
  }
  return rowToLedger(inserted as LedgerRow);
}

export async function listPresence(ledgerId: string): Promise<PresenceInterval[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_tax_presence")
    .select("id, ledger_id, country_iso2, start_date, end_date, source, note, created_at")
    .eq("ledger_id", ledgerId)
    .order("start_date", { ascending: true })
    .order("country_iso2", { ascending: true });

  if (error) {
    throw new Error(`listPresence failed: ${error.message}`);
  }
  return (data ?? []).map((row) => rowToInterval(row as PresenceRow));
}

export async function addPresence(
  ledgerId: string,
  intervals: PresenceInterval[]
): Promise<PresenceInterval[]> {
  if (intervals.length === 0) return [];

  const normalized = intervals.map(assertValidInterval);
  const supabase = createAdminClient();

  const rows = normalized.map((interval) => ({
    ledger_id: ledgerId,
    country_iso2: interval.countryIso2,
    start_date: interval.startDate,
    end_date: interval.endDate,
    source: interval.source,
    note: interval.note ?? null,
  }));

  const { data, error } = await supabase
    .from("emigro_tax_presence")
    .insert(rows)
    .select("id, ledger_id, country_iso2, start_date, end_date, source, note, created_at");

  if (error) {
    throw new Error(`addPresence failed: ${error.message}`);
  }

  const now = new Date().toISOString();
  const { error: touchError } = await supabase
    .from("emigro_tax_ledgers")
    .update({ updated_at: now })
    .eq("id", ledgerId);
  if (touchError) {
    console.warn("[tax-cockpit] ledger touch failed:", touchError.message);
  }

  return (data ?? []).map((row) => rowToInterval(row as PresenceRow));
}

export async function deletePresence(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("emigro_tax_presence").delete().eq("id", id);
  if (error) {
    throw new Error(`deletePresence failed: ${error.message}`);
  }
}

function sumDaysByCountry(intervals: PresenceInterval[], taxYear: number): CountryDayTotal[] {
  const grouped = new Map<string, PresenceInterval[]>();
  for (const interval of intervals) {
    const iso = canonicalIso2(interval.countryIso2);
    if (!iso) continue;
    const list = grouped.get(iso) ?? [];
    list.push(interval);
    grouped.set(iso, list);
  }

  const totals: CountryDayTotal[] = [];
  for (const [iso2, rows] of Array.from(grouped.entries())) {
    const pack = getPack(iso2);
    const rule = pack.dayRule ?? DEFAULT_DAY_RULE;
    const days = rows.reduce(
      (sum, interval) => sum + countDaysInYear(interval, taxYear, rule),
      0
    );
    totals.push({ iso2, days });
  }

  totals.sort((a, b) => b.days - a.days || a.iso2.localeCompare(b.iso2));
  return totals;
}

export async function daysByCountry(
  telegramUserId: number,
  taxYear: number
): Promise<CountryDayTotal[]> {
  const ledger = await ensureLedger(telegramUserId, taxYear);
  const intervals = await listPresence(ledger.id);
  return sumDaysByCountry(intervals, taxYear);
}
