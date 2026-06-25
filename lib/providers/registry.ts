export type ProviderCategory =
  | "legal"
  | "relocation"
  | "translation"
  | "photos"
  | "language_courses";

export type ProviderExam = {
  topicKey: string;
  label: string;
};

export type ServiceProvider = {
  id: string;
  name: string;
  taglineRu: string;
  descriptionRu: string;
  url: string;
  category: ProviderCategory;
  corridorSlugs?: string[];
  topicKeys?: string[];
  examsRu?: ProviderExam[];
  ctaLabelRu: string;
};

export const PREP2GO_TOPIC_KEYS = ["portugal", "spain", "france", "italy", "germany"] as const;

const PREP2GO_EXAMS: ProviderExam[] = [
  { topicKey: "portugal", label: "CIPLE A2" },
  { topicKey: "spain", label: "DELE A2" },
  { topicKey: "france", label: "DELF B2" },
  { topicKey: "italy", label: "CELI B1" },
  { topicKey: "germany", label: "DTZ B1" },
];

const PROVIDERS: ServiceProvider[] = [
  {
    id: "prep2go",
    name: "Prep2Go",
    taglineRu: "Подготовка к языковым экзаменам для гражданства EU",
    descriptionRu:
      "Prep2Go — онлайн-подготовка к экзаменам для гражданства: CIPLE A2 (Португалия), DELE A2 (Испания), DELF B2 (Франция), CELI B1 (Италия), DTZ B1 (Германия). Mock-тесты, карточки, формат реального экзамена.",
    url: "https://www.prep2go.study",
    category: "language_courses",
    corridorSlugs: [
      "ru-speaking-to-portugal",
      "ru-speaking-to-spain",
      "ru-speaking-to-france",
      "ru-speaking-to-italy",
      "ru-speaking-to-germany",
    ],
    topicKeys: [...PREP2GO_TOPIC_KEYS],
    examsRu: PREP2GO_EXAMS,
    ctaLabelRu: "На Prep2Go.study",
  },
];

function uniqueById(providers: ServiceProvider[]): ServiceProvider[] {
  const seen = new Set<string>();
  return providers.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

export function getAllProviders(): ServiceProvider[] {
  return [...PROVIDERS];
}

export function getProviderById(id: string): ServiceProvider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function getProvidersForCorridor(slug: string): ServiceProvider[] {
  return PROVIDERS.filter((p) => p.corridorSlugs?.includes(slug));
}

export function getProvidersForTopic(topicKey: string): ServiceProvider[] {
  return PROVIDERS.filter((p) => p.topicKeys?.includes(topicKey));
}

export function getProvidersForContext(opts: {
  corridorSlug?: string;
  topicKey?: string;
}): ServiceProvider[] {
  const byCorridor = opts.corridorSlug ? getProvidersForCorridor(opts.corridorSlug) : [];
  const byTopic = opts.topicKey ? getProvidersForTopic(opts.topicKey) : [];
  return uniqueById([...byCorridor, ...byTopic]);
}

export function getExamLabelForTopic(provider: ServiceProvider, topicKey: string): string | undefined {
  return provider.examsRu?.find((exam) => exam.topicKey === topicKey)?.label;
}

export function findFirstProviderTopicKey(topicKeys: string[]): string | undefined {
  for (const key of topicKeys) {
    if (getProvidersForTopic(key).length > 0) return key;
  }
  return undefined;
}

export function corridorSlugForTopic(topicKey: string): string {
  return `ru-speaking-to-${topicKey}`;
}
