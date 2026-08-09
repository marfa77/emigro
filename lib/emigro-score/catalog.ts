import { TRANSIT_HUBS } from "@/lib/transit-hubs";
import { EMIGRO_SCORE_REGISTRY } from "./registry";
import { emigroScoreOverall100, emigroScoreTone, toEmigroScoreView } from "./score";
import type { EmigroScoreTone } from "./types";

const CORRIDOR_LABELS: Record<string, { ru: string; flag: string; path: string }> = {
  portugal: { ru: "Португалия", flag: "🇵🇹", path: "/ru/portugal" },
  spain: { ru: "Испания", flag: "🇪🇸", path: "/ru/spain" },
  france: { ru: "Франция", flag: "🇫🇷", path: "/ru/france" },
  italy: { ru: "Италия", flag: "🇮🇹", path: "/ru/italy" },
  germany: { ru: "Германия", flag: "🇩🇪", path: "/ru/germany" },
  netherlands: { ru: "Нидерланды", flag: "🇳🇱", path: "/ru/netherlands" },
  sweden: { ru: "Швеция", flag: "🇸🇪", path: "/ru/sweden" },
  norway: { ru: "Норвегия", flag: "🇳🇴", path: "/ru/norway" },
  finland: { ru: "Финляндия", flag: "🇫🇮", path: "/ru/finland" },
  denmark: { ru: "Дания", flag: "🇩🇰", path: "/ru/denmark" },
  austria: { ru: "Австрия", flag: "🇦🇹", path: "/ru/austria" },
  greece: { ru: "Греция", flag: "🇬🇷", path: "/ru/greece" },
  cyprus: { ru: "Кипр", flag: "🇨🇾", path: "/ru/cyprus" },
  hungary: { ru: "Венгрия", flag: "🇭🇺", path: "/ru/hungary" },
  malta: { ru: "Мальта", flag: "🇲🇹", path: "/ru/malta" },
  bulgaria: { ru: "Болгария", flag: "🇧🇬", path: "/ru/bulgaria" },
  croatia: { ru: "Хорватия", flag: "🇭🇷", path: "/ru/croatia" },
  slovenia: { ru: "Словения", flag: "🇸🇮", path: "/ru/slovenia" },
  estonia: { ru: "Эстония", flag: "🇪🇪", path: "/ru/estonia" },
};

export type EmigroScoreCatalogRow = {
  countryId: string;
  countryRu: string;
  flag: string;
  path: string;
  overall100: number;
  tone: EmigroScoreTone;
  summary: string;
  asOf: string;
};

function labelFor(countryId: string): { ru: string; flag: string; path: string } | null {
  const corridor = CORRIDOR_LABELS[countryId];
  if (corridor) return corridor;
  const hub = TRANSIT_HUBS.find((h) => h.slug === countryId);
  if (hub) return { ru: hub.countryRu, flag: hub.flag, path: hub.path };
  return null;
}

export function listEmigroScoreCatalog(): EmigroScoreCatalogRow[] {
  const rows: EmigroScoreCatalogRow[] = [];
  for (const score of Object.values(EMIGRO_SCORE_REGISTRY)) {
    const meta = labelFor(score.countryId);
    if (!meta) continue;
    const overall100 = emigroScoreOverall100(score);
    const view = toEmigroScoreView(score);
    rows.push({
      countryId: score.countryId,
      countryRu: meta.ru,
      flag: meta.flag,
      path: meta.path,
      overall100,
      tone: emigroScoreTone(overall100),
      summary: view.summary,
      asOf: score.asOf,
    });
  }
  return rows.sort((a, b) => b.overall100 - a.overall100 || a.countryRu.localeCompare(b.countryRu, "ru"));
}
