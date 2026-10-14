import type { WizardModule } from "@/lib/types";

const STUDY_DETAIL_KEYS = [
  "has_university_admission",
  "study_budget_eur",
  "can_show_study_funds",
  "study_level",
] as const;

const STUDY_GOAL = "study";

export type WizardVisibilityContext = {
  /** Hub wizards ask relocation_goal on step 1; «Учёба» there replaces the study yes/no question. */
  goalDriven?: boolean;
};

export function wizardVisibilityContext(modules: WizardModule[]): WizardVisibilityContext {
  return {
    goalDriven: modules.some((m) => m.questions.some((q) => q.question_key === "relocation_goal")),
  };
}

export function isQuestionVisible(
  questionKey: string,
  answers: Record<string, string>,
  ctx: WizardVisibilityContext = {}
): boolean {
  if (questionKey === "annual_salary_eur") return answers.has_job_offer === "yes";
  if (questionKey === "monthly_income_eur") return answers.remote_income === "yes";
  if (questionKey === "wants_study_route") return !ctx.goalDriven;
  if ((STUDY_DETAIL_KEYS as readonly string[]).includes(questionKey)) {
    return answers.wants_study_route === "yes";
  }
  return true;
}

export function isQuestionRequired(
  questionKey: string,
  questionType: string,
  required: boolean,
  answers: Record<string, string>,
  ctx: WizardVisibilityContext = {}
): boolean {
  if (!required) return false;
  if (questionType === "multi") return false;
  if (!isQuestionVisible(questionKey, answers, ctx)) return false;
  return true;
}

export function clearDependentAnswers(
  key: string,
  value: string,
  prev: Record<string, string>
): Record<string, string> {
  const next = { ...prev, [key]: value };
  if (key === "has_job_offer" && value !== "yes") {
    delete next.annual_salary_eur;
  }
  if (key === "remote_income" && value !== "yes") {
    delete next.monthly_income_eur;
  }
  if (key === "relocation_goal") {
    if (value === STUDY_GOAL) {
      next.wants_study_route = "yes";
    } else {
      delete next.wants_study_route;
    }
  }
  if ((key === "wants_study_route" && value !== "yes") || (key === "relocation_goal" && value !== STUDY_GOAL)) {
    for (const detail of STUDY_DETAIL_KEYS) delete next[detail];
  }
  return next;
}

/** Steps with no visible question are skipped (e.g. «Учёба» unless the goal is study). */
export function visibleWizardModules(
  modules: WizardModule[],
  answers: Record<string, string>
): WizardModule[] {
  const ctx = wizardVisibilityContext(modules);
  const visible = modules.filter((m) =>
    m.questions.some((q) => isQuestionVisible(q.question_key, answers, ctx))
  );
  return visible.length > 0 ? visible : modules;
}
