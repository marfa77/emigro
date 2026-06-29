/**
 * Production wizard verification matrix — read-only against live API.
 * Usage: tsx scripts/prod-wizard-matrix.ts [baseUrl]
 */
const BASE = process.argv[2] ?? "https://www.emigro.online";

type Outcome = "likely_eligible" | "needs_review" | "unlikely";

type EvalResult = {
  programSlug: string;
  programTitleRu?: string;
  outcome: Outcome;
  score: number;
  reasons: string[];
  countrySegment?: string;
  corridorSlug?: string;
};

type HubPayload = {
  results: EvalResult[];
  pick: EvalResult | null;
  byCountry?: Array<{ corridorSlug: string; matches: EvalResult[] }>;
};

type Scenario = {
  id: string;
  scope: "hub" | { corridor: string };
  answers: Record<string, unknown>;
  expect: {
    programSlug?: string;
    minOutcome?: Outcome;
    outcome?: Outcome;
    mustNotReason?: RegExp[];
    mustReason?: RegExp[];
    pickContains?: string;
    familyFacts?: Record<string, "yes" | "no">;
  };
};

const OUTCOME_RANK: Record<Outcome, number> = {
  likely_eligible: 3,
  needs_review: 2,
  unlikely: 1,
};

const CORRIDORS = [
  "ru-speaking-to-portugal",
  "ru-speaking-to-spain",
  "ru-speaking-to-poland",
  "ru-speaking-to-czechia",
  "ru-speaking-to-austria",
  "ru-speaking-to-germany",
  "ru-speaking-to-netherlands",
] as const;

const wizardIdCache = new Map<string, string>();

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(120_000) });
  const body = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(`${url} → ${res.status}: ${body.error ?? res.statusText}`);
  return body;
}

async function getCorridorWizardId(corridorSlug: string): Promise<string> {
  const cached = wizardIdCache.get(corridorSlug);
  if (cached) return cached;
  const wizard = await fetchJson<{ id: string }>(`${BASE}/api/v1/corridors/${corridorSlug}/wizard`);
  wizardIdCache.set(corridorSlug, wizard.id);
  return wizard.id;
}

async function runHub(answers: Record<string, unknown>): Promise<HubPayload> {
  const session = await fetchJson<{ id: string }>(`${BASE}/api/v1/hub/wizard/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  return fetchJson<HubPayload>(`${BASE}/api/v1/hub/wizard/sessions/${session.id}/evaluate`, {
    method: "POST",
  });
}

async function runCorridor(
  corridorSlug: string,
  answers: Record<string, unknown>
): Promise<EvalResult[]> {
  const wizardId = await getCorridorWizardId(corridorSlug);
  const session = await fetchJson<{ id: string }>(
    `${BASE}/api/v1/corridors/${corridorSlug}/wizard/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wizard_id: wizardId, answers }),
    }
  );
  const payload = await fetchJson<{ results: EvalResult[] }>(
    `${BASE}/api/v1/corridors/${corridorSlug}/wizard/sessions/${session.id}/evaluate`,
    { method: "POST" }
  );
  return payload.results;
}

function findProgram(results: EvalResult[], slug: string): EvalResult | undefined {
  return results.find((r) => r.programSlug === slug);
}

function hasBadNotConfirmed(reasons: string[]): boolean {
  return reasons.some((r) => /не подтверждено/i.test(r));
}

function hasNeutralInsurance(reasons: string[]): boolean {
  return reasons.some(
    (r) =>
      /медстрахов|страхов/i.test(r) &&
      (/подготовить|оформить|следующем этапе/i.test(r) || !/не подтверждено/i.test(r))
  );
}

const scenarios: Scenario[] = [
  // ── Critical user-reported bugs ──
  {
    id: "crit-spain-dnv-3500-hub",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "residency",
      remote_income: "yes",
      monthly_income_eur: 3500,
    },
    expect: {
      programSlug: "spain-digital-nomad",
      outcome: "likely_eligible",
      mustNotReason: [/доход.*не подтверждено/i, /удал.*не подтверждено/i, /указано €0/i],
    },
  },
  {
    id: "crit-spain-dnv-3500-corridor",
    scope: { corridor: "ru-speaking-to-spain" },
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
      monthly_income_eur: 3500,
    },
    expect: {
      programSlug: "spain-digital-nomad",
      outcome: "likely_eligible",
      mustNotReason: [/доход.*не подтверждено/i, /удал.*не подтверждено/i],
    },
  },
  {
    id: "crit-spain-dnv-insurance-neutral",
    scope: { corridor: "ru-speaking-to-spain" },
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
      monthly_income_eur: 3500,
    },
    expect: {
      programSlug: "spain-digital-nomad",
      mustNotReason: [/медстрахов.*не подтверждено/i, /страхов.*не подтверждено/i],
    },
  },
  {
    id: "crit-job-offer-annual-only-hub",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "residency",
      remote_income: "no",
      has_job_offer: "yes",
      annual_salary_eur: 60_000,
    },
    expect: {
      minOutcome: "likely_eligible",
      mustNotReason: [/зарплат.*не подтверждено/i, /доход.*указано €0/i],
      pickContains: "germany",
    },
  },
  {
    id: "crit-family-pl-cz-at-hub",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "residency",
      family_countries: ["PL", "CZ", "AT"],
    },
    expect: {
      familyFacts: { has_family_in_pl: "yes", has_family_in_cz: "yes", has_family_in_at: "yes" },
    },
  },

  // ── Passport matrix ──
  ...(["RU", "BY", "UA"] as const).flatMap((passport) => [
    {
      id: `passport-${passport}-remote-high`,
      scope: "hub" as const,
      answers: {
        passport_iso2: passport,
        relocation_goal: "residency",
        remote_income: "yes",
        monthly_income_eur: 5000,
      },
      expect: { minOutcome: "needs_review" as Outcome },
    },
    {
      id: `passport-${passport}-passive`,
      scope: "hub" as const,
      answers: {
        passport_iso2: passport,
        relocation_goal: "residency",
        remote_income: "no",
        passive_income_eur: 3000,
        savings_eur: 50_000,
      },
      expect: { minOutcome: "needs_review" as Outcome },
    },
  ]),

  // ── Goal variants ──
  {
    id: "goal-study-admission",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "study",
      wants_study_route: "yes",
      has_university_admission: "yes",
      study_budget_eur: 15_000,
      can_show_study_funds: "yes",
    },
    expect: { minOutcome: "needs_review", pickContains: "study" },
  },
  {
    id: "goal-invest-high",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "citizenship",
      willing_to_invest_eur: 500_000,
    },
    expect: { minOutcome: "needs_review" },
  },
  {
    id: "goal-fast-remote",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      relocation_goal: "fast",
      remote_income: "yes",
      monthly_income_eur: 4500,
    },
    expect: { minOutcome: "likely_eligible" },
  },

  // ── Income variants ──
  {
    id: "income-remote-low",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
      monthly_income_eur: 1500,
    },
    expect: {
      programSlug: "spain-digital-nomad",
      outcome: "unlikely",
    },
  },
  {
    id: "income-remote-no-monthly",
    scope: { corridor: "ru-speaking-to-spain" },
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
    },
    expect: {
      programSlug: "spain-digital-nomad",
      mustNotReason: [/не подтверждено.*€0/i],
    },
  },

  // ── Family / household ──
  {
    id: "family-spouse-2kids",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
      monthly_income_eur: 6000,
      relocating_with_spouse: "yes",
      relocating_children_count: 2,
    },
    expect: { minOutcome: "likely_eligible" },
  },
  {
    id: "family-reunification-es",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      family_countries: ["ES"],
    },
    expect: {
      programSlug: "spain-family-reunification",
      minOutcome: "needs_review",
    },
  },
  {
    id: "family-reunification-de",
    scope: "hub",
    answers: {
      passport_iso2: "RU",
      family_countries: ["DE"],
    },
    expect: { minOutcome: "needs_review" },
  },

  // ── Per-corridor remote nomad checks ──
  ...CORRIDORS.map((corridor) => ({
    id: `corridor-${corridor.replace("ru-speaking-to-", "")}-remote-4k`,
    scope: { corridor } as { corridor: string },
    answers: {
      passport_iso2: "RU",
      remote_income: "yes",
      monthly_income_eur: 4000,
    },
    expect: { minOutcome: "needs_review" as Outcome },
  })),

  // ── Corridor job offer ──
  {
    id: "corridor-germany-job-offer",
    scope: { corridor: "ru-speaking-to-germany" },
    answers: {
      passport_iso2: "RU",
      has_job_offer: "yes",
      annual_salary_eur: 55_000,
    },
    expect: { minOutcome: "likely_eligible" },
  },
  {
    id: "corridor-poland-family-facts",
    scope: { corridor: "ru-speaking-to-poland" },
    answers: {
      passport_iso2: "RU",
      family_countries: ["PL"],
    },
    expect: { minOutcome: "needs_review" },
  },
];

type Verdict = "pass" | "fail" | "suspicious";

type ResultRow = {
  id: string;
  scope: string;
  verdict: Verdict;
  detail: string;
  program?: string;
  outcome?: Outcome;
  pick?: string;
  reasons?: string[];
  inputs: Record<string, unknown>;
};

async function evaluateScenario(scenario: Scenario): Promise<ResultRow> {
  const scopeLabel =
    scenario.scope === "hub" ? "hub" : scenario.scope.corridor;

  try {
    let results: EvalResult[];
    let pick: EvalResult | null = null;
    let hubPayload: HubPayload | null = null;

    if (scenario.scope === "hub") {
      hubPayload = await runHub(scenario.answers);
      results = hubPayload.results;
      pick = hubPayload.pick;
    } else {
      results = await runCorridor(scenario.scope.corridor, scenario.answers);
    }

    const exp = scenario.expect;
    const target = exp.programSlug ? findProgram(results, exp.programSlug) : results[0];
    const issues: string[] = [];

    // Family facts check (hub only — inspect returned answers via session side-effect)
    if (exp.familyFacts && hubPayload) {
      // Re-evaluate locally isn't possible on prod; check program outcomes for family routes
      for (const [key, val] of Object.entries(exp.familyFacts)) {
        const country = key.replace("has_family_in_", "").toUpperCase();
        const familyPrograms = results.filter(
          (r) =>
            r.programSlug.includes("family") &&
            (r.corridorSlug?.includes(country.toLowerCase()) ||
              r.countrySegment === country.toLowerCase() ||
              r.programSlug.includes(country.toLowerCase()))
        );
        if (val === "yes" && familyPrograms.length === 0) {
          issues.push(`Expected family programs for ${country}, found none`);
        }
      }
      // Also verify PL/CZ/AT family routes appear in matches
      const plMatch = results.find(
        (r) =>
          r.outcome !== "unlikely" &&
          (r.corridorSlug === "ru-speaking-to-poland" ||
            r.programSlug.includes("poland") ||
            r.programSlug.includes("family"))
      );
      if (exp.familyFacts.has_family_in_pl === "yes" && !plMatch) {
        issues.push("No non-unlikely match for PL family context");
      }
    }

    if (exp.programSlug && !target) {
      issues.push(`Program ${exp.programSlug} not found in results (${results.length} programs)`);
    }

    if (target && exp.outcome && target.outcome !== exp.outcome) {
      issues.push(`Expected outcome ${exp.outcome}, got ${target.outcome}`);
    }

    if (target && exp.minOutcome) {
      if (OUTCOME_RANK[target.outcome] < OUTCOME_RANK[exp.minOutcome]) {
        issues.push(
          `Expected min outcome ${exp.minOutcome}, got ${target.outcome} for ${exp.programSlug ?? target.programSlug}`
        );
      }
    }

    if (!exp.programSlug && exp.minOutcome) {
      const best = results.reduce(
        (a, b) => (OUTCOME_RANK[a.outcome] >= OUTCOME_RANK[b.outcome] ? a : b),
        results[0]
      );
      if (best && OUTCOME_RANK[best.outcome] < OUTCOME_RANK[exp.minOutcome]) {
        issues.push(`Best outcome ${best.outcome} below min ${exp.minOutcome}`);
      }
    }

    const reasonSource = target?.reasons ?? results.flatMap((r) => r.reasons);

    for (const re of exp.mustNotReason ?? []) {
      const hit = reasonSource.filter((r) => re.test(r));
      if (hit.length) issues.push(`Forbidden reason matched: ${hit[0]}`);
    }

    for (const re of exp.mustReason ?? []) {
      if (!reasonSource.some((r) => re.test(r))) {
        issues.push(`Expected reason not found: ${re}`);
      }
    }

    if (exp.pickContains && pick) {
      const slug = `${pick.countrySegment ?? ""} ${pick.programSlug} ${pick.programTitleRu ?? ""}`.toLowerCase();
      if (!slug.includes(exp.pickContains.toLowerCase())) {
        issues.push(`Pick "${pick.programSlug}" does not contain "${exp.pickContains}"`);
      }
    }

    // Suspicious: any "не подтверждено" on answered income fields
    const answeredIncome =
      scenario.answers.monthly_income_eur ||
      scenario.answers.annual_salary_eur ||
      scenario.answers.passive_income_eur;
    if (
      answeredIncome &&
      hasBadNotConfirmed(reasonSource) &&
      !issues.length
    ) {
      return {
        id: scenario.id,
        scope: scopeLabel,
        verdict: "suspicious",
        detail: `"не подтверждено" despite income provided`,
        program: target?.programSlug,
        outcome: target?.outcome,
        pick: pick?.programSlug,
        reasons: reasonSource.slice(0, 5),
        inputs: scenario.answers,
      };
    }

    const verdict: Verdict = issues.length ? "fail" : "pass";
    return {
      id: scenario.id,
      scope: scopeLabel,
      verdict,
      detail: issues.join("; ") || "OK",
      program: target?.programSlug ?? results[0]?.programSlug,
      outcome: target?.outcome ?? results[0]?.outcome,
      pick: pick?.programSlug,
      reasons: target?.reasons?.slice(0, 4),
      inputs: scenario.answers,
    };
  } catch (e) {
    return {
      id: scenario.id,
      scope: scopeLabel,
      verdict: "fail",
      detail: e instanceof Error ? e.message : String(e),
      inputs: scenario.answers,
    };
  }
}

async function main() {
  console.log(`\n=== Emigro Production Wizard Matrix ===`);
  console.log(`Base: ${BASE}`);
  console.log(`Scenarios: ${scenarios.length}\n`);

  const rows: ResultRow[] = [];
  for (const scenario of scenarios) {
    process.stdout.write(`  ${scenario.id}...`);
    const row = await evaluateScenario(scenario);
    rows.push(row);
    console.log(` ${row.verdict}`);
  }

  const passed = rows.filter((r) => r.verdict === "pass");
  const failed = rows.filter((r) => r.verdict === "fail");
  const suspicious = rows.filter((r) => r.verdict === "suspicious");

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total: ${rows.length} | Pass: ${passed.length} | Fail: ${failed.length} | Suspicious: ${suspicious.length}`);

  if (failed.length) {
    console.log(`\n=== FAILURES ===`);
    for (const r of failed) {
      console.log(`\n[${r.id}] (${r.scope})`);
      console.log(`  ${r.detail}`);
      console.log(`  inputs: ${JSON.stringify(r.inputs)}`);
      if (r.program) console.log(`  program: ${r.program} → ${r.outcome}`);
      if (r.reasons?.length) console.log(`  reasons: ${r.reasons.join(" | ")}`);
    }
  }

  if (suspicious.length) {
    console.log(`\n=== SUSPICIOUS ===`);
    for (const r of suspicious) {
      console.log(`\n[${r.id}] ${r.detail}`);
      console.log(`  reasons: ${r.reasons?.join(" | ")}`);
    }
  }

  // Spot-check: count programs with mass "не подтверждено" on hub baseline
  console.log(`\n=== SYSTEMIC CHECK: hub baseline remote 3500 ===`);
  const baseline = await runHub({
    passport_iso2: "RU",
    relocation_goal: "residency",
    remote_income: "yes",
    monthly_income_eur: 3500,
  });
  const notConfirmedCount = baseline.results.filter((r) =>
    r.reasons.some((reason) => /не подтверждено/i.test(reason))
  ).length;
  const unlikelyCount = baseline.results.filter((r) => r.outcome === "unlikely").length;
  const likelyCount = baseline.results.filter((r) => r.outcome === "likely_eligible").length;
  console.log(`Programs: ${baseline.results.length} | likely: ${likelyCount} | unlikely: ${unlikelyCount} | with "не подтверждено": ${notConfirmedCount}`);
  console.log(`Pick: ${baseline.pick?.countrySegment}/${baseline.pick?.programSlug} (${baseline.pick?.outcome})`);

  const spainDnv = findProgram(baseline.results, "spain-digital-nomad");
  if (spainDnv) {
    console.log(`Spain DNV: ${spainDnv.outcome} — ${spainDnv.reasons.join("; ")}`);
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
