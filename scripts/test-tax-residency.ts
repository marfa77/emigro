import assert from "node:assert/strict";
import { countDaysInYear } from "../lib/tax-cockpit/day-math";
import { EU_STUB_PACKS, getPack } from "../lib/tax-cockpit/packs";
import { formatResidencyReportHtml } from "../lib/tax-cockpit/report";
import { evaluateResidency } from "../lib/tax-cockpit/residency";
import type { PresenceInterval } from "../lib/tax-cockpit/types";

function interval(iso: string, start: string, end: string): PresenceInterval {
  return { countryIso2: iso, startDate: start, endDate: end, source: "manual" };
}

const yearSpan = { startDate: "2026-01-01", endDate: "2026-07-20" };
assert.equal(countDaysInYear(yearSpan, 2026), 200);

const pt200 = evaluateResidency(2026, [interval("PT", yearSpan.startDate, yearSpan.endDate)]);
assert.equal(pt200.byCountry[0]?.days, 200);
assert.equal(pt200.byCountry[0]?.light, "red");
assert.equal(pt200.byCountry[0]?.complete, true);

const pt50 = evaluateResidency(2026, [interval("PT", "2026-01-01", "2026-02-20")]);
assert.equal(pt50.byCountry[0]?.days, 50);
assert.equal(pt50.byCountry[0]?.light, "green");

// CIRS is "more than 183", so 183 nights stay yellow rather than a confident red.
const pt183 = evaluateResidency(2026, [interval("PT", "2026-01-01", "2026-07-03")]);
assert.equal(pt183.byCountry[0]?.days, 183);
assert.equal(pt183.byCountry[0]?.light, "yellow");

const fr200 = evaluateResidency(2026, [interval("FR", yearSpan.startDate, yearSpan.endDate)]);
assert.equal(fr200.byCountry[0]?.days, 200);
assert.equal(fr200.byCountry[0]?.light, "yellow");
assert.notEqual(fr200.byCountry[0]?.light, "green");
assert.notEqual(fr200.byCountry[0]?.light, "red");
assert.equal(fr200.byCountry[0]?.reason, "stub");
assert.equal(getPack("FR").complete, false);

const frFew = evaluateResidency(2026, [interval("FR", "2026-01-01", "2026-01-11")]);
assert.equal(frFew.byCountry[0]?.days, 10);
assert.equal(frFew.byCountry[0]?.light, "yellow");

for (const stub of EU_STUB_PACKS) {
  assert.equal(stub.complete, false, stub.iso2);
  assert.equal(getPack(stub.iso2).complete, false, stub.iso2);
  assert.notEqual(stub.iso2, "PT");
  assert.notEqual(stub.iso2, "IT");
  for (const [start, end] of [
    ["2026-01-01", "2026-01-11"],
    ["2026-01-01", "2026-07-20"],
  ] as const) {
    const light = evaluateResidency(2026, [interval(stub.iso2, start, end)]).byCountry[0]?.light;
    assert.equal(light, "yellow", `${stub.iso2} ${start}`);
  }
}

const usOver = evaluateResidency(2026, [interval("US", yearSpan.startDate, yearSpan.endDate)]);
assert.ok((usOver.byCountry[0]?.days ?? 0) >= 183);
assert.equal(usOver.byCountry[0]?.light, "yellow");
assert.notEqual(usOver.byCountry[0]?.light, "red");
assert.equal(usOver.byCountry[0]?.reason, "abbreviated");

const usFew = evaluateResidency(2026, [interval("US", "2026-01-01", "2026-01-30")]);
assert.equal(usFew.byCountry[0]?.days, 30);
assert.equal(usFew.byCountry[0]?.light, "green");

const usClose = evaluateResidency(2026, [interval("US", "2026-01-01", "2026-05-20")]);
assert.ok((usClose.byCountry[0]?.days ?? 0) >= 183 * 0.75);
assert.ok((usClose.byCountry[0]?.days ?? 0) < 183);
assert.equal(usClose.byCountry[0]?.light, "yellow");

assert.match(getPack("AE").notesRu.join(" "), /183/);
assert.match(getPack("AE").notesRu.join(" "), /90/);
assert.equal(getPack("AE").dayRule?.departInclusive, true);
assert.ok(getPack("PT").playbooks?.some((playbook) => playbook.id === "pt-ae-rental"));
assert.ok(getPack("AE").playbooks?.some((playbook) => playbook.id === "pt-ae-rental"));

assert.equal(getPack("UK").iso2, "GB");
const merged = evaluateResidency(2026, [
  interval("UK", "2026-01-01", "2026-01-11"),
  interval("gb", "2026-01-11", "2026-01-21"),
]);
assert.equal(merged.byCountry.length, 1);
assert.equal(merged.byCountry[0]?.iso2, "GB");
assert.equal(merged.byCountry[0]?.days, 20);

const itOvernight = evaluateResidency(2026, [interval("IT", "2026-03-01", "2026-03-03")]);
const ptOvernight = evaluateResidency(2026, [interval("PT", "2026-03-01", "2026-03-03")]);
assert.equal(ptOvernight.byCountry[0]?.days, 2);
assert.equal(itOvernight.byCountry[0]?.days, 3);
assert.equal(itOvernight.byCountry[0]?.threshold, 183);

const itLeap = evaluateResidency(2024, [interval("IT", "2024-01-01", "2024-01-11")]);
assert.equal(itLeap.byCountry[0]?.threshold, 184);
assert.equal(itLeap.byCountry[0]?.light, "green");

const unknown = evaluateResidency(2026, [interval("TH", yearSpan.startDate, yearSpan.endDate)]);
assert.equal(unknown.byCountry[0]?.light, "yellow");
assert.equal(unknown.byCountry[0]?.complete, false);

const ptHtml = formatResidencyReportHtml(pt200);
assert.match(ptHtml, /не налоговая консультация/i);
assert.match(ptHtml, /не замена бухгалтеру/i);
assert.match(ptHtml, /\/ru\/assist/);
assert.match(ptHtml, /start=assist/);
assert.match(ptHtml, /200/);
assert.match(ptHtml, /🔴/);

const frHtml = formatResidencyReportHtml(fr200);
assert.match(frHtml, /pack incomplete/i);
assert.match(frHtml, /🟡/);
assert.doesNotMatch(frHtml, /🟢/);
assert.doesNotMatch(frHtml, /🔴/);

const both = evaluateResidency(2026, [
  interval("PT", "2026-01-01", "2026-02-20"),
  interval("AE", "2026-03-01", "2026-03-10"),
]);
const bothHtml = formatResidencyReportHtml(both);
assert.match(bothHtml, /Аренда в ОАЭ/);
assert.match(bothHtml, /utm_campaign=tax-cockpit/);

const three = evaluateResidency(2026, [
  interval("PT", yearSpan.startDate, yearSpan.endDate),
  interval("AE", "2026-07-20", "2026-12-31"),
  interval("IT", "2026-03-01", "2026-03-20"),
]);
assert.ok(formatResidencyReportHtml(three).length <= 4000);

console.log("ok tax residency");
