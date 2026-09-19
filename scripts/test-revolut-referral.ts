import assert from "node:assert/strict";
import {
  defaultRevolutLiveMap,
  formatRevolutReferralTelegramLine,
  isAllowedRevolutReferralUrl,
  isRevolutOfferActive,
  isRevolutReferralActive,
  mergeRevolutLiveOffer,
  revolutOfferUrl,
  revolutOffersForGuide,
  revolutOffersForNote,
  shouldShowRevolutReferralOnGuide,
  visibleRevolutOffers,
  type RevolutReferralStats,
} from "../lib/partners/revolut-referral";

const oct6Evening = new Date("2026-10-06T22:00:00.000Z");
const oct7Morning = new Date("2026-10-07T00:00:00.000Z");
const oct7Evening = new Date("2026-10-07T22:00:00.000Z");
const oct8Morning = new Date("2026-10-08T00:00:00.000Z");

assert.equal(isRevolutReferralActive(oct6Evening), true);
assert.equal(isRevolutOfferActive("personal", oct7Morning), false);
assert.equal(isRevolutOfferActive("business", oct7Morning), true);
assert.equal(isRevolutOfferActive("business", oct7Evening), true);
assert.equal(isRevolutOfferActive("business", oct8Morning), false);

assert.deepEqual(revolutOffersForGuide("bank-i-iban-dlya-rossiyan-v-evrope-2026"), [
  "personal",
  "business",
]);
assert.deepEqual(revolutOffersForGuide("kak-otkryt-ip-za-rubezhom-rossiyane-2026"), ["business"]);
assert.equal(shouldShowRevolutReferralOnGuide("vnj-portugaliya-d8-d7-grazhdanstvo-2026"), false);
assert.deepEqual(revolutOffersForNote("inps-partita-iva-milano-2026"), ["business"]);

const defaults = defaultRevolutLiveMap();
assert.deepEqual(visibleRevolutOffers(["business"], defaults, oct7Evening), ["business"]);
assert.deepEqual(visibleRevolutOffers(["business"], defaults, oct8Morning), []);

const extended = {
  ...defaults,
  business: mergeRevolutLiveOffer("business", {
    url: "https://business.revolut.com/signup?promo=NEW&ext=p_veselov&context=C2B_REFERRAL",
    endsOn: "2026-10-20",
    enabled: true,
  }),
};
assert.deepEqual(visibleRevolutOffers(["business"], extended, oct8Morning), ["business"]);
assert.equal(extended.business.url.includes("promo=NEW"), true);

assert.equal(isAllowedRevolutReferralUrl("https://business.revolut.com/signup?x=1"), true);
assert.equal(isAllowedRevolutReferralUrl("https://evil.example/phish"), false);
assert.equal(isAllowedRevolutReferralUrl("http://revolut.com/referral"), false);

const disabled = mergeRevolutLiveOffer("personal", { url: defaults.personal.url, endsOn: "2026-12-01", enabled: false });
assert.deepEqual(visibleRevolutOffers(["personal"], { ...defaults, personal: disabled }, oct6Evening), []);

assert.equal(revolutOfferUrl("business").includes("business.revolut.com/signup"), true);

const line = formatRevolutReferralTelegramLine({
  active: true,
  endsOn: "2026-10-07",
  personalEndsOn: "2026-10-06",
  businessEndsOn: "2026-10-07",
  clicksToday: 4,
  clicksYesterday: 1,
  clicks7d: 11,
  clicksCampaign: 19,
  personal: { clicksToday: 3, clicksYesterday: 1, clicks7d: 8, clicksCampaign: 12 },
  business: { clicksToday: 1, clicksYesterday: 0, clicks7d: 3, clicksCampaign: 7 },
  byContent: [
    ["personal:bank-i-iban-dlya-rossiyan-v-evrope-2026", 8],
    ["business:kak-otkryt-ip-za-rubezhom-rossiyane-2026", 5],
  ],
} satisfies RevolutReferralStats);

assert.equal(line?.includes("личка <b>3</b>"), true);
assert.equal(line?.includes("юрик <b>1</b>"), true);

console.log("revolut referral tests: ok");
