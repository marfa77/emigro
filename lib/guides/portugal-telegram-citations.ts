import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { getFactcheckCadence, getGuideReviewTier, type GuideReviewTier } from "@/lib/guides/review-tiers";

/** Third-party relocant Telegram channels parsed by `npm run portugal:daily`. */
export const PORTUGAL_CHAT_CHANNELS = PORTUGAL_SATELLITE.sourceChannels;

export type PortugalChatChannel = (typeof PORTUGAL_CHAT_CHANNELS)[number];

export type PortugalChatCitationParams = {
  channels: (PortugalChatChannel | string)[];
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
export function formatPortugalChatCitation(params: PortugalChatCitationParams): string {
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
export const PORTUGAL_GUIDE_FACTCHECK: GuideFactcheckConfigInput[] = [
  {
    slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    file: "content/guides/ru/vnj-portugaliya-d8-d7-grazhdanstvo-2026.md",
    title: "D8 и D7 Португалия 2026",
    aliases: ["vnj-portugaliya-d8-d7", "d8-d7", "vnj-portugaliya"],
    topics: [
      {
        id: "aima",
        label: "AIMA / Agora",
        keywords: ["aima", "agora", "биометр", "слот", "запись", "título", "residência"],
        suggestedSections: {
          aima: "## AIMA: сроки и этапы после въезда",
          process: "## Процесс: консульство → AIMA → карта",
        },
      },
      {
        id: "nif-bank",
        label: "NIF / банк",
        keywords: ["nif", "finanças", "банк", "conta", "activobank", "millennium", "morada", "iban"],
        suggestedSections: {
          bank: "## Банковский счёт и NIF до AIMA",
        },
      },
      {
        id: "ifici",
        label: "IFICI / налоги",
        keywords: ["ifici", "nhr", "налог", "20%", "irs", "фриланс"],
        suggestedSections: {
          taxes: "## Налоги и резидентство: что заложить в бюджет",
        },
      },
      {
        id: "consulado",
        label: "Консульство / виза D",
        keywords: ["консул", "consulado", "vfs", "виза d", "d7", "d8"],
        suggestedSections: {
          consulate: "## Консульства и юрисдикция для граждан РФ и СНГ",
        },
      },
    ],
  },
  {
    slug: "pervye-30-dnej-v-portugalii-2026",
    file: "content/guides/ru/pervye-30-dnej-v-portugalii-2026.md",
    title: "Первые 30 дней в Португалии",
    aliases: ["pervye-30-dnej", "30-dnej", "first-30"],
    topics: [
      {
        id: "nif",
        label: "NIF",
        keywords: ["nif", "finanças", "e-fatura", "representante", "morada"],
        suggestedSections: {
          nif: "### День 3–7: NIF",
        },
      },
      {
        id: "bank-lease",
        label: "Банк / аренда",
        keywords: ["банк", "аренд", "arrendamento", "caução", "iban", "activobank", "revolut"],
        suggestedSections: {
          bank: "### Банк: ActivoBank vs Millennium BCP",
          lease: "### Аренда (lease)",
        },
      },
      {
        id: "aima",
        label: "AIMA",
        keywords: ["aima", "agora", "biometr", "título", "residência"],
        suggestedSections: {
          aima: "## Неделя 4: AIMA и Título de Residência",
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
        id: "ifici",
        label: "IFICI",
        keywords: ["ifici", "nhr", "20%", "beckham", "налог", "фриланс"],
        suggestedSections: {
          taxes: "### 3. Налоги",
        },
      },
      {
        id: "aima-tie",
        label: "AIMA / TIE сроки",
        keywords: ["aima", "tie", "extranjería", "cita", "биометр", "карта"],
        suggestedSections: {
          bureaucracy: "### 4. Сроки ВНЖ и бюрократия",
        },
      },
      {
        id: "bank",
        label: "Банки",
        keywords: ["банк", "millennium", "activobank", "nif", "счёт"],
        suggestedSections: {
          bank: "### 7. Банки и финансы для граждан РФ/BY",
        },
      },
    ],
  },
  {
    slug: "d7-vs-digital-nomad-visa-sravnenie",
    file: "content/guides/ru/d7-vs-digital-nomad-visa-sravnenie.md",
    title: "D7 vs Digital Nomad Visa 2026",
    aliases: ["d7-vs-digital-nomad", "d7-vs-d8", "d7-d8-sravnenie"],
    topics: [
      {
        id: "d7-income",
        label: "D7 пассив / сбережения",
        keywords: ["d7", "пассив", "пенси", "аренд", "сбережен", "recurring", "дивиденд"],
        suggestedSections: {
          d7Req: "### Требования 2026",
          d7Tax: "### Налоги на D7",
        },
      },
      {
        id: "d8-remote",
        label: "D8 удалёнка / контракты",
        keywords: ["d8", "nomad", "удалён", "контракт", "employment", "фриланс", "remote"],
        suggestedSections: {
          d8Req: "### Требования 2026",
          d8Tax: "### Налоги на D8",
        },
      },
      {
        id: "ifici",
        label: "IFICI / налоги D7 vs D8",
        keywords: ["ifici", "nhr", "20%", "налог", "irs", "фриланс"],
        suggestedSections: {
          d7Tax: "### Налоги на D7",
          d8Tax: "### Налоги на D8",
        },
      },
      {
        id: "aima-consulado",
        label: "AIMA / консульство",
        keywords: ["aima", "agora", "консул", "consulado", "слот", "биометр"],
        suggestedSections: {
          process: "### Процесс подачи",
        },
      },
      {
        id: "category-myth",
        label: "Мифы D7 vs D8",
        keywords: ["проще", "порог", "удалёнк", "пассив", "легче"],
        suggestedSections: {
          errors: "## Частые ошибки",
        },
      },
    ],
  },
  {
    slug: "prodlenie-vnzh-portugaliya-aima-2026",
    file: "content/guides/ru/prodlenie-vnzh-portugaliya-aima-2026.md",
    title: "Продление ВНЖ Португалия 2026",
    aliases: ["prodlenie-vnzh", "vnzh-renewal", "renovacao-aima"],
    topics: [
      {
        id: "renovacao-portal",
        label: "Portal das Renovações",
        keywords: [
          "renovação",
          "renovacao",
          "portal-renovacoes",
          "portal renovações",
          "caducidade",
          "duc",
          "taxa",
        ],
        suggestedSections: {
          when: "## Когда начинать продление",
          channels: "## Куда подавать: три канала",
        },
      },
      {
        id: "aima-expired",
        label: "Просроченный / services.aima",
        keywords: [
          "просроч",
          "caducado",
          "services.aima",
          "estructura de missão",
          "expir",
        ],
        suggestedSections: {
          expired: "## Просроченный título",
        },
      },
      {
        id: "aima-docs",
        label: "Документы renovação",
        keywords: [
          "morada",
          "rendimentos",
          "seguro",
          "extratos",
          "reagrupamento",
          "d7",
          "d8",
          "trabalho",
          "estudo",
        ],
        suggestedSections: {
          docs: "## Документы",
          types: "## Типы ВНЖ: D7, D8, trabalho, estudo, família, EU",
        },
      },
      {
        id: "aima-agora-renewal",
        label: "Agora слоты renovação",
        keywords: ["agora", "слот", "agendamento", "запись", "biometr"],
        suggestedSections: {
          agora: "## Куда подавать: три канала",
        },
      },
    ],
  },
];

/**
 * Curated signals from community-notes guides and practice-enrichment —
 * used when Supabase is unavailable in dev.
 * Do NOT invent quotes; each item traces to editorial community-notes work.
 */
export const SEED_FACTCHECK_SIGNALS: SeedFactcheckSignal[] = [
  {
    channel_username: "chatlisboa",
    posted_at: "2026-01-15T10:00:00Z",
    text: "Слот Agora исчез за минуту — собирайте PDF заранее, без записи в AIMA не пускают.",
    topic_id: "aima",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    suggested_section: "## AIMA: сроки и этапы после въезда",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-11-20T09:00:00Z",
    text: "Слоты Agora ловят ночью/рано утром по Lisbon; официального расписания релиза нет.",
    topic_id: "aima",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    suggested_section: "## Процесс: консульство → AIMA → карта",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-09-10T14:00:00Z",
    text: "Замкнутый круг: для аренды нужен IBAN, для банка — адрес; выход — NIF + Termo или краткая бронь.",
    topic_id: "nif-bank",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    suggested_section: "## Банковский счёт и NIF до AIMA",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-12-05T11:00:00Z",
    text: "В чатах путают IFICI с NHR — «20% для любого IT» не работает для D8 с зарубежными клиентами.",
    topic_id: "ifici",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    suggested_section: "## Налоги и резидентство: что заложить в бюджет",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-08-01T08:00:00Z",
    text: "NIF можно получить раньше ВНЖ через Finanças; миф «NIF только с картой» повторяется каждую неделю.",
    topic_id: "nif",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    suggested_section: "### День 3–7: NIF",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-10-12T16:00:00Z",
    text: "ActivoBank онлайн часто проще для expats; Millennium в Lisbon строже KYC для RU-паспортов.",
    topic_id: "bank-lease",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    suggested_section: "### Банк: ActivoBank vs Millennium BCP",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-07-18T12:00:00Z",
    text: "Без registo arrendamento в Finanças morada не подтвердите — AIMA и банк смотрят на зарегистрированный договор.",
    topic_id: "bank-lease",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    suggested_section: "### Аренда (lease)",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-02-01T07:00:00Z",
    text: "В Norte AIMA — balcões Porto/Braga/Marco de Canaveses, не только Saldanha в Lisboa.",
    topic_id: "aima",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    suggested_section: "## Неделя 4: AIMA и Título de Residência",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-11-08T13:00:00Z",
    text: "IFICI — не «20% для nomad»: нужен PT-работодатель из списка; D8-фрилансер остаётся на прогрессивной шкале.",
    topic_id: "ifici",
    guide_slug: "portugaliya-vs-ispaniya-vnj-2026",
    suggested_section: "### 3. Налоги",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-03-10T09:00:00Z",
    text: "Полный цикл AIMA в Lisboa 15–28 мес. от прилёта — в чатах советуют не планировать переезд «под срок визы».",
    topic_id: "aima-tie",
    guide_slug: "portugaliya-vs-ispaniya-vnj-2026",
    suggested_section: "### 4. Сроки ВНЖ и бюрократия",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-06-15T10:00:00Z",
    text: "Revolut по NIF — старт на неделю, но аренда и utilities требуют PT IBAN; держите основной счёт в PT-банке.",
    topic_id: "bank",
    guide_slug: "portugaliya-vs-ispaniya-vnj-2026",
    suggested_section: "### 7. Банки и финансы для граждан РФ/BY",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-07-01T11:00:00Z",
    text: "Слот lisboa.kdmid.ru ловят неделями; e-mail подтверждения agendamento иногда не доходит — сохраняйте скрин статуса.",
    topic_id: "consulado",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    suggested_section: "## Консульства и юрисдикция для граждан РФ и СНГ",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-10-22T10:00:00Z",
    text: "На D7 консульство смотрит на recurring пассив, а не просто остаток — миф «хватит €24k без пенсии» повторяется каждую неделю.",
    topic_id: "d7-income",
    guide_slug: "d7-vs-digital-nomad-visa-sravnenie",
    suggested_section: "### Требования 2026",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-12-18T14:00:00Z",
    text: "На D8 одной выписки банка мало — просят employment agreement или контракты за 12 мес. с суммами и сроками.",
    topic_id: "d8-remote",
    guide_slug: "d7-vs-digital-nomad-visa-sravnenie",
    suggested_section: "### Требования 2026",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2025-11-08T13:00:00Z",
    text: "IFICI — не «20% для nomad»: нужен PT-работодатель из списка; D8-фрилансер остаётся на прогрессивной шкале; на D7 пенсии и аренда вне IFICI.",
    topic_id: "ifici",
    guide_slug: "d7-vs-digital-nomad-visa-sravnenie",
    suggested_section: "### Налоги на D8",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2026-01-08T09:00:00Z",
    text: "D8 не «проще D7» — другой порог и пакет документов; путают «без сбережений» с «легче одобрят».",
    topic_id: "category-myth",
    guide_slug: "d7-vs-digital-nomad-visa-sravnenie",
    suggested_section: "## Частые ошибки",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-03-10T09:00:00Z",
    text: "Полный цикл AIMA в Lisboa 15–28 мес. от прилёта — при выборе D7 vs D8 категория не меняется, но сроки планируйте заранее.",
    topic_id: "aima-consulado",
    guide_slug: "d7-vs-digital-nomad-visa-sravnenie",
    suggested_section: "### Процесс подачи",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-06-01T10:00:00Z",
    text: "portal-renovacoes.aima.gov.pt: DUC оплатить за 24 часа; без оплаты pedido renovação не идёт в análise.",
    topic_id: "renovacao-portal",
    guide_slug: "prodlenie-vnzh-portugaliya-aima-2026",
    suggested_section: "## Куда подавать: три канала",
  },
  {
    channel_username: "por_tugal",
    posted_at: "2026-03-05T09:00:00Z",
    text: "Taxas AIMA с 1 марта 2026 — renovação trabalho €99,80; не платите по старым суммам из чатов 2024.",
    topic_id: "renovacao-portal",
    guide_slug: "prodlenie-vnzh-portugaliya-aima-2026",
    suggested_section: "## Пошлины (taxas) — по состоянию на июль 2026",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2025-11-12T14:00:00Z",
    text: "services.aima.gov.pt для просроченного ВНЖ — только после e-mail AIMA с taxa; без письма форма не открывается.",
    topic_id: "aima-expired",
    guide_slug: "prodlenie-vnzh-portugaliya-aima-2026",
    suggested_section: "## Просроченный título",
  },
  {
    channel_username: "chatlisboa",
    posted_at: "2026-04-20T11:00:00Z",
    text: "Renovação онлайн: ждали deferimento 30–90 дней; comprovativo pedido + старый título на границе.",
    topic_id: "renovacao-portal",
    guide_slug: "prodlenie-vnzh-portugaliya-aima-2026",
    suggested_section: "## Сроки ожидания (мягко)",
  },
];

export function resolveGuideFactcheckConfig(guideFilter?: string): GuideFactcheckConfig[] {
  const configs = !guideFilter
    ? PORTUGAL_GUIDE_FACTCHECK
    : PORTUGAL_GUIDE_FACTCHECK.filter((g) => {
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
