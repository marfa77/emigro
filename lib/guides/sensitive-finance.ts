/**
 * Sanctions / payment-services guides: editorial sources come before reader stories
 * and sponsor blocks, and brand mentions in the body stay unlinked (no referral inline).
 */
const SENSITIVE_FINANCE_GUIDE_SLUGS = new Set<string>(["bank-i-iban-dlya-rossiyan-v-evrope-2026"]);

export function isSensitiveFinanceGuide(slug: string): boolean {
  return SENSITIVE_FINANCE_GUIDE_SLUGS.has(slug);
}
