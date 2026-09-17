export type InvestmentAsset = "property" | "fund" | "business" | "bonds" | "donation" | "membership";
export type InvestmentOutcome = "residence" | "permanent_residence" | "citizenship_path";
export type InvestmentRouteStatus = "active" | "review_required";

export type InvestmentRoute = {
  country: string;
  countryRu: string;
  destinationIso2: string;
  flag: string;
  title: string;
  status: InvestmentRouteStatus;
  outcome: InvestmentOutcome;
  /** Lead-screening floor, not a legal quotation. Exact route tests remain in program versions. */
  screeningFloorEur: number;
  assets: InvestmentAsset[];
  programSlug?: string;
  corridorSlug?: string;
  publicPath: string;
  summary: string;
  caveat: string;
  officialUrl: string;
  restrictedPassports?: string[];
  providerId?: string;
  priority: number;
};

export const INVESTMENT_ROUTES: readonly InvestmentRoute[] = [
  {
    country: "thailand",
    countryRu: "Таиланд",
    destinationIso2: "TH",
    flag: "🇹🇭",
    title: "Таиланд: LTR, Privilege и проверка property-linked статуса",
    status: "review_required",
    outcome: "residence",
    screeningFloorEur: 75_000,
    assets: ["property", "business", "membership"],
    corridorSlug: "ru-speaking-to-thailand",
    publicPath: "/ru/thailand",
    summary: "Пхукет — коммерческий пилот. Недвижимость и иммиграционный статус проверяются раздельно.",
    caveat:
      "Покупка объекта не выдаёт визу автоматически. Применимость приказов 237/2568 и 238/2568 требует полного официального и индивидуального review.",
    officialUrl: "https://www.immigration.go.th/?p=34090",
    providerId: "empyreal-estate-phuket",
    priority: 100,
  },
  {
    country: "uae",
    countryRu: "ОАЭ",
    destinationIso2: "AE",
    flag: "🇦🇪",
    title: "ОАЭ: Golden Residence через недвижимость",
    status: "active",
    outcome: "residence",
    screeningFloorEur: 500_000,
    assets: ["property", "business"],
    publicPath: "/ru/uae",
    summary: "Дубай и другие эмираты: недвижимость, бизнес и долгосрочный статус — с раздельной проверкой актива и заявителя.",
    caveat: "Порог проверяется в AED и зависит от категории, структуры владения и текущих правил ICP/GDRFA.",
    officialUrl: "https://icp.gov.ae/en/services/uae-golden-residency/",
    priority: 95,
  },
  {
    country: "greece",
    countryRu: "Греция",
    destinationIso2: "GR",
    flag: "🇬🇷",
    title: "Греция Golden Visa",
    status: "active",
    outcome: "residence",
    screeningFloorEur: 250_000,
    assets: ["property", "fund"],
    programSlug: "greece-golden-visa",
    corridorSlug: "ru-speaking-to-greece",
    publicPath: "/ru/greece/programs/greece-golden-visa",
    summary: "Недвижимость и альтернативные инвестиции; порог зависит от зоны и типа объекта.",
    caveat: "Нельзя переносить минимальный порог одной категории на любой объект или район.",
    officialUrl: "https://migration.gov.gr/en/golden-visa/",
    priority: 90,
  },
  {
    country: "portugal",
    countryRu: "Португалия",
    destinationIso2: "PT",
    flag: "🇵🇹",
    title: "Португалия ARI / Golden Visa",
    status: "active",
    outcome: "citizenship_path",
    screeningFloorEur: 500_000,
    assets: ["fund", "business", "donation"],
    programSlug: "portugal-golden-visa",
    corridorSlug: "ru-speaking-to-portugal",
    publicPath: "/ru/portugal/programs/portugal-golden-visa",
    summary: "ARI после закрытия прямого real-estate маршрута: фонды, бизнес, исследования и культурные варианты.",
    caveat: "Покупка недвижимости больше не является самостоятельным основанием ARI.",
    officialUrl: "https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a",
    priority: 85,
  },
  {
    country: "hungary",
    countryRu: "Венгрия",
    destinationIso2: "HU",
    flag: "🇭🇺",
    title: "Венгрия Guest Investor",
    status: "active",
    outcome: "residence",
    screeningFloorEur: 250_000,
    assets: ["fund", "donation"],
    programSlug: "hungary-guest-investor",
    corridorSlug: "ru-speaking-to-hungary",
    publicPath: "/ru/hungary/programs/hungary-guest-investor",
    summary: "Инвестиционный фонд или пожертвование по правилам Guest Investor Programme.",
    caveat: "Фонд и посредник должны соответствовать венгерским требованиям; обычный ETF не подходит автоматически.",
    officialUrl: "https://oif.gov.hu/factsheets/residence-permit-for-guest-investor",
    priority: 80,
  },
  {
    country: "malta",
    countryRu: "Мальта",
    destinationIso2: "MT",
    flag: "🇲🇹",
    title: "Мальта MPRP",
    status: "active",
    outcome: "permanent_residence",
    screeningFloorEur: 500_000,
    assets: ["property", "donation"],
    programSlug: "malta-mprp",
    corridorSlug: "ru-speaking-to-malta",
    publicPath: "/ru/malta/programs/malta-mprp",
    summary: "Постоянная резиденция через комбинированный пакет: property, contribution, donation и активы.",
    caveat: "MPRP — постоянная резиденция, не продажа гражданства; считать нужно полный пакет семьи.",
    officialUrl: "https://residencymalta.gov.mt/legal-framework-mprp-2/",
    restrictedPassports: ["RU", "BY"],
    priority: 75,
  },
  {
    country: "italy",
    countryRu: "Италия",
    destinationIso2: "IT",
    flag: "🇮🇹",
    title: "Italy Investor Visa",
    status: "active",
    outcome: "residence",
    screeningFloorEur: 250_000,
    assets: ["business", "bonds", "donation"],
    programSlug: "italy-investor-visa",
    corridorSlug: "ru-speaking-to-italy",
    publicPath: "/ru/italy/programs/italy-investor-visa",
    summary: "Стартап, итальянская компания, государственные облигации или пожертвование.",
    caveat:
      "Минимальный уровень относится к категории стартапа; у остальных активов пороги выше. Программа официально приостановлена для граждан РФ/РБ, включая затронутое двойное гражданство.",
    officialUrl: "https://investorvisa.mise.gov.it/index.php/en/",
    restrictedPassports: ["RU", "BY"],
    priority: 70,
  },
] as const;

export function investmentRoute(country: string | undefined | null): InvestmentRoute | undefined {
  const key = country?.trim().toLowerCase();
  return INVESTMENT_ROUTES.find((route) => route.country === key);
}

export function investmentAssetLabel(asset: InvestmentAsset): string {
  return {
    property: "Недвижимость",
    fund: "Фонд",
    business: "Бизнес / стартап",
    bonds: "Гособлигации",
    donation: "Пожертвование",
    membership: "Long-stay membership",
  }[asset];
}

export function outcomeLabel(outcome: InvestmentOutcome): string {
  return {
    residence: "ВНЖ / долгосрочный статус",
    permanent_residence: "ПМЖ",
    citizenship_path: "ВНЖ с паспортным горизонтом",
  }[outcome];
}

const PASSPORT_ALIASES: Record<string, string> = {
  RU: "RU",
  RUSSIA: "RU",
  "РОССИЯ": "RU",
  "РОССИЙСКАЯ ФЕДЕРАЦИЯ": "RU",
  BY: "BY",
  BELARUS: "BY",
  "БЕЛАРУСЬ": "BY",
  UA: "UA",
  UKRAINE: "UA",
  "УКРАИНА": "UA",
  KZ: "KZ",
  KAZAKHSTAN: "KZ",
  "КАЗАХСТАН": "KZ",
  AM: "AM",
  ARMENIA: "AM",
  "АРМЕНИЯ": "AM",
  GE: "GE",
  GEORGIA: "GE",
  "ГРУЗИЯ": "GE",
};

export function normalizeInvestmentPassport(value: string | undefined | null): string | undefined {
  const normalized = value?.trim().toUpperCase();
  if (!normalized) return undefined;
  if (PASSPORT_ALIASES[normalized]) return PASSPORT_ALIASES[normalized];
  return /^[A-Z]{2}$/.test(normalized) ? normalized : undefined;
}

export function qualifyInvestmentRoutes(input: {
  budgetEur: number;
  asset: InvestmentAsset | "any";
  outcome: InvestmentOutcome | "any";
  passportIso2?: string;
}): Array<InvestmentRoute & { match: "likely" | "review" | "budget_gap"; reason: string }> {
  return INVESTMENT_ROUTES.map((route) => {
    const assetMatches = input.asset === "any" || route.assets.includes(input.asset);
    const outcomeMatches = input.outcome === "any" || route.outcome === input.outcome;
    const budgetMatches = input.budgetEur >= route.screeningFloorEur;
    const passportRestricted =
      Boolean(input.passportIso2) &&
      route.restrictedPassports?.includes(input.passportIso2!.trim().toUpperCase());

    if (!budgetMatches) {
      return { ...route, match: "budget_gap" as const, reason: "Ниже предварительного бюджета этого маршрута." };
    }
    if (passportRestricted || !assetMatches || !outcomeMatches || route.status === "review_required") {
      return {
        ...route,
        match: "review" as const,
        reason:
          passportRestricted
            ? "Для указанного паспорта программа ограничена или приостановлена: нужен другой маршрут."
            : route.status === "review_required"
            ? "Нужна ручная проверка основания и документов."
            : "Бюджет проходит, но цель или тип актива требуют сверки.",
      };
    }
    return { ...route, match: "likely" as const, reason: "Предварительно совпадают бюджет, актив и цель." };
  }).sort((a, b) => {
    const rank = { likely: 0, review: 1, budget_gap: 2 };
    return rank[a.match] - rank[b.match] || b.priority - a.priority;
  });
}
