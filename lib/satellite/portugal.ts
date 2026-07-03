export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "lisbon",
  countryRu: "Португалия",
  cityRu: "Лиссабон",
  title: "Португалия — практика из чата",
  tagline:
    "Новости, лайфхаки, советы и гайды по Лиссабону и Португалии — из чатов релокантов, текст редакции Emigro. Навигация по #хэштегам.",
  sourceChannel: "chatlisboa",
  sourceChannels: ["chatlisboa", "por_tugal"] as const,
  sourceChannelUrl: "https://t.me/chatlisboa",
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;
