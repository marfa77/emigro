import type { CommunityNote } from "@/lib/community-notes/types";

export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "porto",
  countryRu: "Португалия",
  cityRu: "Порту",
  title: "Португалия 2026: NIF Porto, AIMA/Agora, аренда Norte",
  tagline:
    "Полевая практика Emigro для русскоязычных уже в Португалии (Norte + Lisboa): NIF в Finanças, Agora ≠ portal-renovacoes, contrato de arrendamento, SNS, банк. Не визовый каталог и не юрконсультация — D7/D8 и гражданство на www.emigro.online.",
  sourceChannel: "chatlisboa",
  /** Third-party relocant chats — sole sources for field-practice signals. */
  sourceChannels: ["chatlisboa", "por_tugal", "lepta", "autolife_pt", "braga_pt_rus"] as const,
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  pillarGuideUrl: "https://www.emigro.online/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;

/**
 * Hub preview order — practice / money intent first.
 * Date-sorted leisure (Camino, clubs, wine) at the top looked like a doorway
 * and correlated with GSC "Crawled - currently not indexed" on the hub.
 */
export const PORTUGAL_HUB_PINNED_GUIDE_SLUGS = [
  "nif-porto-kak-poluchit-2026",
  "aima-agora-zapis-2026",
  "aima-residence-card-sent-abroad-2026",
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "arenda-dolgosrok-porto-braga-2026",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
  "zheltye-stranitsy-relokanta-portugaliya-2026",
  "pervyj-mesyac-portugaliya-checklist",
  "prodlenie-vnzh-portugaliya-aima-2026",
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
  "meditsina-norte-sns-chastnaya-stomatologiya-2026",
  "zamena-zagranpasporta-portugaliya-2026",
  "ciple-guide-2026",
  "termo-responsabilidade-podtverzhdenie-zhilya-2026",
  "porto-rajony-arenda-shkoly-parki-sport-2026",
  "matosinhos-zhizn-arenda-plyazh-leca-2026",
] as const;

const PORTUGAL_HUB_PIN_RANK = new Map<string, number>(
  PORTUGAL_HUB_PINNED_GUIDE_SLUGS.map((slug, index) => [slug, index])
);

export const PORTUGAL_HUB_PRACTICE_TAGS = [
  "nif",
  "aima",
  "arenda",
  "bank",
  "sns",
  "documents",
  "ciple",
  "porto",
] as const;

export function rankPortugalHubGuides(guides: CommunityNote[]): CommunityNote[] {
  return [...guides].sort((a, b) => {
    const ra = PORTUGAL_HUB_PIN_RANK.has(a.slug) ? PORTUGAL_HUB_PIN_RANK.get(a.slug)! : 10_000;
    const rb = PORTUGAL_HUB_PIN_RANK.has(b.slug) ? PORTUGAL_HUB_PIN_RANK.get(b.slug)! : 10_000;
    if (ra !== rb) return ra - rb;
    const ta = new Date(a.published_at ?? 0).getTime();
    const tb = new Date(b.published_at ?? 0).getTime();
    return tb - ta;
  });
}

export function portugalHubPracticeTagsLabel(allTags: string[]): string {
  const set = new Set(allTags.map((t) => t.toLowerCase()));
  const preferred = PORTUGAL_HUB_PRACTICE_TAGS.filter((t) => set.has(t));
  const practiceSet = new Set<string>(PORTUGAL_HUB_PRACTICE_TAGS);
  const rest = allTags.filter((t) => !practiceSet.has(t.toLowerCase()));
  return [...preferred, ...rest].slice(0, 8).join(", ") || "NIF, AIMA, аренда, SNS, банки";
}

/** Owned Emigro surfaces — discussion group / channel, NOT third-party relocant practice. */
export const OWNED_SIGNAL_CHANNELS = ["emigro_chat", "emigro_news"] as const;

export function normalizeSignalChannel(username: string): string {
  return username.replace(/^@/, "").toLowerCase();
}

export function isRelocantSignalChannel(username: string): boolean {
  const norm = normalizeSignalChannel(username);
  return (PORTUGAL_SATELLITE.sourceChannels as readonly string[]).includes(norm);
}

export function filterRelocantSignals<T extends { channel_username: string }>(signals: T[]): T[] {
  return signals.filter((s) => isRelocantSignalChannel(s.channel_username));
}
