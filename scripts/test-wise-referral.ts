import assert from "node:assert/strict";
import {
  defaultWiseLiveOffer,
  formatWiseReferralTelegramLine,
  isAllowedWiseReferralUrl,
  isWiseLiveOfferVisible,
  mergeWiseLiveOffer,
  wiseOfferForGuide,
  wiseOfferForNote,
  type WiseReferralStats,
} from "../lib/partners/wise-referral";

assert.equal(isAllowedWiseReferralUrl("https://wise.com/invite/irhc/pavelv418"), true);
assert.equal(isAllowedWiseReferralUrl("https://www.wise.com/invite/abc"), true);
assert.equal(isAllowedWiseReferralUrl("https://wise.com/register"), false);
assert.equal(isAllowedWiseReferralUrl("http://wise.com/invite/irhc/pavelv418"), false);
assert.equal(isAllowedWiseReferralUrl("https://evil.example/invite/x"), false);

assert.equal(wiseOfferForGuide("bank-i-iban-dlya-rossiyan-v-evrope-2026"), true);
assert.equal(wiseOfferForGuide("kak-otkryt-ip-za-rubezhom-rossiyane-2026"), false);
assert.equal(wiseOfferForNote("kak-otkryt-bankovskiy-schet-portugalia-2026"), true);
assert.equal(wiseOfferForNote("inps-partita-iva-milano-2026"), false);

const open = defaultWiseLiveOffer();
assert.equal(open.url.includes("wise.com/invite/irhc/pavelv418"), true);
assert.equal(isWiseLiveOfferVisible(open), true);

const disabled = mergeWiseLiveOffer({ url: open.url, endsOn: "", enabled: false });
assert.equal(isWiseLiveOfferVisible(disabled), false);

const expired = mergeWiseLiveOffer({
  url: open.url,
  endsOn: "2026-01-01",
  enabled: true,
});
assert.equal(isWiseLiveOfferVisible(expired, new Date("2026-09-19T12:00:00.000Z")), false);

const dated = mergeWiseLiveOffer({
  url: "https://wise.com/invite/irhc/newcode",
  endsOn: "2026-12-31",
  enabled: true,
});
assert.equal(isWiseLiveOfferVisible(dated, new Date("2026-09-19T12:00:00.000Z")), true);
assert.equal(dated.url.includes("newcode"), true);

const line = formatWiseReferralTelegramLine({
  active: true,
  endsOn: "",
  clicksToday: 2,
  clicksYesterday: 1,
  clicks7d: 5,
  clicksCampaign: 9,
  byContent: [["bank-i-iban-dlya-rossiyan-v-evrope-2026", 4]],
} satisfies WiseReferralStats);
assert.equal(line?.includes("Wise ref"), true);
assert.equal(line?.includes("сегодня <b>2</b>"), true);

console.log("wise referral tests: ok");
