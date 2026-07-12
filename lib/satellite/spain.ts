export const SPAIN_SATELLITE_HOST = "spain.emigro.online";

export const SPAIN_SATELLITE = {
  host: SPAIN_SATELLITE_HOST,
  countryKey: "spain",
  city: "valencia",
  countryRu: "Испания",
  cityRu: "Валенсия",
  title: "Испания — практика для релокантов",
  tagline:
    "Практика для релокантов в Испании (Valencia, Madrid, Barcelona): NIE, TIE, digital nomad €2 849/мес, аренда. Короткие материалы редакции Emigro — навигация по #хэштегам.",
  sourceChannel: "spain_granitsa",
  /** Third-party relocant chats — sole sources for field-practice signals. */
  sourceChannels: [
    "spain_granitsa",
    "spainchats",
    "valenforum",
    "valenciarusia",
    "migranty_barselona",
  ] as const,
  mainSiteUrl: "https://www.emigro.online/ru/spain",
  pillarGuideUrl: "https://www.emigro.online/ru/guides/vnj-ispaniya-2026",
  wizardUrl: "https://www.emigro.online/ru/spain/wizard",
  digestUrl: "https://www.emigro.online/ru/spain/digest",
} as const;

/** Owned Emigro surfaces — discussion group / channel, NOT third-party relocant practice. */
export const OWNED_SIGNAL_CHANNELS = ["emigro_chat", "emigro_news"] as const;

export function normalizeSignalChannel(username: string): string {
  return username.replace(/^@/, "").toLowerCase();
}

export function isRelocantSignalChannel(username: string): boolean {
  const norm = normalizeSignalChannel(username);
  return (SPAIN_SATELLITE.sourceChannels as readonly string[]).includes(norm);
}

export function filterRelocantSignals<T extends { channel_username: string }>(signals: T[]): T[] {
  return signals.filter((s) => isRelocantSignalChannel(s.channel_username));
}
