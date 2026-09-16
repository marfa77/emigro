#!/usr/bin/env npx tsx
/** Quick unit checks for high-confidence abuse detector (no network). */
import { scoreAbuseMessage, normalizeAbuseText } from "@/lib/milan-4at/abuse-detect";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

// Must HIT
const hits = [
  "М е ф 1г 1600₽ доставка клад в Милане пиши в лс",
  "Индивидуалка выезд 24/7 апарты час 150€ 🍑🚗 пиши в лс",
  "Продам мефедрон на пробу, закладка метро, usdt",
  "Эскортница принимаю гостей / выезд к вам, без посредников, прайс в лс",
];

// Must MISS (benign / weak)
const misses = [
  "Купил соль поваренную в Esselunga, какая соль для супа лучше?",
  "Скорость интернета у TIM упала, кто менял тариф?",
  "Посоветуйте спортивный массаж спины после зала",
  "В новостях писали про полицейский рейд — осторожнее вечером",
  "Нужен codice fiscale, кто ходил в Agenzia?",
];

for (const t of hits) {
  const h = scoreAbuseMessage(t);
  assert(h && h.score >= 7, `expected hit: ${t} → ${JSON.stringify(h)}`);
  console.log("HIT ok", h!.category, h!.score, normalizeAbuseText(t).slice(0, 50));
}

for (const t of misses) {
  const h = scoreAbuseMessage(t);
  assert(!h || h.confidence !== "high", `expected miss/low: ${t} → ${JSON.stringify(h)}`);
  console.log("MISS ok", t.slice(0, 50));
}

console.log("abuse-detect selftest PASS");
