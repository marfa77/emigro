import { createHmac, timingSafeEqual } from "node:crypto";
import { publicSiteUrl } from "@/lib/site-url";
import type { InvestLocale } from "@/lib/investment/golden-visa-2026";

export const INVEST_PDF_API_PATH = "/api/v1/investment/pdf";
export const INVEST_PDF_TTL_MS = 24 * 60 * 60 * 1000;

/** Lives outside `public/` so the file is reachable only through a signed link. */
export const INVEST_PDF_DIR = "private/assist";

export function investPdfFileName(locale: InvestLocale): string {
  return `emigro_golden_visa_2026_comparison_${locale}.pdf`;
}

function secret(): string | undefined {
  return process.env.EMIGRO_ADMIN_SECRET?.trim() || process.env.CRON_SECRET?.trim();
}

function signature(key: string, locale: InvestLocale, exp: number): string {
  return createHmac("sha256", key).update(`golden-visa-pdf|${locale}|${exp}`).digest("base64url");
}

/** Absolute signed URL, or null when no signing secret is configured. */
export function signInvestPdfUrl(locale: InvestLocale, ttlMs: number = INVEST_PDF_TTL_MS): string | null {
  const key = secret();
  if (!key) return null;
  const exp = Date.now() + ttlMs;
  const params = new URLSearchParams({ locale, exp: String(exp), sig: signature(key, locale, exp) });
  return `${publicSiteUrl()}${INVEST_PDF_API_PATH}/${investPdfFileName(locale)}?${params.toString()}`;
}

export function verifyInvestPdfSignature(locale: InvestLocale, expRaw: string | null, sig: string | null): boolean {
  const key = secret();
  if (!key || !expRaw || !sig || !/^\d{1,16}$/.test(expRaw)) return false;
  const exp = Number(expRaw);
  if (exp < Date.now()) return false;
  const actual = Buffer.from(sig);
  const wanted = Buffer.from(signature(key, locale, exp));
  return actual.length === wanted.length && timingSafeEqual(actual, wanted);
}
