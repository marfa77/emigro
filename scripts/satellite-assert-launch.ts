/**
 * Fail a satellite launch that is still a Spain-thin half-product.
 *
 *   npx tsx scripts/satellite-assert-launch.ts --country=germany --city=berlin
 *   npx tsx scripts/satellite-assert-launch.ts --country=spain --city=valencia
 *   npm run satellite:assert-launch -- --country=portugal --city=porto
 *
 * Do not call a satellite launched if this exits 1.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  SATELLITE_LAUNCH_BAR,
  SATELLITE_LAUNCH_SLOTS,
  SATELLITE_LAUNCH_SLOT_LABELS,
  SATELLITE_LAUNCH_SLOT_META,
  SATELLITE_LAUNCH_CORE_SLOTS,
  satelliteGuideQualityGaps,
  satelliteGuideSeoAeoGaps,
  satelliteLaunchGrepNeedles,
  satelliteLaunchRequiredFiles,
  type SatelliteLaunchSlot,
} from "../lib/satellite/launch-bar";
import { cityChatForCountry, isCityChatLive } from "../lib/satellite/city-chats";
import { validateAgainstBlueprint } from "../lib/community-notes/article-blueprint";
import { validateNoteDraft } from "../lib/community-notes/editorial-quality";
import { validateOfficialPracticeCopy } from "../lib/community-notes/official-vs-practice";
import { COMMITTED_NOTE_OG_SLUGS } from "../lib/community-notes/note-og-slugs";
import { hasNoteOgImageFile } from "../lib/community-notes/note-og-image";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "../lib/community-notes/types";

const ROOT = resolve(process.cwd());

function arg(name: string, fallback?: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  const value = hit?.slice(`--${name}=`.length).trim() || fallback || "";
  if (!value) {
    console.error(`Missing --${name}=`);
    process.exit(2);
  }
  return value.toLowerCase();
}

function read(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf-8");
}

function countYamlCountry(country: string): number {
  const raw = read("parser/groups.yaml");
  const blocks = raw.split(/^\s*- username:/m).slice(1);
  return blocks.filter((b) => new RegExp(`country_key:\\s*${country}\\b`).test(b)).length;
}

function wordCount(parts: string[]): number {
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

type GuideLike = {
  slug: string;
  content_kind: ContentKind;
  excerpt?: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  body_sections: NoteBodySection[];
  body_paragraphs: string[];
  faq: CommunityNoteFaq[];
  key_takeaways: string[];
  official_links: Array<{ title: string; url: string }>;
  topic_tags?: string[];
};

function guideWords(g: GuideLike): number {
  return wordCount([
    g.quick_answer,
    ...(g.body_paragraphs ?? []),
    ...(g.body_sections ?? []).flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
    ...(g.faq ?? []).flatMap((f) => [f.q, f.a]),
    ...(g.key_takeaways ?? []),
  ]);
}

async function loadEditorialModule(country: string): Promise<Record<string, unknown> | { error: string }> {
  const indexPath = `lib/community-notes/guides/${country}-editorial-index.ts`;
  if (!existsSync(resolve(ROOT, indexPath))) {
    return { error: `missing ${indexPath}` };
  }
  try {
    return (await import(`../lib/community-notes/guides/${country}-editorial-index`)) as Record<string, unknown>;
  } catch (e) {
    return { error: `failed to import ${indexPath}: ${e instanceof Error ? e.message : String(e)}` };
  }
}

function editorialGuidesFromMod(country: string, mod: Record<string, unknown>): GuideLike[] | { error: string } {
  const key = `${country.toUpperCase()}_EDITORIAL_GUIDES`;
  const guides = mod[key];
  if (!Array.isArray(guides)) {
    return { error: `${country}-editorial-index.ts must export ${key}` };
  }
  return guides as GuideLike[];
}

function guideSlotsFromMod(country: string, mod: Record<string, unknown>): Partial<Record<SatelliteLaunchSlot, string>> {
  const key = `${country.toUpperCase()}_GUIDE_SLOTS`;
  const slots = mod[key];
  if (!slots || typeof slots !== "object") return {};
  return slots as Partial<Record<SatelliteLaunchSlot, string>>;
}

async function main() {
  const country = arg("country");
  const city = arg("city", country === "portugal" ? "porto" : country === "spain" ? "valencia" : undefined);
  const errors: string[] = [];
  const warns: string[] = [];

  console.log(`=== Satellite gold bar: ${country} / ${city} ===\n`);

  if (country === "portugal") {
    console.log("Portugal is the gold library — checking 15 gold slugs exist; not an editorial-index clone.\n");
    for (const slot of SATELLITE_LAUNCH_SLOTS) {
      const slug = SATELLITE_LAUNCH_SLOT_META[slot].portugalGold;
      if (!COMMITTED_NOTE_OG_SLUGS.has(slug)) {
        errors.push(`portugal gold slug not in COMMITTED_NOTE_OG_SLUGS: ${slot} → ${slug}`);
      }
      if (!hasNoteOgImageFile(slug)) {
        errors.push(`portugal gold hero missing or <20KB: public/images/community-notes/${slug}.webp`);
      }
    }
  } else {
    for (const rel of satelliteLaunchRequiredFiles(country, city)) {
      if (!existsSync(resolve(ROOT, rel))) errors.push(`missing ${rel}`);
    }
  }

  for (const { file, needle, label } of satelliteLaunchGrepNeedles(country, city)) {
    const path = resolve(ROOT, file);
    if (!existsSync(path)) {
      errors.push(`missing ${file} (${label})`);
      continue;
    }
    const raw = read(file);
    if (file === "lib/corridor/hub.ts") {
      if (!raw.includes(country) || !raw.includes("hasPractice")) {
        warns.push(`confirm hasPractice for ${country} in lib/corridor/hub.ts`);
      }
      continue;
    }
    if (file === "lib/satellite/funnel-urls.ts" && country === "portugal") continue;
    if (!raw.includes(needle)) errors.push(`${file}: missing ${label} (${needle})`);
  }

  const channels = existsSync(resolve(ROOT, "parser/groups.yaml")) ? countYamlCountry(country) : 0;
  if (channels < SATELLITE_LAUNCH_BAR.minParserChannels) {
    errors.push(`parser channels for ${country}: ${channels} < ${SATELLITE_LAUNCH_BAR.minParserChannels}`);
  } else {
    console.log(`parser channels: ${channels}`);
  }

  const chat = cityChatForCountry(country);
  if (!chat) {
    errors.push(`lib/satellite/city-chats.ts has no row for ${country} — wizard will not invite anyone`);
  } else if (!isCityChatLive(chat)) {
    errors.push(`${chat.envChatId} empty — user must create group; do not call this launched`);
  } else {
    console.log(`city chat live: ${chat.chatTitleRu} (${chat.startPayload})`);
  }

  const featuredNotesFile = existsSync(resolve(ROOT, `lib/${country}/featured-notes.ts`));
  const featuredComponent =
    existsSync(resolve(ROOT, `components/${country}`)) &&
    readdirSync(resolve(ROOT, `components/${country}`)).some((f) => /FeaturedNotes/.test(f));
  if (country !== "portugal" && !featuredNotesFile && !featuredComponent) {
    errors.push(`missing FeaturedNotes for ${country} on www corridor`);
  }

  const hubPage = `app/satellite/${country}/page.tsx`;
  if (existsSync(resolve(ROOT, hubPage))) {
    const hub = read(hubPage);
    if (!hub.includes("SatelliteHubDepth")) {
      errors.push(`${hubPage}: missing SatelliteHubDepth (thin-hub signal)`);
    }
    if (!hub.includes("SatelliteCityChatCta") && !hub.includes("PortoChatCta")) {
      errors.push(`${hubPage}: missing city chat CTA`);
    }
  }

  const notesPage = `app/satellite/${country}/notes/[slug]/page.tsx`;
  if (existsSync(resolve(ROOT, notesPage))) {
    const note = read(notesPage);
    if (!note.includes("SatelliteCityChatCta") && !note.includes("PortoChatCta")) {
      errors.push(`${notesPage}: missing city chat CTA`);
    }
  }

  const bankPath = `lib/community-notes/${city}-group-bank.json`;
  if (existsSync(resolve(ROOT, bankPath))) {
    try {
      const bank = JSON.parse(read(bankPath)) as { policy?: string; queue?: unknown };
      const queue = Array.isArray(bank.queue) ? bank.queue.filter((s) => typeof s === "string") : [];
      if (queue.length < SATELLITE_LAUNCH_BAR.minGroupBankSlugs) {
        errors.push(`${bankPath}: queue ${queue.length} < ${SATELLITE_LAUNCH_BAR.minGroupBankSlugs}`);
      }
      const policy = bank.policy ?? "";
      if (!/3 days|3 дн/i.test(policy)) {
        errors.push(`${bankPath}: policy must say 1 discussion / 3 days`);
      }
    } catch {
      errors.push(`${bankPath}: invalid JSON`);
    }
  } else if (country !== "portugal") {
    errors.push(`missing ${bankPath} (owned chat discussion queue)`);
  }

  if (country !== "portugal") {
    const modOrErr = await loadEditorialModule(country);
    if ("error" in modOrErr) {
      errors.push(modOrErr.error);
    } else {
      const slots = guideSlotsFromMod(country, modOrErr);
        for (const slot of SATELLITE_LAUNCH_SLOTS) {
          if (!slots[slot]) {
            const kind = (SATELLITE_LAUNCH_CORE_SLOTS as readonly string[]).includes(slot) ? "CORE" : "life";
            errors.push(`GUIDE_SLOTS missing [${kind}] ${slot} (${SATELLITE_LAUNCH_SLOT_LABELS[slot]})`);
          }
        }

      const guides = editorialGuidesFromMod(country, modOrErr);
      if ("error" in guides) {
        errors.push(guides.error);
      } else {
        const guideKind = guides.filter((g) => g.content_kind === "guide");
        console.log(`editorial guides: ${guideKind.length} (index rows: ${guides.length})`);
        if (guideKind.length < SATELLITE_LAUNCH_BAR.minGuides) {
          errors.push(`guides ${guideKind.length} < ${SATELLITE_LAUNCH_BAR.minGuides} (need 15 life guides for week 0–month 6)`);
        }
        for (const slot of SATELLITE_LAUNCH_SLOTS) {
          const slug = slots[slot];
          if (!slug) continue;
          const row = guides.find((g) => g.slug === slug);
          if (!row) errors.push(`GUIDE_SLOTS ${slot} → ${slug} not in EDITORIAL_GUIDES`);
          else if (row.content_kind !== "guide") {
            errors.push(`GUIDE_SLOTS ${slot} (${slug}) is ${row.content_kind}, must be guide`);
          }
        }
        const blueprintCountry = country === "spain" ? "spain" : "portugal";
        const slugToSlot = new Map<string, SatelliteLaunchSlot>();
        for (const slot of SATELLITE_LAUNCH_SLOTS) {
          const slug = slots[slot];
          if (slug) slugToSlot.set(slug, slot);
        }
        const webpHashes = new Map<string, string>();
        for (const g of guideKind) {
          const gate = [
            ...validateNoteDraft(g, country === "spain" ? "spain" : "portugal"),
            ...validateOfficialPracticeCopy(g),
          ];
          const words = guideWords(g);
          if (words < SATELLITE_LAUNCH_BAR.minGuideWords) {
            errors.push(
              `${g.slug}: ${words} words < ${SATELLITE_LAUNCH_BAR.minGuideWords} (target ${SATELLITE_LAUNCH_BAR.targetGuideWords})`
            );
          }
          const sections = g.body_sections?.length ?? 0;
          if (sections < SATELLITE_LAUNCH_BAR.minBodySections) {
            errors.push(`${g.slug}: body_sections ${sections} < ${SATELLITE_LAUNCH_BAR.minBodySections}`);
          }
          const bodyText = [
            g.quick_answer,
            ...(g.body_paragraphs ?? []),
            ...(g.body_sections ?? []).flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
            ...(g.faq ?? []).flatMap((f) => [f.q, f.a]),
            ...(g.key_takeaways ?? []),
          ].join(" ");
          for (const gap of satelliteGuideQualityGaps(bodyText)) {
            errors.push(`${g.slug}: ${gap}`);
          }
          for (const gap of satelliteGuideSeoAeoGaps(g, {
            country,
            city,
            slot: slugToSlot.get(g.slug),
          })) {
            errors.push(`${g.slug}: ${gap}`);
          }
          if (gate.length) errors.push(`${g.slug}: ${gate.join("; ")}`);
          if (country === "spain" || country === "portugal") {
            const bp = validateAgainstBlueprint(g, blueprintCountry);
            if (bp.errors.length) errors.push(`${g.slug} blueprint: ${bp.errors.join("; ")}`);
          }
          const img = `public/images/community-notes/${g.slug}.webp`;
          if (!hasNoteOgImageFile(g.slug)) {
            errors.push(`hero missing or <${SATELLITE_LAUNCH_BAR.minWebpBytes}B: ${img}`);
          } else {
            const buf = readFileSync(resolve(ROOT, img));
            const hash = createHash("sha256").update(buf).digest("hex").slice(0, 16);
            const prev = webpHashes.get(hash);
            if (prev) errors.push(`${g.slug}: duplicate hero hash of ${prev} — unique WebP required`);
            else webpHashes.set(hash, g.slug);
          }
          if (!COMMITTED_NOTE_OG_SLUGS.has(g.slug)) {
            errors.push(`${g.slug}: not in COMMITTED_NOTE_OG_SLUGS`);
          }
        }
      }
    }
  }

  if (warns.length) {
    console.log("\nWARN");
    for (const w of warns) console.log(`  - ${w}`);
  }
  if (errors.length) {
    console.log("\nFAIL — not launched. Statuses: stocked=15 gold guides · community=live chat_id · ops=systemd files (VPS enable is human).");
    for (const e of errors) console.log(`  - ${e}`);
    process.exit(1);
  }
  console.log("\nPASS — stocked + community checks green. systemd files may exist; VPS enable is still a human step.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
