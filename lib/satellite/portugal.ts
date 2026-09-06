export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "porto",
  countryRu: "Португалия",
  cityRu: "Порту",
  title: "Португалия 2026: NIF, AIMA, Porto — практика",
  tagline:
    "Живая практика для русскоязычных релокантов в Португалии (Norte: Порту, Брага, Minho + Lisboa): NIF, запись AIMA/Agora, D8 ~€3 680/мес, аренда, SNS, банки. Гайды с FAQ и официальными ссылками — не юрконсультация.",
  sourceChannel: "chatlisboa",
  /** Third-party relocant chats — sole sources for field-practice signals. */
  sourceChannels: ["chatlisboa", "por_tugal", "lepta", "autolife_pt", "braga_pt_rus"] as const,
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  pillarGuideUrl: "https://www.emigro.online/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;

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
