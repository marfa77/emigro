import jsonLogic from "json-logic-js";
import { stripPassportConstraint } from "@/lib/engine/rule-utils";

export type OutcomeCode = "likely_eligible" | "needs_review" | "unlikely";

export interface EvaluationResult {
  programId: string;
  programSlug: string;
  outcome: OutcomeCode;
  score: number;
  reasons: string[];
}

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
  passportStatus?: string
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

  reasons.push("Один или несколько ключевых критериев не выполнены");
  return {
    programId,
    programSlug,
    outcome: "unlikely",
    score: 0.2,
    reasons,
  };
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
