import assert from "node:assert/strict";
import { qualifyInvestmentRoutes } from "@/lib/investment/registry";
import { partnerDemandState } from "@/lib/investment/partners";
import { signInvestmentResultToken, verifyInvestmentResultToken } from "@/lib/investment/result-token";
import { showsDubaiOfferVerdict } from "@/lib/investment/uae-offer-verdict";

const property = qualifyInvestmentRoutes({
  budgetEur: 80_000,
  asset: "property",
  outcome: "residence",
  passportIso2: "RU",
});
assert.equal(property.find((route) => route.country === "portugal")?.match, "not_property");
assert.equal(property.find((route) => route.country === "italy")?.match, "not_property");
assert.equal(property.find((route) => route.country === "greece")?.match, "blocked");
assert.equal(property.find((route) => route.slug === "thailand-property-stay")?.match, "review");
assert.equal(property.find((route) => route.slug === "thailand-ltr")?.match, "budget_gap");
assert.equal(property.find((route) => route.slug === "thailand-privilege")?.match, "not_property");
assert.equal(property.find((route) => route.country === "spain")?.match, "closed");
assert.equal(property.find((route) => route.country === "uae")?.match, "budget_gap");
assert.notEqual(property[0]?.match, "likely");

// Preferred closed/blocked countries must remain selectable for CRM destination.
const spainPreferred = qualifyInvestmentRoutes({
  budgetEur: 500_000,
  asset: "property",
  outcome: "residence",
  passportIso2: "RU",
}).find((route) => route.country === "spain");
assert.equal(spainPreferred?.match, "closed");

const uae = qualifyInvestmentRoutes({
  budgetEur: 600_000,
  asset: "property",
  outcome: "residence",
  passportIso2: "KZ",
});
assert.equal(uae.find((route) => route.country === "uae")?.match, "likely");
assert.ok(showsDubaiOfferVerdict("uae"));
assert.equal(showsDubaiOfferVerdict("thailand"), false);

assert.equal(partnerDemandState("uae", 2).state, "collecting_demand");
assert.equal(partnerDemandState("uae", 3).state, "search_partners");
assert.equal(partnerDemandState("spain", 5).state, "closed");
assert.equal(partnerDemandState("thailand", 1).state, "manual_partner");

process.env.EMIGRO_ADMIN_SECRET = "test-secret";
const token = signInvestmentResultToken("lead-1");
assert.ok(token);
assert.equal(verifyInvestmentResultToken(token!), "lead-1");
assert.equal(verifyInvestmentResultToken(`${token}x`), null);

console.log("investment eligibility tests: ok");
