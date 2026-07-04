export const PORTUGAL_SATELLITE_HOST = "portugal.emigro.online";

export const PORTUGAL_SATELLITE = {
  host: PORTUGAL_SATELLITE_HOST,
  countryKey: "portugal",
  city: "lisbon",
  countryRu: "Португалия",
  cityRu: "Лиссабон",
  title: "Португалия — практика для релокантов",
  tagline:
    "Новости, лайфхаки, советы и гайды по Лиссабону и Португалии. Короткие материалы редакции Emigro — навигация по #хэштегам.",
  sourceChannel: "chatlisboa",
  sourceChannels: ["chatlisboa", "por_tugal", "lepta"] as const,
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;
