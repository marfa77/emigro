export type InvestmentAsset = "property" | "fund" | "business" | "bonds" | "donation" | "membership";
export type InvestmentOutcome = "residence" | "permanent_residence" | "citizenship_path";
export type InvestmentRouteStatus = "active" | "review_required" | "closed" | "comparison_only";
export type InvestmentMatch = "likely" | "review" | "budget_gap" | "blocked" | "not_property" | "closed";
/** What happens to the applicant's capital in the typical structure. */
export type CapitalFate = "preserved" | "at_risk" | "partially_consumed" | "spent";
export type ExpenseKind = "investment" | "non_refundable" | "combination";
export type LiquidityBand = "liquid" | "locked" | "partially_liquid" | "illiquid";

export type InvestmentRoute = {
  country: string;
  /** Unique program id when one country has several routes. Defaults to country. */
  slug?: string;
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
  /** Typical capital fate — migration UX, not an investment recommendation. */
  capitalFate: CapitalFate;
  /** How the spend is framed commercially. */
  expenseKind: ExpenseKind;
  liquidity: LiquidityBand;
  /** Unique decision question for this route (anti-template). */
  decisionHook: string;
  priority: number;
};

export const INVESTMENT_ROUTES: readonly InvestmentRoute[] = [
  {
    slug: "thailand-property-stay",
    country: "thailand",
    countryRu: "Таиланд",
    destinationIso2: "TH",
    flag: "🇹🇭",
    title: "Таиланд: временное пребывание и недвижимость",
    status: "review_required",
    outcome: "residence",
    screeningFloorEur: 75_000,
    assets: ["property"],
    corridorSlug: "ru-speaking-to-thailand",
    publicPath: "/ru/thailand",
    summary: "Пхукет — коммерческий пилот. €75k — порог интереса к объекту, не юридический порог визы.",
    caveat:
      "Приказы Immigration 237/2568 и 238/2568 не выдают визу автоматически с покупкой. Это не LTR и не Privilege; применимость проверяется вручную.",
    officialUrl: "https://www.immigration.go.th/?p=34090",
    providerId: "empyreal-estate-phuket",
    propertyLinked: true,
    capitalFate: "at_risk",
    expenseKind: "investment",
    liquidity: "illiquid",
    decisionHook: "Понимаете ли вы, что покупка объекта сама по себе не выдаёт визу по приказам Immigration?",
    priority: 100,
  },
  {
    slug: "thailand-ltr",
    country: "thailand",
    countryRu: "Таиланд",
    destinationIso2: "TH",
    flag: "🇹🇭",
    title: "Таиланд: LTR Wealthy Global Citizen",
    status: "review_required",
    outcome: "residence",
    screeningFloorEur: 920_000,
    assets: ["property", "business", "bonds"],
    corridorSlug: "ru-speaking-to-thailand",
    publicPath: "/ru/thailand",
    summary: "BOI LTR: инвестиция в Таиланде от USD 500k и глобальные активы от USD 1m. €920k — ориентир активов, не котировка.",
    caveat:
      "Недвижимость может быть частью тайской инвестиции, но сама по себе не заменяет USD 1m активов, страховку и endorsement BOI. Инвестиция должна уже быть на имя заявителя.",
    officialUrl: "https://ltr.boi.go.th/",
    propertyLinked: true,
    capitalFate: "preserved",
    expenseKind: "investment",
    liquidity: "partially_liquid",
    decisionHook: "Готовы ли вы подтвердить глобальные активы от USD 1m и инвестицию в Таиланде от USD 500k на своё имя?",
    priority: 99,
  },
  {
    slug: "thailand-privilege",
    country: "thailand",
    countryRu: "Таиланд",
    destinationIso2: "TH",
    flag: "🇹🇭",
    title: "Таиланд: Privilege membership",
    status: "review_required",
    outcome: "residence",
    screeningFloorEur: 18_000,
    assets: ["membership"],
    corridorSlug: "ru-speaking-to-thailand",
    publicPath: "/ru/thailand",
    summary: "Платная membership-виза. Входной ориентир — Bronze THB 650 000; покупка недвижимости её не заменяет.",
    caveat:
      "Сборы и пакеты меняются. Сверяйте thailandprivilege.co.th. Это не property→documents и не LTR.",
    officialUrl: "https://www.thailandprivilege.co.th/thailandprivilegecard",
    propertyLinked: false,
    capitalFate: "spent",
    expenseKind: "non_refundable",
    liquidity: "illiquid",
    decisionHook: "Готовы ли вы к невозвратному membership fee вместо инвестиционного актива?",
    priority: 98,
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
    publicPath: "/ru/guides/kupit-nedvizhimost-dubaj-rossiyane-2026-visa-banki-dld",
    summary:
      "Документы через недвижимость: 10-летний Golden Residence при владении объектом(ами) от AED 2 000 000. Ниже порога — отдельные 2-летние property-визы (Taskeen), не Golden.",
    caveat:
      "Порог ICP — AED 2 000 000 полной собственности на имя заявителя (или off-plan у одобренной локальной компании). Оценка и процедура — ICP / DLD; ask брокера сам по себе не равен eligibility. Mortgage/NOC — сверяйте актуальный чеклист DLD Cube.",
    officialUrl: "https://icp.gov.ae/en/services/uae-golden-residency/",
    propertyLinked: true,
    capitalFate: "preserved",
    expenseKind: "investment",
    liquidity: "illiquid",
    decisionHook: "Нужна ли вам недвижимость как часть relocation + статуса — или только виза без привязки к объекту?",
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
    capitalFate: "preserved",
    expenseKind: "investment",
    liquidity: "illiquid",
    decisionHook: "Вам нужна именно недвижимость — и подходит ли ваш паспорт (RU/BY сейчас ограничены)?",
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
    capitalFate: "preserved",
    expenseKind: "investment",
    liquidity: "locked",
    decisionHook: "Готовы ли вы держать qualifying fund (недвижимость больше не основание ARI)?",
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
    capitalFate: "partially_consumed",
    expenseKind: "combination",
    liquidity: "locked",
    decisionHook: "Готовы ли вы к qualifying fund или к donation — а не к покупке квартиры?",
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
    capitalFate: "partially_consumed",
    expenseKind: "combination",
    liquidity: "illiquid",
    decisionHook: "Готовы ли вы к комбинированному cost structure (property + contribution + donation) и проверке паспорта?",
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
    capitalFate: "at_risk",
    expenseKind: "investment",
    liquidity: "locked",
    decisionHook: "Готовы ли вы инвестировать в итальянский business/startup — и подходит ли паспорт (RU/BY ограничены)?",
    priority: 70,
  },
  {
    country: "spain",
    countryRu: "Испания",
    destinationIso2: "ES",
    flag: "🇪🇸",
    title: "Испания: виза инвестора закрыта",
    status: "closed",
    outcome: "residence",
    screeningFloorEur: 500_000,
    assets: ["property", "business", "bonds"],
    publicPath: "/ru/guides/vnj-ispaniya-2026",
    summary: "Golden Visa / виза инвестора по Ley 14/2013 не принимается для новых заявок с 3 апреля 2025.",
    caveat:
      "Ley Orgánica 1/2025 оставила без содержания статьи 63–67 Ley 14/2013. Недвижимость, фонды и депозиты больше не открывают новый инвесторский ВНЖ.",
    officialUrl: "https://www.boe.es/eli/es/lo/2025/01/02/1",
    propertyLinked: true,
    capitalFate: "spent",
    expenseKind: "investment",
    liquidity: "illiquid",
    decisionHook: "Программа закрыта для новых заявок — это архив для сравнения, не маршрут к подаче.",
    priority: 40,
  },
] as const;

export const INVESTMENT_PROGRAM_NOTES: Record<string, readonly string[]> = {
  thailand: [
    "Временное пребывание по приказам 237/2568 и 238/2568 проверяется отдельно от сделки. €75k — коммерческий ориентир пилота, не порог Immigration.",
    "LTR Wealthy Global Citizen (BOI): инвестиция в Таиланде от USD 500k на имя заявителя и активы от USD 1m. Объект может входить в инвестицию, но не заменяет остальные условия.",
    "Thailand Privilege — membership от Bronze THB 650 000 на официальной карточке. Покупка недвижимости membership не заменяет.",
  ],
  uae: [
    "Golden Residence (10 лет) через недвижимость: один или несколько объектов общей стоимостью не менее AED 2 000 000, полная собственность на имя заявителя; ипотека допускается при финансировании одобренным местным банком (ICP). Формулировки DLD про paid amount / NOC сверяйте на дату подачи.",
    "Off-plan: ICP допускает покупку у одобренной локальной компании; проверяйте актуальный чеклист DLD Cube / GDRFA перед сделкой.",
    "Ниже AED 2M: Taskeen 2y — у sole owner порог стоимости снят (title deed); joint — доля от AED 400 000. Это не 10-летний Golden.",
    "Бизнес / депозит AED 2M — отдельная категория Golden, не property→documents. Ask брокера сверяйте с DLD-продажами (uaeproperty.vip), не с маркетинговой ценой.",
    "Маршрут виза → KYC → проверка оффера: /ru/guides/kupit-nedvizhimost-dubaj-rossiyane-2026-visa-banki-dld.",
  ],
  greece: [
    "Порог €250k не универсален: для большинства новых объектов действуют €400k или €800k.",
    "Новые заявки граждан РФ и Беларуси остаются приостановленными, пока официальное уведомление не снято.",
  ],
  portugal: [
    "Прямая покупка недвижимости больше не является самостоятельным основанием ARI.",
    "Скрининг €500k относится к оставшимся вариантам (фонды и иные допуски AIMA), не к квартире.",
  ],
  hungary: [
    "Guest Investor — фонд или пожертвование по правилам программы, не покупка квартиры.",
    "Обычный ETF не подходит автоматически: фонд и посредник должны соответствовать венгерским требованиям.",
  ],
  malta: [
    "MPRP — постоянная резиденция пакетом (property, contribution, donation), не продажа гражданства.",
    "Новые заявки граждан РФ и Беларуси ограничены. Считать нужно полный пакет семьи, не только объект.",
  ],
  italy: [
    "Недвижимость не является основанием Investor Visa. Активы: стартап, компания, гособлигации или пожертвование.",
    "€250k — ориентир категории стартапа; у остальных активов пороги выше. Для граждан РФ/РБ программа приостановлена.",
  ],
  spain: [
    "С 3 апреля 2025 новые визы и ВНЖ инвестора не выдаются: LO 1/2025 (BOE-A-2025-76) опустошила статьи 63–67 Ley 14/2013.",
    "Закрыты все инвестиционные пути этой программы, включая недвижимость от €500k. Это не активный маршрут для партнёра.",
  ],
};

export function routeKey(route: Pick<InvestmentRoute, "country" | "slug">): string {
  return route.slug ?? route.country;
}

export function investmentCountryRoutes(country: string | undefined | null): InvestmentRoute[] {
  const key = country?.trim().toLowerCase();
  if (!key) return [];
  const byCountry = INVESTMENT_ROUTES.filter((route) => route.country === key);
  if (byCountry.length) return [...byCountry].sort((a, b) => b.priority - a.priority);
  return INVESTMENT_ROUTES.filter((route) => route.slug === key);
}

export function uniqueInvestmentCountries(): InvestmentRoute[] {
  const seen = new Set<string>();
  return INVESTMENT_ROUTES.filter((route) => {
    if (seen.has(route.country)) return false;
    seen.add(route.country);
    return true;
  });
}

export function routeStatusLabel(status: InvestmentRouteStatus): string {
  if (status === "active") return "В реестре";
  if (status === "closed") return "Закрыта для новых заявок";
  if (status === "comparison_only") return "Только для сравнения";
  return "Нужен ручной review";
}

export function passportRestrictionLabel(route: Pick<InvestmentRoute, "restrictedPassports">): string | null {
  const passports = route.restrictedPassports ?? [];
  if (passports.includes("RU") && passports.includes("BY")) {
    return "RU/BY: новые заявки ограничены или приостановлены — порог € ниже не означает доступность.";
  }
  if (passports.length) return "Для части паспортов программа ограничена — смотрите eligibility раньше порога.";
  return null;
}

/** True when Emigro treats the route as blocked for typical RU/BY audience. */
export function hasRuByPassportRestriction(
  route: Pick<InvestmentRoute, "restrictedPassports">
): boolean {
  const passports = route.restrictedPassports ?? [];
  return passports.includes("RU") && passports.includes("BY");
}

export function investmentRoute(country: string | undefined | null): InvestmentRoute | undefined {
  return investmentCountryRoutes(country)[0];
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

export function capitalFateLabel(fate: CapitalFate): string {
  return {
    preserved: "Капитал в активе (сохранён)",
    at_risk: "Капитал под риском проекта",
    partially_consumed: "Часть капитала потребляется",
    spent: "Капитал расходуется / fee",
  }[fate];
}

export function expenseKindLabel(kind: ExpenseKind): string {
  return {
    investment: "Инвестиция",
    non_refundable: "Невозвратный взнос",
    combination: "Комбинация",
  }[kind];
}

export function liquidityLabel(band: LiquidityBand): string {
  return {
    liquid: "Ликвидный",
    locked: "Заблокирован на срок программы",
    partially_liquid: "Частично ликвиден",
    illiquid: "Низкая ликвидность",
  }[band];
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
