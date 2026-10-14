/**
 * Hub wizard step visibility: «Учёба» only when the goal is study; corridor wizards unchanged.
 * Usage: npx tsx scripts/test-wizard-visibility.ts
 */
import assert from "node:assert/strict";
import type { WizardModule } from "../lib/types";
import { HUB_WIZARD_MODULES } from "../lib/wizard/hub-definition";
import { HUB_ES_WIZARD_MODULES } from "../lib/wizard/hub-definition-es";
import {
  clearDependentAnswers,
  isQuestionRequired,
  isQuestionVisible,
  visibleWizardModules,
  wizardVisibilityContext,
} from "../lib/wizard/visibility";

const keys = (answers: Record<string, string>, modules: WizardModule[] = HUB_WIZARD_MODULES) =>
  visibleWizardModules(modules, answers).map((m) => m.module_key);

const hubCtx = wizardVisibilityContext(HUB_WIZARD_MODULES);
assert.equal(hubCtx.goalDriven, true);

assert.deepEqual(keys({}), ["core", "labor", "capital", "bond"], "hub starts with 4 steps");

let answers = clearDependentAnswers("relocation_goal", "residency", { passport_iso2: "RU" });
assert.deepEqual(keys(answers), ["core", "labor", "capital", "bond"]);
assert.equal(answers.wants_study_route, undefined);

answers = clearDependentAnswers("relocation_goal", "study", answers);
assert.equal(answers.wants_study_route, "yes", "study goal implies study route");
assert.deepEqual(keys(answers), ["core", "labor", "capital", "study", "bond"]);
assert.equal(isQuestionVisible("wants_study_route", answers, hubCtx), false, "no duplicate yes/no");
assert.equal(isQuestionVisible("has_university_admission", answers, hubCtx), true);

answers = { ...answers, has_university_admission: "yes", study_budget_eur: "12000" };
answers = clearDependentAnswers("relocation_goal", "fast", answers);
assert.equal(answers.wants_study_route, undefined);
assert.equal(answers.has_university_admission, undefined, "switching away from study clears details");
assert.equal(answers.study_budget_eur, undefined);
assert.deepEqual(keys(answers), ["core", "labor", "capital", "bond"]);

// Corridor-style wizard (no relocation_goal question): explicit study yes/no stays.
const corridorModules = HUB_WIZARD_MODULES.map((m) => ({
  ...m,
  questions: m.questions.filter((q) => q.question_key !== "relocation_goal"),
}));
const corridorCtx = wizardVisibilityContext(corridorModules);
assert.equal(corridorCtx.goalDriven, false);
assert.equal(isQuestionVisible("wants_study_route", {}, corridorCtx), true);
assert.equal(isQuestionRequired("wants_study_route", "single", true, {}, corridorCtx), true);
assert.deepEqual(keys({}, corridorModules), ["core", "labor", "capital", "study", "bond"]);

assert.ok(
  !keys({ relocation_goal: "residency" }, HUB_ES_WIZARD_MODULES).includes("study"),
  "ES hub skips study too"
);

assert.deepEqual(visibleWizardModules([], {}), [], "empty module list stays empty");

console.log("wizard visibility: ok");
