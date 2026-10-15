/**
 * Single source of truth for the Golden Visa 2026 comparison: /ru|en/invest/compare,
 * country fact tables, the PDF lead magnet and Dataset JSON-LD.
 * `verify: true` = not yet checked by a human against the official text → «уточняется» badge.
 */

export const GOLDEN_VISA_LAST_CHECKED = "2026-10-14";

export const INVEST_COUNTRY_SLUGS = [
  "portugal",
  "italy",
  "spain",
  "greece",
  "thailand",
  "uae",
  "hungary",
  "malta",
] as const;

export type InvestCountrySlug = (typeof INVEST_COUNTRY_SLUGS)[number];
export type InvestLocale = "ru" | "en";
export type InvestPageKey = InvestCountrySlug | "hub" | "compare";

export type Localized = { ru: string; en: string };
export type FactCell = Localized & { verify?: boolean };

export type RuByStatus = "open" | "restricted" | "verify" | "na";

export type GoldenVisaSource = { label: string; url: string };

export type GoldenVisaRow = {
  slug: InvestCountrySlug;
  iso2: string;
  flag: string;
  country: Localized;
  programme: Localized;
  status: "open" | "closed";
  minInvestment: FactCell;
  routes: FactCell;
  citizenship: FactCell;
  ruBy: FactCell & { status: RuByStatus };
  sources: GoldenVisaSource[];
  /** ISO date or null when the row itself still needs a human check. */
  lastChecked: string | null;
};

export const GOLDEN_VISA_ROWS: readonly GoldenVisaRow[] = [
  {
    slug: "portugal",
    iso2: "PT",
    flag: "🇵🇹",
    country: { ru: "Португалия", en: "Portugal" },
    programme: { ru: "ARI (Golden Visa)", en: "ARI (Golden Visa)" },
    status: "open",
    minInvestment: { ru: "€500 000", en: "€500,000" },
    routes: {
      ru: "Квалифицированные португальские фонды не в недвижимость (срок ≥5 лет, ≥60% в компаниях Португалии); создание компании €500 тыс. + 5 рабочих мест; наука €500 тыс.; культура €250 тыс.; 10 рабочих мест. Недвижимость и перевод капитала €1,5 млн исключены с 10/2023",
      en: "Qualifying Portuguese non-real-estate funds (≥5-year maturity, ≥60% in Portuguese companies); company creation €500K + 5 jobs; research €500K; culture €250K; 10 jobs. Real estate and the €1.5M capital transfer were removed in 10/2023",
    },
    citizenship: {
      ru: "10 лет вне ЕС/CPLP; 7 лет для ЕС/CPLP (Lei Orgânica 1/2026, в силе с 19.05.2026; срок — с выдачи ВНЖ)",
      en: "10 yrs non-EU/CPLP; 7 yrs EU/CPLP (Lei Orgânica 1/2026, in force 19.05.2026; counted from permit issue)",
    },
    ruBy: {
      status: "open",
      ru: "Законом не исключены; усиленный AML / проверка происхождения средств. Практику банков и фондов уточняйте",
      en: "Not excluded by law; enhanced AML / source-of-funds checks. Bank and fund practice varies",
      verify: true,
    },
    sources: [
      { label: "vistos.mne.gov.pt — ARI", url: "https://vistos.mne.gov.pt/pt/ari-autorizacao-de-residencia-para-actividade-de-investimento" },
      { label: "AIMA — art. 90.º-A", url: "https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a" },
      {
        label: "Lei Orgânica n.º 1/2026 (DR n.º 95/2026, Série I, 18.05.2026)",
        url: "https://diariodarepublica.pt/dr/detalhe/lei-organica/1-2026-1123539996",
      },
    ],
    lastChecked: GOLDEN_VISA_LAST_CHECKED,
  },
  {
    slug: "italy",
    iso2: "IT",
    flag: "🇮🇹",
    country: { ru: "Италия", en: "Italy" },
    programme: { ru: "Investor Visa", en: "Investor Visa" },
    status: "open",
    minInvestment: { ru: "€250 000", en: "€250,000" },
    routes: {
      ru: "€250 тыс. инновационный стартап; €500 тыс. итальянская компания / венчурный фонд; €2 млн гособлигации; €1 млн филантропия; удержание 2 года",
      en: "€250K innovative startup; €500K Italian company / VC fund; €2M government bonds; €1M philanthropy; held 2 yrs",
    },
    citizenship: {
      ru: "~10 лет проживания (общее правило)",
      en: "~10 yrs of residence (general rule)",
      verify: true,
    },
    ruBy: {
      status: "restricted",
      ru: "Приостановлена для граждан РФ/РБ, включая двойное гражданство",
      en: "Suspended for RU/BY citizens, including RU/BY dual nationals",
    },
    sources: [
      { label: "investorvisa.mise.gov.it", url: "https://investorvisa.mise.gov.it/index.php/en/" },
      { label: "D.Lgs. 286/1998 art. 26-bis", url: "https://portalenormativo.it/articolo/dlgs-1998-07-25-286/art-26-bis" },
    ],
    lastChecked: GOLDEN_VISA_LAST_CHECKED,
  },
  {
    slug: "greece",
    iso2: "GR",
    flag: "🇬🇷",
    country: { ru: "Греция", en: "Greece" },
    programme: { ru: "Golden Visa", en: "Golden Visa" },
    status: "open",
    minInvestment: {
      ru: "€250 000 (только исключения)",
      en: "€250,000 (exceptions only)",
    },
    routes: {
      ru: "€800 тыс. Аттика / Салоники / Миконос / Санторини / острова >3 100 жителей; €400 тыс. в остальных районах (один объект ≥120 м²); €250 тыс. только перевод коммерческого объекта в жильё или реставрация памятника",
      en: "€800K Attica / Thessaloniki / Mykonos / Santorini / islands >3,100 inhabitants; €400K elsewhere (single property ≥120 m²); €250K only for conversion to residential or listed-building restoration",
      verify: true,
    },
    citizenship: {
      ru: "7 лет проживания (общее правило)",
      en: "7 yrs of residence (general rule)",
      verify: true,
    },
    ruBy: {
      status: "restricted",
      ru: "Новые заявки граждан РФ/РБ (включая членов семьи) приостановлены с 01.04.2022; подтверждено Циркуляром 1 Минмиграции от 21.04.2026",
      en: "New applications by RU/BY nationals (incl. family members) suspended since 01.04.2022; confirmed by Ministry of Migration Circular 1 of 21.04.2026",
    },
    sources: [
      { label: "migration.gov.gr — Golden Visa", url: "https://migration.gov.gr/en/golden-visa/" },
      {
        label: "Циркуляр 1 / Circular 1, 21.04.2026 (Diavgeia ΨΣΙ746ΜΔΨΟ-ΔΧΜ)",
        url: "https://diavgeia.gov.gr/doc/%CE%A8%CE%A3%CE%99746%CE%9C%CE%94%CE%A8%CE%9F-%CE%94%CE%A7%CE%9C",
      },
    ],
    lastChecked: GOLDEN_VISA_LAST_CHECKED,
  },
  {
    slug: "spain",
    iso2: "ES",
    flag: "🇪🇸",
    country: { ru: "Испания", en: "Spain" },
    programme: { ru: "Golden Visa — закрыта", en: "Golden Visa — closed" },
    status: "closed",
    minInvestment: { ru: "— закрыта", en: "— closed" },
    routes: {
      ru: "Golden Visa отменена 03.04.2025 (LO 1/2025, DF 21). Альтернативы: ВНЖ без права работы, виза цифрового кочевника, ВНЖ предпринимателя",
      en: "Golden visa abolished 03.04.2025 (LO 1/2025, DF 21). Alternatives: non-lucrative residence, digital nomad visa, entrepreneur",
    },
    citizenship: { ru: "н/п", en: "n/a" },
    ruBy: { status: "na", ru: "н/п", en: "n/a" },
    sources: [{ label: "BOE-A-2025-76 (LO 1/2025)", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2025-76" }],
    lastChecked: GOLDEN_VISA_LAST_CHECKED,
  },
  {
    slug: "thailand",
    iso2: "TH",
    flag: "🇹🇭",
    country: { ru: "Таиланд", en: "Thailand" },
    programme: { ru: "LTR Wealthy Global Citizen", en: "LTR Wealthy Global Citizen" },
    status: "open",
    minInvestment: {
      ru: "US$500 000 в Таиланде + US$1 млн глобальных активов",
      en: "US$500,000 invested in Thailand + US$1M global assets",
    },
    routes: {
      ru: "Тайские гособлигации / компания, VC, PE / недвижимость; страховка US$50 тыс. или депозит US$100 тыс.; виза на 10 лет (5+5)",
      en: "Thai government bonds / company, VC, PE / property; US$50K insurance or US$100K deposit; 10-yr visa (5+5)",
    },
    citizenship: { ru: "Не путь к гражданству", en: "Not a citizenship route" },
    ruBy: {
      status: "open",
      ru: "Не исключены",
      en: "Not excluded",
      verify: true,
    },
    sources: [{ label: "ltr.boi.go.th", url: "https://ltr.boi.go.th/" }],
    lastChecked: GOLDEN_VISA_LAST_CHECKED,
  },
  {
    slug: "uae",
    iso2: "AE",
    flag: "🇦🇪",
    country: { ru: "ОАЭ", en: "UAE" },
    programme: { ru: "Golden Visa через недвижимость", en: "Golden Visa (property)" },
    status: "open",
    minInvestment: { ru: "AED 2 000 000", en: "AED 2,000,000" },
    routes: {
      ru: "Недвижимость (зарегистрированная собственность от AED 2 млн; ипотека одобренного банка допускается); есть и другие категории",
      en: "Property (registered ownership from AED 2M; approved-bank mortgage allowed); other categories exist",
    },
    citizenship: { ru: "Не путь к гражданству", en: "Not a citizenship route" },
    ruBy: { status: "verify", ru: "Уточняется", en: "Being verified", verify: true },
    sources: [{ label: "icp.gov.ae — UAE Golden Residency", url: "https://icp.gov.ae/en/services/uae-golden-residency/" }],
    lastChecked: null,
  },
  {
    slug: "hungary",
    iso2: "HU",
    flag: "🇭🇺",
    country: { ru: "Венгрия", en: "Hungary" },
    programme: { ru: "Guest Investor", en: "Guest Investor" },
    status: "open",
    minInvestment: { ru: "€250 000", en: "€250,000" },
    routes: {
      ru: "Паи фонда недвижимости MNB от €250 тыс. (≥5 лет) или пожертвование €1 млн вузу. Вариант «квартира €500 тыс.» отменён до запуска (MK 20.12.2024)",
      en: "MNB real-estate fund units from €250K (≥5 yrs) or a €1M donation to a university. The €500K property option was withdrawn before launch (Gazette 20.12.2024)",
    },
    citizenship: { ru: "Уточняется", en: "Being verified", verify: true },
    ruBy: { status: "verify", ru: "Уточняется", en: "Being verified", verify: true },
    sources: [{ label: "oif.gov.hu — Guest Investor", url: "https://oif.gov.hu/factsheets/residence-permit-for-guest-investor" }],
    lastChecked: null,
  },
  {
    slug: "malta",
    iso2: "MT",
    flag: "🇲🇹",
    country: { ru: "Мальта", en: "Malta" },
    programme: { ru: "MPRP (ПМЖ)", en: "MPRP (permanent residence)" },
    status: "open",
    minInvestment: {
      ru: "Активы €500 тыс. (из них €150 тыс. ликвидных) + жильё + взносы",
      en: "Assets €500K (incl. €150K liquid) + housing + contributions",
    },
    routes: {
      ru: "Покупка жилья от €375 тыс. или аренда от €14 тыс./год + admin €60 тыс. + contribution €37 тыс. + donation €2 тыс. (L.N. 146/2025)",
      en: "Property purchase from €375K or lease from €14K/yr + €60K admin + €37K contribution + €2K donation (L.N. 146/2025)",
      verify: true,
    },
    citizenship: {
      ru: "ПМЖ ≠ паспорт: натурализация требует реального проживания",
      en: "PR ≠ passport: naturalisation needs real residence",
      verify: true,
    },
    ruBy: {
      status: "restricted",
      ru: "Заявки из РФ и РБ сейчас не допускаются (FAQ Residency Malta, v2.6.5)",
      en: "Applications from Russia and Belarus currently not eligible (Residency Malta FAQ, v2.6.5)",
    },
    sources: [
      { label: "residencymalta.gov.mt — MPRP", url: "https://residencymalta.gov.mt/legal-framework-mprp-2/" },
      {
        label: "Residency Malta — MPRP FAQ v2.6.5",
        url: "https://residencymalta.gov.mt/wp-content/uploads/2024/09/MPRP-FAQs-V2.6.5.pdf",
      },
    ],
    lastChecked: null,
  },
];

export function goldenVisaRow(slug: string): GoldenVisaRow | undefined {
  return GOLDEN_VISA_ROWS.find((row) => row.slug === slug);
}

export function isInvestCountrySlug(value: string): value is InvestCountrySlug {
  return (INVEST_COUNTRY_SLUGS as readonly string[]).includes(value);
}

export function rowNeedsVerify(row: GoldenVisaRow): boolean {
  return (
    row.lastChecked === null ||
    Boolean(row.minInvestment.verify || row.routes.verify || row.citizenship.verify || row.ruBy.verify)
  );
}

export function investPagePath(locale: InvestLocale, key: InvestPageKey): string {
  if (key === "hub") return `/${locale}/invest`;
  return `/${locale}/invest/${key}`;
}

export const INVEST_COMPARE_PDF_PATH: Record<InvestLocale, string> = {
  ru: "/assist/emigro_golden_visa_2026_comparison_ru.pdf",
  en: "/assist/emigro_golden_visa_2026_comparison_en.pdf",
};

export const VERIFY_BADGE: Localized = { ru: "уточняется", en: "being verified" };

/** Cell whose text is just the badge wording — render the badge once. */
export function isVerifyOnly(cell: FactCell, locale: InvestLocale): boolean {
  return Boolean(cell.verify) && cell[locale].trim().toLowerCase() === VERIFY_BADGE[locale];
}

export const PORTUGAL_2026_CALLOUT: Localized = {
  ru: "Важно (2026): Lei Orgânica 1/2026, в силе с 19 мая 2026 — для гражданства нужно 10 лет легального проживания (граждане ЕС и стран CPLP — 7 лет). Срок считается с даты выдачи первого ВНЖ. Заявления на гражданство, поданные до 18.05.2026, рассматриваются по старому правилу 5 лет. Основной маршрут ARI — от €500 000 в квалифицированные португальские фонды (не недвижимость, срок ≥5 лет, ≥60% в компании Португалии).",
  en: "Important (2026): Lei Orgânica 1/2026, in force since 19 May 2026 — citizenship now requires 10 years of legal residence (7 years for EU and CPLP nationals), counted from the first permit's issue date. Nationality applications filed by 18 May 2026 keep the old 5-year rule. The main ARI route is €500,000+ in qualifying Portuguese funds (no real estate, ≥5-year maturity, ≥60% in Portuguese companies).",
};

/** Overlay: how time already lived under ARI counts is still contested (see the ARI 2021–22 guide). */
export const PORTUGAL_2026_CALLOUT_NOTE: Localized = {
  ru: "Для тех, кто уже живёт в Португалии по ARI, но ещё не подал на гражданство, зачёт прожитого времени по новому закону спорный — смотрите разбор когорт в гайде.",
  en: "If you already hold ARI but have not yet filed for nationality, how your time counts under the new law is still contested — see the cohort breakdown in our guide.",
};
