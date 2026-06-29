/** Portugal long-tail SEO cluster — НЧ запросы под один URL каждый. */
export type PtLongTailTarget = {
  path: string;
  guideSlug?: string;
  primaryQuery: string;
  queries: string[];
  seoTitle: string;
  seoDescription: string;
};

export const PT_LONG_TAIL_TARGETS: PtLongTailTarget[] = [
  {
    path: "/ru/portugal",
    primaryQuery: "внж португалия d8 d7 2026 для россиян",
    queries: [
      "внж португалия d8 d7 2026 для россиян",
      "переехать в португалию из россии легально 2026",
      "aima португалия запись биометрия после визы",
    ],
    seoTitle: "ВНЖ Португалия D8 и D7 2026 — для граждан РФ",
    seoDescription:
      "D8 и D7 Португалия 2026 для граждан РФ, Беларуси, Казахстана: пороги дохода, AIMA, консульство. Программы с проверкой Emigro и wizard подбора маршрута.",
  },
  {
    path: "/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    guideSlug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    primaryQuery: "d8 португалия минимальный доход 2026",
    queries: [
      "d8 португалия минимальный доход 2026",
      "d7 португалия пассивный доход сбережения 2026",
      "закон о гражданстве португалия 10 лет d8",
    ],
    seoTitle: "D8 и D7 Португалия 2026 — доход, AIMA, гражданство",
    seoDescription:
      "D8 digital nomad и D7 пассивный доход Португалия 2026: пороги €3 680 / €920, документы, AIMA, гражданство 10 лет. Для паспортов RU/BY/UA/KZ.",
  },
  {
    path: "/ru/guides/pervye-30-dnej-v-portugalii-2026",
    guideSlug: "pervye-30-dnej-v-portugalii-2026",
    primaryQuery: "nif португалия гражданин россии как получить",
    queries: [
      "nif португалия гражданин россии как получить",
      "первые 30 дней в португалии после переезда чеклист",
      "activobank португалия счёт для иностранца",
    ],
    seoTitle: "NIF и первые 30 дней в Португалии 2026 — чек-лист",
    seoDescription:
      "NIF, банк, SIM, SNS и запись AIMA после прилёта в Португалию: пошаговый чек-лист для граждан РФ/BY/UA/KZ с D7 или D8 в 2026 году.",
  },
  {
    path: "/ru/guides/podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026",
    guideSlug: "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026",
    primaryQuery: "как подтвердить доход из россии для d8 португалия",
    queries: [
      "как подтвердить доход из россии для d8 португалия",
      "d8 португалия доход из россии удалёнка выписки",
      "отказ d7 d8 португалия консульство что делать",
    ],
    seoTitle: "Доход из России для D8/D7 Португалия 2026",
    seoDescription:
      "Как подтвердить доход и сбережения из РФ для D8/D7 Португалия: выписки, договоры, санкции, типовые ошибки консульства. Для граждан РФ и СНГ.",
  },
  {
    path: "/ru/guides/konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya",
    guideSlug: "konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya",
    primaryQuery: "консульство португалии подача d8 граждане рф",
    queries: [
      "консульство португалии подача d8 граждане рф",
      "где подать d7 португалия граждане беларуси 2026",
      "d8 виза португалия требования для россиян 2026",
    ],
    seoTitle: "Подать D8/D7 Португалия из РФ — консульство 2026",
    seoDescription:
      "Консульская юрисдикция для D8/D7 Португалия: где граждане РФ, Беларуси и Казахстана могут подаваться в 2026, резиденция и типовые ошибки.",
  },
];

export const PT_LONG_TAIL_QUERIES = PT_LONG_TAIL_TARGETS.flatMap((t) => t.queries);

export function getPtLongTailByGuideSlug(slug: string): PtLongTailTarget | undefined {
  return PT_LONG_TAIL_TARGETS.find((t) => t.guideSlug === slug);
}

export function getPtLongTailByPath(path: string): PtLongTailTarget | undefined {
  return PT_LONG_TAIL_TARGETS.find((t) => t.path === path);
}
