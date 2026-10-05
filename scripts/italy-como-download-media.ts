/**
 * Resolve Wikimedia Commons originals for the Lake Como editorial set,
 * reject anything that is not the expected reusable licence, and write local WebP files.
 *
 *   npm run italy:download-como-media
 *   npm run italy:download-como-media -- --search "Sacro Monte Ossuccio"
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { COMO_MEDIA_MANIFEST, type ComoSourceAsset } from "./italy-como-media-manifest";

const OUT_DIR = path.join(process.cwd(), "public/images/como/editorial");
const AUDIT_PATH = path.join(process.cwd(), "scripts/output/italy-como-media-audit.json");
const MIN_WIDTH = 1200;
const MIN_BYTES = 70 * 1024;
const RESIZE_WIDTH = 1800;
const WEBP_QUALITY = 82;
const USER_AGENT =
  "EmigroComoMedia/1.0 (https://italy.emigro.online; Lake Como editorial media; reusable Commons files only)";

type ExtValue = { value?: string };

export type CommonsImageInfo = {
  url?: string;
  descriptionurl?: string;
  width?: number;
  height?: number;
  size?: number;
  extmetadata?: Record<string, ExtValue | undefined>;
};

export type CommonsPage = {
  title?: string;
  missing?: string;
  invalid?: string;
  imageinfo?: CommonsImageInfo[];
};

export type ResolvedCommonsFile = {
  ok: true;
  canonicalTitle: string;
  sourcePage: string;
  originalUrl: string;
  author: string;
  artistHtml: string;
  license: string;
  licenseUrl: string;
  usageTerms: string;
  restrictions: string;
};

export type RejectedCommonsFile = {
  ok: false;
  reason: string;
  canonicalTitle: string | null;
  sourcePage: string | null;
  author: string | null;
  license: string | null;
  licenseUrl: string | null;
};

export type CommonsResolution = ResolvedCommonsFile | RejectedCommonsFile;

export type ComoMediaAuditRow = {
  id: string;
  status: "ok" | "rejected";
  fileTitle: string;
  canonicalTitle: string | null;
  output: string;
  sourcePage: string | null;
  originalUrl: string | null;
  author: string | null;
  artistHtml: string | null;
  license: string | null;
  licenseUrl: string | null;
  usageTerms: string | null;
  restrictions: string | null;
  width: number | null;
  height: number | null;
  bytes: number | null;
  reason: string | null;
};

export type ComoMediaAudit = {
  generatedAt: string;
  minWidth: number;
  minBytes: number;
  resizeWidth: number;
  webpQuality: number;
  rows: ComoMediaAuditRow[];
};

export function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Prefer the Commons user-link name over attribution banners and HTML. */
export function artistCredit(html: string): string {
  const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  for (const anchor of anchors) {
    const attrs = anchor[1] ?? "";
    const text = stripHtml(anchor[2] ?? "");
    if (!text || text.length > 80) continue;
    if (/title="User:/i.test(attrs) || /\/wiki\/User:/i.test(attrs)) {
      return text.replace(/^User:/i, "").trim();
    }
  }
  for (const anchor of anchors) {
    const attrs = anchor[1] ?? "";
    const text = stripHtml(anchor[2] ?? "");
    if (!text || text.length > 80) continue;
    if (/title="File:/i.test(attrs)) continue;
    return text;
  }
  const plain = stripHtml(html);
  const belongs = plain.match(/belongs to\s+(.{2,80}?)\s*\./i);
  if (belongs?.[1]) return belongs[1].trim();
  return plain;
}

export function metaText(
  meta: Record<string, ExtValue | undefined> | undefined,
  key: string,
): string {
  return stripHtml(meta?.[key]?.value ?? "");
}

export function buildImageInfoUrl(fileTitle: string): URL {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|extmetadata|size");
  api.searchParams.set("titles", fileTitle);
  api.searchParams.set("origin", "*");
  return api;
}

export function normalizeHttpUrl(value: string | null | undefined): string | null {
  const trimmed = stripHtml(value ?? "");
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^https:\/\//i.test(trimmed)) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return `https://${trimmed.slice("http://".length)}`;
  return null;
}

function isCommonsUploadUrl(value: string): boolean {
  try {
    return new URL(value).hostname === "upload.wikimedia.org";
  } catch {
    return false;
  }
}

/** Commons imageinfo does not emit CanonicalTitle; the query page title is the canonical file title. */
export function canonicalTitleFromPage(page: CommonsPage): string | null {
  const fromMeta = metaText(page.imageinfo?.[0]?.extmetadata, "CanonicalTitle");
  if (fromMeta) return fromMeta;
  const title = page.title?.trim();
  return title || null;
}

export function licenceRejection(license: string, expected: RegExp): string | null {
  if (!license) return "missing LicenseShortName";
  if (/\bNC\b|non-?commercial|\bND\b|no ?derivatives|all rights reserved|fair use/i.test(license)) {
    return `non-reusable licence "${license}"`;
  }
  if (!/^(CC BY-SA|CC BY|CC0|Public domain|PDM|CC PDM)\b/i.test(license)) {
    return `licence "${license}" is not an accepted CC or public-domain short name`;
  }
  if (!expected.test(license)) {
    return `licence "${license}" does not match ${expected}`;
  }
  return null;
}

export function outputMeetsEditorialGate(width: number, bytes: number): boolean {
  return width >= MIN_WIDTH && bytes >= MIN_BYTES;
}

export function resolveCommonsPage(page: CommonsPage, asset: ComoSourceAsset): CommonsResolution {
  const canonicalTitle = canonicalTitleFromPage(page);
  if (page.missing !== undefined || page.invalid !== undefined || !page.imageinfo?.length) {
    return {
      ok: false,
      reason: `Commons has no file for ${asset.fileTitle}`,
      canonicalTitle,
      sourcePage: null,
      author: null,
      license: null,
      licenseUrl: null,
    };
  }

  const info = page.imageinfo[0];
  const meta = info.extmetadata;
  const license = metaText(meta, "LicenseShortName");
  const artistHtml = meta?.Artist?.value ?? "";
  const author = artistCredit(artistHtml);
  const licenseUrl = normalizeHttpUrl(meta?.LicenseUrl?.value);
  const sourcePage = normalizeHttpUrl(info.descriptionurl);
  const originalUrl = normalizeHttpUrl(info.url?.split("?")[0] ?? info.url);
  const restrictions = metaText(meta, "Restrictions");
  const usageTerms = metaText(meta, "UsageTerms");
  const licenceProblem = licenceRejection(license, asset.expectedLicense);

  if (licenceProblem) {
    return {
      ok: false,
      reason: licenceProblem,
      canonicalTitle,
      sourcePage,
      author: author || null,
      license: license || null,
      licenseUrl,
    };
  }
  if (restrictions) {
    return {
      ok: false,
      reason: `file page records extra restrictions: ${restrictions}`,
      canonicalTitle,
      sourcePage,
      author: author || null,
      license,
      licenseUrl,
    };
  }
  if (!licenseUrl) {
    return {
      ok: false,
      reason: `file page has no licence URL for "${license}"`,
      canonicalTitle,
      sourcePage,
      author: author || null,
      license,
      licenseUrl: null,
    };
  }
  if (!author) {
    return {
      ok: false,
      reason: "file page has no Artist credit",
      canonicalTitle,
      sourcePage,
      author: null,
      license,
      licenseUrl,
    };
  }
  if (!sourcePage || !sourcePage.startsWith("https://commons.wikimedia.org/wiki/File:")) {
    return {
      ok: false,
      reason: "file page URL is missing",
      canonicalTitle,
      sourcePage,
      author,
      license,
      licenseUrl,
    };
  }
  if (!originalUrl || !isCommonsUploadUrl(originalUrl)) {
    return {
      ok: false,
      reason: "original URL is not on upload.wikimedia.org",
      canonicalTitle,
      sourcePage,
      author,
      license,
      licenseUrl,
    };
  }

  return {
    ok: true,
    canonicalTitle: canonicalTitle ?? asset.fileTitle,
    sourcePage,
    originalUrl,
    author,
    artistHtml,
    license,
    licenseUrl,
    usageTerms,
    restrictions,
  };
}

async function commonsFetch(url: URL): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
      "Api-User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`Commons API ${response.status} for ${url.searchParams.get("titles") ?? url.searchParams.get("gsrsearch")}`);
  }
  return response.json();
}

export function firstCommonsPage(payload: unknown): CommonsPage | null {
  if (!payload || typeof payload !== "object") return null;
  const query = (payload as { query?: { pages?: Record<string, CommonsPage> } }).query;
  const pages = query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page ?? null;
}

async function downloadOriginal(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!response.ok) throw new Error(`download ${response.status}`);
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType && !/^image\//i.test(contentType)) {
    throw new Error(`download content-type ${contentType}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function toEditorialWebp(input: Buffer): Promise<{ webp: Buffer; width: number; height: number }> {
  const webp = await sharp(input)
    .rotate()
    .resize({ width: RESIZE_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
  const meta = await sharp(webp).metadata();
  return { webp, width: meta.width ?? 0, height: meta.height ?? 0 };
}

function emptyRow(asset: ComoSourceAsset, reason: string): ComoMediaAuditRow {
  return {
    id: asset.id,
    status: "rejected",
    fileTitle: asset.fileTitle,
    canonicalTitle: null,
    output: asset.output,
    sourcePage: null,
    originalUrl: null,
    author: null,
    artistHtml: null,
    license: null,
    licenseUrl: null,
    usageTerms: null,
    restrictions: null,
    width: null,
    height: null,
    bytes: null,
    reason,
  };
}

async function acquire(asset: ComoSourceAsset): Promise<ComoMediaAuditRow> {
  const payload = await commonsFetch(buildImageInfoUrl(asset.fileTitle));
  const page = firstCommonsPage(payload);
  if (!page) return emptyRow(asset, "Commons query returned no page");

  const resolved = resolveCommonsPage(page, asset);
  if (!resolved.ok) {
    return {
      ...emptyRow(asset, resolved.reason),
      canonicalTitle: resolved.canonicalTitle,
      sourcePage: resolved.sourcePage,
      author: resolved.author,
      license: resolved.license,
      licenseUrl: resolved.licenseUrl,
    };
  }

  const destination = path.join(OUT_DIR, asset.output);
  try {
    const original = await downloadOriginal(resolved.originalUrl);
    const { webp, width, height } = await toEditorialWebp(original);
    if (!outputMeetsEditorialGate(width, webp.length)) {
      if (fs.existsSync(destination)) fs.unlinkSync(destination);
      return {
        id: asset.id,
        status: "rejected",
        fileTitle: asset.fileTitle,
        canonicalTitle: resolved.canonicalTitle,
        output: asset.output,
        sourcePage: resolved.sourcePage,
        originalUrl: resolved.originalUrl,
        author: resolved.author,
        artistHtml: resolved.artistHtml,
        license: resolved.license,
        licenseUrl: resolved.licenseUrl,
        usageTerms: resolved.usageTerms,
        restrictions: resolved.restrictions,
        width,
        height,
        bytes: webp.length,
        reason: `output ${width}px / ${webp.length} bytes is below ${MIN_WIDTH}px or ${MIN_BYTES} bytes`,
      };
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(destination, webp);
    return {
      id: asset.id,
      status: "ok",
      fileTitle: asset.fileTitle,
      canonicalTitle: resolved.canonicalTitle,
      output: asset.output,
      sourcePage: resolved.sourcePage,
      originalUrl: resolved.originalUrl,
      author: resolved.author,
      artistHtml: resolved.artistHtml,
      license: resolved.license,
      licenseUrl: resolved.licenseUrl,
      usageTerms: resolved.usageTerms,
      restrictions: resolved.restrictions,
      width,
      height,
      bytes: webp.length,
      reason: null,
    };
  } catch (error) {
    if (fs.existsSync(destination)) fs.unlinkSync(destination);
    const message = error instanceof Error ? error.message : String(error);
    return {
      id: asset.id,
      status: "rejected",
      fileTitle: asset.fileTitle,
      canonicalTitle: resolved.canonicalTitle,
      output: asset.output,
      sourcePage: resolved.sourcePage,
      originalUrl: resolved.originalUrl,
      author: resolved.author,
      artistHtml: resolved.artistHtml,
      license: resolved.license,
      licenseUrl: resolved.licenseUrl,
      usageTerms: resolved.usageTerms,
      restrictions: resolved.restrictions,
      width: null,
      height: null,
      bytes: null,
      reason: message,
    };
  }
}

async function searchCommons(query: string): Promise<void> {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrsearch", query);
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "12");
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|extmetadata|size");
  api.searchParams.set("origin", "*");

  const payload = await commonsFetch(api);
  const pages = (payload as { query?: { pages?: Record<string, CommonsPage> } }).query?.pages ?? {};
  const rows = Object.values(pages);
  if (rows.length === 0) {
    console.log(`No Commons files for: ${query}`);
    return;
  }
  for (const page of rows) {
    const info = page.imageinfo?.[0];
    const license = metaText(info?.extmetadata, "LicenseShortName") || "(no licence)";
    const author = metaText(info?.extmetadata, "Artist") || "(no artist)";
    const width = info?.width ?? 0;
    const reusable = licenceRejection(license, /^(CC BY-SA|CC BY|CC0|Public domain|PDM|CC PDM)\b/i);
    console.log(
      [
        reusable ? "REJECT" : "CANDIDATE",
        page.title ?? "(untitled)",
        license,
        `${width}px`,
        author,
        info?.descriptionurl ?? "",
      ].join(" | "),
    );
  }
}

function writeAudit(rows: ComoMediaAuditRow[]): void {
  const audit: ComoMediaAudit = {
    generatedAt: new Date().toISOString(),
    minWidth: MIN_WIDTH,
    minBytes: MIN_BYTES,
    resizeWidth: RESIZE_WIDTH,
    webpQuality: WEBP_QUALITY,
    rows,
  };
  fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
  fs.writeFileSync(AUDIT_PATH, `${JSON.stringify(audit, null, 2)}\n`);
}

async function main(): Promise<void> {
  const searchFlag = process.argv.indexOf("--search");
  if (searchFlag !== -1) {
    const query = process.argv.slice(searchFlag + 1).join(" ").trim();
    if (!query) throw new Error("Pass a subject query after --search");
    await searchCommons(query);
    return;
  }

  const rows: ComoMediaAuditRow[] = [];
  for (const asset of COMO_MEDIA_MANIFEST) {
    try {
      const row = await acquire(asset);
      rows.push(row);
      if (row.status === "ok") {
        console.log(
          `OK ${row.id} ${row.license} ${row.output} ${row.width}x${row.height} ${row.bytes}B`,
        );
      } else {
        console.error(`REJECT ${row.id}: ${row.reason}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      rows.push(emptyRow(asset, message));
      console.error(`REJECT ${asset.id}: ${message}`);
    }
  }

  writeAudit(rows);
  const rejected = rows.filter((row) => row.status !== "ok");
  if (rejected.length > 0) {
    throw new Error(`${rejected.length} asset(s) rejected; see ${path.relative(process.cwd(), AUDIT_PATH)}`);
  }
  console.log(`Wrote ${rows.length} editorial WebP files and ${path.relative(process.cwd(), AUDIT_PATH)}`);
}

const invoked = process.argv[1] ?? "";
if (invoked.endsWith("italy-como-download-media.ts")) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
