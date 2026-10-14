import fs from "fs";
import path from "path";
import { buildTelegramStatsReport } from "@/lib/analytics/format-stats-telegram";
import { querySearchConsole } from "@/lib/analytics/dashboard/search-console";
import { getPublishedCommunityNotesUncached } from "@/lib/community-notes/queries";
import type { CommunityNote } from "@/lib/community-notes/types";
import { getEmigroInventory } from "@/lib/emigro-inventory";
import { guidePath, listGuides } from "@/lib/guides/load";
import type { GuideLocale } from "@/lib/locale";
import {
  italySatelliteUrl,
  portugalSatelliteUrl,
  publicSiteUrl,
  spainSatelliteUrl,
  thailandSatelliteUrl,
} from "@/lib/site-url";
import type { FunctionDecl } from "@/lib/telegram/bot/agent/gemini";
import { trafficBreakdown } from "@/lib/telegram/bot/agent/traffic";

const LOCALES = ["ru", "es", "fr"] as const;
const SATELLITES = {
  portugal: portugalSatelliteUrl,
  spain: spainSatelliteUrl,
  italy: italySatelliteUrl,
  thailand: thailandSatelliteUrl,
} as const;
type SatelliteKey = keyof typeof SATELLITES;

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,160}$/;
const DOC_RE = /^[A-Za-z0-9_-]{1,80}$/;

function clip(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max)}\n…[обрезано, всего ${text.length} символов]`;
}

function asLocale(v: unknown): GuideLocale | null {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v) ? (v as GuideLocale) : null;
}

function asSatellite(v: unknown): SatelliteKey | null {
  return typeof v === "string" && v in SATELLITES ? (v as SatelliteKey) : null;
}

function words(q: unknown): string[] {
  return String(q ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((w) => w.length > 1);
}

function score(haystack: string, terms: string[]): number {
  const h = haystack.toLowerCase();
  return terms.reduce((n, t) => n + (h.includes(t) ? 1 : 0), 0);
}

function noteUrl(country: SatelliteKey, slug: string): string {
  return SATELLITES[country](`/notes/${slug}`);
}

function guideSummary(g: ReturnType<typeof listGuides>[number], locale: GuideLocale) {
  return {
    slug: g.slug,
    locale,
    url: `${publicSiteUrl()}${guidePath(g.slug, locale)}`,
    title: g.title,
    seo_title: g.seo_title,
    seo_title_len: g.seo_title?.length ?? 0,
    seo_description: g.seo_description,
    seo_description_len: g.seo_description?.length ?? 0,
    date_modified: g.date_modified,
    review_tier: g.review_tier,
    primary_intent: g.primary_intent,
  };
}

function noteSummary(n: CommunityNote, country: SatelliteKey) {
  return {
    slug: n.slug,
    url: noteUrl(country, n.slug),
    city: n.city,
    category: n.category,
    title: n.title,
    seo_title: n.seo_title,
    seo_description: n.seo_description,
    seo_description_len: n.seo_description?.length ?? 0,
    published_at: n.published_at,
    updated_at: n.updated_at,
  };
}

function isPublicHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return false;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h) || h.includes(":")) return false;
  return h.includes(".");
}

function metaContent(html: string, attr: "name" | "property", key: string): string | null {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1] ?? null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

async function fetchPage(rawUrl: string) {
  const url = new URL(rawUrl);
  if (!/^https?:$/.test(url.protocol) || !isPublicHost(url.hostname)) return { error: "только публичные http(s) URL" };
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EmigroAgent/1.0; +https://www.emigro.online)" },
    signal: AbortSignal.timeout(15_000),
  });
  const html = (await res.text()).slice(0, 1_500_000);
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html.slice(0, 50_000);
  const ldTypes = Array.from(html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi))
    .flatMap((m) => Array.from(m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g), (t) => t[1]));
  const body = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const text = decodeEntities(body).replace(/\s+/g, " ").trim();
  const title = decodeEntities(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
  const description = decodeEntities(metaContent(head, "name", "description") ?? "");
  return {
    status: res.status,
    final_url: res.url,
    title,
    title_len: title.length,
    description,
    description_len: description.length,
    canonical: head.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] ?? null,
    robots: metaContent(head, "name", "robots"),
    og_title: metaContent(head, "property", "og:title"),
    og_image: metaContent(head, "property", "og:image"),
    hreflang: Array.from(head.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi), (m) => m[1]),
    h1: Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi), (m) => decodeEntities(m[1].replace(/<[^>]+>/g, "").trim())).slice(0, 3),
    h2: Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi), (m) => decodeEntities(m[1].replace(/<[^>]+>/g, "").trim())).slice(0, 25),
    schema_types: Array.from(new Set(ldTypes)),
    word_count: text.split(" ").length,
    text: clip(text, 6000),
  };
}

export const AGENT_FUNCTIONS: FunctionDecl[] = [
  {
    name: "site_inventory",
    description: "Живые цифры склада Emigro: сколько гайдов по локалям, ES/FR пилларов и коридоров, заметок на каждом сателлите.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "search_guides",
    description: "Найти гайды www.emigro.online по словам (тема, страна, виза, slug). Возвращает URL, SEO title/description с длиной, дату обновления. Пустой query — свежие.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
        locale: { type: "string", enum: [...LOCALES], description: "ru — RU/BY/UA/KZ, es — LATAM, fr — Магриб/Сенегал. Без locale — все." },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "read_guide",
    description: "Прочитать гайд целиком: frontmatter (seo, quick_answer, official_sources, теги) и markdown-текст.",
    parameters: {
      type: "object",
      properties: { slug: { type: "string" }, locale: { type: "string", enum: [...LOCALES] } },
      required: ["slug"],
    },
  },
  {
    name: "search_notes",
    description: "Найти заметки сателлита (portugal = Порту/Норте, spain = Валенсия, italy = Милан/Комо, thailand = Пхукет). Пустой query — свежие.",
    parameters: {
      type: "object",
      properties: {
        country: { type: "string", enum: Object.keys(SATELLITES) },
        query: { type: "string" },
        limit: { type: "number" },
      },
      required: ["country"],
    },
  },
  {
    name: "read_note",
    description: "Прочитать заметку сателлита: quick_answer, разделы, FAQ, официальные ссылки, SEO.",
    parameters: {
      type: "object",
      properties: { country: { type: "string", enum: Object.keys(SATELLITES) }, slug: { type: "string" } },
      required: ["country", "slug"],
    },
  },
  {
    name: "traffic_breakdown",
    description:
      "Динамика трафика сайта и сателлитов из нашей аналитики: период против предыдущего такого же — сессии, просмотры, визард, клики Assist; по дням, каналам, источникам (utm/реферер), входным страницам, топ страниц. Главный инструмент для «что с трафиком / динамика / почему упало».",
    parameters: {
      type: "object",
      properties: {
        days: { type: "number", description: "длина периода, по умолчанию 7 (макс. 45)" },
        path_contains: { type: "string", description: "только сессии, видевшие такие страницы, напр. /notes/ или /es/" },
      },
    },
  },
  {
    name: "site_stats",
    description: "Сводка как в /stats: подписчики Threads, чаты сателлитов, инвест-заявки, сегодня против вчера. Для динамики трафика бери traffic_breakdown.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "search_console",
    description: "Google Search Console по emigro.online (все поддомены): клики, показы, CTR, позиция по запросам или страницам.",
    parameters: {
      type: "object",
      properties: {
        dimension: { type: "string", enum: ["query", "page"] },
        days: { type: "number", description: "окно в днях, по умолчанию 28" },
        contains: { type: "string", description: "фильтр по подстроке в запросе/URL" },
        page_contains: { type: "string", description: "для dimension=query: только запросы этой страницы/раздела" },
        limit: { type: "number" },
      },
      required: ["dimension"],
    },
  },
  {
    name: "fetch_page",
    description: "Открыть живую страницу (наша или конкурента): статус, title, description с длиной, canonical, robots, hreflang, H1/H2, schema.org типы, текст.",
    parameters: { type: "object", properties: { url: { type: "string" } }, required: ["url"] },
  },
  {
    name: "measure_text",
    description: "Точно посчитать длину строк в символах (title, description, посты Threads). Вызывай перед тем, как указать длину.",
    parameters: {
      type: "object",
      properties: { texts: { type: "array", items: { type: "string" } } },
      required: ["texts"],
    },
  },
  {
    name: "read_doc",
    description: "Внутренние доки проекта (docs/*.md): стратегия, SEO-стандарты, сателлиты, Threads, монетизация. Без name — список.",
    parameters: { type: "object", properties: { name: { type: "string", description: "имя без .md, напр. SEO_GUIDE_STANDARD" } } },
  },
];

export async function callAgentTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const limit = (d: number, max: number) => Math.min(max, Math.max(1, Math.round(Number(args.limit) || d)));

  switch (name) {
    case "site_inventory": {
      const notes = await Promise.all(
        (Object.keys(SATELLITES) as SatelliteKey[]).map(async (c) => [c, (await getPublishedCommunityNotesUncached(c)).length] as const),
      );
      return { ...getEmigroInventory(), esGuides: listGuides("es").length, frGuides: listGuides("fr").length, satelliteNotes: Object.fromEntries(notes) };
    }
    case "search_guides": {
      const locales = asLocale(args.locale) ? [asLocale(args.locale)!] : [...LOCALES];
      const terms = words(args.query);
      const all = locales.flatMap((l) => listGuides(l).map((g) => ({ g, l })));
      const ranked = terms.length
        ? all
            .map((x) => ({ ...x, s: score([x.g.slug, x.g.title, x.g.seo_title, x.g.excerpt, ...(x.g.tags ?? []), ...(x.g.topic_keys ?? [])].join(" "), terms) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s)
        : all.sort((a, b) => (b.g.date_modified ?? "").localeCompare(a.g.date_modified ?? ""));
      return { total: ranked.length, guides: ranked.slice(0, limit(15, 40)).map((x) => guideSummary(x.g, x.l)) };
    }
    case "read_guide": {
      const slug = String(args.slug ?? "");
      if (!SLUG_RE.test(slug)) return { error: "некорректный slug" };
      const locale = asLocale(args.locale) ?? LOCALES.find((l) => fs.existsSync(path.join(process.cwd(), "content/guides", l, `${slug}.md`)));
      if (!locale) return { error: "гайд не найден" };
      const file = path.join(process.cwd(), "content/guides", locale, `${slug}.md`);
      if (!fs.existsSync(file)) return { error: "гайд не найден" };
      return { url: `${publicSiteUrl()}${guidePath(slug, locale)}`, markdown: clip(fs.readFileSync(file, "utf8"), 40_000) };
    }
    case "search_notes": {
      const country = asSatellite(args.country);
      if (!country) return { error: "country: portugal | spain | italy | thailand" };
      const notes = await getPublishedCommunityNotesUncached(country);
      const terms = words(args.query);
      const ranked = terms.length
        ? notes
            .map((n) => ({ n, s: score([n.slug, n.title, n.seo_title, n.excerpt, n.category, ...n.topic_tags, ...n.hashtags].join(" "), terms) }))
            .filter((x) => x.s > 0)
            .sort((a, b) => b.s - a.s)
            .map((x) => x.n)
        : [...notes].sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""));
      return { total: ranked.length, notes: ranked.slice(0, limit(15, 40)).map((n) => noteSummary(n, country)) };
    }
    case "read_note": {
      const country = asSatellite(args.country);
      if (!country) return { error: "country: portugal | spain | italy | thailand" };
      const note = (await getPublishedCommunityNotesUncached(country)).find((n) => n.slug === String(args.slug));
      if (!note) return { error: "заметка не найдена" };
      const { body_sections, body_paragraphs, ...rest } = note;
      return {
        ...noteSummary(note, country),
        ...rest,
        body: clip(JSON.stringify({ body_paragraphs, body_sections }), 30_000),
      };
    }
    case "traffic_breakdown":
      return trafficBreakdown({
        days: Number(args.days) || undefined,
        pathContains: typeof args.path_contains === "string" && args.path_contains ? args.path_contains : undefined,
      });
    case "site_stats":
      return { report: (await buildTelegramStatsReport()).replace(/<\/?[^>]+>/g, "") };
    case "search_console":
      return querySearchConsole({
        dimension: args.dimension === "page" ? "page" : "query",
        days: Number(args.days) || undefined,
        contains: typeof args.contains === "string" ? args.contains : undefined,
        pageContains: typeof args.page_contains === "string" ? args.page_contains : undefined,
        limit: limit(25, 100),
      });
    case "fetch_page":
      return fetchPage(String(args.url ?? ""));
    case "measure_text":
      return {
        lengths: (Array.isArray(args.texts) ? args.texts : []).map((t) => ({ text: String(t), chars: Array.from(String(t)).length })),
      };
    case "read_doc": {
      const dir = path.join(process.cwd(), "docs");
      if (!args.name) {
        return {
          docs: fs
            .readdirSync(dir)
            .filter((f) => f.endsWith(".md"))
            .map((f) => ({ name: f.replace(/\.md$/, ""), kb: Math.round(fs.statSync(path.join(dir, f)).size / 1024) })),
        };
      }
      const docName = String(args.name).replace(/\.md$/, "");
      if (!DOC_RE.test(docName)) return { error: "некорректное имя" };
      const file = path.join(dir, `${docName}.md`);
      if (!fs.existsSync(file)) return { error: "нет такого дока" };
      return { name: docName, markdown: clip(fs.readFileSync(file, "utf8"), 40_000) };
    }
  }
  return { error: "unknown function" };
}
