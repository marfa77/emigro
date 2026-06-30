import { performance } from "node:perf_hooks";
import assert from "node:assert/strict";
import { evaluateProgram, normalizeFacts } from "../lib/engine/evaluator";
import { expandHubFacts } from "../lib/wizard/expand-facts";

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

const expandedFamilyFacts = expandHubFacts({
  passport_iso2: "RU",
  family_countries: ["PL", "CZ", "AT"],
});
assert.equal(expandedFamilyFacts.has_family_in_pl, "yes");
assert.equal(expandedFamilyFacts.has_family_in_cz, "yes");
assert.equal(expandedFamilyFacts.has_family_in_at, "yes");

const corridorFamilyFacts = expandHubFacts({
  passport_iso2: "RU",
  has_family_in_pl: "yes",
});
assert.equal(corridorFamilyFacts.has_family_in_pl, "yes");
assert.equal(corridorFamilyFacts.has_family_in_cz, "no");

const jobOfferFacts = normalizeFacts({
  passport_iso2: "RU",
  remote_income: "no",
  has_job_offer: "yes",
  annual_salary_eur: 60_000,
});
assert.equal(jobOfferFacts.monthly_income_eur, 5_000);
const swedenWorkPermit = evaluateProgram(
  "smoke-sweden-work-permit",
  "sweden-work-permit",
  {
    and: [
      { "==": [{ var: "passport_iso2" }, "RU"] },
      { "==": [{ var: "has_job_offer" }, "yes"] },
      { ">=": [{ var: "monthly_income_eur" }, 3050] },
    ],
  },
  jobOfferFacts,
  undefined,
  [{ requirementType: "employment", labelRu: "Оффер", valueText: "зарплата от €3 050/мес" }],
  { answeredKeys: ["remote_income", "has_job_offer", "annual_salary_eur"] }
);
assert.equal(swedenWorkPermit.outcome, "likely_eligible");

const spainDnvFacts = normalizeFacts({
  passport_iso2: "RU",
  remote_income: "yes",
  monthly_income_eur: 3500,
});
const spainDnv = evaluateProgram(
  "smoke-spain-dnv",
  "spain-digital-nomad",
  {
    and: [
      { "==": [{ var: "passport_iso2" }, "RU"] },
      { "==": [{ var: "remote_income" }, "yes"] },
      { ">=": [{ var: "monthly_income_eur" }, 2849] },
    ],
  },
  spainDnvFacts,
  undefined,
  [
    { requirementType: "income", labelRu: "Доход", valueText: "€2 849/мес" },
    { requirementType: "insurance", labelRu: "Медстраховка", valueText: "Полное покрытие в Испании" },
  ],
  { answeredKeys: ["remote_income", "monthly_income_eur"] }
);
assert.equal(spainDnv.outcome, "likely_eligible");
assert(!spainDnv.reasons.some((reason) => /доход|удал/i.test(reason) && /не подтверждено|не указан|указано €0/i.test(reason)));

const neutralInsurance = evaluateProgram(
  "smoke-spain-dnv-docs",
  "spain-digital-nomad-docs",
  { and: [false] },
  spainDnvFacts,
  undefined,
  [{ requirementType: "insurance", labelRu: "Медстраховка", valueText: "Полное покрытие в Испании" }],
  { answeredKeys: ["remote_income", "monthly_income_eur"] }
);
assert(neutralInsurance.reasons.some((reason) => reason.includes("Нужно будет подготовить/оформить отдельно")));
assert(!neutralInsurance.reasons.some((reason) => reason.includes("не подтверждено")));
