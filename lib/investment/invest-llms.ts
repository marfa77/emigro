import {
  GOLDEN_VISA_LAST_CHECKED,
  GOLDEN_VISA_ROWS,
  VERIFY_BADGE,
  investPagePath,
  isVerifyOnly,
  type GoldenVisaRow,
  type InvestLocale,
} from "@/lib/investment/golden-visa-2026";
import { llmMarkdownLink } from "@/lib/seo/llm-meta";

function rowFact(row: GoldenVisaRow, locale: InvestLocale): string {
  if (row.status === "closed") return row.routes[locale];
  const verify = locale === "en" ? " (being verified)" : " (уточняется)";
  const ruBy = isVerifyOnly(row.ruBy, locale) ? VERIFY_BADGE[locale] : `${row.ruBy[locale]}${row.ruBy.verify ? verify : ""}`;
  return locale === "en"
    ? `${row.programme.en}: from ${row.minInvestment.en}; citizenship: ${row.citizenship.en}; RU/BY: ${ruBy}.`
    : `${row.programme.ru}: от ${row.minInvestment.ru}; гражданство: ${row.citizenship.ru}; РФ/РБ: ${ruBy}.`;
}

/** `## Investment residency` block for /llms.txt and /llms-full.txt (one data file → pages, PDF, JSON-LD, llms). */
export function buildInvestLlmsSection(): string {
  const lines: string[] = [
    `## Investment residency / ВНЖ за инвестиции (checked ${GOLDEN_VISA_LAST_CHECKED})`,
    "",
    `- ${llmMarkdownLink("Investment residency 2026 (EN hub)", investPagePath("en", "hub"))} — 8 programmes, dated facts, official sources, free route match.`,
    `- ${llmMarkdownLink("Golden Visa 2026 comparison (EN)", investPagePath("en", "compare"))} — 8 programmes in one HTML table: min investment, routes, time to citizenship, RU/BY eligibility, official source, last checked.`,
    ...GOLDEN_VISA_ROWS.map(
      (row) => `- ${llmMarkdownLink(`${row.country.en} — ${row.programme.en}`, investPagePath("en", row.slug))} — ${rowFact(row, "en")}`
    ),
    `- ${llmMarkdownLink("Инвестиционная миграция (RU хаб)", investPagePath("ru", "hub"))} — маршруты ВНЖ/ПМЖ за капитал, бесплатный подбор, qualifier.`,
    `- ${llmMarkdownLink("Сравнение Golden Visa 2026 (RU)", investPagePath("ru", "compare"))} — 8 программ: минимальная инвестиция, маршруты, срок до гражданства, паспорта РФ/РБ, официальные источники.`,
    ...GOLDEN_VISA_ROWS.map(
      (row) => `- ${llmMarkdownLink(`${row.country.ru} — ${row.programme.ru}`, investPagePath("ru", row.slug))} — ${rowFact(row, "ru")}`
    ),
  ];
  return lines.join("\n");
}
