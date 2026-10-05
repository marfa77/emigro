import assert from "node:assert/strict";
import {
  parseNewsBotCallback,
  parseNewsBotIntent,
  parseNewsStartPayload,
} from "../lib/news/bot-subscribe-commands";
import { formatNewsBotCardHtml } from "../lib/news/bot-push";
import { newsBotHowToHtml, resolveNewsBotTopic } from "../lib/news/bot-subscribe-topics";
import { newsBotDeepLink, newsBotStartPayload } from "../lib/telegram/deep-link";

assert.equal(resolveNewsBotTopic("португалия")?.key, "portugal");
assert.equal(resolveNewsBotTopic("валенсия")?.key, "spain");
assert.equal(resolveNewsBotTopic("милан")?.key, "italy");
assert.equal(resolveNewsBotTopic("пхукет")?.key, "thailand");
assert.equal(resolveNewsBotTopic("germany")?.key, "germany");

assert.equal(parseNewsStartPayload("news_portugal")?.key, "portugal");
assert.equal(parseNewsStartPayload("news"), "picker");
assert.equal(parseNewsStartPayload("porto_chat"), null);

assert.equal(parseNewsBotIntent("новости Португалия")?.type, "subscribe");
assert.equal(parseNewsBotIntent("/news spain")?.type, "subscribe");
assert.equal((parseNewsBotIntent("/news spain") as { topic?: { key: string } }).topic?.key, "spain");
assert.equal(parseNewsBotIntent("новости")?.type, "subscribe");
assert.equal((parseNewsBotIntent("новости") as { topic?: unknown }).topic, undefined);
assert.equal(parseNewsBotIntent("отписка")?.type, "unsubscribe");
assert.equal(parseNewsBotIntent("/stop italy")?.type, "unsubscribe");
assert.equal(parseNewsBotIntent("/start news_italy")?.type, "subscribe");
assert.equal((parseNewsBotIntent("/start news_italy") as { topic?: { key: string } }).topic?.key, "italy");
assert.equal(parseNewsBotIntent("как подписаться на новости")?.type, "help");
assert.equal(parseNewsBotIntent("чат порту"), null);

assert.equal(parseNewsBotCallback("news:sub:portugal")?.type, "subscribe");
assert.equal(parseNewsBotCallback("news:unsub:all")?.type, "unsubscribe");

assert.equal(newsBotStartPayload("portugal"), "news_portugal");
assert.match(newsBotDeepLink("spain"), /start=news_spain/);
assert.match(newsBotHowToHtml(), /Подписка только здесь/);

const card = formatNewsBotCardHtml({
  id: "1",
  slug: "portugal-story-2026-10-05-abc",
  topic_key: "portugal",
  title: "AIMA меняет очередь",
  excerpt: "Коротко: цита.",
  published_at: "2026-10-05T10:00:00.000Z",
});
assert.match(card, /Португалия/);
assert.match(card, /AIMA меняет очередь/);
assert.match(card, /\/ru\/news\/portugal-story-2026-10-05-abc/);
assert.match(card, /отписка/);

console.log("news-bot-subscribe: ok");
