export const ITALY_SATELLITE_HOST = "italy.emigro.online";

export const ITALY_SATELLITE = {
  host: ITALY_SATELLITE_HOST,
  countryKey: "italy",
  city: "milan",
  countryRu: "Италия",
  cityRu: "Милан",
  title: "Италия — практика для релокантов",
  tagline:
    "Практика для релокантов в Италии (Milano и север, включая Como): codice fiscale, permesso / Questura, аренда, SSN. Короткие материалы редакции Emigro — навигация по #хэштегам.",
  sourceChannel: "milanru",
  /** Third-party relocant chats — sole sources for field-practice signals. */
  sourceChannels: [
    "milanru",
    "milan_4at",
    "forum_italy",
    "digital_nomad_Italiya",
  ] as const,
  mainSiteUrl: "https://www.emigro.online/ru/italy",
  pillarGuideUrl: "https://www.emigro.online/ru/guides/vnj-italiya-2026-digital-nomad",
  wizardUrl: "https://www.emigro.online/ru/italy/wizard",
  digestUrl: "https://www.emigro.online/ru/italy/digest",
} as const;

export function normalizeSignalChannel(username: string): string {
  return username.replace(/^@/, "").toLowerCase();
}

export function isRelocantSignalChannel(username: string): boolean {
  const norm = normalizeSignalChannel(username);
  return (ITALY_SATELLITE.sourceChannels as readonly string[]).some(
    (ch) => ch.toLowerCase() === norm
  );
}

export function filterRelocantSignals<T extends { channel_username: string }>(signals: T[]): T[] {
  return signals.filter((s) => isRelocantSignalChannel(s.channel_username));
}
