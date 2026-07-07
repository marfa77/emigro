export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "porto",
  countryRu: "Португалия",
  cityRu: "Порту",
  title: "Португалия — практика для релокантов",
  tagline:
    "Новости, лайфхаки, советы и гайды по Португалии с акцентом на Norte (Порту, Брага, Minho). Короткие материалы редакции Emigro — навигация по #хэштегам.",
  sourceChannel: "chatlisboa",
  /** Third-party relocant chats — sole sources for field-practice signals. */
  sourceChannels: ["chatlisboa", "por_tugal", "lepta", "autolife_pt"] as const,
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
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
