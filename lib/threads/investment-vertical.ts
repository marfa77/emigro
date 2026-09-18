/**
 * Preparation-only inventory for a separate investment-migration Threads account.
 *
 * This module intentionally has no Graph client, token loader, scheduler, or publish
 * function. A future manual workflow may consume these records after legal review.
 */
import { INVESTMENT_ROUTES, routeKey } from "@/lib/investment/registry";
import {
  expectedThreadsBrandUsername,
  normalizeThreadsUsername,
} from "@/lib/threads/config";

export const THREADS_INVESTMENT_VERTICAL_ID = "investment_migration";
export const THREADS_INVESTMENT_CAMPAIGN = "emigro_threads_investment";
export const THREADS_INVESTMENT_ENV_PREFIX = "THREADS_INVESTMENT_";
export const THREADS_INVESTMENT_USERNAME = "emigro_invest";

export const THREADS_INVESTMENT_EDITORIAL_SCOPE = [
  "legal_status",
  "property_documents",
  "investment_documents",
  "source_verified_program_changes",
] as const;

export type ThreadsInvestmentInventoryItem = {
  slug: string;
  country: string;
  countryRu: string;
  topicTag: string;
  sourcePath: string;
  sourceUrl: string;
  headline: string;
  fact: string;
  caveat: string;
  reviewRequired: true;
};

export type ThreadsInvestmentVerticalConfig = {
  verticalId: typeof THREADS_INVESTMENT_VERTICAL_ID;
  username: string;
  envPrefix: typeof THREADS_INVESTMENT_ENV_PREFIX;
  campaign: typeof THREADS_INVESTMENT_CAMPAIGN;
  autoPublish: false;
  accountCreationSupported: false;
  editorialScope: typeof THREADS_INVESTMENT_EDITORIAL_SCOPE;
};

/**
 * Reads identity only. Credentials deliberately remain outside the shared Threads
 * config so this vertical cannot inherit the main or Thailand-general account.
 */
export function loadThreadsInvestmentVerticalConfig(): ThreadsInvestmentVerticalConfig {
  return {
    verticalId: THREADS_INVESTMENT_VERTICAL_ID,
    username: normalizeThreadsUsername(
      process.env.THREADS_INVESTMENT_USERNAME || THREADS_INVESTMENT_USERNAME
    ),
    envPrefix: THREADS_INVESTMENT_ENV_PREFIX,
    campaign: THREADS_INVESTMENT_CAMPAIGN,
    autoPublish: false,
    accountCreationSupported: false,
    editorialScope: THREADS_INVESTMENT_EDITORIAL_SCOPE,
  };
}

export function assertThreadsInvestmentAccountIsolated(
  primaryUsername = expectedThreadsBrandUsername()
): void {
  const { username } = loadThreadsInvestmentVerticalConfig();
  if (!username) {
    throw new Error("THREADS_INVESTMENT_USERNAME is required for account identity checks.");
  }
  if (username === normalizeThreadsUsername(primaryUsername)) {
    throw new Error("Investment Threads must use a separate account from the main/Thailand stream.");
  }
}

/** Registry-backed discovery inventory, following the existing source-first convention. */
export function buildThreadsInvestmentInventory(
  siteBase = process.env.EMIGRO_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.emigro.online"
): ThreadsInvestmentInventoryItem[] {
  const base = siteBase.replace(/\/$/, "");
  return INVESTMENT_ROUTES.filter((route) => route.propertyLinked && route.status !== "closed").map((route) => {
    const sourcePath = `/ru/invest/${route.country}`;
    const sourceUrl = new URL(sourcePath, `${base}/`);
    sourceUrl.searchParams.set("utm_source", "threads");
    sourceUrl.searchParams.set("utm_medium", "social");
    sourceUrl.searchParams.set("utm_campaign", THREADS_INVESTMENT_CAMPAIGN);
    sourceUrl.searchParams.set("utm_content", routeKey(route));

    return {
      slug: `investment-${routeKey(route)}`,
      country: route.country,
      countryRu: route.countryRu,
      topicTag: route.countryRu,
      sourcePath,
      sourceUrl: sourceUrl.toString(),
      headline: route.title,
      fact: route.summary,
      caveat: route.caveat,
      reviewRequired: true,
    };
  });
}
