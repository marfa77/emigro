import { COUNTRY_ACCENTS } from "@/lib/brand/country-accents";

/** Topic / interest key → ISO2 used by hub family facts and ranking. */
const INTEREST_KEY_TO_ISO2: Record<string, string> = {
  portugal: "PT",
  spain: "ES",
  france: "FR",
  italy: "IT",
  germany: "DE",
  netherlands: "NL",
  sweden: "SE",
  scandinavia: "SE",
  norway: "NO",
  finland: "FI",
  denmark: "DK",
  poland: "PL",
  czechia: "CZ",
  austria: "AT",
  greece: "GR",
  cyprus: "CY",
  hungary: "HU",
  malta: "MT",
  bulgaria: "BG",
  croatia: "HR",
  slovenia: "SI",
  estonia: "EE",
};

export function interestKeysToIso2(keys: string[]): string[] {
  const out: string[] = [];
  for (const raw of keys) {
    const key = raw.trim().toLowerCase();
    if (!key) continue;
    const iso = INTEREST_KEY_TO_ISO2[key];
    if (iso && !out.includes(iso)) out.push(iso);
  }
  return out;
}

export function interestKeysToLabelsRu(keys: string[]): string[] {
  const out: string[] = [];
  for (const raw of keys) {
    const key = raw.trim().toLowerCase();
    if (!key) continue;
    const label = COUNTRY_ACCENTS[key]?.label;
    if (label && !out.includes(label)) out.push(label);
  }
  return out;
}

export function parseInterestParam(search: string): { keys: string[]; iso2: string[]; labelsRu: string[] } {
  const interest = new URLSearchParams(search).get("interest") ?? "";
  const keys = interest
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  return {
    keys,
    iso2: interestKeysToIso2(keys),
    labelsRu: interestKeysToLabelsRu(keys),
  };
}

/** URL segment for ranking bonus (matches GlobalEvalResult.countrySegment). */
export function interestIso2ToSegments(iso2List: string[]): string[] {
  const map: Record<string, string> = {
    PT: "portugal",
    ES: "spain",
    FR: "france",
    IT: "italy",
    DE: "germany",
    NL: "netherlands",
    SE: "sweden",
    NO: "norway",
    FI: "finland",
    DK: "denmark",
    PL: "poland",
    CZ: "czechia",
    AT: "austria",
    GR: "greece",
    CY: "cyprus",
    HU: "hungary",
    MT: "malta",
    BG: "bulgaria",
    HR: "croatia",
    SI: "slovenia",
    EE: "estonia",
  };
  return iso2List.map((iso) => map[iso]).filter(Boolean) as string[];
}
