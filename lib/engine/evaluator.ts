import jsonLogic from "json-logic-js";
import { stripPassportConstraint } from "@/lib/engine/rule-utils";
import { HUB_WIZARD_MODULES } from "@/lib/wizard/hub-definition";

export type OutcomeCode = "likely_eligible" | "needs_review" | "unlikely";

export interface EvaluationResult {
  programId: string;
  programSlug: string;
  outcome: OutcomeCode;
  score: number;
  reasons: string[];
}

export type EvaluationRequirement = {
  requirementType?: string;
  labelRu: string;
  valueText?: string | null;
};

export type EvaluationOptions = {
  answeredKeys?: Iterable<string>;
};

const MAX_REASON_LENGTH = 150;

export function evaluateRule(
  rule: Record<string, unknown>,
  facts: Record<string, unknown>,
  programId?: string
): boolean {
  try {
    return Boolean(jsonLogic.apply(rule, facts));
  } catch (e) {
    console.error("[evaluator] rule error for program", programId, e);
    return false;
  }
}

export function evaluateProgram(
  programId: string,
  programSlug: string,
  rule: Record<string, unknown>,
  facts: Record<string, unknown>,
  passportStatus?: string,
  requirements: EvaluationRequirement[] = [],
  options: EvaluationOptions = {}
): EvaluationResult {
  const reasons: string[] = [];

  if (passportStatus === "ineligible") {
    return {
      programId,
      programSlug,
      outcome: "unlikely",
      score: 0,
      reasons: ["С этим паспортом маршрут обычно не открыт или требует другого основания для подачи."],
    };
  }

  if (passportStatus === "partial") {
    reasons.push(
      "Паспорт может подойти, но место подачи зависит от законного проживания и консульства. Это нужно проверить отдельно."
    );
  }

  const effectiveRule = stripPassportConstraint(rule, passportStatus);
  const passed = evaluateRule(effectiveRule, facts, programId);

  if (passed) {
    reasons.push("По вашим ответам основные базовые условия выглядят выполненными.");
    return {
      programId,
      programSlug,
      outcome: passportStatus === "partial" ? "needs_review" : "likely_eligible",
      score: passportStatus === "partial" ? 0.7 : 1,
      reasons,
    };
  }

  reasons.push(...failedRuleReasons(effectiveRule, facts, requirements, options));
  return {
    programId,
    programSlug,
    outcome: "unlikely",
    score: 0.2,
    reasons: reasons.map(capReason),
  };
}

const QUESTION_BY_KEY = new Map(
  HUB_WIZARD_MODULES.flatMap((module) => module.questions).map((question) => [
    question.question_key,
    question,
  ])
);

const YES_NO_LABELS: Record<string, string> = {
  yes: "Да",
  no: "Нет",
};

const FACT_COPY: Record<
  string,
  {
    label: string;
    unit?: string;
    requiredYes?: string;
  }
> = {
  passport_iso2: { label: "Паспорт" },
  remote_income: {
    label: "Удалённый доход",
    requiredYes: "нужен стабильный доход из-за рубежа",
  },
  monthly_income_eur: { label: "Доход", unit: "/мес" },
  has_job_offer: {
    label: "Оффер",
    requiredYes: "нужен подписанный оффер в стране назначения",
  },
  annual_salary_eur: { label: "Зарплата в оффере", unit: "/год" },
  passive_income_eur: { label: "Пассивный доход", unit: "/мес" },
  savings_eur: { label: "Сбережения" },
  willing_to_invest_eur: { label: "Инвестиционный капитал" },
  has_university_degree: {
    label: "Диплом",
    requiredYes: "нужен признаваемый диплом вуза",
  },
  wants_study_route: {
    label: "Учёба",
    requiredYes: "программа требует учебный маршрут",
  },
  has_university_admission: {
    label: "Зачисление",
    requiredYes: "нужна справка/offer от учебного заведения",
  },
  study_budget_eur: { label: "Средства на учёбу" },
  can_show_study_funds: {
    label: "Средства на учёбу",
    requiredYes: "нужно подтвердить источник средств",
  },
};

function failedRuleReasons(
  rule: Record<string, unknown>,
  facts: Record<string, unknown>,
  requirements: EvaluationRequirement[],
  options: EvaluationOptions
): string[] {
  const detailed = explainFailedNode(rule, facts, options);
  if (detailed.length > 0) return unique(detailed);

  const fallback = requirements
    .slice(0, 3)
    .map((requirement) => requirementReason(requirement, options));

  return (fallback.length > 0
    ? fallback
    : ["По вашим ответам программа не проходит базовую проверку. Сравните требования со страницей программы."]).map(capReason);
}

function explainFailedNode(
  node: unknown,
  facts: Record<string, unknown>,
  options: EvaluationOptions
): string[] {
  if (!node || typeof node !== "object") return [];
  const rule = node as Record<string, unknown>;

  if (Array.isArray(rule.and)) {
    return rule.and.flatMap((child) =>
      evaluateRuleObject(child, facts) ? [] : explainFailedNode(child, facts, options)
    );
  }

  if (Array.isArray(rule.or)) {
    if (evaluateRuleObject(rule, facts)) return [];
    const variants = rule.or.flatMap((child) => explainFailedNode(child, facts, options));
    if (variants.length <= 1) return variants;
    return [`Нужно выполнить один из вариантов: ${unique(variants).slice(0, 3).join("; ")}`];
  }

  const comparison = explainComparison(rule, facts, options);
  return comparison ? [comparison] : [];
}

function evaluateRuleObject(node: unknown, facts: Record<string, unknown>): boolean {
  if (!node || typeof node !== "object") return false;
  return evaluateRule(node as Record<string, unknown>, facts);
}

function explainComparison(
  rule: Record<string, unknown>,
  facts: Record<string, unknown>,
  options: EvaluationOptions
): string | null {
  const gte = rule[">="];
  if (Array.isArray(gte) && gte.length === 2) {
    const field = varName(gte[0]);
    const required = numberValue(gte[1]);
    if (!field || required === null) return null;
    return numericReason(field, facts[field], required, "от", options);
  }

  const gt = rule[">"];
  if (Array.isArray(gt) && gt.length === 2) {
    const field = varName(gt[0]);
    const required = numberValue(gt[1]);
    if (!field || required === null) return null;
    return numericReason(field, facts[field], required, "больше", options);
  }

  const lte = rule["<="];
  if (Array.isArray(lte) && lte.length === 2) {
    const field = varName(lte[0]);
    const max = numberValue(lte[1]);
    if (!field || max === null) return null;
    return numericMaxReason(field, facts[field], max, "не больше", options);
  }

  const lt = rule["<"];
  if (Array.isArray(lt) && lt.length === 2) {
    const field = varName(lt[0]);
    const max = numberValue(lt[1]);
    if (!field || max === null) return null;
    return numericMaxReason(field, facts[field], max, "меньше", options);
  }

  const eq = rule["=="];
  if (Array.isArray(eq) && eq.length === 2) {
    const field = varName(eq[0]);
    if (!field) return null;
    return equalityReason(field, facts[field], eq[1], options);
  }

  const notEq = rule["!="];
  if (Array.isArray(notEq) && notEq.length === 2) {
    const field = varName(notEq[0]);
    if (!field) return null;
    return notEqualityReason(field, facts[field], notEq[1], options);
  }

  const includes = rule.in;
  if (Array.isArray(includes) && includes.length === 2) {
    const field = varName(includes[0]);
    const allowed = Array.isArray(includes[1]) ? includes[1] : null;
    if (!field || !allowed) return null;
    return inReason(field, facts[field], allowed, options);
  }

  return null;
}

function varName(node: unknown): string | null {
  if (!node || typeof node !== "object") return null;
  const name = (node as { var?: unknown }).var;
  return typeof name === "string" ? name : null;
}

function numberValue(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function numericReason(
  field: string,
  actualValue: unknown,
  required: number,
  comparator = "от",
  options: EvaluationOptions = {}
): string {
  const copy = FACT_COPY[field];
  const label = copy?.label ?? fieldLabel(field);
  const unit = copy?.unit ?? "";
  if (!wasAnswered(field, options)) {
    return neutralRequirementCopy(label, `порог ${comparator} ${formatEuro(required)}${unit}`);
  }
  const actual = numberValue(actualValue) ?? 0;
  return capReason(`${label}: нужно ${comparator} ${formatEuro(required)}${unit}, указано ${formatEuro(actual)}${unit}`);
}

function numericMaxReason(
  field: string,
  actualValue: unknown,
  max: number,
  comparator = "не больше",
  options: EvaluationOptions = {}
): string {
  const copy = FACT_COPY[field];
  const label = copy?.label ?? fieldLabel(field);
  const unit = copy?.unit ?? "";
  if (!wasAnswered(field, options)) {
    return neutralRequirementCopy(label, `порог ${comparator} ${formatEuro(max)}${unit}`);
  }
  const actual = numberValue(actualValue) ?? 0;
  return capReason(`${label}: нужно ${comparator} ${formatEuro(max)}${unit}, указано ${formatEuro(actual)}${unit}`);
}

function equalityReason(
  field: string,
  actualValue: unknown,
  expected: unknown,
  options: EvaluationOptions
): string | null {
  if (!wasAnswered(field, options)) {
    const label = isFamilyFact(field) ? "Семья в стране" : (FACT_COPY[field]?.label ?? fieldLabel(field));
    return neutralRequirementCopy(label);
  }

  if (String(expected) === "yes" && isFamilyFact(field)) {
    return "Семья в стране: для этого маршрута нужна близкая связь с резидентом или гражданином, а в ответах она не указана.";
  }

  const copy = FACT_COPY[field];
  const label = copy?.label ?? fieldLabel(field);
  const actual = optionLabel(field, actualValue);

  if (String(expected) === "yes") {
    const requirement = copy?.requiredYes ?? "нужно значение «Да»";
    return capReason(`${label}: ${requirement}. Сейчас выбрано «${actual}»`);
  }

  return capReason(`${label}: нужно «${optionLabel(field, expected)}». Сейчас выбрано «${actual}»`);
}

function notEqualityReason(
  field: string,
  actualValue: unknown,
  blocked: unknown,
  options: EvaluationOptions
): string {
  const label = FACT_COPY[field]?.label ?? fieldLabel(field);
  if (!wasAnswered(field, options)) return neutralRequirementCopy(label);
  return capReason(`${label}: значение «${optionLabel(field, blocked)}» не подходит, выбрано «${optionLabel(field, actualValue)}»`);
}

function inReason(
  field: string,
  actualValue: unknown,
  allowed: unknown[],
  options: EvaluationOptions
): string {
  const label = FACT_COPY[field]?.label ?? fieldLabel(field);
  if (!wasAnswered(field, options)) return neutralRequirementCopy(label);
  const allowedLabels = allowed.map((value) => optionLabel(field, value)).join(", ");
  return capReason(`${label}: нужно одно из значений «${allowedLabels}», выбрано «${optionLabel(field, actualValue)}»`);
}

function isFamilyFact(field: string): boolean {
  return /^has_family_in_[a-z]{2}$/i.test(field);
}

const REQUIREMENT_FACT_KEYS: Record<string, string[]> = {
  income: ["monthly_income_eur", "passive_income_eur", "annual_salary_eur"],
  min_monthly_income_eur: ["monthly_income_eur"],
  passive_income: ["passive_income_eur"],
  savings: ["savings_eur"],
  min_savings_eur: ["savings_eur"],
  job_offer: ["has_job_offer", "annual_salary_eur"],
  employment: ["has_job_offer", "annual_salary_eur"],
  remote_work: ["remote_income", "monthly_income_eur"],
  study_admission: ["has_university_admission"],
  study_funds: ["study_budget_eur", "can_show_study_funds"],
  investment: ["willing_to_invest_eur"],
  min_investment_eur: ["willing_to_invest_eur"],
};

function requirementReason(
  requirement: EvaluationRequirement,
  options: EvaluationOptions
): string {
  const factKeys = requirement.requirementType
    ? REQUIREMENT_FACT_KEYS[requirement.requirementType] ?? []
    : [];
  const hasAnsweredFact = factKeys.some((field) => wasAnswered(field, options));

  if (factKeys.length === 0 || !hasAnsweredFact) {
    return neutralRequirementCopy(requirement.labelRu, requirement.valueText ?? undefined);
  }

  return requirement.valueText
    ? `${requirement.labelRu}: требуется ${requirement.valueText}. По вашим ответам это не подтверждено.`
    : `${requirement.labelRu}: по вашим ответам это не подтверждено.`;
}

function neutralRequirementCopy(label: string, detail?: string): string {
  return capReason(
    detail
      ? `${label}: ${detail}. Нужно будет подготовить/оформить отдельно.`
      : `${label}: проверяется на следующем этапе.`
  );
}

function wasAnswered(field: string, options: EvaluationOptions): boolean {
  if (!options.answeredKeys) return true;
  const answered = new Set(Array.from(options.answeredKeys));
  if (answered.has(field)) return true;
  return isFamilyFact(field) && answered.has("family_countries");
}

function optionLabel(field: string, value: unknown): string {
  const raw = value === undefined || value === null || value === "" ? "no" : String(value);
  const question = QUESTION_BY_KEY.get(field);
  const option = question?.options?.find((item) => item.value === raw);
  return option?.label_ru ?? YES_NO_LABELS[raw] ?? raw;
}

function fieldLabel(field: string): string {
  const question = QUESTION_BY_KEY.get(field);
  return question?.label_ru?.replace(/\s*\(.*?\)\s*/g, "").trim() || field;
}

function formatEuro(value: number): string {
  return `€${Math.round(value).toLocaleString("ru-RU")}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean).map(capReason)));
}

function capReason(reason: string): string {
  const compact = reason.replace(/\s+/g, " ").trim();
  if (compact.length <= MAX_REASON_LENGTH) return compact;
  return `${compact.slice(0, MAX_REASON_LENGTH - 1).trimEnd()}…`;
}

export function normalizeFacts(answers: Record<string, unknown>): Record<string, unknown> {
  const facts: Record<string, unknown> = { ...answers };
  const monthlyIncomeWasMissing =
    facts.monthly_income_eur === "" ||
    facts.monthly_income_eur === null ||
    facts.monthly_income_eur === undefined;

  for (const key of [
    "monthly_income_eur",
    "passive_income_eur",
    "savings_eur",
    "annual_salary_eur",
    "willing_to_invest_eur",
    "relocating_children_count",
    "relocating_parents_count",
  ]) {
    const val = facts[key];
    if (val === "" || val === null || val === undefined) {
      facts[key] = 0;
    } else if (typeof val === "string") {
      facts[key] = Number(val) || 0;
    }
  }

  if (
    monthlyIncomeWasMissing &&
    facts.has_job_offer === "yes" &&
    typeof facts.annual_salary_eur === "number" &&
    facts.annual_salary_eur > 0
  ) {
    facts.monthly_income_eur = facts.annual_salary_eur / 12;
  }

  return facts;
}
