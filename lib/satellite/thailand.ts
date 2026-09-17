export const THAILAND_SATELLITE_HOST = "thailand.emigro.online";

export const THAILAND_SATELLITE = {
  host: THAILAND_SATELLITE_HOST,
  countryKey: "thailand",
  city: "phuket",
  countryRu: "Таиланд",
  cityRu: "Пхукет",
  title: "Таиланд — практика для релокантов",
  tagline:
    "Практика для русскоязычных релокантов в Таиланде с фокусом на Пхукет: DTV и LTR, TM30, аренда, банки, медицина и повседневная жизнь. Сигналы из активных сообществ проверяются по официальным источникам.",
  sourceChannel: "nashi_phuket_chat",
  /** Third-party communities — source signals only, never copied as editorial text. */
  sourceChannels: [
    "nashi_phuket_chat",
    "pkhuket2",
    "info_phuket",
    "russianinphuket",
    "thailand_chatik",
  ] as const,
  mainSiteUrl: "https://www.emigro.online/ru/thailand",
  pillarGuideUrl: "https://www.emigro.online/ru/guides/tailand-dlya-rossiyan-2026",
  wizardUrl: "https://www.emigro.online/ru/wizard",
  digestUrl: "https://www.emigro.online/ru/thailand",
} as const;

export function normalizeSignalChannel(username: string): string {
  return username.replace(/^@/, "").toLowerCase();
}

export function isRelocantSignalChannel(username: string): boolean {
  const norm = normalizeSignalChannel(username);
  return (THAILAND_SATELLITE.sourceChannels as readonly string[]).includes(norm);
}

export function filterRelocantSignals<T extends { channel_username: string }>(signals: T[]): T[] {
  return signals.filter((signal) => isRelocantSignalChannel(signal.channel_username));
}
