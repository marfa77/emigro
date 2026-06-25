import { performance } from "node:perf_hooks";
import { evaluateProgram, normalizeFacts } from "../lib/engine/evaluator";

const facts = normalizeFacts({
  passport_iso2: "BY",
  remote_income: "no",
  monthly_income_eur: 1800,
  passive_income_eur: 500,
  savings_eur: 8000,
  willing_to_invest_eur: 100000,
  wants_study_route: "yes",
  has_university_admission: "no",
  study_budget_eur: 3000,
  can_show_study_funds: "no",
  has_family_in_pt: "no",
});

const checks = [
  {
    label: "income alternatives",
    rule: {
      and: [
        { "==": [{ var: "passport_iso2" }, "RU"] },
        {
          or: [
            { ">=": [{ var: "passive_income_eur" }, 2400] },
            { ">=": [{ var: "savings_eur" }, 57600] },
          ],
        },
      ],
    },
  },
  {
    label: "study admission and funds",
    rule: {
      and: [
        { "==": [{ var: "wants_study_route" }, "yes"] },
        { "==": [{ var: "has_university_admission" }, "yes"] },
        {
          or: [
            { ">=": [{ var: "study_budget_eur" }, 9840] },
            { "==": [{ var: "can_show_study_funds" }, "yes"] },
          ],
        },
      ],
    },
  },
  {
    label: "family route",
    rule: {
      and: [
        { "==": [{ var: "passport_iso2" }, "RU"] },
        { "==": [{ var: "has_family_in_pt" }, "yes"] },
      ],
    },
  },
  {
    label: "investment capital",
    rule: {
      and: [
        { "==": [{ var: "passport_iso2" }, "RU"] },
        { ">=": [{ var: "willing_to_invest_eur" }, 500000] },
      ],
    },
  },
] as const;

const start = performance.now();
const results = checks.map((check, index) => ({
  label: check.label,
  ...evaluateProgram(`smoke-${index}`, check.label, check.rule, facts),
}));
const elapsedMs = Math.round(performance.now() - start);

console.log(`Wizard evaluation smoke: ${results.length} programs in ${elapsedMs}ms`);
for (const result of results) {
  console.log(`\n${result.label}: ${result.outcome} (${result.score})`);
  for (const reason of result.reasons) {
    console.log(`- ${reason}`);
  }
}
