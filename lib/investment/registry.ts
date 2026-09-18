export type InvestmentAsset = "property" | "fund" | "business" | "bonds" | "donation" | "membership";
export type InvestmentOutcome = "residence" | "permanent_residence" | "citizenship_path";
export type InvestmentRouteStatus = "active" | "review_required" | "closed" | "comparison_only";
export type InvestmentMatch = "likely" | "review" | "budget_gap" | "blocked" | "not_property" | "closed";

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
  /** Signed property partner, if any. Never implies automatic contact sharing. */
  providerId?: string;
  /** False for funds, bonds and other non-property routes. */
  propertyLinked: boolean;
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
    propertyLinked: true,
    priority: 100,
  },
  {
    country: "uae",
    countryRu: "ОАЭ",
    destinationIso2: "AE",
    flag: "🇦🇪",
    title: "ОАЭ: Golden Residence через недвижимость (AED 2M)",
    status: "active",
    outcome: "residence",
    screeningFloorEur: 545_000,
    assets: ["property", "business"],
    publicPath: "/ru/guides/oae-dlya-rossiyan-2026",
    summary:
      "Документы через недвижимость: 10-летний Golden Residence при владении объектом(ами) от AED 2 000 000. Ниже порога — отдельные 2-летние property-визы, не Golden.",
    caveat:
      "Порог ICP — AED 2 000 000 полной собственности на имя заявителя (или off-plan у одобренного застройщика). Оценка и процедура — ICP / DLD; ask брокера сам по себе не равен eligibility.",
    officialUrl: "https://icp.gov.ae/en/services/uae-golden-residency/",
    propertyLinked: true,
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
    caveat: "€250k относится не ко всем зонам и объектам. Новые заявки граждан РФ и Беларуси приостановлены.",
    officialUrl: "https://migration.gov.gr/en/golden-visa/",
    restrictedPassports: ["RU", "BY"],
    propertyLinked: true,
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
    propertyLinked: false,
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
    propertyLinked: false,
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
    propertyLinked: true,
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
    propertyLinked: false,
    priority: 70,
  },
] as const;

export const INVESTMENT_PROGRAM_NOTES: Record<string, readonly string[]> = {
  thailand: [
    "LTR Wealthy Global Citizen: квалифицированная инвестиция от USD 500k и глобальные активы от USD 1m. Не любой объект на Пхукете.",
    "Приказы 237/2568 и 238/2568 могут давать только временное пребывание. Это не ПМЖ и не гражданство; процедура требует ручного подтверждения.",
    "Thailand Privilege — платная membership-виза. Покупка недвижимости её не заменяет.",
  ],
  uae: [
    "Golden Residence (10 лет) через недвижимость: один или несколько объектов общей стоимостью не менее AED 2 000 000, полная собственность на имя заявителя; ипотека допускается при финансировании одобренным местным банком (ICP).",
    "Off-plan: ICP допускает покупку у одобренной локальной компании; проверяйте актуальный чеклист DLD Cube / GDRFA перед сделкой.",
    "Ниже AED 2M: отдельные 2-летние property-визы и другие инвесторские треки — это не 10-летний Golden. Не путайте пороги брокеров с федеральным правилом.",
    "Бизнес / депозит AED 2M — отдельная категория Golden, не property→documents. Ask брокера сверяйте с DLD-продажами (uaeproperty.vip), не с маркетинговой ценой.",
  ],
  greece: [
    "Порог €250k не универсален: для большинства новых объектов действуют €400k или €800k.",
    "Новые заявки граждан РФ и Беларуси остаются приостановленными, пока официальное уведомление не снято.",
  ],
};

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
}): Array<InvestmentRoute & { match: InvestmentMatch; reason: string }> {
  return INVESTMENT_ROUTES.map((route) => {
    const assetMatches = input.asset === "any" || route.assets.includes(input.asset);
    const propertyIntent = input.asset === "property";
    const outcomeMatches = input.outcome === "any" || route.outcome === input.outcome;
    const budgetMatches = input.budgetEur >= route.screeningFloorEur;
    const passportRestricted =
      Boolean(input.passportIso2) &&
      route.restrictedPassports?.includes(input.passportIso2!.trim().toUpperCase());

    if (route.status === "closed") {
      return { ...route, match: "closed" as const, reason: "Программа закрыта для новых заявок и не передаётся партнёру." };
    }
    if (propertyIntent && !route.propertyLinked) {
      return {
        ...route,
        match: "not_property" as const,
        reason: "Покупка недвижимости сама по себе не является основанием этой программы.",
      };
    }
    if (passportRestricted) {
      return {
        ...route,
        match: "blocked" as const,
        reason: "Для указанного паспорта программа ограничена или приостановлена.",
      };
    }
    if (!budgetMatches) {
      return { ...route, match: "budget_gap" as const, reason: "Ниже предварительного бюджета этого маршрута." };
    }
    if (!assetMatches || !outcomeMatches || route.status !== "active") {
      return {
        ...route,
        match: "review" as const,
        reason: route.status === "review_required"
          ? "Нужна ручная проверка программы, актива и документов до любого партнёра."
          : "Бюджет проходит, но цель или тип актива требуют сверки.",
      };
    }
    return { ...route, match: "likely" as const, reason: "Предварительно совпадают бюджет, актив и цель. Это не подтверждение eligibility." };
  }).sort((a, b) => {
    const rank: Record<InvestmentMatch, number> = {
      likely: 0,
      review: 1,
      budget_gap: 2,
      blocked: 3,
      not_property: 4,
      closed: 5,
    };
    return rank[a.match] - rank[b.match] || b.priority - a.priority;
  });
}
