import fs from "fs";
import path from "path";
import { getGuideCoverPath } from "@/lib/guides/covers";

export type GuideFrontmatter = {
  slug: string;
  title: string;
  seo_title?: string;
  seo_description?: string;
  excerpt?: string;
  quick_answer?: string;
  cta_primary?: string;
  cta_secondary?: string;
  estimated_minutes?: number;
  date_published?: string;
  date_modified?: string;
  tags?: string[];
  topic_keys?: string[];
  corridor_slugs?: string[];
  cover_image?: string;
  /** Resolved cover path (frontmatter or slug map). */
  cover_path: string;
};

export type GuideArticle = GuideFrontmatter & {
  bodyHtml: string;
};

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

function inlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-corridor-700 underline hover:text-corridor-900">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function resolveCoverPath(meta: Record<string, string | string[]>, slug: string): string {
  const coverImage = meta.cover_image ? String(meta.cover_image) : undefined;
  const corridorSlugs = Array.isArray(meta.corridor_slugs) ? meta.corridor_slugs.map(String) : undefined;
  return getGuideCoverPath(slug, { coverImage, corridorSlugs });
}

function mapFrontmatter(meta: Record<string, string | string[]>, slug: string): GuideFrontmatter {
  const resolvedSlug = String(meta.slug ?? slug);
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
    cover_image: meta.cover_image ? String(meta.cover_image) : undefined,
    cover_path: resolveCoverPath(meta, resolvedSlug),
  };
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let inTable = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const closeTable = () => {
    if (inTable) {
      html.push("</tbody></table>");
      inTable = false;
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

    const faqQuestion = trimmed.match(/^\*\*([^*]+)\*\*$/);
    if (faqQuestion) {
      closeList();
      closeTable();
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && !nextLine.startsWith("#") && !nextLine.startsWith("|") && !nextLine.startsWith("- ")) {
        html.push(
          `<p class="mt-4 text-slate-700 leading-relaxed"><strong>${faqQuestion[1]}</strong> ${inlineMarkdown(nextLine)}</p>`
        );
        i++;
        continue;
      }
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      closeTable();
      html.push(`<h2 class="mt-10 text-2xl font-semibold text-slate-900">${inlineMarkdown(trimmed.slice(3))}</h2>`);
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
        html.push('<div class="mt-4 overflow-x-auto"><table class="min-w-full text-sm"><tbody>');
        inTable = true;
      }
      html.push(
        `<tr class="border-b border-slate-200">${cells.map((c) => `<td class="px-3 py-2 align-top">${inlineMarkdown(c)}</td>`).join("")}</tr>`
      );
      continue;
    }

    if (trimmed.startsWith("- ")) {
      closeTable();
      if (!inList) {
        html.push('<ul class="mt-4 list-disc space-y-2 pl-5 text-slate-700">');
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    closeTable();
    html.push(`<p class="mt-4 text-slate-700 leading-relaxed">${inlineMarkdown(trimmed)}</p>`);
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
      return mapFrontmatter(meta, file.replace(/\.md$/, ""));
    })
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

export function loadGuide(slug: string): GuideArticle | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, body } = parseFrontmatter(raw);

  return {
    ...mapFrontmatter(meta, slug),
    bodyHtml: markdownToHtml(body),
  };
}

export function guidePath(slug: string): string {
  return `/ru/guides/${slug}`;
}

export function getRelatedGuides(currentSlug: string, corridorSlugs?: string[], limit = 4): GuideFrontmatter[] {
  if (!corridorSlugs?.length) return [];
  const corridors = new Set(corridorSlugs);
  return listGuides()
    .filter((guide) => guide.slug !== currentSlug)
    .filter((guide) => guide.corridor_slugs?.some((c) => corridors.has(c)))
    .slice(0, limit);
}
