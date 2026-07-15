import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { listGuides } from "@/lib/guides/load";
import { resolveGuideWizardHref, isWizardHref } from "@/lib/wizard/resolve-href";
import type { FunnelIssue } from "./types";

const ROOT = join(process.cwd());

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

function auditGuides(): FunnelIssue[] {
  const issues: FunnelIssue[] = [];
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

function scanFileForLandingCtas(filePath: string, rel: string): FunnelIssue[] {
  const text = readFileSync(filePath, "utf8");
  const issues: FunnelIssue[] = [];
  const hrefRe = /href=["'](\/ru\/[a-z][a-z-]*)(?:\?[^"']*)?["']/g;
  let match: RegExpExecArray | null;
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

  while ((match = hrefRe.exec(text)) !== null) {
    const href = match[1];
    if (href === "/ru/wizard" || href.includes("/wizard")) continue;
    const segment = href.replace("/ru/", "");
    if (skipSegments.has(segment)) continue;
    if (text.includes("Подобрать") || text.includes("Wizard") || text.includes("wizard")) {
      const resolved = resolveGuideWizardHref(href);
      if (!isWizardHref(resolved)) {
        issues.push({ source: rel, href, resolved });
      }
    }
  }
  return issues;
}

export function runFunnelChecks(): { issues: FunnelIssue[]; guidesChecked: number } {
  const guideIssues = auditGuides();
  const componentDirs = [join(ROOT, "app/ru"), join(ROOT, "components")];
  const scanIssues: FunnelIssue[] = [];

  for (const dir of componentDirs) {
    for (const file of walkTsx(dir)) {
      const rel = file.replace(ROOT + "/", "");
      if (rel.includes("/wizard/")) continue;
      scanIssues.push(...scanFileForLandingCtas(file, rel));
    }
  }

  const deduped = new Map<string, FunnelIssue>();
  for (const issue of [...guideIssues, ...scanIssues]) {
    deduped.set(`${issue.source}:${issue.href}`, issue);
  }

  return {
    issues: Array.from(deduped.values()),
    guidesChecked: listGuides().length,
  };
}
