/** Static fallback catalog aligned with supabase/migrations seed data. */

export type MetaCodeRow = { code: string; label_en: string; label_ru: string };

export const PROGRAM_TYPES_FALLBACK: MetaCodeRow[] = [
  { code: "LABOR", label_en: "Work & remote income", label_ru: "Работа и удалённый доход" },
  { code: "CAPITAL", label_en: "Passive income & savings", label_ru: "Пассивный доход и сбережения" },
  { code: "BOND", label_en: "Family ties", label_ru: "Семейные связи" },
];

export const STEP_TYPES_FALLBACK: MetaCodeRow[] = [
  { code: "document_prep", label_en: "Document preparation", label_ru: "Подготовка документов" },
  { code: "application", label_en: "Consular application", label_ru: "Подача в консульство" },
  { code: "residence", label_en: "Residence permit", label_ru: "ВНЖ" },
  { code: "language_requirement", label_en: "Language requirement", label_ru: "Языковое требование" },
  { code: "citizenship", label_en: "Citizenship path", label_ru: "Путь к гражданству" },
];

export const REQUIREMENT_TYPES_FALLBACK: MetaCodeRow[] = [
  { code: "income", label_en: "Income", label_ru: "Доход" },
  { code: "savings", label_en: "Savings", label_ru: "Сбережения" },
  { code: "insurance", label_en: "Insurance", label_ru: "Страховка" },
  { code: "family", label_en: "Family", label_ru: "Семья" },
  { code: "documents", label_en: "Documents", label_ru: "Документы" },
  { code: "min_investment_eur", label_en: "Minimum investment", label_ru: "Минимальная инвестиция" },
  { code: "citizenship", label_en: "Citizenship path", label_ru: "Путь к гражданству" },
  { code: "timeline", label_en: "Timeline note", label_ru: "Сроки" },
];

export const EVALUATION_OUTCOMES_FALLBACK: MetaCodeRow[] = [
  { code: "likely_eligible", label_en: "Likely eligible", label_ru: "Вероятно подходит" },
  { code: "needs_review", label_en: "Needs review", label_ru: "Требует проверки" },
  { code: "unlikely", label_en: "Unlikely", label_ru: "Маловероятно" },
];

/** Program route outcomes for contributor ingest (see API_CONTRIBUTOR_GUIDE.md). */
export const PROGRAM_OUTCOMES: MetaCodeRow[] = [
  { code: "temporary", label_en: "Temporary stay", label_ru: "Временное пребывание" },
  { code: "residency", label_en: "Residency permit", label_ru: "Вид на жительство" },
  { code: "pr", label_en: "Permanent residence", label_ru: "ПМЖ" },
  { code: "citizenship_direct", label_en: "Direct citizenship", label_ru: "Гражданство напрямую" },
  { code: "citizenship_path", label_en: "Citizenship path", label_ru: "Путь к гражданству" },
];

export const COST_TYPES = [
  "government_fee",
  "legal_estimate",
  "min_investment",
  "health_insurance_annual",
  "other",
] as const;

export const PASSPORT_ELIGIBILITY_STATUSES = ["eligible", "blocked", "conditional", "unknown"] as const;

export const SOURCE_TYPES = ["official", "embassy", "legislation", "secondary"] as const;

export const PROPOSAL_OPERATIONS = ["create", "update", "refresh", "deprecate"] as const;

export const ENTITY_TYPES = [
  "program",
  "program_source",
  "program_requirement",
  "program_cost",
  "program_timeline_step",
  "passport_eligibility",
] as const;
