import { applyBlueprintFixes, validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { geminiFastJson, geminiProJson } from "@/lib/news/gemini";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { countGlossaryTerms, isGlossarySection, moveGlossaryToStart } from "@/lib/community-notes/glossary";
import {
  flattenBodySections,
  normalizeNoteDraftSeo,
  validateNoteDraft,
} from "@/lib/community-notes/editorial-quality";
import { reconcileTopic } from "@/lib/community-notes/editorial-filter";
import {
  enrichDraftPracticeFromSignals,
  practicePublishGateErrors,
} from "@/lib/community-notes/practice-enrichment";
import { sanitizeSnsFields } from "@/lib/community-notes/sns-editorial";
import {
  EDITORIAL_ACTION_GUIDE_RULES,
  EDITORIAL_PRESENTATION_RULES,
  PRESENTATION_REWRITE_HINT,
} from "@/lib/community-notes/editorial-presentation";
import {
  EDITORIAL_VOICE_PORTUGAL,
  PORTUGAL_EDITORIAL_SYSTEM,
  SPAIN_EDITORIAL_SYSTEM,
  SPAIN_TOPIC_LABELS,
  SPAIN_TOPIC_OFFICIAL_LINKS,
  TOPIC_LABELS,
  TOPIC_OFFICIAL_LINKS,
  VOICE_REWRITE_HINT,
  VOICE_REWRITE_HINT_SPAIN,
} from "@/lib/community-notes/editorial-voice";
import type {
  CommunityNote,
  CommunityNoteFaq,
  CommunitySignalIngest,
  ContentKind,
  NoteBodySection,
} from "@/lib/community-notes/types";
import { filterRelocantSignals as filterPortugalSignals } from "@/lib/satellite/portugal";
import { filterRelocantSignals as filterSpainSignals } from "@/lib/satellite/spain";

export type SatelliteCountryKey = "portugal" | "spain";

function editorialConfig(countryKey: SatelliteCountryKey) {
  if (countryKey === "spain") {
    return {
      system: SPAIN_EDITORIAL_SYSTEM,
      topicLabels: SPAIN_TOPIC_LABELS,
      topicLinks: SPAIN_TOPIC_OFFICIAL_LINKS,
      countryTag: "spain",
      slugPrefix: "es",
      geoHint:
        "Гео: Valencia, Madrid или Barcelona по теме. Примеры — Valencia, Ruzafa, extranjería Comunidad Valenciana. Не используй NIF, AIMA, Lisboa.",
      filterSignals: filterSpainSignals,
    };
  }
  return {
    system: PORTUGAL_EDITORIAL_SYSTEM,
    topicLabels: TOPIC_LABELS,
    topicLinks: TOPIC_OFFICIAL_LINKS,
    countryTag: "portugal",
    slugPrefix: "pt",
    geoHint:
      "Гео: аудитория — релоканты в Norte (Порту, Брага, Minho). Примеры практики — Porto, Braga, Matosinhos, Guimarães, Viana. Лиссабон — только если тема центральная (AIMA Saldanha, Cascais, аренда Lisboa).",
    filterSignals: filterPortugalSignals,
  };
}

export type SignalCluster = {
  topic: string;
  contentKind: ContentKind;
  signals: CommunitySignalIngest[];
};

export type DraftedNote = {
  slug: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  body_sections: NoteBodySection[];
  key_takeaways: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
  hashtags: string[];
  source_channel: string;
  source_label: string | null;
};

const draftSchema = {
  type: "object",
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    excerpt: { type: "string" },
    seo_title: { type: "string" },
    seo_description: { type: "string" },
    quick_answer: { type: "string" },
    key_takeaways: { type: "array", items: { type: "string" } },
    body_sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          section_kind: { type: "string", enum: ["official", "practice", "gap", "glossary"] },
          paragraphs: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } },
        },
        required: ["heading"],
      },
    },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "string" } },
        required: ["q", "a"],
      },
    },
  },
  required: [
    "slug",
    "title",
    "excerpt",
    "seo_title",
    "seo_description",
    "quick_answer",
    "key_takeaways",
    "body_sections",
    "faq",
  ],
};

/** Gemini API schema (uppercase) — tighter JSON for rewrites. */
const draftSchemaGemini = {
  type: "OBJECT",
  properties: {
    slug: { type: "STRING" },
    title: { type: "STRING" },
    excerpt: { type: "STRING" },
    seo_title: { type: "STRING" },
    seo_description: { type: "STRING" },
    quick_answer: { type: "STRING" },
    key_takeaways: { type: "ARRAY", items: { type: "STRING" } },
    body_sections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          section_kind: { type: "STRING", enum: ["official", "practice", "gap", "glossary"] },
          paragraphs: { type: "ARRAY", items: { type: "STRING" } },
          bullets: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["heading"],
      },
    },
    faq: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: { q: { type: "STRING" }, a: { type: "STRING" } },
        required: ["q", "a"],
      },
    },
  },
  required: [
    "slug",
    "title",
    "excerpt",
    "seo_title",
    "seo_description",
    "quick_answer",
    "key_takeaways",
    "body_sections",
    "faq",
  ],
};

function noteRewriteContext(note: CommunityNote): string {
  const sectionOutline = note.body_sections
    .map((s) => `- ${s.heading}${s.section_kind ? ` (${s.section_kind})` : ""}`)
    .join("\n");
  return [note.title, note.excerpt, note.quick_answer, sectionOutline, ...note.key_takeaways.slice(0, 4)]
    .filter(Boolean)
    .join("\n");
}

function anonymizeSnippet(text: string): string {
  return text
    .replace(/@[\w\d_]+/g, "[чат]")
    .replace(/\+?\d[\d\s()-]{8,}\d/g, "[tel]")
    .replace(/https?:\/\/\S+/g, "[link]")
    .slice(0, 320);
}

function pickBestSnippets(signals: CommunitySignalIngest[], limit = 3): string[] {
  return [...signals]
    .sort((a, b) => b.text.length - a.text.length)
    .slice(0, limit)
    .map((s) => anonymizeSnippet(s.text));
}

function dominantContentKind(signals: CommunitySignalIngest[]): ContentKind {
  const counts = new Map<ContentKind, number>();
  for (const s of signals) {
    const k = (s.content_kind ?? "tip") as ContentKind;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "tip";
}

export function clusterSignals(
  signals: CommunitySignalIngest[],
  countryKey: SatelliteCountryKey = "portugal"
): SignalCluster[] {
  const { filterSignals } = editorialConfig(countryKey);
  const buckets = new Map<string, CommunitySignalIngest[]>();
  for (const s of filterSignals(signals)) {
    const topic = s.topic_hints?.[0] || "general";
    const list = buckets.get(topic) ?? [];
    list.push(s);
    buckets.set(topic, list);
  }
  return Array.from(buckets.entries())
    .map(([topic, list]) => ({
      topic,
      contentKind: dominantContentKind(list),
      signals: list,
    }))
    .sort((a, b) => b.signals.length - a.signals.length);
}

function buildUserPrompt(
  cluster: SignalCluster,
  snippets: string[],
  countryKey: SatelliteCountryKey
): string {
  const { topicLabels, geoHint } = editorialConfig(countryKey);
  const topic = cluster.topic;
  const contentKind = cluster.contentKind;
  const channels = Array.from(new Set(cluster.signals.map((s) => s.channel_username)));

  return `Тема кластера: ${topicLabels[topic] ?? topic}
Тип материала (content_kind): ${contentKind}
Каналы (метаданные, не цитировать): ${channels.map((c) => `@${c}`).join(", ")}
Сообщений в кластере: ${cluster.signals.length} (используй только intent, не количество)

Фрагменты обсуждений (intent only, max 3):
${snippets.map((s, i) => `${i + 1}. ${s}`).join("\n")}

slug: latin kebab-case, уникальный, тема + 2026 если уместно.
category: ${topicLabels[topic] ?? (countryKey === "spain" ? "Быт в Испании" : "Быт в Португалии")}

Напиши заметку по БЛЮПРИНТУ + ПОДАЧЕ ДЛЯ ЧТЕНИЯ + ГОЛОСУ «Опытный релокант за кофе»:
glossary (≤8 терминов, literary intro) → official (Что/Как/Зачем + «Главное») → practice (2+ секции) → gap («чат vs сайт») → типичные ошибки.
quick_answer: микросцена-хук + 2 факта; 2–3 предложения. key_takeaways: максимум 4, action-oriented.
Не дублируй один смысл в разных секциях. В key_takeaways — минимум 2 пункта «Официально:» / «На практике:» / «Расхождение:».
faq: 4–5 вопросов; ответ начинается с да/нет/цифры, затем «По правилам…» / «На практике…».

${countryKey === "portugal" ? EDITORIAL_VOICE_PORTUGAL : ""}

${EDITORIAL_ACTION_GUIDE_RULES}

${EDITORIAL_PRESENTATION_RULES}

${geoHint}`;
}

async function generateDraft(
  cluster: SignalCluster,
  countryKey: SatelliteCountryKey
): Promise<Omit<
  DraftedNote,
  "category" | "content_kind" | "official_links" | "topic_tags" | "hashtags" | "source_channel" | "source_label" | "body_paragraphs"
>> {
  const snippets = pickBestSnippets(cluster.signals, 3);
  const userPrompt = buildUserPrompt(cluster, snippets, countryKey);
  const { system } = editorialConfig(countryKey);

  return geminiProJson<
    Omit<
      DraftedNote,
      | "category"
      | "content_kind"
      | "official_links"
      | "topic_tags"
      | "hashtags"
      | "source_channel"
      | "source_label"
      | "body_paragraphs"
    >
  >(system, userPrompt, draftSchema, 12288);
}

function finalizeDraft(
  cluster: SignalCluster,
  raw: Awaited<ReturnType<typeof generateDraft>>,
  inlineTags: string[],
  countryKey: SatelliteCountryKey
): DraftedNote {
  const { topicLabels, topicLinks, countryTag, slugPrefix } = editorialConfig(countryKey);
  const topic = cluster.topic;
  const contentKind = cluster.contentKind;
  const channels = Array.from(new Set(cluster.signals.map((s) => s.channel_username)));

  const slug = raw.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  const resolvedTopic = reconcileTopic(topic, raw.title, slug || `${slugPrefix}-${topic}`, countryKey);
  const topicTags = resolvedTopic === "general" ? [countryTag] : [resolvedTopic, countryTag];
  const bodySections = moveGlossaryToStart(raw.body_sections ?? []);

  return normalizeNoteDraftSeo({
    ...raw,
    slug: slug || `${slugPrefix}-${resolvedTopic}-${contentKind}-2026`,
    category: topicLabels[resolvedTopic] ?? (countryKey === "spain" ? "Быт в Испании" : "Быт в Португалии"),
    content_kind: contentKind,
    body_sections: bodySections,
    body_paragraphs: flattenBodySections(bodySections),
    key_takeaways: raw.key_takeaways ?? [],
    official_links: topicLinks[resolvedTopic] ?? topicLinks.general,
    topic_tags: topicTags,
    hashtags: buildNoteHashtags({ topicTags, contentKind, extra: inlineTags }),
    source_channel: channels.join("+"),
    source_label: null,
  });
}

function withSnsSanitize(draft: DraftedNote): DraftedNote {
  const sns = sanitizeSnsFields({
    quick_answer: draft.quick_answer,
    key_takeaways: draft.key_takeaways,
    body_paragraphs: draft.body_paragraphs,
    body_sections: draft.body_sections,
    faq: draft.faq,
  });
  if (!sns.changed) return draft;
  const body_sections = sns.patch.body_sections ?? draft.body_sections;
  return {
    ...draft,
    quick_answer: sns.patch.quick_answer ?? draft.quick_answer,
    key_takeaways: sns.patch.key_takeaways ?? draft.key_takeaways,
    body_sections,
    body_paragraphs: flattenBodySections(body_sections),
    faq: sns.patch.faq ?? draft.faq,
  };
}

export async function draftNoteFromCluster(
  cluster: SignalCluster,
  countryKey: SatelliteCountryKey = "portugal"
): Promise<DraftedNote> {
  const inlineTags = cluster.signals.flatMap((s) => s.hashtags ?? []).slice(0, 6);
  let lastError: string | undefined;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const raw = await generateDraft(cluster, countryKey);
    const draft = withSnsSanitize(finalizeDraft(cluster, raw, inlineTags, countryKey));
    const enriched = enrichDraftPracticeFromSignals(draft, cluster.signals);
    const merged: DraftedNote = { ...draft, ...enriched.draft };
    const errors = validateNoteDraft(merged, countryKey);
    errors.push(...practicePublishGateErrors(enriched.audit, enriched.signalBullets, merged));
    if (errors.length === 0) return merged;
    lastError = errors.join("; ");
  }

  throw new Error(`Draft quality gate failed: ${lastError ?? "unknown"}`);
}

/** Rewrite an existing published note to rich editorial format (no new signals). */
export async function rewriteCommunityNote(
  note: CommunityNote,
  options?: { voicePass?: boolean }
): Promise<DraftedNote> {
  const countryKey: SatelliteCountryKey = note.country_key === "spain" ? "spain" : "portugal";
  const countryTag = countryKey === "spain" ? "spain" : "portugal";
  const { topicLabels, system } = editorialConfig(countryKey);
  const topic = note.topic_tags.find((t) => t !== countryTag) ?? "general";
  const defaultChannel = countryKey === "spain" ? "spain_granitsa" : "chatlisboa";
  const cluster: SignalCluster = {
    topic,
    contentKind: note.content_kind,
    signals: [
      {
        message_id: 0,
        channel_username: note.source_channel?.split("+")[0] ?? defaultChannel,
        text: noteRewriteContext(note),
        topic_hints: note.topic_tags,
        content_kind: note.content_kind,
        city: note.city,
        country_key: note.country_key,
        posted_at: note.published_at ?? new Date().toISOString(),
      },
    ],
  };

  const existingContent = options?.voicePass
    ? `

ТЕКУЩИЙ КОНТЕНТ (ОБЯЗАТЕЛЬНО сохрани ВСЕ факты, цифры, органы, section_kind, порядок секций — только улучши подачу голосом):
${JSON.stringify(
  {
    quick_answer: note.quick_answer,
    key_takeaways: note.key_takeaways,
    body_sections: note.body_sections,
    faq: note.faq,
  },
  null,
  0
).slice(0, 24000)}`
    : "";

  const userPrompt = `${buildUserPrompt(cluster, pickBestSnippets(cluster.signals, 1), countryKey)}

ПЕРЕПИСЫВАНИЕ существующей заметки. Сохрани slug: ${note.slug}
Текущий заголовок: ${note.title}
Улучши подачу для чтения и структуру body_sections. Не теряй факты — сделай текст понятнее и логичнее.
Явно раздели официальные требования и практику из чатов (section_kind + метки в key_takeaways).
${existingContent}

${
  options?.voicePass
    ? countryKey === "spain"
      ? VOICE_REWRITE_HINT_SPAIN
      : VOICE_REWRITE_HINT
    : PRESENTATION_REWRITE_HINT
}

КОМПАКТНЫЙ JSON (критично): сохрани все секции и факты из текущего контента; до 8 body_sections, до 5 bullets на секцию, glossary 5–8 терминов, 4 key_takeaways, 4–5 faq. Минимум 600 слов суммарно для guide.`;

  const tokenLimit = options?.voicePass ? 12288 : 8192;

  let lastError: string | undefined;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const retryHint = lastError ? `\n\nИсправь ошибки прошлой попытки: ${lastError}` : "";
    const call = attempt % 2 === 0 ? geminiProJson : geminiFastJson;
    const raw = await call<
      Omit<
        DraftedNote,
        | "category"
        | "content_kind"
        | "official_links"
        | "topic_tags"
        | "hashtags"
        | "source_channel"
        | "source_label"
        | "body_paragraphs"
      >
    >(system, userPrompt + retryHint, draftSchemaGemini, tokenLimit);

    const draft = withSnsSanitize(finalizeDraft(cluster, { ...raw, slug: note.slug }, note.hashtags, countryKey));
    if (options?.voicePass && draft.content_kind === "guide") {
      const fixed = applyBlueprintFixes({
        content_kind: draft.content_kind,
        quick_answer: draft.quick_answer,
        key_takeaways: draft.key_takeaways,
        body_sections: draft.body_sections,
        faq: draft.faq,
      });
      if (fixed.changed) {
        draft.body_sections = fixed.body_sections;
        draft.key_takeaways = fixed.key_takeaways;
        draft.body_paragraphs = flattenBodySections(fixed.body_sections);
      }
      const newGlossary = draft.body_sections.find(isGlossarySection);
      const oldGlossary = note.body_sections.find(isGlossarySection);
      if (oldGlossary && (!newGlossary || countGlossaryTerms(newGlossary) < 5)) {
        const merged = {
          ...oldGlossary,
          paragraphs: newGlossary?.paragraphs?.length ? newGlossary.paragraphs : oldGlossary.paragraphs,
        };
        const without = draft.body_sections.filter((s) => !isGlossarySection(s));
        draft.body_sections = moveGlossaryToStart([merged, ...without]);
        draft.body_paragraphs = flattenBodySections(draft.body_sections);
      }
    }
    if (note.slug === "pervyj-mesyac-portugaliya-checklist") {
      draft.category = "Первый месяц";
    } else if (!note.category.includes("CIPLE")) {
      draft.category = topicLabels[topic] ?? note.category;
    } else {
      draft.category = note.category;
    }

    const errors = validateNoteDraft(draft, countryKey);
    if (options?.voicePass && draft.content_kind === "guide") {
      const blueprint = validateAgainstBlueprint(
        {
          content_kind: draft.content_kind,
          slug: note.slug,
          quick_answer: draft.quick_answer,
          seo_description: draft.seo_description,
          body_sections: draft.body_sections,
          key_takeaways: draft.key_takeaways,
          faq: draft.faq,
          official_links: note.official_links,
        },
        countryKey
      );
      errors.push(...blueprint.errors);
    }
    if (errors.length === 0) return draft;
    lastError = errors.join("; ");
  }

  throw new Error(`Rewrite quality gate failed: ${lastError ?? "unknown"}`);
}
