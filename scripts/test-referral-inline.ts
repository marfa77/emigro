import assert from "node:assert/strict";
import {
  classifyReferralUrl,
  injectReferralInlineLinks,
  injectReferralMarkdownLinks,
  liveUrlsFromTargets,
  referralInlineTargets,
} from "../lib/partners/referral-inline";
import { defaultRevolutLiveMap } from "../lib/partners/revolut-referral";
import { defaultWiseLiveOffer } from "../lib/partners/wise-referral";

const revolut = defaultRevolutLiveMap();
const wise = defaultWiseLiveOffer();
const targets = referralInlineTargets({
  revolut: { offers: ["personal", "business"], live: revolut },
  wise: { live: wise },
});

assert.equal(targets[0]?.phrase, "Revolut Business");
assert.equal(liveUrlsFromTargets(targets).wise, wise.url);

const html = injectReferralInlineLinks(
  [
    "<h2><span>Paysera и Revolut: после статуса</span></h2>",
    "<p>Сначала Wise или Revolut, потом местный банк.</p>",
    "<p>Откройте <a href=\"https://wise.com/help/x\">Wise Help</a> и сравните с Revolut Business.</p>",
    "<table><thead><tr><th>Wise</th><th>Revolut</th></tr></thead><tbody><tr><td>Wise</td><td>Revolut</td></tr></tbody></table>",
  ].join(""),
  targets
);

assert.equal(html.includes("<h2><span>Paysera и Revolut: после статуса</span></h2>"), true);
assert.equal(html.includes('href="https://wise.com/help/x">Wise Help'), true);
assert.equal(html.includes("<th>Wise</th>"), true);
assert.equal(html.includes("<th>Revolut</th>"), true);
assert.equal((html.match(/data-partner-referral="wise"/g) ?? []).length, 2);
assert.equal((html.match(/data-partner-referral="revolut"/g) ?? []).length >= 3, true);
assert.equal(html.includes("Revolut Business"), true);
assert.equal(html.includes('data-partner-product="business"'), true);
assert.equal(html.includes("rel=\"noopener noreferrer sponsored\""), true);
assert.equal(html.includes(revolut.personal.url.replace(/&/g, "&amp;")), true);

const markdown = injectReferralMarkdownLinks(
  "Сначала [Wise Help](https://wise.com/help/x), потом Wise или Revolut.",
  targets
);
assert.equal(markdown.includes("[Wise Help](https://wise.com/help/x)"), true);
assert.equal(markdown.includes(`[Wise](${wise.url})`), true);
assert.equal(markdown.includes(`[Revolut](${revolut.personal.url})`), true);

assert.equal(classifyReferralUrl(wise.url)?.provider, "wise");
assert.equal(classifyReferralUrl("https://wise.com/help/articles/x"), null);
assert.equal(classifyReferralUrl(revolut.personal.url)?.product, "personal");
assert.equal(classifyReferralUrl(revolut.business.url)?.product, "business");

const businessOnly = referralInlineTargets({
  revolut: { offers: ["business"], live: revolut },
});
assert.equal(businessOnly.some((item) => item.phrase === "Revolut"), false);
assert.equal(businessOnly.some((item) => item.phrase === "Revolut Business"), true);

console.log("referral inline tests: ok");
