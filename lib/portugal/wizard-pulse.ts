import { getCorridorBySlug } from "@/lib/corridor/queries";
import { PORTUGAL_CORRIDOR_SLUG, PORTUGAL_URL_SEGMENT } from "@/lib/portugal/hub";
import { createServerClient } from "@/lib/supabase/server";

export const PORTUGAL_PULSE_MIN_TOTAL = 10;
export const PORTUGAL_PULSE_MIN_BUCKET = 5;
export const PORTUGAL_PULSE_DAYS = 30;

const PASSPORT_LABELS: Record<string, string> = {
  RU: "Россия",
  BY: "Беларусь",
  UA: "Украина",
  KZ: "Казахстан",
};

export type PulseShare = {
  label: string;
  count: number;
  share: number;
};

export type PortugalWizardPulse = {
  periodDays: number;
  totalChecks: number;
  topPrograms: PulseShare[];
  topPassports: PulseShare[];
  remoteIncomeShare: number | null;
};

type HubSessionRow = {
  passport_iso2: string | null;
  results: {
    pick?: { countrySegment?: string; programTitleRu?: string } | null;
    hasRemoteIncome?: boolean;
  } | null;
  answers: Record<string, unknown> | null;
};

type CorridorSessionRow = {
  id: string;
  passport_iso2: string | null;
  answers: Record<string, unknown> | null;
};

type EligibilityRow = {
  session_id: string;
  outcome: string;
  score: number | null;
  emigro_programs: { title_ru: string } | { title_ru: string }[] | null;
};

function sinceIso(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function increment(map: Map<string, number>, key: string, delta = 1) {
  map.set(key, (map.get(key) ?? 0) + delta);
}

function passportLabel(iso2: string | null | undefined): string | null {
  if (!iso2) return null;
  const code = iso2.toUpperCase();
  return PASSPORT_LABELS[code] ?? null;
}

function hasRemoteIncome(answers: Record<string, unknown> | null, fromResults?: boolean): boolean {
  if (fromResults) return true;
  return answers?.remote_income === "yes";
}

function toShares(map: Map<string, number>, total: number, minBucket: number, limit = 3): PulseShare[] {
  return Array.from(map.entries())
    .filter(([, count]) => count >= minBucket)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      share: Math.round((count / total) * 100),
    }));
}

function programTitleFromEligibility(row: EligibilityRow): string | null {
  const program = row.emigro_programs;
  if (!program) return null;
  if (Array.isArray(program)) return program[0]?.title_ru ?? null;
  return program.title_ru ?? null;
}

/** Anonymous aggregate wizard trends for Portugal Hub. Returns null when volume is too low. */
export async function getPortugalWizardPulse(): Promise<PortugalWizardPulse | null> {
  try {
    const supabase = createServerClient();
    const corridor = await getCorridorBySlug(PORTUGAL_CORRIDOR_SLUG);
    if (!corridor) return null;

    const since = sinceIso(PORTUGAL_PULSE_DAYS);

    const [hubRes, corridorSessionsRes] = await Promise.all([
      supabase
        .from("emigro_hub_wizard_sessions")
        .select("passport_iso2, results, answers")
        .not("completed_at", "is", null)
        .gte("completed_at", since),
      supabase
        .from("emigro_wizard_sessions")
        .select("id, passport_iso2, answers")
        .eq("corridor_id", corridor.id)
        .not("completed_at", "is", null)
        .gte("completed_at", since),
    ]);

    if (hubRes.error || corridorSessionsRes.error) return null;

    const hubSessions = (hubRes.data ?? []) as HubSessionRow[];
    const corridorSessions = (corridorSessionsRes.data ?? []) as CorridorSessionRow[];

    const portugalHubSessions = hubSessions.filter(
      (s) => s.results?.pick?.countrySegment === PORTUGAL_URL_SEGMENT
    );

    const sessionIds = corridorSessions.map((s) => s.id);
    let eligibilityRows: EligibilityRow[] = [];

    if (sessionIds.length > 0) {
      const { data, error } = await supabase
        .from("emigro_eligibility_results")
        .select("session_id, outcome, score, emigro_programs(title_ru)")
        .in("session_id", sessionIds)
        .neq("outcome", "unlikely");

      if (error) return null;
      eligibilityRows = (data ?? []) as EligibilityRow[];
    }

    const totalChecks = portugalHubSessions.length + corridorSessions.length;
    if (totalChecks < PORTUGAL_PULSE_MIN_TOTAL) return null;

    const programCounts = new Map<string, number>();
    const passportCounts = new Map<string, number>();
    let remoteIncomeCount = 0;

    for (const session of portugalHubSessions) {
      const pickTitle = session.results?.pick?.programTitleRu?.trim();
      if (pickTitle) increment(programCounts, pickTitle);

      const passport = passportLabel(session.passport_iso2);
      if (passport) increment(passportCounts, passport);

      if (hasRemoteIncome(session.answers, session.results?.hasRemoteIncome)) {
        remoteIncomeCount += 1;
      }
    }

    for (const session of corridorSessions) {
      const passport = passportLabel(session.passport_iso2);
      if (passport) increment(passportCounts, passport);

      if (hasRemoteIncome(session.answers)) {
        remoteIncomeCount += 1;
      }
    }

    const bestBySession = new Map<string, EligibilityRow>();
    for (const row of eligibilityRows) {
      const current = bestBySession.get(row.session_id);
      const score = row.score ?? 0;
      if (!current || score > (current.score ?? 0)) {
        bestBySession.set(row.session_id, row);
      }
    }

    for (const row of Array.from(bestBySession.values())) {
      const title = programTitleFromEligibility(row);
      if (title) increment(programCounts, title);
    }

    const topPrograms = toShares(programCounts, totalChecks, PORTUGAL_PULSE_MIN_BUCKET);
    const topPassports = toShares(passportCounts, totalChecks, PORTUGAL_PULSE_MIN_BUCKET);

    const remoteIncomeShare =
      remoteIncomeCount >= PORTUGAL_PULSE_MIN_BUCKET
        ? Math.round((remoteIncomeCount / totalChecks) * 100)
        : null;

    if (topPrograms.length === 0 && topPassports.length === 0 && remoteIncomeShare === null) {
      return null;
    }

    return {
      periodDays: PORTUGAL_PULSE_DAYS,
      totalChecks,
      topPrograms,
      topPassports,
      remoteIncomeShare,
    };
  } catch {
    return null;
  }
}
