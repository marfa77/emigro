/** Curated practice notes — deep links from www.emigro.online/ru/italy for crawl signals. */
export type ItalyFeaturedNote = {
  slug: string;
  title: string;
  description: string;
};

export const ITALY_FEATURED_NOTES: ItalyFeaturedNote[] = [
  {
    slug: "codice-fiscale-milano-2026",
    title: "Codice fiscale в Milano",
    description: "AA4/8, Agenzia Entrate, что без кода нельзя в первую неделю.",
  },
  {
    slug: "permesso-questura-milano-2026",
    title: "Permesso и Questura Milano",
    description: "Kit postale, 8 giorni, Schengen ≠ permesso.",
  },
  {
    slug: "arenda-milano-idealista-2026",
    title: "Аренда в Milano: Idealista",
    description: "Contratto, caparra, CF + IBAN до подписи. Como как Nord.",
  },
  {
    slug: "pervye-30-dnej-v-italii-satelit-2026",
    title: "Первые 30 дней в Италии",
    description: "Чеклист 72 часа → неделя 4: связь, CF, крыша, Questura.",
  },
  {
    slug: "meditsina-milano-ssn-tessera-2026",
    title: "SSN и tessera в Milano",
    description: "Medico di base ATS, частное, pronto soccorso.",
  },
  {
    slug: "bank-iban-nerezident-italiya-2026",
    title: "Банк и IBAN нерезидента",
    description: "IT IBAN vs Revolut. KYC для RU/BY в Milano.",
  },
];
