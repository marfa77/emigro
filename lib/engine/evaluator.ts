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
  labelRu: string;
  valueText?: string | null;
};

export function evaluateRule(
  rule: Record<string, unknown>,
  facts: Record<string, unknown>
): boolean {
  try {
    return Boolean(jsonLogic.apply(rule, facts));
  } catch {
    return false;
  }
}

export function evaluateProgram(
  programId: string,
  programSlug: string,
  rule: Record<string, unknown>,
  facts: Record<string, unknown>,
  passportStatus?: string,
  requirements: EvaluationRequirement[] = []
): EvaluationResult {
  const reasons: string[] = [];

  if (passportStatus === "ineligible") {
    return {
      programId,
      programSlug,
      outcome: "unlikely",
      score: 0,
      reasons: ["Паспорт не поддерживается для этого маршрута"],
    };
  }

  if (passportStatus === "partial") {
    reasons.push("Паспорт поддерживается частично — уточните юрисдикцию консульства");
  }

  const effectiveRule = stripPassportConstraint(rule, passportStatus);
  const passed = evaluateRule(effectiveRule, facts);

  if (passed) {
    reasons.push("Основные критерии по вашим ответам выполнены");
    return {
      programId,
      programSlug,
      outcome: passportStatus === "partial" ? "needs_review" : "likely_eligible",
      score: passportStatus === "partial" ? 0.7 : 1,
      reasons,
    };
  }

  reasons.push(...failedRuleReasons(rule, facts, requirements));
  return {
    programId,
    programSlug,
    outcome: "unlikely",
    score: 0.2,
    reasons,
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
  requirements: EvaluationRequirement[]
): string[] {
  const detailed = explainFailedNode(rule, facts);
  if (detailed.length > 0) return unique(detailed);

  const fallback = requirements
    .slice(0, 3)
    .map((requirement) =>
      requirement.valueText
        ? `${requirement.labelRu}: ${requirement.valueText} — не совпало с ответами wizard`
        : `${requirement.labelRu}: не совпало с ответами wizard`
    );

  return fallback.length > 0
    ? fallback
    : ["Критерии программы не совпали с ответами wizard"];
}

function explainFailedNode(node: unknown, facts: Record<string, unknown>): string[] {
  if (!node || typeof node !== "object") return [];
  const rule = node as Record<string, unknown>;

  if (Array.isArray(rule.and)) {
    return rule.and.flatMap((child) =>
      evaluateRuleObject(child, facts) ? [] : explainFailedNode(child, facts)
    );
  }

  if (Array.isArray(rule.or)) {
    if (evaluateRuleObject(rule, facts)) return [];
    return rule.or.flatMap((child) => explainFailedNode(child, facts));
  }

  const comparison = explainComparison(rule, facts);
  return comparison ? [comparison] : [];
}

function evaluateRuleObject(node: unknown, facts: Record<string, unknown>): boolean {
  if (!node || typeof node !== "object") return false;
  return evaluateRule(node as Record<string, unknown>, facts);
}

function explainComparison(rule: Record<string, unknown>, facts: Record<string, unknown>): string | null {
  const gte = rule[">="];
  if (Array.isArray(gte) && gte.length === 2) {
    const field = varName(gte[0]);
    const required = numberValue(gte[1]);
    if (!field || required === null) return null;
    return numericReason(field, facts[field], required);
  }

  const eq = rule["=="];
  if (Array.isArray(eq) && eq.length === 2) {
    const field = varName(eq[0]);
    if (!field) return null;
    return equalityReason(field, facts[field], eq[1]);
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

function numericReason(field: string, actualValue: unknown, required: number): string {
  const copy = FACT_COPY[field];
  const label = copy?.label ?? fieldLabel(field);
  const unit = copy?.unit ?? "";
  const actual = numberValue(actualValue) ?? 0;
  return `${label}: нужно от ${formatEuro(required)}${unit}, указано ${formatEuro(actual)}${unit}`;
}

function equalityReason(field: string, actualValue: unknown, expected: unknown): string | null {
  if (field === "passport_iso2") return null;

  if (String(expected) === "yes" && isFamilyFact(field)) {
    return "Семья в стране: не указана близкая связь";
  }

  const copy = FACT_COPY[field];
  const label = copy?.label ?? fieldLabel(field);
  const actual = optionLabel(field, actualValue);

  if (String(expected) === "yes") {
    const requirement = copy?.requiredYes ?? "нужно значение «Да»";
    return `${label}: ${requirement}, выбрано «${actual}»`;
  }

  return `${label}: нужно «${optionLabel(field, expected)}», выбрано «${actual}»`;
}

function isFamilyFact(field: string): boolean {
  return /^has_family_in_[a-z]{2}$/i.test(field);
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
  return Array.from(new Set(values.filter(Boolean)));
}

export function normalizeFacts(answers: Record<string, unknown>): Record<string, unknown> {
  const facts: Record<string, unknown> = { ...answers };

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

  return facts;
}
