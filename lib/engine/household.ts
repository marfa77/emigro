import type { EvaluationResult, OutcomeCode } from "@/lib/engine/evaluator";

export type HouseholdProfile = {
  spouse: boolean;
  children: number;
  parents: number;
  /** Primary applicant + relocating dependants */
  size: number;
  adultDependants: number;
};

export type HouseholdSummary = {
  profile: HouseholdProfile;
  labelRu: string;
  isSolo: boolean;
};

/** Solo income/savings bases used after JSON Logic (2026 indicative). */
type ThresholdSpec = {
  field: "monthly_income_eur" | "passive_income_eur" | "annual_salary_eur" | "savings_eur";
  solo: number;
  adultAddon: number;
  childAddon: number;
  labelRu: string;
  savingsAlt?: {
    field: "savings_eur";
    solo: number;
    adultAddon: number;
    childAddon: number;
    labelRu: string;
  };
};

const INCOME_THRESHOLDS: Record<string, ThresholdSpec> = {
  "portugal-d8-digital-nomad": {
    field: "monthly_income_eur",
    solo: 3040,
    adultAddon: 760,
    childAddon: 380,
    labelRu: "месячный доход D8",
  },
  "portugal-d7-passive-income": {
    field: "passive_income_eur",
    solo: 760,
    adultAddon: 380,
    childAddon: 230,
    labelRu: "пассивный доход D7",
    savingsAlt: {
      field: "savings_eur",
      solo: 9120,
      adultAddon: 4560,
      childAddon: 2760,
      labelRu: "сбережения D7",
    },
  },
  "spain-digital-nomad": {
    field: "monthly_income_eur",
    solo: 2849,
    adultAddon: 950,
    childAddon: 475,
    labelRu: "месячный доход digital nomad",
  },
  "spain-non-lucrative": {
    field: "passive_income_eur",
    solo: 2400,
    adultAddon: 600,
    childAddon: 400,
    labelRu: "пассивный доход no lucrativa",
    savingsAlt: {
      field: "savings_eur",
      solo: 57600,
      adultAddon: 14400,
      childAddon: 9600,
      labelRu: "сбережения no lucrativa",
    },
  },
  "france-vls-ts-visiteur": {
    field: "passive_income_eur",
    solo: 1823,
    adultAddon: 600,
    childAddon: 350,
    labelRu: "средства visiteur",
    savingsAlt: {
      field: "savings_eur",
      solo: 21876,
      adultAddon: 7200,
      childAddon: 4200,
      labelRu: "сбережения visiteur",
    },
  },
  "italy-digital-nomad": {
    field: "monthly_income_eur",
    solo: 2334,
    adultAddon: 700,
    childAddon: 350,
    labelRu: "месячный доход digital nomad",
  },
  "italy-elective-residence": {
    field: "passive_income_eur",
    solo: 2583,
    adultAddon: 650,
    childAddon: 325,
    labelRu: "пассивный доход elective",
    savingsAlt: {
      field: "savings_eur",
      solo: 31000,
      adultAddon: 7800,
      childAddon: 3900,
      labelRu: "сбережения elective",
    },
  },
  "germany-chancenkarte": {
    field: "savings_eur",
    solo: 13092,
    adultAddon: 4000,
    childAddon: 2500,
    labelRu: "сбережения Chancenkarte",
  },
};

const FAMILY_REUNIFICATION_SLUG = "family-reunification";

const INVESTOR_PROGRAM_SLUGS = new Set([
  "portugal-golden-visa",
  "spain-residence-by-investment",
  "italy-investor-visa",
]);

function num(val: unknown): number {
  if (val === "" || val === null || val === undefined) return 0;
  if (typeof val === "number") return val;
  return Number(val) || 0;
}

export function parseHousehold(answers: Record<string, unknown>): HouseholdProfile {
  const spouse =
    answers.relocating_with_spouse === "yes" || answers.relocating_with_spouse === true;
  const children = Math.min(12, Math.max(0, Math.floor(num(answers.relocating_children_count))));
  const parents = Math.min(4, Math.max(0, Math.floor(num(answers.relocating_parents_count))));
  const adultDependants = (spouse ? 1 : 0) + parents;
  const size = 1 + adultDependants + children;

  return { spouse, children, parents, size, adultDependants };
}

export function describeHousehold(profile: HouseholdProfile): HouseholdSummary {
  if (profile.size <= 1) {
    return { profile, labelRu: "только вы", isSolo: true };
  }

  const parts: string[] = ["вы"];
  if (profile.spouse) parts.push("супруг(а)");
  if (profile.children > 0) {
    parts.push(`${profile.children} ${childWord(profile.children)}`);
  }
  if (profile.parents > 0) {
    parts.push(`${profile.parents} взросл. родственник(а)`);
  }

  return { profile, labelRu: parts.join(" + "), isSolo: false };
}

function childWord(n: number): string {
  if (n === 1) return "ребёнок";
  if (n >= 2 && n <= 4) return "ребёнка";
  return "детей";
}

export function householdRequiredAmount(
  spec: Pick<ThresholdSpec, "solo" | "adultAddon" | "childAddon">,
  profile: HouseholdProfile
): number {
  return (
    spec.solo +
    spec.adultAddon * profile.adultDependants +
    spec.childAddon * profile.children
  );
}

function worseOutcome(a: OutcomeCode, b: OutcomeCode): OutcomeCode {
  const rank: Record<OutcomeCode, number> = {
    likely_eligible: 0,
    needs_review: 1,
    unlikely: 2,
  };
  return rank[a] >= rank[b] ? a : b;
}

function outcomeScore(outcome: OutcomeCode): number {
  if (outcome === "likely_eligible") return 1;
  if (outcome === "needs_review") return 0.65;
  return 0.15;
}

/** Re-score income-based programs when dependants relocate together. */
export function adjustEvaluationForHousehold(
  programSlug: string,
  facts: Record<string, unknown>,
  base: EvaluationResult
): EvaluationResult {
  const profile = parseHousehold(facts);
  if (profile.size <= 1) return base;

  const reasons = [...base.reasons];

  if (programSlug.includes(FAMILY_REUNIFICATION_SLUG)) {
    return base;
  }

  if (profile.parents > 0) {
    reasons.push(
      "Родители/бабушки редко получают ВНЖ вместе с основным заявителем — обычно отдельное воссоединение или отказ"
    );
  }

  const spec = INCOME_THRESHOLDS[programSlug];
  if (!spec) {
    if (INVESTOR_PROGRAM_SLUGS.has(programSlug) && base.outcome === "likely_eligible") {
      return {
        ...base,
        reasons: [
          ...reasons,
          "Инвестиционные программы обычно включают супруга и детей в одну заявку",
        ],
      };
    }
    if (base.outcome === "likely_eligible") {
      return {
        ...base,
        outcome: worseOutcome(base.outcome, "needs_review"),
        score: 0.72,
        reasons: [
          ...reasons,
          `Семья из ${profile.size} чел. — уточните доп. требования к иждивенцам для этой программы`,
        ],
      };
    }
    return { ...base, reasons };
  }

  const required = householdRequiredAmount(spec, profile);
  const actual = num(facts[spec.field]);
  const savingsSpec = spec.savingsAlt;
  const savingsRequired = savingsSpec ? householdRequiredAmount(savingsSpec, profile) : 0;
  const savingsActual = savingsSpec ? num(facts[savingsSpec.field]) : 0;
  const meetsHousehold = actual >= required || (savingsSpec ? savingsActual >= savingsRequired : false);

  if (meetsHousehold) {
    const viaSavings = savingsSpec && savingsActual >= savingsRequired && actual < required;
    const nextReasons = [
      ...reasons.filter((r) => !/критерии|criteria/i.test(r)),
      viaSavings
        ? `Порог сбережений для семьи (${profile.size} чел.): ~€${Math.round(savingsRequired).toLocaleString("ru-RU")} (${savingsSpec!.labelRu})`
        : `Порог для семьи (${profile.size} чел.): ~€${Math.round(required).toLocaleString("ru-RU")} (${spec.labelRu})`,
      viaSavings
        ? "Сбережения покрывают семейный порог по ориентиру 2026"
        : "Доход покрывает семейный порог по ориентиру 2026",
    ];
    return {
      ...base,
      outcome: base.outcome === "unlikely" ? "needs_review" : base.outcome,
      score: Math.max(base.score, outcomeScore(base.outcome === "unlikely" ? "needs_review" : base.outcome)),
      reasons: nextReasons,
    };
  }

  const gap = Math.max(required - actual, savingsSpec ? savingsRequired - savingsActual : 0);
  const gapLabel = savingsSpec
    ? `доход ~€${Math.round(required).toLocaleString("ru-RU")} или сбережения ~€${Math.round(savingsRequired).toLocaleString("ru-RU")}`
    : `~€${Math.round(required).toLocaleString("ru-RU")} (${spec.labelRu})`;
  return {
    ...base,
    outcome: "unlikely",
    score: 0.12,
    reasons: [
      ...reasons,
      `Для семьи из ${profile.size} чел. нужно ${gapLabel}, у вас доход ~€${Math.round(actual).toLocaleString("ru-RU")}${savingsSpec ? `, сбережения ~€${Math.round(savingsActual).toLocaleString("ru-RU")}` : ""}`,
      `Не хватает ~€${Math.round(gap).toLocaleString("ru-RU")} — или рассмотрите поэтапный переезд (сначала основной заявитель)`,
    ],
  };
}

export function mergeHouseholdFacts(answers: Record<string, unknown>): Record<string, unknown> {
  const profile = parseHousehold(answers);
  return {
    ...answers,
    household_size: profile.size,
    relocating_with_spouse: profile.spouse ? "yes" : "no",
    relocating_children_count: profile.children,
    relocating_parents_count: profile.parents,
    relocating_with_family: profile.size > 1 ? "yes" : "no",
  };
}
