import fs from "fs";
import path from "path";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_REVALIDATE, CACHE_TAGS } from "@/lib/cache/tags";
import { getGuideCoverPath, resolveGuideCoverPath, resolveGuideOgImagePath } from "@/lib/guides/covers";
import { specificGuideTopicKeys } from "@/lib/guides/guide-display";
import { getFactcheckCadence, getGuideReviewTier, type FactcheckCadence, type GuideReviewTier } from "@/lib/guides/review-tiers";

export type { FactcheckCadence, GuideReviewTier } from "@/lib/guides/review-tiers";
export type { GuideOfficialSource, GuideFrontmatter, GuideArticle } from "@/lib/guides/types";
export { guidePath } from "@/lib/guides/paths";

import type { GuideOfficialSource, GuideFrontmatter, GuideArticle } from "@/lib/guides/types";

const GUIDES_DIR = path.join(process.cwd(), "content/guides/ru");

function parseFrontmatter(raw: string): { meta: Record<string, string | string[]>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      meta[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      continue;
    }
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    meta[key] = value;
  }

  return { meta, body: match[2] };
}

function parseOfficialSources(frontmatterBlock: string): GuideOfficialSource[] {
  const sources: GuideOfficialSource[] = [];
  let inBlock = false;
  let pendingUrl: string | null = null;

  for (const line of frontmatterBlock.split("\n")) {
    if (/^official_sources:\s*$/.test(line)) {
      inBlock = true;
      continue;
    }
    if (!inBlock) continue;

    const urlMatch = line.match(/^\s*-\s*url:\s*(.+)\s*$/);
    if (urlMatch) {
      if (pendingUrl) sources.push({ url: pendingUrl, label: pendingUrl });
      pendingUrl = urlMatch[1].trim();
      continue;
    }

    const labelMatch = line.match(/^\s*label:\s*(.+)\s*$/);
    if (labelMatch && pendingUrl) {
      let label = labelMatch[1].trim();
      if (label.startsWith('"') && label.endsWith('"')) label = label.slice(1, -1);
      sources.push({ url: pendingUrl, label });
      pendingUrl = null;
      continue;
    }

    if (/^[a-zA-Z0-9_]+:/.test(line) && !line.startsWith(" ")) break;
  }

  if (pendingUrl) sources.push({ url: pendingUrl, label: pendingUrl });
  return sources;
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-corridor-700 underline hover:text-corridor-900">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function resolveCoverPath(meta: Record<string, string | string[]>, slug: string): string {
  const coverImage = meta.cover_image ? String(meta.cover_image) : undefined;
  const corridorSlugs = Array.isArray(meta.corridor_slugs) ? meta.corridor_slugs.map(String) : undefined;
  const topicKeys = Array.isArray(meta.topic_keys) ? meta.topic_keys.map(String) : undefined;
  const primaryIntent = meta.primary_intent ? String(meta.primary_intent) : undefined;
  return getGuideCoverPath(slug, { coverImage, corridorSlugs, topicKeys, primaryIntent });
}

function mapFrontmatter(
  meta: Record<string, string | string[]>,
  slug: string,
  officialSources: GuideOfficialSource[]
): GuideFrontmatter {
  const resolvedSlug = String(meta.slug ?? slug);
  const cover_path = resolveGuideCoverPath(resolvedSlug, resolveCoverPath(meta, resolvedSlug));
  const review_tier = getGuideReviewTier(resolvedSlug, meta.review_tier ? String(meta.review_tier) : undefined);
  const factcheck_cadence = getFactcheckCadence(resolvedSlug, review_tier);
  return {
    slug: resolvedSlug,
    title: String(meta.title ?? slug),
    seo_title: meta.seo_title ? String(meta.seo_title) : undefined,
    seo_description: meta.seo_description ? String(meta.seo_description) : undefined,
    excerpt: meta.excerpt ? String(meta.excerpt) : undefined,
    quick_answer: meta.quick_answer ? String(meta.quick_answer) : undefined,
    cta_primary: meta.cta_primary ? String(meta.cta_primary) : undefined,
    cta_secondary: meta.cta_secondary ? String(meta.cta_secondary) : undefined,
    estimated_minutes: meta.estimated_minutes ? Number(meta.estimated_minutes) : undefined,
    date_published: meta.date_published ? String(meta.date_published) : undefined,
    date_modified: meta.date_modified ? String(meta.date_modified) : undefined,
    tags: Array.isArray(meta.tags) ? meta.tags.map(String) : undefined,
    topic_keys: Array.isArray(meta.topic_keys) ? meta.topic_keys.map(String) : undefined,
    corridor_slugs: Array.isArray(meta.corridor_slugs) ? meta.corridor_slugs.map(String) : undefined,
    primary_intent: meta.primary_intent ? String(meta.primary_intent) : undefined,
    cover_image: meta.cover_image ? String(meta.cover_image) : undefined,
    official_sources: officialSources.length > 0 ? officialSources : undefined,
    review_tier,
    factcheck_cadence,
    cover_path,
    og_image_path: resolveGuideOgImagePath(resolvedSlug, cover_path),
  };
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let inOrderedList = false;
  let inTable = false;
  let tableRowIndex = 0;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
    if (inOrderedList) {
      html.push("</ol>");
      inOrderedList = false;
    }
  };

  const closeTable = () => {
    if (inTable) {
      if (tableRowIndex > 1) html.push("</tbody>");
      html.push("</table>");
      html.push("</div></div>");
      inTable = false;
      tableRowIndex = 0;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      closeTable();
      continue;
    }

    if (trimmed === "---") {
      closeList();
      closeTable();
      html.push('<div class="my-10 h-px w-full bg-gradient-to-r from-transparent via-corridor-200 to-transparent"></div>');
      continue;
    }

    const faqQuestion = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (faqQuestion) {
      closeList();
      closeTable();
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && !nextLine.startsWith("#") && !nextLine.startsWith("|") && !nextLine.startsWith("- ")) {
        html.push(
          `<section class="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 shadow-sm"><h3 class="text-base font-semibold text-slate-950">${inlineMarkdown(faqQuestion[1])}</h3><p class="mt-2 text-slate-700 leading-relaxed">${inlineMarkdown(nextLine)}</p></section>`
        );
        i++;
        continue;
      }
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      closeTable();
      html.push(`<h2 class="mt-12 flex items-start gap-3 text-2xl font-bold tracking-tight text-slate-950"><span class="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-corridor-500 shadow-[0_0_0_6px_rgba(37,99,235,0.10)]"></span><span>${inlineMarkdown(trimmed.slice(3))}</span></h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      closeTable();
      html.push(`<h3 class="mt-8 text-xl font-semibold text-slate-900">${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("|")) {
      closeList();
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      if (cells.every((c) => /^-+$/.test(c))) continue;
      if (!inTable) {
        html.push('<div class="not-prose my-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-950/5"><div class="overflow-x-auto"><table class="min-w-full border-separate border-spacing-0 text-sm">');
        inTable = true;
      }
      const isHeader = tableRowIndex === 0;
      if (isHeader) html.push("<thead>");
      if (tableRowIndex === 1) html.push("<tbody>");
      html.push(
        `<tr class="${isHeader ? "bg-slate-950 text-white" : tableRowIndex % 2 === 0 ? "bg-slate-50/70" : "bg-white"}">${cells.map((c, cellIndex) => {
          const tag = isHeader ? "th" : "td";
          const align = cellIndex === 0 ? "font-semibold text-slate-900" : "text-slate-700";
          const base = isHeader
            ? "px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white"
            : `border-t border-slate-100 px-4 py-3 align-top leading-relaxed ${align}`;
          return `<${tag} class="${base}">${inlineMarkdown(c)}</${tag}>`;
        }).join("")}</tr>`
      );
      if (isHeader) html.push("</thead>");
      tableRowIndex++;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      closeTable();
      if (inOrderedList) closeList();
      if (!inList) {
        html.push('<ul class="mt-4 space-y-3 text-slate-700">');
        inList = true;
      }
      html.push(`<li class="flex gap-3 leading-relaxed"><span class="mt-2 h-2 w-2 flex-none rounded-full bg-corridor-500"></span><span>${inlineMarkdown(trimmed.slice(2))}</span></li>`);
      continue;
    }

    const orderedItem = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedItem) {
      closeTable();
      if (inList) closeList();
      if (!inOrderedList) {
        html.push('<ol class="mt-4 list-decimal space-y-3 pl-6 text-slate-700 marker:font-bold marker:text-corridor-600">');
        inOrderedList = true;
      }
      html.push(`<li class="pl-1 leading-relaxed">${inlineMarkdown(orderedItem[1])}</li>`);
      continue;
    }

    closeList();
    closeTable();
    html.push(`<p class="mt-5 text-slate-700 leading-8">${inlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  closeTable();
  return html.join("\n");
}

export function listGuides(): GuideFrontmatter[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf8");
      const { meta } = parseFrontmatter(raw);
      const frontmatterBlock = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
      return mapFrontmatter(meta, file.replace(/\.md$/, ""), parseOfficialSources(frontmatterBlock));
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function loadGuideUncached(slug: string): GuideArticle | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const frontmatterBlock = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? "";
  const officialSources = parseOfficialSources(frontmatterBlock);

  return {
    ...mapFrontmatter(meta, slug, officialSources),
    bodyHtml: markdownToHtml(body),
  };
}

/** Per-request dedupe between generateMetadata and page render. */
export const loadGuide = cache(loadGuideUncached);

export async function getGuidesIndex(): Promise<GuideFrontmatter[]> {
  return unstable_cache(async () => listGuides(), ["guides-index"], {
    revalidate: CACHE_REVALIDATE.guides,
    tags: [CACHE_TAGS.guides],
  })();
}

export function getRelatedGuides(
  currentSlug: string,
  corridorSlugs?: string[],
  topicKeys?: string[],
  limit = 4,
  allGuides?: GuideFrontmatter[],
): GuideFrontmatter[] {
  const corridors = new Set(corridorSlugs ?? []);
  const topics = specificGuideTopicKeys(topicKeys);
  if (corridors.size === 0 && topics.size === 0) return [];

  return (allGuides ?? listGuides())
    .filter((guide) => guide.slug !== currentSlug)
    .map((guide) => {
      let score = 0;
      if (guide.corridor_slugs?.some((c) => corridors.has(c))) score += 2;
      for (const key of Array.from(specificGuideTopicKeys(guide.topic_keys))) {
        if (topics.has(key)) score += 1;
      }
      return { guide, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ guide }) => guide);
}
