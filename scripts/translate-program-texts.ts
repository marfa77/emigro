/**
 * One-off (2026-11-19): program requirement values and timeline durations in the DB were partly English
 * («€920/month … or equivalent savings», «2–4 weeks»). Translate them to Russian with Gemini, numbers
 * untouched, then write only rows whose text changed.
 *
 *   npx tsx scripts/translate-program-texts.ts --dry-run   # writes the mapping to --out for review
 *   npx tsx scripts/translate-program-texts.ts --apply <mapping.json>
 */
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createAdminClient } from "@/lib/admin/supabase";

const looksEnglish = (v: string | null) =>
  Boolean(v) && /[A-Za-z]{3,}/.test(v!) && (v!.match(/[а-яё]/gi)?.length ?? 0) < v!.length * 0.3 &&
  /\b(?:weeks?|months?|days?|mo\.|wk|or|and|the|of|with|after|before|for|to|per|year|often|up|within|no|only|via|from)\b/i.test(v!);

const PROMPT = `Переведи строки на русский для сайта о ВНЖ. Правила:
- Все числа, суммы, валюты, диапазоны, проценты, даты и названия органов/документов (AIMA, IND, SIRI, OFII, MA35, ABH, UGE, CMVM, RMMG, SMIC, IPREM, EOOD, OÜ, nulla osta, permesso, cita previa, Termin, Zaświadczenie, Potvrzení, Zulassungsbescheid, MVV и т.п.) сохраняй как есть.
- Названия стран и городов переводи на русский в правильном падеже (Portugal → «Португалии» после «в/для», Berlin → «Берлин», Paris/IDF → «Париж и Иль-де-Франс», Madrid/BCN → «Мадрид и Барселона»).
- Месяцы, недели и дни согласуй с последним числом диапазона: «1–4 месяца», «4–12 месяцев», «3–5 месяцев», «2–4 недели», «5–14 недель», «30–60 дней». «wk» → «нед.».
- Даты по-русски: «1 Jun 2026» → «1 июня 2026».
- Коротко и естественно, без пояснений. Не добавляй факты.
Верни JSON-объект {"оригинал": "перевод"} для всех строк.`;

async function gemini(strings: string[]): Promise<Record<string, string>> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${PROMPT}\n\n${JSON.stringify(strings, null, 0)}` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0 },
      }),
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(text);
}

async function main() {
  const supabase = createAdminClient();
  const apply = process.argv.indexOf("--apply");
  if (apply > -1) {
    const map: Record<string, string> = JSON.parse(readFileSync(process.argv[apply + 1], "utf8"));
    let n = 0;
    for (const [table, col] of [["emigro_program_requirements", "value_text"], ["emigro_program_timeline_steps", "duration_text"]] as const) {
      for (const [from, to] of Object.entries(map)) {
        if (!to || to === from) continue;
        const { data, error } = await supabase.from(table).update({ [col]: to }).eq(col, from).select("id");
        if (error) console.log(`ERROR ${table}: ${error.message}`);
        n += data?.length ?? 0;
      }
    }
    console.log(`updated ${n} row(s)`);
    return;
  }
  const out = process.argv[process.argv.indexOf("--out") + 1];
  const req = await supabase.from("emigro_program_requirements").select("value_text").limit(5000);
  const tl = await supabase.from("emigro_program_timeline_steps").select("duration_text").limit(5000);
  const strings = Array.from(
    new Set([
      ...(req.data ?? []).map((r) => r.value_text as string),
      ...(tl.data ?? []).map((r) => r.duration_text as string),
    ].filter(looksEnglish))
  );
  const map: Record<string, string> = {};
  for (let i = 0; i < strings.length; i += 40) Object.assign(map, await gemini(strings.slice(i, i + 40)));
  writeFileSync(out, JSON.stringify(map, null, 1));
  console.log(`${strings.length} strings → ${Object.keys(map).length} translations in ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
