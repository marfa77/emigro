/**
 * Audit wizard funnel — every primary CTA should resolve to a wizard URL.
 * Usage: npx tsx scripts/audit-wizard-funnel.ts
 */
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { resolveGuideWizardHref, isWizardHref } from "../lib/wizard/resolve-href";
import { listGuides } from "../lib/guides/load";

const ROOT = join(__dirname, "..");

type Issue = { source: string; href: string; resolved: string };

function auditGuides(): Issue[] {
  const issues: Issue[] = [];
  for (const guide of listGuides()) {
    const resolved = resolveGuideWizardHref(guide.cta_primary, guide.topic_keys);
    if (!isWizardHref(resolved)) {
      issues.push({
        source: `guide:${guide.slug}`,
        href: guide.cta_primary ?? "(missing)",
        resolved,
      });
    }
  }
  return issues;
}

function scanFileForLandingCtas(filePath: string, rel: string): Issue[] {
  const text = readFileSync(filePath, "utf8");
  const issues: Issue[] = [];
  const hrefRe = /href=["'](\/ru\/[a-z][a-z-]*)(?:\?[^"']*)?["']/g;
  let match: RegExpExecArray | null;
  while ((match = hrefRe.exec(text)) !== null) {
    const href = match[1];
    if (href === "/ru/wizard" || href.includes("/wizard")) continue;
    const skipSegments = new Set([
      "news",
      "guides",
      "contact",
      "partners",
      "privacy",
      "terms",
      "cookies",
      "community",
      "assist",
      "ukraine",
      "serbia",
      "georgia",
      "montenegro",
      "armenia",
      "uae",
      "thailand",
      "turkey",
      "kazakhstan",
      "indonesia",
    ]);
    const segment = href.replace("/ru/", "");
    if (skipSegments.has(segment)) continue;
    if (text.includes("Подобрать") || text.includes("Wizard") || text.includes("wizard")) {
      issues.push({
        source: rel,
        href,
        resolved: resolveGuideWizardHref(href),
      });
    }
  }
  return issues.filter((i) => !isWizardHref(i.resolved));
}

function walkTsx(dir: string, base = ""): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const rel = join(base, name.name);
    const full = join(dir, name.name);
    if (name.isDirectory() && name.name !== "node_modules" && !name.name.startsWith(".")) {
      out.push(...walkTsx(full, rel));
    } else if (name.isFile() && /\.(tsx|ts)$/.test(name.name)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const guideIssues = auditGuides();
  const componentDirs = [
    join(ROOT, "app/ru"),
    join(ROOT, "components"),
  ];
  const scanIssues: Issue[] = [];
  for (const dir of componentDirs) {
    for (const file of walkTsx(dir)) {
      const rel = file.replace(ROOT + "/", "");
      if (rel.includes("/wizard/")) continue;
      scanIssues.push(...scanFileForLandingCtas(file, rel));
    }
  }

  const all = [...guideIssues];
  console.log("=== Wizard funnel audit ===\n");
  console.log(`Guides checked: ${listGuides().length}`);
  console.log(`Guide CTA issues: ${guideIssues.length}`);

  if (guideIssues.length) {
    console.log("\nGuide issues:");
    for (const issue of guideIssues) {
      console.log(`  ${issue.source}: ${issue.href} → ${issue.resolved}`);
    }
  } else {
    console.log("All guide cta_primary values resolve to wizard ✓");
  }

  const badPrimaries = listGuides().filter((g) => g.cta_primary && !g.cta_primary.includes("/wizard") && g.cta_primary !== "/ru/wizard");
  if (badPrimaries.length) {
    console.log(`\nFrontmatter still without /wizard (${badPrimaries.length}) — OK if resolveGuideWizardHref handles them:`);
    for (const g of badPrimaries) {
      console.log(`  ${g.slug}: ${g.cta_primary} → ${resolveGuideWizardHref(g.cta_primary, g.topic_keys)}`);
    }
  }

  process.exit(guideIssues.length ? 1 : 0);
}

main();
