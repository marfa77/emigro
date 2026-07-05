/** Curated tip/lifehack topics — evergreen, not news. */
export type TipShortFormat = "mistakes" | "list" | "howto" | "comparison" | "fact";

export type TipShortTopic = {
  id: string;
  /** YouTube title seed */
  title: string;
  /** Hook pattern — Gemini adapts but keeps this energy */
  hookSeed: string;
  format: TipShortFormat;
  country: string;
  topic_key: string;
  guide_slug?: string;
  /** Factual seeds for the script writer */
  facts: string[];
  tags: string[];
};

export const TIP_SHORT_TOPICS: TipShortTopic[] = [
  {
    id: "aima-3-mistakes",
    title: "3 ошибки при записи в AIMA",
    hookSeed: "Три ошибки при записи в AIMA — и вы теряете месяцы",
    format: "mistakes",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    facts: [
      "Записываются без NIF и Portuguese IBAN — потом отказывают в договоре аренды и срывают слот",
      "Ждут пластиковую карту AIMA, чтобы открыть банк — порядок обратный: NIF → банк → аренда → AIMA",
      "Не сохраняют comprovativo de marcação и receipt подачи — без них сложно доказать легальный статус",
    ],
    tags: ["AIMA", "Португалия", "ВНЖ", "ошибки"],
  },
  {
    id: "lisbon-free-museums-vnj",
    title: "Бесплатные музеи в Лиссабоне с ВНЖ",
    hookSeed: "С ВНЖ в Лиссабоне — музеи бесплатно, а об этом мало кто говорит",
    format: "list",
    country: "Португалия",
    topic_key: "portugal",
    facts: [
      "Держатели cartão de cidadão или Título de Residência часто проходят бесплатно в MAAT, Gulbenkian и Municipal museums",
      "Нужен документ резидента + иногда NIF — проверяйте на кассе, не на сайте",
      "Лучше идти в будний день до 11:00 — меньше очередей",
    ],
    tags: ["Лиссабон", "ВНЖ", "музеи", "лайфхак"],
  },
  {
    id: "lisbon-rent-2026",
    title: "Сколько реально стоит аренда в Лиссабоне в 2026",
    hookSeed: "Сколько реально стоит аренда в Лиссабоне — цифры без маркетинга",
    format: "fact",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "byudzhet-relokatsii-evropa-2026-po-stranam",
    facts: [
      "T1 в центре часто €1 200–1 800 в месяц + депозит 2–3 месяца",
      "За пределами центра T1 €900–1 300 — но без NIF многие агенты не подпишут контракт",
      "Закладывайте €3 000–5 000 на первый месяц: депозит, комиссия агента, мебель",
    ],
    tags: ["Лиссабон", "аренда", "бюджет", "2026"],
  },
  {
    id: "nif-one-day",
    title: "NIF за один день — как",
    hookSeed: "Этого никто не говорит про NIF в Португалии",
    format: "howto",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    facts: [
      "NIF можно получить в Finanças лично или через представителя с procuração",
      "Без NIF не откроете Portuguese IBAN и не подпишете contrato de arrendamento",
      "Gestor €300–800 ускоряет, но личная подача в малых городах иногда за один визит",
    ],
    tags: ["NIF", "Португалия", "налоги", "лайфхак"],
  },
  {
    id: "d7-vs-d8-one-minute",
    title: "D7 или D8 — за одну минуту",
    hookSeed: "D7 или D8 — одна минута, без воды",
    format: "comparison",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
    facts: [
      "D8 — удалённая работа, порог около €3 680 в месяц в 2026",
      "D7 — пассивный доход, порог около €920 в месяц плюс сбережения",
      "Оба требуют AIMA после въезда; D8 не даёт работать в PT локально",
    ],
    tags: ["D7", "D8", "Португалия", "ВНЖ"],
  },
  {
    id: "portugal-iban-not-revolut",
    title: "Почему Revolut не заменит Portuguese IBAN",
    hookSeed: "Revolut в Португалии — не замена IBAN, и вот почему",
    format: "fact",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    facts: [
      "AIMA, аренда и utilities часто требуют IBAN португальского банка",
      "ActivoBank и Millennium чаще открывают non-EU после NIF",
      "Revolut удобен для трат, но не закрывает compliance для ВНЖ",
    ],
    tags: ["IBAN", "банк", "Португалия", "NIF"],
  },
  {
    id: "sns-registration",
    title: "SNS без очереди — что сделать в первую неделю",
    hookSeed: "SNS в Португалии — без этого не получите направление к врачу",
    format: "howto",
    country: "Португалия",
    topic_key: "portugal",
    guide_slug: "pervye-30-dnej-v-portugalii-2026",
    facts: [
      "После NIF регистрируйтесь в centro de saúde по месту жительства",
      "Нужны NIF, адрес и документ резидента или виза D",
      "Número de utente приходит не сразу — сохраните comprovativo регистрации",
    ],
    tags: ["SNS", "здоровье", "Португалия"],
  },
];

export function getTipTopic(id: string): TipShortTopic | undefined {
  return TIP_SHORT_TOPICS.find((t) => t.id === id);
}
