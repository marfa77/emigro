/**
 * Golden Visa 2026 comparison PDFs from lib/investment/golden-visa-2026.ts (single source of truth).
 *   npx tsx scripts/build-golden-visa-pdf.ts
 * Output: public/assist/emigro_golden_visa_2026_comparison_{ru,en}.pdf (served with X-Robots-Tag: noindex).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  GOLDEN_VISA_LAST_CHECKED,
  GOLDEN_VISA_ROWS,
  INVEST_COMPARE_PDF_PATH,
  PORTUGAL_2026_CALLOUT,
  VERIFY_BADGE,
  investPagePath,
  isVerifyOnly,
  type FactCell,
  type InvestLocale,
} from "../lib/investment/golden-visa-2026";

const SITE = "https://www.emigro.online";
const CHROME =
  process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const COPY = {
  ru: {
    title: "Golden Visa 2026: сравнение программ ВНЖ за инвестиции",
    lastChecked: "Последняя проверка",
    disclaimer: "Не юридическая консультация. Правила меняются — проверяйте по официальному источнику.",
    head: ["Страна", "Мин. инвестиция", "Маршруты", "Срок до гражданства", "Паспорта РФ/РБ", "Официальный источник", "Проверено"],
    footer: "Бесплатный подбор маршрута под ваш паспорт и бюджет",
    utmContent: "pdf_ru",
  },
  en: {
    title: "Golden Visa 2026: investment residency programmes compared",
    lastChecked: "Last checked",
    disclaimer: "Not legal advice. Rules change — verify with the official source.",
    head: ["Country", "Min investment", "Routes", "Time to citizenship", "RU/BY passports", "Official source", "Last checked"],
    footer: "Free route match for your passport and budget",
    utmContent: "pdf_en",
  },
} as const;

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function cell(value: FactCell, locale: InvestLocale): string {
  if (isVerifyOnly(value, locale)) return `<span class="badge">${VERIFY_BADGE[locale]}</span>`;
  return `${esc(value[locale])}${value.verify ? ` <span class="badge">${VERIFY_BADGE[locale]}</span>` : ""}`;
}

function html(locale: InvestLocale): string {
  const t = COPY[locale];
  const pageUrl = `${SITE}${investPagePath(locale, "compare")}?utm_source=pdf&utm_medium=lead_magnet&utm_campaign=golden_visa_2026&utm_content=${t.utmContent}`;
  const rows = GOLDEN_VISA_ROWS.map(
    (row) => `<tr>
  <th>${row.flag} ${esc(row.country[locale])}<small>${esc(row.programme[locale])}</small></th>
  <td>${cell(row.minInvestment, locale)}</td>
  <td>${cell(row.routes, locale)}</td>
  <td>${cell(row.citizenship, locale)}</td>
  <td class="${row.ruBy.status === "restricted" ? "warn" : ""}">${cell(row.ruBy, locale)}</td>
  <td class="src">${row.sources.map((s) => `<a href="${esc(s.url)}">${esc(s.label)}</a>`).join("<br>")}</td>
  <td>${row.lastChecked ?? `<span class="badge">${VERIFY_BADGE[locale]}</span>`}</td>
</tr>`
  ).join("\n");

  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${esc(t.title)} — Emigro</title>
<style>
  @page { size: A4 landscape; margin: 12mm 10mm; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; color: #0f172a; font-size: 8.6pt; line-height: 1.35; }
  h1 { font-size: 16pt; margin: 0 0 4px; }
  .meta { color: #475569; margin: 0 0 8px; }
  .callout { border: 1px solid #fcd34d; background: #fffbeb; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px; color: #78350f; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  thead th { background: #f1f5f9; text-align: left; font-size: 7.6pt; text-transform: uppercase; letter-spacing: .03em; color: #475569; }
  th, td { border-top: 1px solid #e2e8f0; padding: 5px 6px; vertical-align: top; text-align: left; }
  tbody tr { page-break-inside: avoid; }
  tbody th small { display: block; font-weight: 400; color: #64748b; }
  col.c1 { width: 11%; } col.c2 { width: 11%; } col.c3 { width: 27%; } col.c4 { width: 15%; } col.c5 { width: 14%; } col.c6 { width: 14%; } col.c7 { width: 8%; }
  .warn { color: #9f1239; font-weight: 600; }
  .src a { color: #0f5f73; word-break: break-word; }
  .badge { display: inline-block; background: #fef3c7; color: #78350f; border: 1px solid #fde68a; border-radius: 8px; padding: 0 4px; font-size: 6.8pt; font-weight: 700; text-transform: uppercase; }
  footer { margin-top: 10px; color: #475569; }
  footer a { color: #0f5f73; font-weight: 600; }
</style>
</head>
<body>
<h1>${esc(t.title)}</h1>
<p class="meta"><strong>${t.lastChecked}: ${GOLDEN_VISA_LAST_CHECKED}</strong> · ${esc(t.disclaimer)}</p>
<div class="callout">${esc(PORTUGAL_2026_CALLOUT[locale])}</div>
<table>
<colgroup><col class="c1"><col class="c2"><col class="c3"><col class="c4"><col class="c5"><col class="c6"><col class="c7"></colgroup>
<thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
<tbody>
${rows}
</tbody>
</table>
<footer>Emigro · ${esc(t.footer)}: <a href="${esc(pageUrl)}">${esc(`${SITE.replace("https://", "")}${investPagePath(locale, "compare")}`)}</a></footer>
</body>
</html>`;
}

function main() {
  if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_BIN`);
  const dir = mkdtempSync(join(tmpdir(), "gv-pdf-"));
  for (const locale of ["ru", "en"] as const) {
    const htmlPath = join(dir, `golden-visa-${locale}.html`);
    writeFileSync(htmlPath, html(locale), "utf8");
    const out = resolve("public", INVEST_COMPARE_PDF_PATH[locale].replace(/^\//, ""));
    mkdirSync(resolve(out, ".."), { recursive: true });
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--print-to-pdf=${out}`,
        `file://${htmlPath}`,
      ],
      { stdio: "pipe" }
    );
    console.log(`wrote ${out}`);
  }
}

main();
