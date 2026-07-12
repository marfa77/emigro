import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { getFactcheckCadence, getGuideReviewTier, type GuideReviewTier } from "@/lib/guides/review-tiers";

/** Third-party relocant Telegram channels parsed by `npm run spain:daily`. */
export const SPAIN_CHAT_CHANNELS = SPAIN_SATELLITE.sourceChannels;

export type SpainChatChannel = (typeof SPAIN_CHAT_CHANNELS)[number];

export type SpainChatCitationParams = {
  channels: (SpainChatChannel | string)[];
  topic: string;
  claim: string;
  /** e.g. "2025–2026", "июль 2026" */
  period?: string;
  /** inline — sentence in prose; block — markdown callout */
  variant?: "inline" | "block";
};

export type GuideFactcheckTopic = {
  id: string;
  label: string;
  keywords: string[];
  suggestedSections: Record<string, string>;
};

export type GuideFactcheckConfig = {
  slug: string;
  file: string;
  title: string;
  aliases: string[];
  /** Review tier hint — volatile guides get quarterly TG fact-check priority. */
  reviewTier: GuideReviewTier;
  factcheckCadence: ReturnType<typeof getFactcheckCadence>;
  topics: GuideFactcheckTopic[];
};

type GuideFactcheckConfigInput = Omit<GuideFactcheckConfig, "reviewTier" | "factcheckCadence">;

export type SeedFactcheckSignal = {
  channel_username: string;
  posted_at: string;
  text: string;
  topic_id: string;
  guide_slug: string;
  suggested_section: string;
};

export function formatChannelHandle(channel: string): string {
  const norm = channel.replace(/^@/, "").toLowerCase();
  return `@${norm}`;
}

/** Neutral citation phrasing — "часто пишут", not authoritative claims. */
export function formatSpainChatCitation(params: SpainChatCitationParams): string {
  const { channels, claim, period = "2025–2026", variant = "inline" } = params;
  const handles = channels.map(formatChannelHandle);
  const channelList =
    handles.length <= 2
      ? handles.join(" и ")
      : `${handles.slice(0, 2).join(", ")} и др.`;

  const prefix = `В локальных чатах эмигрантов (${channelList}) в ${period} часто пишут`;
  const body = `${prefix}, что ${claim}`;

  if (variant === "block") {
    return `> **Практика из чатов:** ${body}`;
  }
  return body;
}

/** Guide slug aliases for `--guide` filter (partial match). */
export const SPAIN_GUIDE_FACTCHECK: GuideFactcheckConfigInput[] = [
  {
    slug: "vnj-ispaniya-2026",
    file: "content/guides/ru/vnj-ispaniya-2026.md",
    title: "Digital nomad Испания 2026",
    aliases: ["vnj-ispaniya", "ispaniya-2026", "spain-dnv"],
    topics: [
      {
        id: "dnv-uge",
        label: "DNV / UGE",
        keywords: ["dnv", "uge", "teletrabajo", "nomad", "digital", "консул", "consulado"],
        suggestedSections: {
          dnv: "## Digital Nomad Visa (Visado para nómadas digitales)",
          uge: "### Что нужно для подачи",
        },
      },
      {
        id: "beckham",
        label: "Beckham / налоги",
        keywords: ["beckham", "24%", "irpf", "aeat", "налог", "autónomo"],
        suggestedSections: {
          beckham: "### Режим Beckham (Ley Beckham)",
        },
      },
      {
        id: "tie-extranjeria",
        label: "TIE / extranjería",
        keywords: ["tie", "extranjería", "cita", "huellas", "resguardo", "huella"],
        suggestedSections: {
          tie: "### Сколько времени занимает получение Digital Nomad Visa?",
        },
      },
      {
        id: "golden-myth",
        label: "Golden Visa мифы",
        keywords: ["golden", "инвест", "недвижим", "500", "закрыт"],
        suggestedSections: {
          golden: "## Golden Visa: статус 2026",
        },
      },
      {
        id: "nie-bank",
        label: "NIE / банк",
        keywords: ["nie", "iban", "банк", "caixabank", "santander", "revolut"],
        suggestedSections: {
          bank: "## Особенности для граждан РФ в 2026",
        },
      },
    ],
  },
  {
    slug: "pervye-30-dnej-v-ispanii-2026",
    file: "content/guides/ru/pervye-30-dnej-v-ispanii-2026.md",
    title: "Первые 30 дней в Испании",
    aliases: ["pervye-30-dnej-ispaniya", "30-dnej-ispaniya", "first-30-spain"],
    topics: [
      {
        id: "nie",
        label: "NIE",
        keywords: ["nie", "ex-15", "cita previa", "gestoría", "gestoria"],
        suggestedSections: {
          nie: "### День 3–7: начало NIE",
        },
      },
      {
        id: "empadronamiento",
        label: "Empadronamiento",
        keywords: ["empadronamiento", "padrón", "padron", "ayuntamiento", "contrato"],
        suggestedSections: {
          empadronamiento: "### Empadronamiento (padron municipal)",
        },
      },
      {
        id: "bank-lease",
        label: "Банк / аренда",
        keywords: ["банк", "аренд", "idealista", "iban", "caixabank", "deposit"],
        suggestedSections: {
          bank: "### Банк",
          lease: "## Бюджет первого месяца (ориентир 2026)",
        },
      },
      {
        id: "tie",
        label: "TIE / extranjería",
        keywords: ["tie", "extranjería", "huellas", "cita", "resguardo", "30 дней"],
        suggestedSections: {
          tie: "## Неделя 4: extranjería и TIE",
        },
      },
    ],
  },
  {
    slug: "portugaliya-vs-ispaniya-vnj-2026",
    file: "content/guides/ru/portugaliya-vs-ispaniya-vnj-2026.md",
    title: "Португалия vs Испания ВНЖ 2026",
    aliases: ["portugaliya-vs-ispaniya", "pt-vs-es", "portugal-vs-spain"],
    topics: [
      {
        id: "beckham",
        label: "Beckham (ES)",
        keywords: ["beckham", "24%", "irpf", "налог", "aeat"],
        suggestedSections: {
          taxes: "### 3. Налоги",
        },
      },
      {
        id: "tie-aima",
        label: "TIE / AIMA сроки",
        keywords: ["tie", "extranjería", "cita", "aima", "биометр", "карта", "huellas"],
        suggestedSections: {
          bureaucracy: "### 4. Сроки ВНЖ и бюрократия",
        },
      },
      {
        id: "bank-es",
        label: "Банки (ES)",
        keywords: ["банк", "caixabank", "santander", "nie", "iban", "revolut"],
        suggestedSections: {
          bank: "### 7. Банки и финансы для граждан РФ/BY",
        },
      },
      {
        id: "valencia-rent",
        label: "Аренда Valencia",
        keywords: ["valencia", "валенс", "idealista", "аренд", "alquiler"],
        suggestedSections: {
          cost: "### 2. Стоимость жизни",
        },
      },
    ],
  },
  {
    slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    file: "content/guides/ru/digital-nomad-portugaliya-ispaniya-italiya-2026.md",
    title: "Digital nomad PT vs ES vs IT 2026",
    aliases: ["digital-nomad-portugaliya", "nomad-pt-es-it", "dnv-comparison"],
    topics: [
      {
        id: "dnv-uge",
        label: "DNV / UGE (ES)",
        keywords: ["dnv", "uge", "teletrabajo", "nomad", "digital", "консул", "consulado"],
        suggestedSections: {
          spain: "## Испания — когда выбирать",
        },
      },
      {
        id: "beckham",
        label: "Beckham / налоги (ES)",
        keywords: ["beckham", "24%", "irpf", "aeat", "налог"],
        suggestedSections: {
          taxes: "## Налоги — не игнорируйте",
        },
      },
      {
        id: "valencia-rent",
        label: "Аренда Valencia",
        keywords: ["valencia", "idealista", "аренд", "alquiler", "iban"],
        suggestedSections: {
          cost: "## Сравнение стоимости жизни nomad-семьи (2+1)",
        },
      },
      {
        id: "tie-extranjeria",
        label: "TIE / extranjería",
        keywords: ["tie", "extranjería", "cita", "huellas", "resguardo"],
        suggestedSections: {
          renewal: "## Продление nomad-ВНЖ: что проверяют",
        },
      },
    ],
  },
  {
    slug: "grazhdanstvo-portugaliya-ispaniya-2026",
    file: "content/guides/ru/grazhdanstvo-portugaliya-ispaniya-2026.md",
    title: "Гражданство PT vs ES 2026",
    aliases: ["grazhdanstvo-portugaliya", "citizenship-pt-es", "grazhdanstvo-ispaniya"],
    topics: [
      {
        id: "golden-myth",
        label: "Golden Visa мифы",
        keywords: ["golden", "инвест", "недвижим", "500", "закрыт"],
        suggestedSections: {
          golden: "## Альтернативные пути (кратко)",
        },
      },
      {
        id: "empadronamiento",
        label: "Empadronamiento / адреса",
        keywords: ["empadronamiento", "padrón", "padron", "ayuntamiento", "contrato"],
        suggestedSections: {
          docs: "### Документы (типовой пакет ES)",
        },
      },
      {
        id: "nationality-rf",
        label: "Отказ от РФ-паспорта",
        keywords: ["отказ", "паспорт", "двойн", "nacionalidad", "гражданств"],
        suggestedSections: {
          rf: "## Испания: DELE + CCSE",
        },
      },
    ],
  },
];

/**
 * Curated practice notes — used when Supabase is unavailable in dev.
 * Seed signals only; channels just added, no DB signals yet.
 */
export const SEED_FACTCHECK_SIGNALS: SeedFactcheckSignal[] = [
  {
    channel_username: "migranty_barselona",
    posted_at: "2026-01-10T09:00:00Z",
    text: "Cita extranjería в Madrid/BCN — 2–4 мес. ожидания; бронируйте сразу после прилёта, не ждите NIE.",
    topic_id: "tie-extranjeria",
    guide_slug: "vnj-ispaniya-2026",
    suggested_section: "### Сколько времени занимает получение Digital Nomad Visa?",
  },
  {
    channel_username: "valenciarusia",
    posted_at: "2025-11-15T14:00:00Z",
    text: "В Valencia agencies на Idealista часто требуют NIE + Spanish IBAN ещё до viewing — без этого не показывают квартиры.",
    topic_id: "bank-lease",
    guide_slug: "pervye-30-dnej-v-ispanii-2026",
    suggested_section: "### Банк",
  },
  {
    channel_username: "spainchats",
    posted_at: "2025-12-01T11:00:00Z",
    text: "DNV через UGE и через консульство — разные пакеты; в чатах путают «подал в консульстве» с «уже в UGE после въезда».",
    topic_id: "dnv-uge",
    guide_slug: "vnj-ispaniya-2026",
    suggested_section: "### Что нужно для подачи",
  },
  {
    channel_username: "valenciarusia",
    posted_at: "2025-09-20T08:00:00Z",
    text: "Порядок шагов: NIE → empadronamiento → банк; без padrón ayuntamiento может отказать, а extranjería смотрит на certificado.",
    topic_id: "empadronamiento",
    guide_slug: "pervye-30-dnej-v-ispanii-2026",
    suggested_section: "### Empadronamiento (padron municipal)",
  },
  {
    channel_username: "valenforum",
    posted_at: "2026-02-05T16:00:00Z",
    text: "Аренда Valencia: депозит 1–2 мес. + agency 1 мес.; contrato de alquiler нужен для empadronamiento в большинстве municipios.",
    topic_id: "bank-lease",
    guide_slug: "pervye-30-dnej-v-ispanii-2026",
    suggested_section: "## Бюджет первого месяца (ориентир 2026)",
  },
  {
    channel_username: "spain_granitsa",
    posted_at: "2025-10-08T13:00:00Z",
    text: "Beckham Law не включается автоматически — заявление в AEAT в 6 мес. после NIE; миф «24% для любого nomad» повторяется еженедельно.",
    topic_id: "beckham",
    guide_slug: "vnj-ispaniya-2026",
    suggested_section: "### Режим Beckham (Ley Beckham)",
  },
  {
    channel_username: "spain_granitsa",
    posted_at: "2026-03-01T07:00:00Z",
    text: "Golden Visa «ещё открыта через недвижимость» — устаревший миф; с 3 апр. 2025 все инвестпути закрыты, в чатах до сих пор спрашивают про €500k.",
    topic_id: "golden-myth",
    guide_slug: "vnj-ispaniya-2026",
    suggested_section: "## Golden Visa: статус 2026",
  },
  {
    channel_username: "valenforum",
    posted_at: "2025-08-12T10:00:00Z",
    text: "Gestoría €300–800 ускоряет NIE + TIE в Valencia; cita previa на sede ловят ночью, официального расписания релиза нет.",
    topic_id: "nie",
    guide_slug: "pervye-30-dnej-v-ispanii-2026",
    suggested_section: "### День 3–7: начало NIE",
  },
  {
    channel_username: "spainchats",
    posted_at: "2025-11-22T09:00:00Z",
    text: "На DNV одной выписки банка мало — просят employment agreement или контракты за 12 мес. с суммами; UGE строже консульства по remote proof.",
    topic_id: "dnv-uge",
    guide_slug: "vnj-ispaniya-2026",
    suggested_section: "## Digital Nomad Visa (Visado para nómadas digitales)",
  },
  {
    channel_username: "valenciarusia",
    posted_at: "2026-04-18T12:00:00Z",
    text: "Полный цикл TIE в Valencia — 4–8 мес.; resguardo обязателен для travel — без него риск при проверке до пластика.",
    topic_id: "tie",
    guide_slug: "pervye-30-dnej-v-ispanii-2026",
    suggested_section: "## Неделя 4: extranjería и TIE",
  },
  {
    channel_username: "migranty_barselona",
    posted_at: "2026-05-10T09:00:00Z",
    text: "TIE в Madrid/BCN — bottleneck cita previa 3–6 мес.; в сравнении PT vs ES не выбирайте страну по «быстрой карте».",
    topic_id: "tie-aima",
    guide_slug: "portugaliya-vs-ispaniya-vnj-2026",
    suggested_section: "### 4. Сроки ВНЖ и бюрократия",
  },
  {
    channel_username: "valenforum",
    posted_at: "2025-12-20T15:00:00Z",
    text: "Revolut/N26 помогают первые недели, но extranjería и utilities хотят ES IBAN — CaixaBank/Santander после NIE + empadronamiento.",
    topic_id: "bank-es",
    guide_slug: "portugaliya-vs-ispaniya-vnj-2026",
    suggested_section: "### 7. Банки и финансы для граждан РФ/BY",
  },
  {
    channel_username: "spainchats",
    posted_at: "2025-12-01T11:00:00Z",
    text: "DNV через UGE и через консульство — разные пакеты; в чатах путают «подал в консульстве» с «уже в UGE после въезда».",
    topic_id: "dnv-uge",
    guide_slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    suggested_section: "## Испания — когда выбирать",
  },
  {
    channel_username: "spainchats",
    posted_at: "2025-11-22T09:00:00Z",
    text: "На DNV одной выписки банка мало — просят employment agreement или контракты за 12 мес. с суммами; UGE строже консульства по remote proof.",
    topic_id: "dnv-uge",
    guide_slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    suggested_section: "## Испания — когда выбирать",
  },
  {
    channel_username: "spain_granitsa",
    posted_at: "2025-10-08T13:00:00Z",
    text: "Beckham Law не включается автоматически — заявление в AEAT в 6 мес. после NIE; миф «24% для любого nomad» повторяется еженедельно.",
    topic_id: "beckham",
    guide_slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    suggested_section: "## Налоги — не игнорируйте",
  },
  {
    channel_username: "valenciarusia",
    posted_at: "2025-11-15T14:00:00Z",
    text: "В Valencia agencies на Idealista часто требуют NIE + Spanish IBAN ещё до viewing — без этого не показывают квартиры.",
    topic_id: "valencia-rent",
    guide_slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    suggested_section: "## Сравнение стоимости жизни nomad-семьи (2+1)",
  },
  {
    channel_username: "migranty_barselona",
    posted_at: "2026-01-10T09:00:00Z",
    text: "Cita extranjería в Madrid/BCN — 2–4 мес. ожидания; бронируйте сразу после прилёта, не ждите NIE.",
    topic_id: "tie-extranjeria",
    guide_slug: "digital-nomad-portugaliya-ispaniya-italiya-2026",
    suggested_section: "## Продление nomad-ВНЖ: что проверяют",
  },
  {
    channel_username: "spain_granitsa",
    posted_at: "2026-03-01T07:00:00Z",
    text: "Golden Visa «ещё открыта через недвижимость» — устаревший миф; с 3 апр. 2025 все инвестпути закрыты, в чатах до сих пор спрашивают про €500k.",
    topic_id: "golden-myth",
    guide_slug: "grazhdanstvo-portugaliya-ispaniya-2026",
    suggested_section: "## Альтернативные пути (кратко)",
  },
  {
    channel_username: "valenciarusia",
    posted_at: "2025-09-20T08:00:00Z",
    text: "Порядок шагов: NIE → empadronamiento → банк; без padrón ayuntamiento может отказать, а extranjería смотрит на certificado.",
    topic_id: "empadronamiento",
    guide_slug: "grazhdanstvo-portugaliya-ispaniya-2026",
    suggested_section: "### Документы (типовой пакет ES)",
  },
  {
    channel_username: "spain_granitsa",
    posted_at: "2026-06-15T10:00:00Z",
    text: "При nacionalidad ES граждане РФ обязаны отказаться от паспорта РФ — в чатах регулярно сравнивают с PT, где двойное гражданство разрешено.",
    topic_id: "nationality-rf",
    guide_slug: "grazhdanstvo-portugaliya-ispaniya-2026",
    suggested_section: "## Испания: DELE + CCSE",
  },
];

export function resolveGuideFactcheckConfig(guideFilter?: string): GuideFactcheckConfig[] {
  const configs = !guideFilter
    ? SPAIN_GUIDE_FACTCHECK
    : SPAIN_GUIDE_FACTCHECK.filter((g) => {
        const q = guideFilter.toLowerCase().replace(/\.md$/, "");
        return g.slug.includes(q) || g.aliases.some((a) => a.includes(q) || q.includes(a));
      });

  return configs.map(enrichGuideFactcheckConfig);
}

function enrichGuideFactcheckConfig(config: GuideFactcheckConfigInput): GuideFactcheckConfig {
  const reviewTier = getGuideReviewTier(config.slug);
  return {
    ...config,
    reviewTier,
    factcheckCadence: getFactcheckCadence(config.slug, reviewTier),
  };
}

export function matchSignalTopic(
  text: string,
  topics: GuideFactcheckTopic[]
): GuideFactcheckTopic | null {
  const lower = text.toLowerCase();
  for (const topic of topics) {
    if (topic.keywords.some((k) => lower.includes(k.toLowerCase()))) {
      return topic;
    }
  }
  return null;
}

export function suggestSectionForTopic(
  topic: GuideFactcheckTopic,
  topicId: string
): string {
  const sections = topic.suggestedSections;
  const direct = sections[topicId];
  if (direct) return direct;
  return Object.values(sections)[0] ?? topic.label;
}
