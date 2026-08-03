import fs from "fs";
import path from "path";
import { cache } from "react";
import { isStoryGenre, isStoryRole } from "@/lib/stories/genres";
import type { StoryArticle, StoryFrontmatter, StoryVerification } from "@/lib/stories/types";

const STORIES_DIR = path.join(process.cwd(), "content/stories/ru");

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

function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-corridor-700 underline hover:text-corridor-900">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let inOrderedList = false;

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

  let inBlockquote = false;
  const closeBlockquote = () => {
    if (inBlockquote) {
      html.push("</blockquote>");
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      closeList();
      closeBlockquote();
      continue;
    }

    if (trimmed === "---") {
      closeList();
      closeBlockquote();
      html.push(
        '<div class="my-8 h-px w-full bg-gradient-to-r from-transparent via-corridor-200 to-transparent"></div>'
      );
      continue;
    }

    if (trimmed.startsWith(">")) {
      closeList();
      const quoteText = trimmed.replace(/^>\s?/, "");
      if (!inBlockquote) {
        html.push(
          '<blockquote class="mt-5 space-y-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm leading-relaxed text-amber-950">'
        );
        inBlockquote = true;
      }
      html.push(quoteText ? `<p>${inlineMarkdown(quoteText)}</p>` : '<p class="h-2"></p>');
      continue;
    }

    closeBlockquote();

    if (trimmed.startsWith("#### ")) {
      closeList();
      html.push(
        `<h4 class="mt-6 text-lg font-semibold text-slate-900">${inlineMarkdown(trimmed.slice(5))}</h4>`
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3 class="mt-7 text-xl font-semibold text-slate-900">${inlineMarkdown(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(
        `<h2 class="mt-10 text-2xl font-bold tracking-tight text-slate-950">${inlineMarkdown(trimmed.slice(3))}</h2>`
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (inOrderedList) closeList();
      if (!inList) {
        html.push('<ul class="mt-4 space-y-2 text-slate-700">');
        inList = true;
      }
      html.push(
        `<li class="flex gap-3 leading-relaxed"><span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-corridor-500"></span><span>${inlineMarkdown(trimmed.slice(2))}</span></li>`
      );
      continue;
    }

    const orderedItem = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedItem) {
      if (inList) closeList();
      if (!inOrderedList) {
        html.push(
          '<ol class="mt-4 list-decimal space-y-2 pl-6 text-slate-700 marker:font-bold marker:text-corridor-600">'
        );
        inOrderedList = true;
      }
      html.push(`<li class="pl-1 leading-relaxed">${inlineMarkdown(orderedItem[1])}</li>`);
      continue;
    }

    closeList();
    html.push(`<p class="mt-4 text-slate-700 leading-8">${inlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  closeBlockquote();
  return html.join("\n");
}

function mapFrontmatter(meta: Record<string, string | string[]>, fileSlug: string): StoryFrontmatter {
  const genreRaw = String(meta.genre ?? "lifehack");
  const roleRaw = String(meta.role ?? "other");
  const verificationRaw = String(meta.verification ?? "personal");
  const verification: StoryVerification =
    verificationRaw === "emigro_reviewed" ? "emigro_reviewed" : "personal";

  return {
    slug: String(meta.slug ?? fileSlug),
    title: String(meta.title ?? fileSlug),
    seo_title: meta.seo_title ? String(meta.seo_title) : undefined,
    seo_description: meta.seo_description ? String(meta.seo_description) : undefined,
    excerpt: meta.excerpt ? String(meta.excerpt) : undefined,
    genre: isStoryGenre(genreRaw) ? genreRaw : "lifehack",
    role: isStoryRole(roleRaw) ? roleRaw : "other",
    country: String(meta.country ?? ""),
    author_display: String(meta.author_display ?? "Автор Emigro"),
    relocation_year: meta.relocation_year ? Number(meta.relocation_year) : undefined,
    related_guide_slugs: Array.isArray(meta.related_guide_slugs)
      ? meta.related_guide_slugs.map(String)
      : undefined,
    verification,
    backlink_url: meta.backlink_url ? String(meta.backlink_url) : undefined,
    date_published: meta.date_published ? String(meta.date_published) : undefined,
    date_modified: meta.date_modified ? String(meta.date_modified) : undefined,
    estimated_minutes: meta.estimated_minutes ? Number(meta.estimated_minutes) : undefined,
  };
}

export function listStories(): StoryFrontmatter[] {
  if (!fs.existsSync(STORIES_DIR)) return [];
  return fs
    .readdirSync(STORIES_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(STORIES_DIR, file), "utf8");
      const { meta } = parseFrontmatter(raw);
      return mapFrontmatter(meta, file.replace(/\.md$/, ""));
    })
    .sort((a, b) => {
      const da = a.date_published ?? "";
      const db = b.date_published ?? "";
      return db.localeCompare(da) || a.title.localeCompare(b.title, "ru");
    });
}

export function loadStoryUncached(slug: string): StoryArticle | null {
  const filePath = path.join(STORIES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  return {
    ...mapFrontmatter(meta, slug),
    bodyHtml: markdownToHtml(body),
  };
}

let _loadStoryFn: typeof loadStoryUncached | null = null;

function resolveLoadStory(): typeof loadStoryUncached {
  if (_loadStoryFn) return _loadStoryFn;
  if (process.env.NEXT_RUNTIME) {
    _loadStoryFn = cache(loadStoryUncached) as typeof loadStoryUncached;
  } else {
    _loadStoryFn = loadStoryUncached;
  }
  return _loadStoryFn;
}

export function loadStory(slug: string): StoryArticle | null {
  return resolveLoadStory()(slug);
}

export function listStoriesForGuide(guideSlug: string, limit = 3): StoryFrontmatter[] {
  return listStories()
    .filter((s) => s.related_guide_slugs?.includes(guideSlug))
    .slice(0, limit);
}

export function countStoriesForGuide(guideSlug: string): number {
  return listStories().filter((s) => s.related_guide_slugs?.includes(guideSlug)).length;
}
