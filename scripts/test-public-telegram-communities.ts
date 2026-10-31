/**
 * Public Telegram community links for PT / ES / IT surfaces.
 *   npx tsx scripts/test-public-telegram-communities.ts
 */
import assert from "node:assert/strict";
import {
  allPublicTelegramCommunityLinks,
  publicTelegramLinksForCountry,
  publicTelegramCountryFromStoryCountry,
  resolvePublicTelegramCountryFromGuide,
} from "../lib/telegram/public-communities";

assert.equal(publicTelegramLinksForCountry("portugal").length, 1);
assert.equal(publicTelegramLinksForCountry("portugal")[0].url, "https://t.me/emigro_portugal");
assert.equal(publicTelegramLinksForCountry("spain")[0].url, "https://t.me/valencia_echat");
assert.equal(publicTelegramLinksForCountry("italy").length, 3);
assert.equal(allPublicTelegramCommunityLinks().length, 5);

assert.equal(publicTelegramCountryFromStoryCountry("Португалия"), "portugal");
assert.equal(publicTelegramCountryFromStoryCountry("Испания"), "spain");

const ptGuide = resolvePublicTelegramCountryFromGuide({
  slug: "d8-portugal-2026",
  tags: [],
  topic_keys: ["portugal", "vnj"],
  primary_intent: "route",
});
assert.equal(ptGuide, "portugal");

console.log("test-public-telegram-communities: OK");
