/**
 * Rewrite a RU guide's English jargon into plain Russian with Gemini, section by section,
 * keeping every number, link, table and heading (2026-11-20, UAE guides). Output goes to a file for review:
 *
 *   npx tsx scripts/dejargon-guide.ts content/guides/ru/<slug>.md /tmp/out.md
 */
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const PROMPT = `Ты редактор русскоязычного сайта о ВНЖ. Перепиши фрагмент markdown простым русским языком.
Строгие правила:
- НЕ сокращай: сохрани все мысли, все предложения по смыслу, все списки, таблицы, заголовки и порядок.
- Сохрани ВСЕ числа, суммы, даты, проценты и ВСЕ ссылки markdown [текст](url) — url не меняй вообще.
- Англицизмы и английские фразы замени русскими: ask → цена продавца; registered sold → цена реальной сделки в реестре DLD; due diligence → проверка; KYC → проверка банком (KYC) при первом упоминании; source of funds / SoF → происхождение денег; source of wealth / SoW → происхождение капитала; joint → совместная собственность; sole owner → единственный владелец; title deed → свидетельство о собственности (title deed) при первом упоминании; off-plan → строящийся объект (off-plan) при первом упоминании; ready → готовый объект; mortgage → ипотека; paid amount → выплаченная сумма; balance → остаток долга; handoff → передача заявки; substance → реальная деятельность; free zone → фризона; mainland → «материковая» юрисдикция (mainland) при первом упоминании; freelance permit → фриланс-разрешение; employment visa → рабочая виза; trade licence → лицензия компании; salary certificate → справка о зарплате; resident-banking → счёт для резидентов; risk profile / risk appetite → готовность банка рисковать; Golden Residence → Golden Visa; property → недвижимость; pillar → основной гид; qualifier → анкета.
- Оставь как есть: названия органов, сервисов, банков, фризон и программ (DLD, ICP, GDRFA, FTA, CBUAE, QFZP, IFZA, DMCC, RAKEZ, Emirates NBD, Cube, Taskeen, Oqood, Ejari, NOC, Emirates ID, Golden Visa, Green Visa, AED, uaeproperty.vip, Emigro).
- Никаких новых фактов. Верни только переписанный markdown без пояснений.`;

async function gemini(text: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: `${PROMPT}\n\n---\n${text}` }] }], generationConfig: { temperature: 0 } }),
    });
    const data = await res.json();
    const out = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    if (out.trim()) return out.replace(/^```(?:markdown)?\n?|\n?```$/g, "").trim();
  }
  throw new Error("Gemini returned empty text three times");
}

async function main() {
  const [src, out] = process.argv.slice(2);
  const raw = readFileSync(src, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("no frontmatter");
  const sections = m[2].split(/\n(?=## )/);
  const done = await Promise.all(sections.map((sec) => gemini(sec)));
  writeFileSync(out, `---\n${m[1]}\n---\n\n${done.join("\n\n")}\n`);
  console.log(`sections ${sections.length} → ${out}`);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
