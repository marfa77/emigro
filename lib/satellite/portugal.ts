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
  sourceChannels: ["chatlisboa", "por_tugal", "lepta", "autolife_pt"] as const,
  mainSiteUrl: "https://www.emigro.online/ru/portugal",
  wizardUrl: "https://www.emigro.online/ru/portugal/wizard",
  digestUrl: "https://www.emigro.online/ru/portugal/digest",
} as const;
