export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "lisbon",
  countryRu: "Португалия",
  cityRu: "Лиссабон",
  title: "Португалия — практика из чата",
  tagline:
    "Короткие заметки по Лиссабону: NIF, AIMA, аренда и бытовые шаги. Темы из обсуждений релокантов — текст редакции Emigro, не копия чата.",
  sourceChannel: "chatlisboa",
  sourceChannels: ["chatlisboa", "por_tugal"] as const,
  sourceChannelUrl: "https://t.me/chatlisboa",
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;
