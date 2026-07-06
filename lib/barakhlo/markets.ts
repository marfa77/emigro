const BARAKHLO_ORIGIN = "https://www.barakhlo.online";

export type BarakhloMarket = {
  /** Path under barakhlo.online, empty = city picker root. */
  path: string;
  cityRu: string;
  cityEn: string;
};

/** Primary Barakhlo market per Emigro corridor segment. */
export const BARAKHLO_MARKETS: Record<string, BarakhloMarket> = {
  portugal: { path: "/portugal/lisbon", cityRu: "Лиссабон", cityEn: "Lisbon" },
  spain: { path: "/spain/valencia", cityRu: "Валенсия", cityEn: "Valencia" },
  france: { path: "/france/paris", cityRu: "Париж", cityEn: "Paris" },
  italy: { path: "/italy/milan", cityRu: "Милан", cityEn: "Milan" },
  germany: { path: "/germany/berlin", cityRu: "Берлин", cityEn: "Berlin" },
  netherlands: { path: "/netherlands/amsterdam", cityRu: "Амстердам", cityEn: "Amsterdam" },
  poland: { path: "/poland/warsaw", cityRu: "Варшава", cityEn: "Warsaw" },
  austria: { path: "/austria/vienna", cityRu: "Вена", cityEn: "Vienna" },
  czechia: { path: "", cityRu: "EU", cityEn: "EU" },
  scandinavia: { path: "", cityRu: "EU", cityEn: "EU" },
};

export function barakhloMarketForSegment(segment: string): BarakhloMarket {
  return (
    BARAKHLO_MARKETS[segment] ?? {
      path: "",
      cityRu: "EU",
      cityEn: "EU",
    }
  );
}

export function barakhloMarketUrl(segment: string): string {
  const { path } = barakhloMarketForSegment(segment);
  return path ? `${BARAKHLO_ORIGIN}${path}` : BARAKHLO_ORIGIN;
}

export function barakhloMarketCityLabel(segment: string, locale: "ru" | "en" = "ru"): string {
  const market = barakhloMarketForSegment(segment);
  return locale === "ru" ? market.cityRu : market.cityEn;
}
