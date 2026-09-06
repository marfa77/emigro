import assert from "node:assert/strict";
import {
  cityChatForCountry,
  cityChatForWizardReport,
  countryKeyFromCorridorSlug,
  countryKeyFromWizardReport,
  liveCityChatForCountry,
  matchCityChatKeyword,
  parseCityChatStartPayload,
} from "../lib/satellite/city-chats";
import { cityChatDeepLink, isCityChatStartPayload, portoChatDeepLink } from "../lib/telegram/deep-link";
import {
  CITY_CHAT_KICKER,
  CITY_CHAT_PILLARS,
  cityChatLead,
  cityChatTelegramBio,
} from "../lib/satellite/city-chat-copy";

assert.equal(countryKeyFromCorridorSlug("ru-speaking-to-portugal"), "portugal");
assert.equal(countryKeyFromCorridorSlug("ru-speaking-to-spain"), "spain");
assert.equal(countryKeyFromWizardReport({ payload: { pick: { countrySegment: "Germany" } } }), "germany");
assert.equal(countryKeyFromWizardReport({ corridorSlug: "ru-speaking-to-portugal" }), "portugal");

const porto = cityChatForCountry("portugal");
assert.equal(porto?.startPayload, "porto_chat");
assert.equal(parseCityChatStartPayload("porto_chat_wizhub")?.city, "porto");
assert.equal(parseCityChatStartPayload("porto")?.city, "porto");
assert.equal(isCityChatStartPayload("porto_chat_wizcorr"), true);
assert.equal(parseCityChatStartPayload("valencia_chat")?.city, "valencia");
assert.equal(parseCityChatStartPayload("berlin_chat"), undefined);

assert.ok(liveCityChatForCountry("portugal"));
assert.equal(cityChatForCountry("spain")?.startPayload, "valencia_chat");
assert.equal(liveCityChatForCountry("spain")?.city, "valencia");
assert.equal(cityChatForWizardReport({ payload: { pick: { countrySegment: "spain" } } })?.city, "valencia");
assert.equal(cityChatForWizardReport({ payload: { pick: { countrySegment: "portugal" } } })?.city, "porto");

assert.equal(matchCityChatKeyword("Порту")?.city, "porto");
assert.equal(matchCityChatKeyword("чат порту")?.city, "porto");

const href = portoChatDeepLink("wizhub");
assert.match(href, /start=porto_chat_wizhub/);
assert.equal(cityChatDeepLink(porto!, "wizcorr").includes("porto_chat_wizcorr"), true);

assert.equal(CITY_CHAT_KICKER, "Для своих");
assert.equal(CITY_CHAT_PILLARS.length, 3);
assert.match(cityChatLead(porto!), /публикуем важное/);
assert.match(cityChatTelegramBio(porto!), /эксперты отвечают/);

console.log("city-chats wizard funnel ok");
