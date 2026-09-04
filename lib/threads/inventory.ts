/**
 * Live site inventory for Threads daily slots — same stock as @Emigro_news,
 * not Portugal-only. Copy stays short; URLs are appended in composeConversionChain.
 */
import { createClient } from "@supabase/supabase-js";
import { ARCHIVE_SLUGS, isThinHouseholdTopic } from "@/lib/community-notes/editorial-filter";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import type { CommunityNote } from "@/lib/community-notes/types";
import { getGuideCountryTopicKeys } from "@/lib/guides/guide-display";
import type { GuideFrontmatter } from "@/lib/guides/load";
import { listGuidePromoCandidates } from "@/lib/news/guide-telegram-post";
import {
  isLightningAwaitingOwner,
  isLightningImmigrationText,
  isLightningThreadsAlreadyPosted,
  lightningAudienceSkipReason,
  lightningStrengthSkipReason,
} from "@/lib/news/story-lightning";
import { newsArticleUrl, portugalSatellitePublicUrl } from "@/lib/site-url";
import {
  composeConversionChain,
  composeDayChain,
  composeWizardChain,
  loadThreadsDays,
  loadThreadsGuides,
  loadThreadsWizard,
  nextCycledRow,
  previewDay,
  previewWizard,
  threadsDaysForCta,
  threadsGuidePageUrl,
  threadsTrackedUrl,
  type ThreadsBankCta,
} from "@/lib/threads/banks";
import { formatThreadsChainPreview, type ThreadsChainItem } from "@/lib/threads/compose";

export type ThreadsSlotPlan = {
  kind: "guide" | "wizard" | "city" | "assist" | "news";
  slug: string;
  countryRu: string;
  cta: ThreadsBankCta;
  items: ThreadsChainItem[];
  preview: string;
  cursor?: number;
};

export type ThreadsInventoryState = {
  guides_used: string[];
  notes_used: string[];
  news_used: string[];
  last_guide_countries: string[];
  wizard_cursor: number;
  assist_cursor: number;
  chat_cursor: number;
  city_cursor: number;
};

const COUNTRY_RU: Record<string, string> = {
  portugal: "Португалия",
  spain: "Испания",
  france: "Франция",
  italy: "Италия",
  germany: "Германия",
  netherlands: "Нидерланды",
  sweden: "Швеция",
  norway: "Норвегия",
  finland: "Финляндия",
  denmark: "Дания",
  poland: "Польша",
  czechia: "Чехия",
  austria: "Австрия",
  greece: "Греция",
  cyprus: "Кипр",
  hungary: "Венгрия",
  malta: "Мальта",
  bulgaria: "Болгария",
  croatia: "Хорватия",
  slovenia: "Словения",
  estonia: "Эстония",
  europe: "Европа",
};

const CTA_P2: Record<ThreadsBankCta, string> = {
  wizard:
    "Бесплатно: визард подберёт коридор под паспорт, доход и семью — за пару минут, 0 €. Без обещания ВНЖ.",
  assist: "Route Check за €129 — разбор основания и слабых мест пакета. Не гарантия ВНЖ.",
  porto_chat: "Быт Порту — в приватном чате через бота. Без публичной ссылки-приглашения.",
};

export function countryKeyFromGuide(guide: GuideFrontmatter): string {
  return getGuideCountryTopicKeys(guide.topic_keys)[0] || "europe";
}

export function countryRuFromKey(key: string): string {
  return COUNTRY_RU[key] || "Европа";
}

export function guideFitsAssist(guide: GuideFrontmatter): boolean {
  const hay = [
    guide.slug,
    guide.primary_intent,
    ...(guide.tags ?? []),
    ...(guide.topic_keys ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return /vnj|visa|nacional|grazhdan|citizenship|d7|d8|nomad|extranjer|aima|blue.?card|passiv|konsul/.test(
    hay
  );
}

function planOf(
  kind: ThreadsSlotPlan["kind"],
  slug: string,
  countryRu: string,
  cta: ThreadsBankCta,
  items: ThreadsChainItem[]
): ThreadsSlotPlan {
  return {
    kind,
    slug,
    countryRu,
    cta,
    items,
    preview: formatThreadsChainPreview(items),
  };
}

export function pickWizardPlan(state: ThreadsInventoryState): ThreadsSlotPlan | null {
  const cycled = nextCycledRow(loadThreadsWizard(), state.wizard_cursor || 0);
  if (!cycled) return null;
  const items = composeWizardChain(cycled.row);
  return {
    ...planOf("wizard", `wizard-${cycled.row.d}`, "Визард", "wizard", items),
    preview: previewWizard(cycled.row),
    cursor: cycled.nextCursor,
  };
}

export function pickAssistBankPlan(state: ThreadsInventoryState): ThreadsSlotPlan | null {
  const cycled = nextCycledRow(threadsDaysForCta("assist"), state.assist_cursor || 0);
  if (!cycled) return null;
  const items = composeDayChain(cycled.row);
  return {
    ...planOf("assist", `assist-${cycled.row.d}`, "ВНЖ", "assist", items),
    preview: previewDay(cycled.row),
    cursor: cycled.nextCursor,
  };
}

export function pickPortoChatBankPlan(state: ThreadsInventoryState): ThreadsSlotPlan | null {
  const cycled = nextCycledRow(threadsDaysForCta("porto_chat"), state.chat_cursor || 0);
  if (!cycled) return null;
  const items = composeDayChain(cycled.row);
  return {
    ...planOf("city", `chat-${cycled.row.d}`, "Порту", "porto_chat", items),
    preview: previewDay(cycled.row),
    cursor: cycled.nextCursor,
  };
}

/** Sequential row from emigro-days.json (day 1 = Cedofeita rent → Porto chat). */
export function pickDaysBankPlan(state: Pick<ThreadsInventoryState, "chat_cursor" | "assist_cursor"> & {
  last_day?: number;
}): ThreadsSlotPlan | null {
  const days = loadThreadsDays();
  if (days.length === 0) return null;
  const next = (Number(state.last_day || 0) % days.length) + 1;
  const row = days.find((item) => item.d === next) || days[0]!;
  const items = composeDayChain(row);
  const kind = row.cta === "assist" ? "assist" : "city";
  const countryRu = row.cta === "porto_chat" ? "Порту" : "ВНЖ";
  return {
    ...planOf(kind, `day-${row.d}`, countryRu, row.cta, items),
    preview: previewDay(row),
    cursor: row.d,
  };
}

export function pickLiveGuidePlan(
  state: ThreadsInventoryState,
  preferAssist: boolean
): ThreadsSlotPlan | null {
  const used = new Set(state.guides_used);
  let candidates = listGuidePromoCandidates(used);
  if (candidates.length === 0) {
    candidates = listGuidePromoCandidates(new Set());
  }
  if (candidates.length === 0) return null;

  const recent = new Set((state.last_guide_countries ?? []).slice(-3));
  const scored = candidates
    .map((guide) => {
      const country = countryKeyFromGuide(guide);
      let score = 0;
      if (preferAssist && guideFitsAssist(guide)) score += 12;
      if (!preferAssist && !guideFitsAssist(guide)) score += 3;
      if (!recent.has(country)) score += 6;
      if (guide.review_tier === "volatile") score += 4;
      return { guide, country, score };
    })
    .sort((a, b) => b.score - a.score);

  const rotated = scored.filter((row) => !recent.has(row.country));
  const pick = (rotated.length > 0 ? rotated : scored)[0];
  if (!pick) return null;
  const cta: ThreadsBankCta = preferAssist && guideFitsAssist(pick.guide) ? "assist" : "wizard";
  const bank = loadThreadsGuides().find((row) => row.guide === pick.guide.slug);
  const content = `gde-${pick.guide.slug}`.slice(0, 40);
  const p1 =
    bank?.p1 ||
    pick.guide.quick_answer ||
    pick.guide.excerpt ||
    pick.guide.seo_description ||
    pick.guide.title;
  // Never append a wizard URL under an Assist (€129) bank line — match p2 to live CTA.
  const p2 = bank?.p2 && bank.cta === cta ? bank.p2 : CTA_P2[cta];
  const items = composeConversionChain({
    p1,
    p2,
    cta,
    content,
    topic: countryRuFromKey(pick.country),
    countryTopic: pick.country === "europe" ? undefined : pick.country,
    extraUrl: threadsGuidePageUrl(pick.guide.slug, content),
  });
  return planOf("guide", pick.guide.slug, countryRuFromKey(pick.country), cta, items);
}

function noteCta(note: CommunityNote): ThreadsBankCta {
  const hay = `${note.slug} ${note.category} ${(note.topic_tags ?? []).join(" ")}`.toLowerCase();
  if (note.country_key === "portugal" && !/aima|vnj|d7|d8|nacional|ciple/.test(hay)) {
    return "porto_chat";
  }
  // Route / visa notes bait free corridor wizard first; Assist is Saturday bank only.
  return "wizard";
}

function usableNote(note: CommunityNote): boolean {
  if (ARCHIVE_SLUGS.has(note.slug)) return false;
  if (isThinHouseholdTopic(note.title, note.slug)) return false;
  return Boolean(note.slug && note.title);
}

export async function pickPortugalSatellitePlan(
  state: ThreadsInventoryState
): Promise<ThreadsSlotPlan | null> {
  const turn = (state.city_cursor || 0) % 2;
  if (turn === 0) {
    const chat = pickPortoChatBankPlan(state);
    if (chat) return chat;
  }

  let notes: CommunityNote[] = [];
  try {
    notes = (await getPublishedCommunityNotesUncached("portugal")).filter(usableNote);
  } catch {
    notes = [];
  }
  const used = new Set(state.notes_used);
  const next = notes.find((note) => !used.has(note.slug)) || notes[0];
  if (!next) {
    return pickPortoChatBankPlan(state);
  }

  const cta = noteCta(next);
  const dest = portugalSatellitePublicUrl(`/notes/${next.slug}`);
  const content = `note-${next.slug}`.slice(0, 40);
  const items = composeConversionChain({
    p1: next.quick_answer || next.excerpt || next.title,
    p2: CTA_P2[cta],
    cta,
    content,
    topic: "Порту",
    countryTopic: "portugal",
    extraUrl: threadsTrackedUrl(dest, content),
  });
  return {
    ...planOf("city", next.slug, "Порту", cta, items),
    cursor: (state.city_cursor || 0) + 1,
  };
}

export async function pickCityPlan(state: ThreadsInventoryState): Promise<ThreadsSlotPlan | null> {
  return pickPortugalSatellitePlan(state);
}

type DigestRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  topic_key: string;
  published_at: string | null;
  status: string | null;
  telegram_message_ids: number[] | null;
  threads_text: string | null;
};

export async function pickNewsPlan(state: ThreadsInventoryState): Promise<ThreadsSlotPlan | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data, error } = await supabase
    .from("emigro_news_digests")
    .select("slug, title, excerpt, topic_key, published_at, status, telegram_message_ids, threads_text")
    .eq("status", "published")
    .eq("locale", "ru")
    .order("published_at", { ascending: false })
    .limit(30);
  if (error) {
    console.warn("[threads-daily] news query failed:", error.message);
    return null;
  }

  const used = new Set(state.news_used);
  const now = Date.now();
  for (const row of (data ?? []) as DigestRow[]) {
    if (!row.slug || used.has(row.slug)) continue;
    if (isLightningAwaitingOwner(row.threads_text)) continue;
    if (isLightningThreadsAlreadyPosted(row.threads_text)) continue;
    const ids = row.telegram_message_ids;
    if (!Array.isArray(ids) || ids.length === 0) continue;
    const published = row.published_at ? Date.parse(row.published_at) : 0;
    if (!published) continue;
    const age = now - published;
    if (age < 20 * 60 * 60 * 1000 || age > 10 * 24 * 60 * 60 * 1000) continue;
    const gate = `${row.title} ${row.excerpt || ""}`;
    if (!isLightningImmigrationText(gate)) continue;
    if (lightningAudienceSkipReason(gate)) continue;
    if (lightningStrengthSkipReason(gate)) continue;

    const countryKey = (row.topic_key || "").trim().toLowerCase();
    const countryRu = countryRuFromKey(countryKey);
    const content = `news-${row.slug}`.slice(0, 40);
    const items = composeConversionChain({
      p1: (row.excerpt || row.title).trim(),
      p2: "Коротко на сайте. Бесплатно: визард подберёт коридор под ваши вводные — 0 €, без обещания ВНЖ.",
      cta: "wizard",
      content,
      topic: countryRu,
      countryTopic: countryKey === "europe" ? undefined : countryKey,
      extraUrl: threadsTrackedUrl(newsArticleUrl(row.slug), content),
    });
    return planOf("news", row.slug, countryRu, "wizard", items);
  }
  return null;
}
