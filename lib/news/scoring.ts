import type { NewsTopicConfig } from "@/lib/news/topics";

export const TRUSTED_DOMAINS = [
  "reuters.com",
  "bloomberg.com",
  "ft.com",
  "theguardian.com",
  "politico.eu",
  "euronews.com",
  "schengenvisainfo.com",
  "theportugalnews.com",
  "portugalresident.com",
  "thelocal.pt",
  "dutchnews.nl",
  "nltimes.nl",
  "publico.pt",
  "expresso.pt",
  "observador.pt",
  "eco.pt",
  "eco.sapo.pt",
  "portugal.gov.pt",
  "imidaily.com",
  "parlamento.pt",
  "dre.pt",
  "boe.es",
  "inclusion.gob.es",
  "gov.uk",
  "interior.gob.es",
  "interieur.gouv.fr",
  "bund.de",
  "ind.nl",
];

const CRITICAL_RISK_TERMS = [
  "5 years",
  "five years",
  "10 years",
  "ten years",
  "citizenship law",
  "nationality law",
  "naturalization",
  "waiting period",
  "residency requirement",
  "amendment",
  "bill",
  "proposal",
  "гражданств",
  "натурализ",
  "5 лет",
  "10 лет",
];

const STRONG_KEYWORDS = [
  "golden visa",
  "vistos gold",
  "visto gold",
  "residence by investment",
  "investidores",
  "investidor",
  "provedor de justiça",
  "provedoria",
  "lei da nacionalidade",
  "aima",
  "digital nomad",
  "blue card",
  "investor visa",
  "family reunification",
];

const LAW_SIGNALS = [
  "new law",
  "law reform",
  "parliament",
  "decree-law",
  "decreto-lei",
  "nationality law",
  "citizenship law",
  "lei da nacionalidade",
  "tribunal constitucional",
  "regime transitório",
  "regime transitorio",
  "zona cinzenta",
  "grey zone",
  "legislation",
  "immigration law",
  "visa policy",
  "ação contra o estado",
  "acao contra o estado",
  "legal action",
  "class action",
];

const MEDIUM_KEYWORDS = [
  "immigration",
  "visa",
  "residency",
  "residence permit",
  "schengen",
  "consulate",
  "prefecture",
  "naturalization",
  "ari",
  "ombudsman",
  "backlog",
  "atraso",
];

export function domainFromLink(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "unknown";
  }
}

export function normalizeLink(link: string): string {
  try {
    const u = new URL(link);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid"]) {
      u.searchParams.delete(key);
    }
    return u.toString();
  } catch {
    return link.trim();
  }
}

export function isCriticalInvestorRiskText(text: string): boolean {
  const t = text.toLowerCase();
  const hasTerm = CRITICAL_RISK_TERMS.some((w) => t.includes(w.toLowerCase()));
  const has5to10 =
    /(?:^|\D)(?:5|five|пять)\s*(?:-|to|→|до)?\s*(?:10|ten|десять)\s*(?:year|years|лет)/i.test(t) ||
    (/citizenship|nationality|naturalization|гражданств|nacionalidade|cidadania/i.test(t) &&
      /(?:5|five|cinco|пять)\s*(?:year|years|anos|лет)/i.test(t) &&
      /(?:10|ten|dez|десять)\s*(?:year|years|anos|лет)/i.test(t));
  return hasTerm && has5to10;
}

/** PT Golden Visa / ARI «grey zone»: invested ~4–5y ago for a 5y passport path, now stuck. */
export function isPortugalGoldenVisaInvestorDisputeText(text: string): boolean {
  const t = text.toLowerCase();
  const hasGv =
    /golden visa|vistos?\s*gold|visto gold|\bari\b|autorização de residência para investimento|residence by investment|investidores?(?:\s+dos)?\s+vistos|золотая виза|золотой виз|инвестор(?:ы|ов|ам)?\s+(?:золотой|golden|ari)/.test(
      t
    );
  const hasGreyOrDispute =
    /zona cinzent|grey zone|gray zone|серая зон|переходн|regime transitór|regime transitor|provedor|provedoria|ombudsman|queixa|ação contra|acao contra|legal action|lawsuit|tribunal constitucional|10\s*anos|dez anos|nacionalidade|citizenship law|nationality law|lei da nacionalidade|aima|atraso|backlog|enganad|lesad|обманут|sem cartão|without (?:a )?residence card|clock starts|conta(?:r)?\s+a\s+partir|from (?:the )?application|após (?:a )?emissão|after (?:the )?issuance|2021|2022|cinco anos|5\s*anos|5\s*лет|пять лет/.test(
      t
    );
  return hasGv && hasGreyOrDispute;
}

export function isSpainGoldenVisaBaitText(text: string): boolean {
  const t = text.toLowerCase();
  const hasSpain = /spain|spanish|испани/.test(t);
  const hasGoldenVisa = /golden visa|золот\w*\s+виз|инвесторск\w*\s+виз|residence by investment/.test(t);
  const hasClosedRealEstateRoute = /real[\s-]?estate|property|недвижимост|покупк\w*\s+жиль/.test(t);
  const hasBaitFrame =
    /last chance|closing soon|about to close|still open|still available|hurry|urgent|последн\w*\s+шанс|скоро\s+закро|срочно|успеть\s+подать|ещ[её]\s+открыт/.test(
      t
    );
  const hasTransitionalFrame =
    /transitional|pending|already filed|before 2025-04-03|до 2025-04-03|до 3 апреля 2025|переходн\w*\s+правил|ранее\s+подан/.test(
      t
    );
  return hasSpain && hasGoldenVisa && hasClosedRealEstateRoute && hasBaitFrame && !hasTransitionalFrame;
}

function keywordScore(text: string, topic: NewsTopicConfig): number {
  const t = text.toLowerCase();
  let score = 0;
  for (const w of STRONG_KEYWORDS) if (t.includes(w)) score += 7;
  for (const w of LAW_SIGNALS) if (t.includes(w)) score += 5;
  for (const w of MEDIUM_KEYWORDS) if (t.includes(w)) score += 2;
  if (isCriticalInvestorRiskText(t)) score += 12;
  if (topic.key === "portugal" && isPortugalGoldenVisaInvestorDisputeText(t)) score += 16;
  const countryTokens = [topic.countryEn, topic.countryRu, topic.key].map((s) => s.toLowerCase());
  for (const token of countryTokens) {
    if (token && t.includes(token)) score += 3;
  }
  if (topic.key === "spain" && isSpainGoldenVisaBaitText(text)) score -= 18;
  return score;
}

export function computeNewsScore(
  title: string,
  snippet: string,
  link: string,
  pubDate: string,
  topic: NewsTopicConfig,
  referenceMs?: number
): number {
  let score = keywordScore(`${title} ${snippet}`, topic);
  const domain = domainFromLink(link);
  if (TRUSTED_DOMAINS.some((d) => domain.endsWith(d))) score += 8;
  if (link.includes(".gov") || domain.endsWith(".gov.pt")) score += 5;
  if (domain.includes("news.google.com")) score -= 6;

  const ref = referenceMs ?? Date.now();
  const ageMs = ref - new Date(pubDate).getTime();
  const ageDays = Number.isFinite(ageMs) ? ageMs / (1000 * 60 * 60 * 24) : 10;
  if (ageDays <= 1) score += 5;
  else if (ageDays <= 3) score += 3;
  else if (ageDays <= 7) score += 1;
  else score -= 5;

  return score;
}

const LOW_TRUST_DOMAINS = new Set(["mshale.com", "harici.com.tr", "news.google.com"]);

export function isLowTrustSource(link: string): boolean {
  const domain = domainFromLink(link).toLowerCase();
  return LOW_TRUST_DOMAINS.has(domain) || domain.endsWith(".news.google.com");
}
