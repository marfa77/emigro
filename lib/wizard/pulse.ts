import { getActiveNewsTopics } from "@/lib/news/topics";
import { PORTUGAL_CORRIDOR_SLUG, PORTUGAL_URL_SEGMENT } from "@/lib/portugal/hub";
import { createServerClient } from "@/lib/supabase/server";

export const WIZARD_PULSE_MIN_TOTAL = 10;
export const WIZARD_PULSE_MIN_BUCKET = 5;
export const WIZARD_PULSE_DAYS = 30;

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

export type GlobalWizardPulse = {
  periodDays: number;
  totalChecks: number;
  hubChecks: number;
  corridorChecks: number;
  topCountries: PulseShare[];
  topPassports: PulseShare[];
  remoteIncomeShare: number | null;
};

export type PortugalWizardPulse = GlobalWizardPulse & {
  portugalChecks: number;
  topPortugalPrograms: PulseShare[];
};

type HubSessionRow = {
  passport_iso2: string | null;
  results: {
    pick?: {
      countrySegment?: string;
      countryRu?: string;
      programTitleRu?: string;
    } | null;
    hasRemoteIncome?: boolean;
  } | null;
  answers: Record<string, unknown> | null;
};

type CorridorSessionRow = {
  id: string;
  passport_iso2: string | null;
  answers: Record<string, unknown> | null;
  corridor_id: string;
  emigro_corridors: { slug: string; title_ru: string } | { slug: string; title_ru: string }[] | null;
};

type EligibilityRow = {
  session_id: string;
  outcome: string;
  score: number | null;
  emigro_programs: { title_ru: string } | { title_ru: string }[] | null;
};

type PulseData = {
  hubSessions: HubSessionRow[];
  corridorSessions: CorridorSessionRow[];
  eligibilityBySessionId: Map<string, EligibilityRow>;
  portugalCorridorId: string | null;
  countryByCorridorSlug: Map<string, string>;
  countryByUrlSegment: Map<string, string>;
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
  if (total <= 0) return [];
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

function corridorSlugFromRow(row: CorridorSessionRow): string | null {
  const corridor = row.emigro_corridors;
  if (!corridor) return null;
  if (Array.isArray(corridor)) return corridor[0]?.slug ?? null;
  return corridor.slug ?? null;
}

function programTitleFromEligibility(row: EligibilityRow): string | null {
  const program = row.emigro_programs;
  if (!program) return null;
  if (Array.isArray(program)) return program[0]?.title_ru ?? null;
  return program.title_ru ?? null;
}

function hubCountryLabel(
  session: HubSessionRow,
  countryByUrlSegment: Map<string, string>
): string | null {
  const pick = session.results?.pick;
  if (!pick) return null;
  if (pick.countryRu?.trim()) return pick.countryRu.trim();
  const segment = pick.countrySegment?.trim();
  if (segment) return countryByUrlSegment.get(segment) ?? null;
  return null;
}

function bestEligibilityRows(rows: EligibilityRow[]): EligibilityRow[] {
  const bestBySession = new Map<string, EligibilityRow>();
  for (const row of rows) {
    const current = bestBySession.get(row.session_id);
    const score = row.score ?? 0;
    if (!current || score > (current.score ?? 0)) {
      bestBySession.set(row.session_id, row);
    }
  }
  return Array.from(bestBySession.values());
}

async function loadPulseData(): Promise<PulseData | null> {
  try {
    const supabase = createServerClient();
    const topics = await getActiveNewsTopics();
    const since = sinceIso(WIZARD_PULSE_DAYS);

    const countryByCorridorSlug = new Map<string, string>();
    const countryByUrlSegment = new Map<string, string>();
    let portugalCorridorId: string | null = null;

    for (const topic of topics) {
      countryByUrlSegment.set(topic.urlSegment, topic.countryRu);
      if (topic.corridorSlug) {
        countryByCorridorSlug.set(topic.corridorSlug, topic.countryRu);
      }
    }

    const { data: portugalCorridor } = await supabase
      .from("emigro_corridors")
      .select("id")
      .eq("slug", PORTUGAL_CORRIDOR_SLUG)
      .maybeSingle();

    portugalCorridorId = portugalCorridor?.id ?? null;

    const [hubRes, corridorRes] = await Promise.all([
      supabase
        .from("emigro_hub_wizard_sessions")
        .select("passport_iso2, results, answers")
        .not("completed_at", "is", null)
        .gte("completed_at", since),
      supabase
        .from("emigro_wizard_sessions")
        .select("id, passport_iso2, answers, corridor_id, emigro_corridors(slug, title_ru)")
        .not("completed_at", "is", null)
        .gte("completed_at", since),
    ]);

    if (hubRes.error || corridorRes.error) return null;

    const corridorSessions = (corridorRes.data ?? []) as CorridorSessionRow[];
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

    const eligibilityBySessionId = new Map<string, EligibilityRow>();
    for (const row of bestEligibilityRows(eligibilityRows)) {
      eligibilityBySessionId.set(row.session_id, row);
    }

    return {
      hubSessions: (hubRes.data ?? []) as HubSessionRow[],
      corridorSessions,
      eligibilityBySessionId,
      portugalCorridorId,
      countryByCorridorSlug,
      countryByUrlSegment,
    };
  } catch {
    return null;
  }
}

function buildGlobalPulse(data: PulseData): GlobalWizardPulse | null {
  const { hubSessions, corridorSessions } = data;
  const totalChecks = hubSessions.length + corridorSessions.length;
  if (totalChecks < WIZARD_PULSE_MIN_TOTAL) return null;

  const countryCounts = new Map<string, number>();
  const passportCounts = new Map<string, number>();
  let remoteIncomeCount = 0;

  for (const session of hubSessions) {
    const country = hubCountryLabel(session, data.countryByUrlSegment);
    if (country) increment(countryCounts, country);

    const passport = passportLabel(session.passport_iso2);
    if (passport) increment(passportCounts, passport);

    if (hasRemoteIncome(session.answers, session.results?.hasRemoteIncome)) {
      remoteIncomeCount += 1;
    }
  }

  for (const session of corridorSessions) {
    const slug = corridorSlugFromRow(session);
    const country = slug ? data.countryByCorridorSlug.get(slug) : null;
    if (country) increment(countryCounts, country);

    const passport = passportLabel(session.passport_iso2);
    if (passport) increment(passportCounts, passport);

    if (hasRemoteIncome(session.answers)) {
      remoteIncomeCount += 1;
    }
  }

  const topCountries = toShares(countryCounts, totalChecks, WIZARD_PULSE_MIN_BUCKET);
  const topPassports = toShares(passportCounts, totalChecks, WIZARD_PULSE_MIN_BUCKET);
  const remoteIncomeShare =
    remoteIncomeCount >= WIZARD_PULSE_MIN_BUCKET
      ? Math.round((remoteIncomeCount / totalChecks) * 100)
      : null;

  if (topCountries.length === 0 && topPassports.length === 0 && remoteIncomeShare === null) {
    return null;
  }

  return {
    periodDays: WIZARD_PULSE_DAYS,
    totalChecks,
    hubChecks: hubSessions.length,
    corridorChecks: corridorSessions.length,
    topCountries,
    topPassports,
    remoteIncomeShare,
  };
}

/** All corridors + hub wizard — for homepage and global context. */
export async function getGlobalWizardPulse(): Promise<GlobalWizardPulse | null> {
  const data = await loadPulseData();
  if (!data) return null;
  return buildGlobalPulse(data);
}

/** Global trends plus Portugal program breakdown for Portugal Hub. */
export async function getPortugalWizardPulse(): Promise<PortugalWizardPulse | null> {
  const data = await loadPulseData();
  if (!data) return null;

  const global = buildGlobalPulse(data);
  if (!global) return null;

  const portugalCorridorSessions = data.portugalCorridorId
    ? data.corridorSessions.filter((s) => s.corridor_id === data.portugalCorridorId)
    : [];

  const portugalHubSessions = data.hubSessions.filter(
    (s) => s.results?.pick?.countrySegment === PORTUGAL_URL_SEGMENT
  );

  const portugalChecks = portugalHubSessions.length + portugalCorridorSessions.length;
  const programCounts = new Map<string, number>();

  for (const session of portugalHubSessions) {
    const title = session.results?.pick?.programTitleRu?.trim();
    if (title) increment(programCounts, title);
  }

  for (const session of portugalCorridorSessions) {
    const row = data.eligibilityBySessionId.get(session.id);
    const title = row ? programTitleFromEligibility(row) : null;
    if (title) increment(programCounts, title);
  }

  const topPortugalPrograms =
    portugalChecks >= WIZARD_PULSE_MIN_BUCKET
      ? toShares(programCounts, portugalChecks, WIZARD_PULSE_MIN_BUCKET)
      : [];

  return {
    ...global,
    portugalChecks,
    topPortugalPrograms,
  };
}
