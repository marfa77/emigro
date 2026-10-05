/** Countries you can follow in @emigro_chat_bot. Satellites first — those landings promote the feature. */

export type NewsBotTopic = {
  key: string;
  countryRu: string;
  flag: string;
  aliases: readonly string[];
  satellite: boolean;
};

export const NEWS_BOT_TOPICS: readonly NewsBotTopic[] = [
  {
    key: "portugal",
    countryRu: "Португалия",
    flag: "🇵🇹",
    satellite: true,
    aliases: ["portugal", "португалия", "португалию", "португалии", "pt", "порту"],
  },
  {
    key: "spain",
    countryRu: "Испания",
    flag: "🇪🇸",
    satellite: true,
    aliases: ["spain", "испания", "испанию", "испании", "es", "валенсия", "valencia"],
  },
  {
    key: "italy",
    countryRu: "Италия",
    flag: "🇮🇹",
    satellite: true,
    aliases: ["italy", "италия", "италию", "италии", "it", "милан", "milan", "milano"],
  },
  {
    key: "thailand",
    countryRu: "Таиланд",
    flag: "🇹🇭",
    satellite: true,
    aliases: ["thailand", "таиланд", "таиланда", "th", "пхукет", "phuket"],
  },
  {
    key: "france",
    countryRu: "Франция",
    flag: "🇫🇷",
    satellite: false,
    aliases: ["france", "франция", "францию", "франции"],
  },
  {
    key: "germany",
    countryRu: "Германия",
    flag: "🇩🇪",
    satellite: false,
    aliases: ["germany", "германия", "германию", "германии"],
  },
  {
    key: "netherlands",
    countryRu: "Нидерланды",
    flag: "🇳🇱",
    satellite: false,
    aliases: ["netherlands", "нидерланды", "голландия", "голландию"],
  },
  {
    key: "poland",
    countryRu: "Польша",
    flag: "🇵🇱",
    satellite: false,
    aliases: ["poland", "польша", "польшу", "польши"],
  },
];

export const SATELLITE_NEWS_TOPIC_KEYS = NEWS_BOT_TOPICS.filter((t) => t.satellite).map((t) => t.key);

export function newsBotTopicByKey(key: string | undefined | null): NewsBotTopic | undefined {
  const clean = key?.trim().toLowerCase();
  if (!clean) return undefined;
  return NEWS_BOT_TOPICS.find((t) => t.key === clean);
}

export function resolveNewsBotTopic(raw: string | undefined | null): NewsBotTopic | undefined {
  const clean = (raw || "").trim().toLowerCase();
  if (!clean) return undefined;
  const exact = newsBotTopicByKey(clean);
  if (exact) return exact;
  return NEWS_BOT_TOPICS.find((t) => t.aliases.some((alias) => clean === alias || clean.includes(alias)));
}

export function newsBotHowToHtml(): string {
  return [
    "<b>Новости страны — в этот чат</b>",
    "Как только выпуск выходит на сайте, бот присылает карточку сюда. Подписка только здесь, не на сайте.",
    "",
    "Напишите: <code>новости Португалия</code>, <code>новости Испания</code>, <code>новости Италия</code> или <code>новости Таиланд</code>.",
    "Или просто <code>новости</code> — выберите страну кнопкой.",
    "Отписка: <code>отписка</code> или /stop",
  ].join("\n");
}
