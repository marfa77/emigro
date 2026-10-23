import { AE_PACK } from "./ae";
import { EU_STUB_PACKS } from "./eu-stubs";
import { IT_PACK } from "./it";
import { PT_PACK } from "./pt";
import type { CountryPack } from "./types";
import { UK_PACK } from "./uk";
import { US_PACK } from "./us";

export type { CountryPack, CountryPlaybook, OfficialSource, ThresholdCompare } from "./types";
export { EU_STUB_PACKS } from "./eu-stubs";
export { PT_AE_RENTAL_PLAYBOOK } from "./pt-ae-rental";

export const COMPLETE_PACKS: readonly CountryPack[] = [PT_PACK, AE_PACK, IT_PACK, UK_PACK, US_PACK];

const PACKS = indexPacks();

function indexPacks(): Map<string, CountryPack> {
  const map = new Map<string, CountryPack>();
  for (const pack of COMPLETE_PACKS.concat(EU_STUB_PACKS)) {
    const iso = pack.iso2.toUpperCase();
    if (map.has(iso)) throw new Error(`duplicate tax pack: ${iso}`);
    map.set(iso, pack);
  }
  return map;
}

/** UK is not an ISO code; journals often say UK. Canonical pack id is GB. */
export function canonicalIso2(iso2: string): string | null {
  const code = iso2.trim().toUpperCase();
  if (code === "UK") return "GB";
  if (!/^[A-Z]{2}$/.test(code)) return null;
  return code;
}

function unknownPack(iso2: string): CountryPack {
  return {
    iso2,
    nameRu: iso2,
    complete: false,
    presenceThresholdDays: 183,
    thresholdCompare: "gte",
    notesRu: [
      "Pack incomplete: страны нет среди полных правил (EU, ОАЭ, UK, US). Порог 183 дня — заглушка. Уверенный зелёный и красный не ставим.",
    ],
    tieBreakerQuestionsRu: [
      "Какой местный тест резидентства, и нужен ли отдельный pack вместо ориентира 183 дня?",
    ],
  };
}

export function getPack(iso2: string): CountryPack {
  const code = canonicalIso2(iso2);
  if (!code) return unknownPack(iso2.trim().toUpperCase() || "??");
  return PACKS.get(code) ?? unknownPack(code);
}

export function listPacks(): CountryPack[] {
  return Array.from(PACKS.values());
}
