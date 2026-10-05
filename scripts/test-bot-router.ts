import assert from "node:assert/strict";
import { decideUserRoute, parseAppSlashCommand, startPayloadFromText } from "../lib/telegram/bot/decide";
import { isGlobalCommand } from "../lib/telegram/bot/home";
import { parseMenuLabel } from "../lib/telegram/bot/markup";
import { isOwnerCallbackData, isOwnerCommandText } from "../lib/telegram/bot/owner";
import {
  assistBotStartPayload,
  parseBotStartPayload,
  propertyBotStartPayload,
} from "../lib/telegram/deep-link";

assert.equal(startPayloadFromText("/start"), "");
assert.equal(startPayloadFromText("/start news_portugal"), "news_portugal");
assert.equal(startPayloadFromText("привет"), null);

assert.equal(decideUserRoute({ text: "/start", hasLiveSession: false }).type, "home");
assert.equal(decideUserRoute({ text: "меню", hasLiveSession: true }).type, "home");
assert.equal(decideUserRoute({ text: "отмена", hasLiveSession: true }).type, "home");
assert.equal(isGlobalCommand("Меню"), true);
assert.equal(parseMenuLabel("Новости"), "Новости");

const unknown = decideUserRoute({ text: "сколько стоит D7", hasLiveSession: false });
assert.equal(unknown.type, "home");
assert.match((unknown as { hint?: string }).hint || "", /меню/i);

assert.deepEqual(decideUserRoute({ text: "чат порту", hasLiveSession: false }), {
  type: "city-keyword",
  countryKey: "portugal",
});
const bareChat = decideUserRoute({ text: "чат", hasLiveSession: false });
assert.equal(bareChat.type, "home", "generic «чат» must not invite Porto");

assert.deepEqual(decideUserRoute({ text: "Новости", hasLiveSession: true }), {
  type: "open",
  link: { app: "news" },
});
assert.deepEqual(decideUserRoute({ text: "Помощь", hasLiveSession: false }), {
  type: "open",
  link: { app: "assist" },
});
assert.deepEqual(decideUserRoute({ text: "/property", hasLiveSession: false }), {
  type: "open",
  link: { app: "property" },
});
assert.equal(parseAppSlashCommand("/assist")?.app, "assist");

const newsStart = decideUserRoute({ text: "/start news_spain", hasLiveSession: true });
assert.deepEqual(newsStart, { type: "open", link: { app: "news", topicKey: "spain" } });

const assistStart = decideUserRoute({ text: "/start assist_route_portugal", hasLiveSession: false });
assert.deepEqual(assistStart, {
  type: "open",
  link: { app: "assist", country: "portugal", tier: "route-check" },
});

assert.deepEqual(decideUserRoute({ text: "/start property_uae", hasLiveSession: false }), {
  type: "open",
  link: { app: "property", dest: "uae" },
});
assert.deepEqual(decideUserRoute({ text: "/start porto_chat", hasLiveSession: false }), {
  type: "open",
  link: { app: "city", countryKey: "portugal" },
});

const wiz = parseBotStartPayload("wiz_hub_AbC12_xyZ9");
assert.equal(wiz?.app, "wizard");
if (wiz?.app === "wizard") assert.equal(wiz.sessionId, "AbC12_xyZ9");

assert.equal(decideUserRoute({ text: "паспорт РФ, доход 3к", hasLiveSession: true }).type, "continue-session");
assert.equal(
  decideUserRoute({ callbackData: "as:plan:route-check", hasLiveSession: true }).type,
  "continue-session"
);
assert.equal(
  decideUserRoute({ callbackData: "as:plan:route-check", hasLiveSession: false }).type,
  "dispatch"
);
assert.deepEqual(decideUserRoute({ callbackData: "home:assist:italy", hasLiveSession: true }), {
  type: "open",
  link: { app: "assist", country: "italy" },
});
assert.deepEqual(decideUserRoute({ callbackData: "city:spain", hasLiveSession: false }), {
  type: "open",
  link: { app: "city", countryKey: "spain" },
});

assert.equal(assistBotStartPayload({ country: "spain", tier: "route-check" }), "assist_route_spain");
assert.equal(propertyBotStartPayload("thailand"), "property_thailand");
assert.equal(parseBotStartPayload("assist_partner")?.app, "assist");

assert.equal(isOwnerCallbackData("lg:tg:slug"), true);
assert.equal(isOwnerCallbackData("gd:ok:1"), true);
assert.equal(isOwnerCallbackData("tr:no:abc"), true);
assert.equal(isOwnerCallbackData("news:sub:portugal"), false);
assert.equal(isOwnerCommandText("/stats"), true);
assert.equal(isOwnerCommandText("/start"), false);

console.log("bot-router: ok");
