import { investmentCountryRoutes } from "@/lib/investment/registry";

export type InvestmentPartnerRole = "property" | "legal";

export type InvestmentPartner = {
  id: string;
  name: string;
  role: InvestmentPartnerRole;
  countries: string[];
  signed: boolean;
  /** Qualified unassigned leads required before a new country is offered to a partner. */
  activationMinQualifiedLeads: number;
};

export const INVESTMENT_PARTNERS: readonly InvestmentPartner[] = [
  {
    id: "empyreal-estate-phuket",
    name: "Empyreal Estate Phuket",
    role: "property",
    countries: ["thailand"],
    signed: true,
    activationMinQualifiedLeads: 0,
  },
];

/** Sister tools are not CRM partners — never auto-assign leads to them. */
export const INVESTMENT_SISTER_TOOLS = [
  {
    id: "dubai-offer-verdict",
    name: "Dubai Offer Verdict",
    countries: ["uae"],
    url: "https://uaeproperty.vip",
    role: "dld_due_diligence" as const,
  },
] as const;

export const PARTNER_SEARCH_THRESHOLD = 3;

export function partnerForCountry(country: string | undefined): InvestmentPartner | undefined {
  return INVESTMENT_PARTNERS.find((partner) => partner.signed && partner.countries.includes(country ?? ""));
}

export function partnerDemandState(country: string, qualifiedLeads: number): {
  state: "manual_partner" | "search_partners" | "collecting_demand" | "closed";
  partner?: InvestmentPartner;
  remaining: number;
} {
  const routes = investmentCountryRoutes(country);
  if (routes.length > 0 && routes.every((route) => route.status === "closed")) {
    return { state: "closed", remaining: 0 };
  }
  const partner = partnerForCountry(country);
  if (partner && qualifiedLeads >= partner.activationMinQualifiedLeads) {
    return { state: "manual_partner", partner, remaining: 0 };
  }
  const remaining = Math.max(PARTNER_SEARCH_THRESHOLD - qualifiedLeads, 0);
  return {
    state: remaining === 0 ? "search_partners" : "collecting_demand",
    remaining,
  };
}
