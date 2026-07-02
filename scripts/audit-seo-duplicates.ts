/**
 * Audit duplicate SEO titles/descriptions across indexable RU pages.
 * Usage: npx tsx scripts/audit-seo-duplicates.ts
 */
import {
  fitMetaDescription,
  fitSeoTitleAbsolute,
  pageMetadata,
  SITE_NAME,
} from "../lib/seo";
import { listGuides } from "../lib/guides/load";
import {
  GUIDE_CATEGORIES,
  GUIDE_AUDIENCES,
  getGuideCategoryById,
  getGuideAudienceById,
} from "../lib/guides/categories";
import { buildDigestMetadata, buildProgramMetadata } from "../lib/seo/corridor-page-seo";
import { getPtLongTailByGuideSlug, getPtLongTailByPath } from "../lib/seo/pt-longtail";
import { TRANSIT_HUBS } from "../lib/transit-hubs";
import { getNewsDisplaySeoTitle } from "../lib/news/digests";
import { createServerClient } from "../lib/supabase/server";

const TITLE_SUFFIX = ` | ${SITE_NAME}`;

type PageMeta = { url: string; title: string; description: string; source: string };

function resolveTitle(metadata: ReturnType<typeof pageMetadata>): string {
  const t = metadata.title;
  if (typeof t === "string") return `${t}${TITLE_SUFFIX}`;
  if (t && typeof t === "object" && "absolute" in t && t.absolute) return t.absolute;
  if (t && typeof t === "object" && "default" in t) return String(t.default);
  return String(t);
}

function addPage(pages: PageMeta[], input: {
  url: string;
  title: string;
  description: string;
  titleAbsolute?: boolean;
  source: string;
}) {
  const meta = pageMetadata({
    title: input.title,
    description: input.description,
    path: input.url.replace(/^https?:\/\/[^/]+/, "") || input.url,
    titleAbsolute: input.titleAbsolute,
  });
  pages.push({
    url: input.url,
    title: resolveTitle(meta),
    description: String(meta.description ?? input.description),
    source: input.source,
  });
}

function findDuplicates(pages: PageMeta[], field: "title" | "description") {
  const map = new Map<string, PageMeta[]>();
  for (const p of pages) {
    const key = p[field];
    const list = map.get(key) ?? [];
    list.push(p);
    map.set(key, list);
  }
  return [...map.entries()].filter(([, list]) => list.length > 1);
}

async function main() {
  process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.emigro.online";
  const pages: PageMeta[] = [];

  // Static pages
  const staticPages: { url: string; title: string; description: string; titleAbsolute?: boolean }[] = [
    { url: "/ru", title: "Emigro — ВНЖ и релокация в Европу", titleAbsolute: true, description: "Навигатор по ВНЖ и гражданству для русскоязычных: коридоры Европы, wizard подбора, справочники программ и еженедельные новости с источниками." },
    { url: "/ru/guides", title: "Гайды по релокации и ВНЖ в Европе", description: "Практические pillar-гайды Emigro: маршруты для русскоязычных за рубежом и в СНГ — digital nomad, семья с детьми, отказы в визах, бюджет релокации и ВНЖ по странам ЕС." },
    { url: "/ru/news", title: "Новости релокации в Европу", titleAbsolute: true, description: "Еженедельные обзоры по ВНЖ, визам и гражданству в Португалии, Испании, Франции, Италии, Германии, Нидерландах и Скандинавии для русскоязычных заявителей." },
    { url: "/ru/wizard", title: "Подбор страны и маршрута ВНЖ", titleAbsolute: true, description: "Ответьте на вопросы о паспорте, текущем месте жительства, доходе, работе и семье — Emigro проверит европейские коридоры и покажет подходящие программы." },
  ];
  for (const p of staticPages) addPage(pages, { ...p, source: "static" });

  // Guides filters — mirror app/ru/guides/page.tsx generateMetadata
  for (const cat of GUIDE_CATEGORIES) {
    const category = getGuideCategoryById(cat.id);
    addPage(pages, {
      url: `/ru/guides?cat=${cat.id}`,
      title: `Гайды: ${category.label}`,
      description: `${category.description} Pillar-гайды Emigro для русскоязычных за рубежом и в СНГ — wizard подбора маршрута ВНЖ.`,
      source: "guides-filter-cat",
    });
  }
  for (const aud of GUIDE_AUDIENCES) {
    const audience = getGuideAudienceById(aud.id);
    addPage(pages, {
      url: `/ru/guides?aud=${aud.id}`,
      title: `Гайды для ${audience.label}`,
      description: `Pillar-гайды Emigro для ${audience.label.toLowerCase()}: маршруты ВНЖ, документы, семья и бюджет релокации в Европу.`,
      source: "guides-filter-aud",
    });
  }

  // Guides
  for (const guide of listGuides()) {
    const longTail = getPtLongTailByGuideSlug(guide.slug);
    const title = longTail?.seoTitle ?? guide.seo_title ?? guide.title;
    const description =
      longTail?.seoDescription ?? guide.seo_description ?? guide.excerpt ?? guide.quick_answer ?? guide.title;
    const meta = pageMetadata({ title, description, path: `/ru/guides/${guide.slug}` });
    pages.push({
      url: `/ru/guides/${guide.slug}`,
      title: resolveTitle(meta),
      description: String(meta.description),
      source: "guide",
    });
  }

  // News topics from DB
  try {
    const supabase = createServerClient();
    const { data: topics } = await supabase.from("emigro_news_topics").select("*").eq("is_active", true);
    for (const topic of topics ?? []) {
      const segment = topic.url_segment as string;
      addPage(pages, {
        url: `/ru/news?country=${segment}`,
        title: `Новости ${topic.country_ru} — ВНЖ и гражданство`,
        titleAbsolute: true,
        description: `Еженедельные обзоры по релокации в ${topic.country_ru} для ${topic.audience_ru}: изменения законов, консульства, пороги ВНЖ и практика подачи с проверенными источниками.`,
        source: "news-filter",
      });

      if (topic.corridor_slug && topic.status !== "news_only") {
        const landingTitle = `${topic.country_ru} — коридор релокации`;
        const ptLongTail = segment === "portugal" ? getPtLongTailByPath(`/ru/${segment}`) : undefined;
        addPage(pages, {
          url: `/ru/${segment}`,
          title: ptLongTail?.seoTitle ?? landingTitle,
          description:
            ptLongTail?.seoDescription ??
            `${topic.focus_hint_ru}. Wizard подбора маршрута ВНЖ, справочник коридора с проверенными фактами, программы и еженедельные новости для паспортов RU/BY/UA/KZ. Emigro.`,
          source: "corridor-landing",
        });
        addPage(pages, {
          url: `/ru/${segment}/wizard`,
          title: `Подбор маршрута ВНЖ — ${topic.country_ru}`,
          description: `Wizard Emigro по коридору ${topic.country_ru}: ответьте на вопросы о паспорте, доходе и семье — получите сравнение программ ВНЖ с требованиями и сроками для паспортов RU/BY/UA/KZ.`,
          source: "corridor-wizard",
        });

        const digestMeta = buildDigestMetadata({
          key: topic.key,
          countryRu: topic.country_ru,
          urlSegment: segment,
          audienceRu: topic.audience_ru,
          focusHintRu: topic.focus_hint_ru,
          seoTags: topic.seo_tags,
          sitePaths: { landing: `/ru/${segment}`, guide: `/ru/${segment}/digest`, wizard: `/ru/${segment}/wizard` },
        } as never);
        pages.push({
          url: `/ru/${segment}/digest`,
          title: resolveTitle(digestMeta),
          description: String(digestMeta.description),
          source: "corridor-digest",
        });
      }
    }

    const { data: programs } = await supabase
      .from("emigro_programs")
      .select("slug, title_ru, summary_ru, program_type, destination_iso2")
      .eq("is_active", true);
    const { data: allTopics } = await supabase.from("emigro_news_topics").select("*");
    const topicByIso = new Map<string, (typeof allTopics)[0]>();
    for (const t of allTopics ?? []) {
      for (const iso of (t.destination_iso2 as string[] | null) ?? []) {
        topicByIso.set(iso, t);
      }
    }

    for (const program of programs ?? []) {
      const topic = topicByIso.get(program.destination_iso2 as string);
      if (!topic) continue;
      const segment = topic.url_segment as string;
      const progMeta = buildProgramMetadata(
        {
          slug: program.slug as string,
          title_ru: program.title_ru as string,
          summary_ru: program.summary_ru as string,
          program_type: program.program_type as string,
          requirements: [],
          timeline: [],
          costs: [],
          passportEligibility: [],
          sources: [],
        } as never,
        {
          countryRu: topic.country_ru,
          urlSegment: segment,
          seoTags: topic.seo_tags,
          sitePaths: { landing: `/ru/${segment}` },
        } as never
      );
      pages.push({
        url: `/ru/${segment}/programs/${program.slug}`,
        title: resolveTitle(progMeta),
        description: String(progMeta.description),
        source: "program",
      });
    }

    const { data: digests } = await supabase
      .from("emigro_news_digests")
      .select("slug, title, seo_title, seo_description, excerpt, week_end, country, topic_key")
      .eq("status", "published");
    for (const digest of digests ?? []) {
      const title = fitSeoTitleAbsolute(getNewsDisplaySeoTitle(digest as never, digest.country as string));
      const description = fitMetaDescription((digest.seo_description as string) || (digest.excerpt as string));
      pages.push({
        url: `/ru/news/${digest.slug}`,
        title,
        description,
        source: "news-article",
      });
    }
  } catch (e) {
    console.warn("DB unavailable, skipping dynamic pages:", e);
  }

  for (const hub of TRANSIT_HUBS) {
    addPage(pages, {
      url: hub.path,
      title: hub.heroTitle ?? `${hub.countryRu}: транзитный хаб`,
      description: `${hub.quickAnswer} Не EU-коридор: первый шаг для стабилизации, документов, банков и подготовки маршрута в Европу.`,
      source: "transit-hub",
    });
  }

  const titleDups = findDuplicates(pages, "title");
  const descDups = findDuplicates(pages, "description");

  console.log(`\nTotal pages analyzed: ${pages.length}`);
  console.log(`Duplicate titles: ${titleDups.length} groups (${titleDups.reduce((s, [, l]) => s + l.length, 0)} pages)`);
  console.log(`Duplicate descriptions: ${descDups.length} groups (${descDups.reduce((s, [, l]) => s + l.length, 0)} pages)\n`);

  console.log("=== TOP DUPLICATE TITLES ===");
  for (const [title, list] of titleDups.sort((a, b) => b[1].length - a[1].length).slice(0, 20)) {
    console.log(`\n"${title}" (${list.length} pages)`);
    for (const p of list.slice(0, 8)) console.log(`  ${p.url} [${p.source}]`);
    if (list.length > 8) console.log(`  ... +${list.length - 8} more`);
  }

  console.log("\n=== TOP DUPLICATE DESCRIPTIONS ===");
  for (const [desc, list] of descDups.sort((a, b) => b[1].length - a[1].length).slice(0, 15)) {
    console.log(`\n"${desc.slice(0, 100)}..." (${list.length} pages)`);
    for (const p of list.slice(0, 6)) console.log(`  ${p.url} [${p.source}]`);
    if (list.length > 6) console.log(`  ... +${list.length - 6} more`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
