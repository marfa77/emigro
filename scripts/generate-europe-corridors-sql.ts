/**
 * Generates supabase/migrations/20260625200000_europe_corridors.sql
 * from lib/corridor/seed/europe-corridors.ts (6 corridors, Portugal excluded).
 * STUDY programs are in lib/corridor/seed/study-programs.ts → 20260625260000_student_visa_programs.sql
 *
 * Run: npx tsx scripts/generate-europe-corridors-sql.ts
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  EUROPE_CORRIDORS,
  corridorWizardQuestions,
  type CorridorSeed,
  type ProgramSeed,
} from "../lib/corridor/seed/europe-corridors";

const OUT = join(process.cwd(), "supabase/migrations/20260625200000_europe_corridors.sql");

const COUNTRIES: [string, string, string][] = [
  ["ES", "Spain", "Испания"],
  ["FR", "France", "Франция"],
  ["IT", "Italy", "Италия"],
  ["DE", "Germany", "Германия"],
  ["NL", "Netherlands", "Нидерланды"],
  ["SE", "Sweden", "Швеция"],
  ["NO", "Norway", "Норвегия"],
  ["DK", "Denmark", "Дания"],
  ["FI", "Finland", "Финляндия"],
];

const PASSPORTS = ["RU", "BY", "UA", "KZ"] as const;

function sqlStr(v: string | null | undefined): string {
  if (v == null) return "NULL";
  return `'${v.replace(/'/g, "''")}'`;
}

function sqlJson(obj: unknown): string {
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

function programDestination(corridor: CorridorSeed, program: ProgramSeed): string {
  return program.destinationIso2 ?? corridor.destinations[0];
}

function buildCorridorSql(c: CorridorSeed): string {
  const lines: string[] = [];
  const wizardSlug = `${c.urlSegment}-routes`;

  lines.push(`-- Corridor: ${c.slug}`);
  lines.push(`INSERT INTO emigro_corridors (id, slug, title_en, title_ru, audience_description_en, audience_description_ru, primary_passport_iso2)`);
  lines.push(`VALUES (${sqlStr(c.id)}, ${sqlStr(c.slug)}, ${sqlStr(c.titleEn)}, ${sqlStr(c.titleRu)}, ${sqlStr(c.audienceEn)}, ${sqlStr(c.audienceRu)}, 'RU')`);
  lines.push(`ON CONFLICT (slug) DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_corridor_passports (corridor_id, passport_iso2, support_level) VALUES`);
  lines.push(
    PASSPORTS.map(
      (p, i) =>
        `  (${sqlStr(c.id)}, '${p}', '${p === "RU" ? "primary" : "secondary"}')${i < PASSPORTS.length - 1 ? "," : ""}`
    ).join("\n")
  );
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_corridor_destinations (corridor_id, destination_iso2) VALUES`);
  lines.push(c.destinations.map((d, i) => `  (${sqlStr(c.id)}, '${d}')${i < c.destinations.length - 1 ? "," : ""}`).join("\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_programs (id, slug, destination_iso2, program_type, title_en, title_ru, summary_en, summary_ru) VALUES`);
  c.programs.forEach((p, i) => {
    const id = c.programIds[i];
    const dest = programDestination(c, p);
    lines.push(
      `  (${sqlStr(id)}, ${sqlStr(p.slug)}, '${dest}', '${p.type}', ${sqlStr(p.titleEn)}, ${sqlStr(p.titleRu)}, ${sqlStr(p.summaryEn)}, ${sqlStr(p.summaryRu)})${i < c.programs.length - 1 ? "," : ""}`
    );
  });
  lines.push(`ON CONFLICT (slug) DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_corridor_programs (corridor_id, program_id, sort_order, is_featured) VALUES`);
  c.programIds.forEach((pid, i) => {
    lines.push(`  (${sqlStr(c.id)}, ${sqlStr(pid)}, ${i + 1}, true)${i < c.programIds.length - 1 ? "," : ""}`);
  });
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_program_versions (id, program_id, version_label, eligibility_rule) VALUES`);
  c.programs.forEach((p, i) => {
    lines.push(
      `  (${sqlStr(c.versionIds[i])}, ${sqlStr(c.programIds[i])}, '2026-01', ${sqlJson(p.rule)})${i < c.programs.length - 1 ? "," : ""}`
    );
  });
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_program_requirements (program_version_id, requirement_type, label_en, label_ru, value_text, sort_order) VALUES`);
  const reqRows: string[] = [];
  c.programs.forEach((p, pi) => {
    p.requirements.forEach((r, ri) => {
      reqRows.push(
        `  (${sqlStr(c.versionIds[pi])}, '${r.type}', ${sqlStr(r.labelEn)}, ${sqlStr(r.labelRu)}, ${sqlStr(r.value)}, ${ri + 1})`
      );
    });
  });
  lines.push(reqRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_program_costs (program_version_id, label_en, label_ru, amount_text, sort_order) VALUES`);
  const costRows: string[] = [];
  c.programs.forEach((p, pi) => {
    p.costs.forEach((cost, ci) => {
      costRows.push(
        `  (${sqlStr(c.versionIds[pi])}, ${sqlStr(cost.labelEn)}, ${sqlStr(cost.labelRu)}, ${sqlStr(cost.amount)}, ${ci + 1})`
      );
    });
  });
  lines.push(costRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_program_timeline_steps (program_version_id, step_type, title_en, title_ru, duration_text, sort_order) VALUES`);
  const tlRows: string[] = [];
  c.programs.forEach((p, pi) => {
    p.timeline.forEach((t, ti) => {
      tlRows.push(
        `  (${sqlStr(c.versionIds[pi])}, '${t.step}', ${sqlStr(t.titleEn)}, ${sqlStr(t.titleRu)}, ${sqlStr(t.duration)}, ${ti + 1})`
      );
    });
  });
  lines.push(tlRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_program_sources (program_version_id, source_url, raw_excerpt, last_verified, label_en, label_ru) VALUES`);
  const srcRows: string[] = [];
  c.programs.forEach((p, pi) => {
    p.sources.forEach((s) => {
      srcRows.push(
        `  (${sqlStr(c.versionIds[pi])}, ${sqlStr(s.url)}, ${sqlStr(s.excerpt)}, '2026-06-01', ${sqlStr(s.labelEn)}, ${sqlStr(s.labelRu)})`
      );
    });
  });
  lines.push(srcRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_passport_eligibility (program_version_id, passport_iso2, status, notes_en, notes_ru) VALUES`);
  const peRows: string[] = [];
  c.programs.forEach((p, pi) => {
    PASSPORTS.forEach((passport) => {
      let status: "eligible" | "partial" | "ineligible" = p.passportStatusOverride ?? (passport === "RU" ? "eligible" : "partial");
      let notesEn: string | null = null;
      let notesRu: string | null = null;
      if (p.passportStatusOverride === "partial") {
        notesEn =
          p.slug === "netherlands-startup-facilitator"
            ? "IND facilitator endorsement required — case-by-case review"
            : "Preliminarily possible, subject to consulate jurisdiction and current policy";
        notesRu =
          p.slug === "netherlands-startup-facilitator"
            ? "Нужен одобренный IND facilitator — индивидуальная проверка"
            : "Предварительно возможно, но зависит от консульства подачи и текущей политики";
      } else if (passport !== "RU") {
        notesEn = "Preliminarily possible, subject to consulate jurisdiction and place of submission";
        notesRu = "Предварительно возможно, но зависит от консульства подачи и юрисдикции";
      } else if (passport === "RU") {
        notesEn = "Official program requirements verified; apply via consulate/VFS where available";
        notesRu = "Официальные требования программы проверены; подача через консульство/VFS где доступно";
      }
      peRows.push(
        `  (${sqlStr(c.versionIds[pi])}, '${passport}', '${status}', ${sqlStr(notesEn)}, ${sqlStr(notesRu)})`
      );
    });
  });
  lines.push(peRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_corridor_digest_items (corridor_id, category, title_en, title_ru, body_en, body_ru, source_url, last_verified, sort_order) VALUES`);
  c.digest.forEach((d, i) => {
    lines.push(
      `  (${sqlStr(c.id)}, '${d.category}', ${sqlStr(d.titleEn)}, ${sqlStr(d.titleRu)}, ${sqlStr(d.bodyEn)}, ${sqlStr(d.bodyRu)}, ${d.sourceUrl ? sqlStr(d.sourceUrl) : "NULL"}, '2026-06-01', ${i + 1})${i < c.digest.length - 1 ? "," : ""}`
    );
  });
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  lines.push(`INSERT INTO emigro_wizard_definitions (id, corridor_id, slug, title_en, title_ru) VALUES`);
  lines.push(
    `  (${sqlStr(c.wizardId)}, ${sqlStr(c.id)}, ${sqlStr(wizardSlug)}, ${sqlStr(`${c.titleEn.split("→")[1]?.trim() ?? c.urlSegment} route finder`)}, ${sqlStr(`Подбор маршрута — ${c.titleRu.replace("Русскоязычные → ", "")}`)})`
  );
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  const moduleKeys = ["core", "labor", "capital", "bond"] as const;
  lines.push(`INSERT INTO emigro_wizard_modules (id, wizard_id, module_key, title_en, title_ru, sort_order) VALUES`);
  moduleKeys.forEach((key, i) => {
    const titles: Record<(typeof moduleKeys)[number], [string, string]> = {
      core: ["Basics", "Основное"],
      labor: ["Work & remote", "Работа и удалёнка"],
      capital: ["Passive income & savings", "Пассивный доход и сбережения"],
      bond: ["Family", "Семья"],
    };
    const [en, ru] = titles[key];
    lines.push(`  (${sqlStr(c.moduleIds[i])}, ${sqlStr(c.wizardId)}, '${key}', ${sqlStr(en)}, ${sqlStr(ru)}, ${i + 1})${i < moduleKeys.length - 1 ? "," : ""}`);
  });
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  const questions = corridorWizardQuestions(c);
  lines.push(`INSERT INTO emigro_wizard_questions (module_id, question_key, question_type, label_en, label_ru, help_en, help_ru, options, sort_order) VALUES`);
  const qRows: string[] = [];
  moduleKeys.forEach((key, mi) => {
    const moduleId = c.moduleIds[mi];
    questions[key].forEach((q, qi) => {
      qRows.push(
        `  (${sqlStr(moduleId)}, '${q.key}', '${q.type}', ${sqlStr(q.labelEn)}, ${sqlStr(q.labelRu)}, ${q.helpEn ? sqlStr(q.helpEn) : "NULL"}, ${q.helpRu ? sqlStr(q.helpRu) : "NULL"}, ${q.options ? sqlStr(q.options) : "NULL"}, ${qi + 1})`
      );
    });
  });
  lines.push(qRows.join(",\n"));
  lines.push(`ON CONFLICT DO NOTHING;`);
  lines.push("");

  return lines.join("\n");
}

function buildNewsTopicUpdates(): string {
  const lines: string[] = ["-- Activate news topics with corridor site paths"];
  for (const c of EUROPE_CORRIDORS) {
    const sitePaths = {
      landing: `/ru/${c.urlSegment}`,
      wizard: `/ru/${c.urlSegment}/wizard`,
      guide: `/ru/${c.urlSegment}/digest`,
    };
    lines.push(`UPDATE emigro_news_topics SET`);
    lines.push(`  status = 'active',`);
    lines.push(`  corridor_slug = ${sqlStr(c.slug)},`);
    lines.push(`  site_paths = ${sqlJson(sitePaths)}::jsonb,`);
    lines.push(`  updated_at = now()`);
    lines.push(`WHERE key = ${sqlStr(c.topicKey)};`);
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const parts: string[] = [
    "-- Europe corridors seed (6 corridors, 2026 thresholds)",
    "-- Generated by scripts/generate-europe-corridors-sql.ts — do not edit by hand",
    "",
    "INSERT INTO emigro_countries (iso2, name_en, name_ru) VALUES",
    COUNTRIES.map(([iso, en, ru], i) => `  ('${iso}', '${en}', '${ru}')${i < COUNTRIES.length - 1 ? "," : ""}`).join("\n"),
    "ON CONFLICT DO NOTHING;",
    "",
  ];

  for (const corridor of EUROPE_CORRIDORS) {
    parts.push(buildCorridorSql(corridor));
  }

  parts.push(buildNewsTopicUpdates());

  const sql = parts.join("\n") + "\n";
  writeFileSync(OUT, sql, "utf8");

  const lineCount = sql.split("\n").length;
  console.log(`Wrote ${OUT}`);
  console.log(`Lines: ${lineCount}`);
  console.log(`Corridors: ${EUROPE_CORRIDORS.length}`);
}

main();
