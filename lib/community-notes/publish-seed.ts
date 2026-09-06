import { createServerClient } from "@/lib/supabase/server";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { PERVYJ_MESYAC_CHECKLIST_GUIDE } from "@/lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist";
import { NIF_PORTO_GUIDE } from "@/lib/community-notes/guides/nif-porto";
import { AIMA_AGORA_GUIDE } from "@/lib/community-notes/guides/aima-agora-zapis";
import { SPAIN_EDITORIAL_SEED } from "@/lib/community-notes/guides/spain-editorial-index";
import { ITALY_EDITORIAL_SEED } from "@/lib/community-notes/guides/italy-editorial-index";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

type SeedNote = {
  slug: string;
  category: string;
  content_kind: ContentKind;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_paragraphs: string[];
  body_sections?: NoteBodySection[];
  key_takeaways?: string[];
  faq: CommunityNoteFaq[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags: string[];
};

/** Baseline editorial notes — full voice, not truncated seed fallback. */
export const PORTUGAL_EDITORIAL_SEED: SeedNote[] = [
  {
    slug: PERVYJ_MESYAC_CHECKLIST_GUIDE.slug,
    category: PERVYJ_MESYAC_CHECKLIST_GUIDE.category,
    content_kind: PERVYJ_MESYAC_CHECKLIST_GUIDE.content_kind,
    title: PERVYJ_MESYAC_CHECKLIST_GUIDE.title,
    excerpt: PERVYJ_MESYAC_CHECKLIST_GUIDE.excerpt,
    seo_title: PERVYJ_MESYAC_CHECKLIST_GUIDE.seo_title,
    seo_description: PERVYJ_MESYAC_CHECKLIST_GUIDE.seo_description,
    quick_answer: PERVYJ_MESYAC_CHECKLIST_GUIDE.quick_answer,
    body_paragraphs: PERVYJ_MESYAC_CHECKLIST_GUIDE.body_paragraphs,
    body_sections: PERVYJ_MESYAC_CHECKLIST_GUIDE.body_sections,
    key_takeaways: PERVYJ_MESYAC_CHECKLIST_GUIDE.key_takeaways,
    faq: PERVYJ_MESYAC_CHECKLIST_GUIDE.faq,
    official_links: PERVYJ_MESYAC_CHECKLIST_GUIDE.official_links,
    topic_tags: PERVYJ_MESYAC_CHECKLIST_GUIDE.topic_tags,
  },
  {
    slug: NIF_PORTO_GUIDE.slug,
    category: NIF_PORTO_GUIDE.category,
    content_kind: NIF_PORTO_GUIDE.content_kind,
    title: NIF_PORTO_GUIDE.title,
    excerpt: NIF_PORTO_GUIDE.excerpt,
    seo_title: NIF_PORTO_GUIDE.seo_title,
    seo_description: NIF_PORTO_GUIDE.seo_description,
    quick_answer: NIF_PORTO_GUIDE.quick_answer,
    body_paragraphs: NIF_PORTO_GUIDE.body_paragraphs,
    body_sections: NIF_PORTO_GUIDE.body_sections,
    key_takeaways: NIF_PORTO_GUIDE.key_takeaways,
    faq: NIF_PORTO_GUIDE.faq,
    official_links: NIF_PORTO_GUIDE.official_links,
    topic_tags: NIF_PORTO_GUIDE.topic_tags,
  },
  {
    slug: AIMA_AGORA_GUIDE.slug,
    category: AIMA_AGORA_GUIDE.category,
    content_kind: AIMA_AGORA_GUIDE.content_kind,
    title: AIMA_AGORA_GUIDE.title,
    excerpt: AIMA_AGORA_GUIDE.excerpt,
    seo_title: AIMA_AGORA_GUIDE.seo_title,
    seo_description: AIMA_AGORA_GUIDE.seo_description,
    quick_answer: AIMA_AGORA_GUIDE.quick_answer,
    body_paragraphs: AIMA_AGORA_GUIDE.body_paragraphs,
    body_sections: AIMA_AGORA_GUIDE.body_sections,
    key_takeaways: AIMA_AGORA_GUIDE.key_takeaways,
    faq: AIMA_AGORA_GUIDE.faq,
    official_links: AIMA_AGORA_GUIDE.official_links,
    topic_tags: AIMA_AGORA_GUIDE.topic_tags,
  },
  {
    slug: "arenda-lissabon-do-podpisi",
    category: "Аренда",
    content_kind: "tip",
    title: "Аренда в Лиссабоне: вопросы из чата до подписи",
    excerpt:
      "Caução, fiador, NIF в договоре и регистрация arrendamento — что обсудить до перевода денег.",
    seo_title: "Аренда Лиссабон 2026 — до подписи договора",
    seo_description:
      "Аренда в Лиссабоне: caução, fiador, NIF, регистрация arrendamento. Что проверить до подписи — для русскоязычных релокантов.",
    quick_answer:
      "До подписи: NIF обеих сторон, лимит caução, опись имущества, регистрация договora и платёж с назначением — не наличными без trace.",
    body_paragraphs: [
      "Типичная история из чата: договор на английском, caução на личный счёт, через месяц — arrendamento не зарегистрирован, адрес не подходит для AIMA.",
      "NIF в договоре — не формальность. Без него сложнее банк и миграционные шаги. Отказ арендодателя указывать NIF — красный флаг.",
      "Caução — обычно до одного месяца (NRAU ограничивает максимум). Перевод с назначением «caução + адрес», не «на карту другу».",
      "Fiador для иностранцев — частое требование. «Три месяца вперёд + fiador + залог» — сравните с рынком, не подписывайте под давлением «последний шанс сегодня».",
      "После подписи: регистрация arrendamento в Finanças, фото состояния квартиры, первая квитанция с вашим NIF.",
    ],
    faq: [
      {
        q: "Нужен ли NIF в договоре?",
        a: "Да — для большинства административных шагов адрес подтверждается через зарегистрированный договор.",
      },
      {
        q: "Сколько может быть caução?",
        a: "Обычно до одного месячного платежа; сверяйте с действующим законом об аренде.",
      },
    ],
    official_links: [{ title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" }],
    topic_tags: ["arenda", "arrendamento", "lisboa"],
  },
];

export async function publishPortugalSeedNotes(): Promise<number> {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let published = 0;

  for (const note of PORTUGAL_EDITORIAL_SEED) {
    const { data: existing } = await supabase.from("community_notes").select("id").eq("slug", note.slug).maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from("community_notes").insert({
      ...note,
      hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
      country_key: "portugal",
      city: "lisbon",
      source_channel: "chatlisboa+por_tugal",
      source_label: null,
      status: "published",
      published_at: now,
      updated_at: now,
    });

    if (error) {
      console.warn(`[seed] ${note.slug}: ${error.message}`);
    } else {
      published += 1;
      console.log(`[seed] published ${note.slug}`);
    }
  }

  return published;
}

export async function publishSpainSeedNotes(): Promise<number> {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let published = 0;

  for (const note of SPAIN_EDITORIAL_SEED) {
    const { data: existing } = await supabase.from("community_notes").select("id").eq("slug", note.slug).maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from("community_notes").insert({
      ...note,
      body_sections: note.body_sections ?? [],
      key_takeaways: note.key_takeaways ?? [],
      hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
      country_key: "spain",
      city: "valencia",
      source_channel: "valenforum+spain_granitsa+spainchats",
      source_label: "editorial:spain-seed",
      status: "published",
      published_at: now,
      updated_at: now,
    });

    if (error) {
      console.warn(`[seed] ${note.slug}: ${error.message}`);
    } else {
      published += 1;
      console.log(`[seed] published ${note.slug}`);
    }
  }

  return published;
}

export async function publishItalySeedNotes(): Promise<number> {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let published = 0;

  for (const note of ITALY_EDITORIAL_SEED) {
    const { data: existing } = await supabase.from("community_notes").select("id").eq("slug", note.slug).maybeSingle();
    if (existing) continue;

    const { error } = await supabase.from("community_notes").insert({
      ...note,
      body_sections: note.body_sections ?? [],
      key_takeaways: note.key_takeaways ?? [],
      hashtags: buildNoteHashtags({ topicTags: note.topic_tags, contentKind: note.content_kind }),
      country_key: "italy",
      city: "milan",
      source_channel: "milanru+forum_italy+digital_nomad_Italiya",
      source_label: "editorial:italy-seed",
      status: "published",
      published_at: now,
      updated_at: now,
    });

    if (error) {
      console.warn(`[seed] ${note.slug}: ${error.message}`);
    } else {
      published += 1;
      console.log(`[seed] published ${note.slug}`);
    }
  }

  return published;
}
