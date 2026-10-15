import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { investPdfFileName, verifyInvestPdfSignature } from "@/lib/investment/pdf-link";
import type { InvestLocale } from "@/lib/investment/golden-visa-2026";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Literal paths: a computed path makes the file tracer pull the whole repo into the function.
const PDF_FILES: Record<InvestLocale, string> = {
  ru: join(process.cwd(), "private/assist/emigro_golden_visa_2026_comparison_ru.pdf"),
  en: join(process.cwd(), "private/assist/emigro_golden_visa_2026_comparison_en.pdf"),
};

const PRIVATE_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "private, no-store",
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const localeRaw = params.get("locale");
  const locale: InvestLocale | null = localeRaw === "ru" || localeRaw === "en" ? localeRaw : null;
  if (!locale || !verifyInvestPdfSignature(locale, params.get("exp"), params.get("sig"))) {
    return NextResponse.json({ error: "Link expired or invalid" }, { status: 403, headers: PRIVATE_HEADERS });
  }

  const fileName = investPdfFileName(locale);
  const file = await readFile(PDF_FILES[locale]);
  return new NextResponse(new Uint8Array(file), {
    status: 200,
    headers: {
      ...PRIVATE_HEADERS,
      "Content-Type": "application/pdf",
      "Content-Length": String(file.length),
      "Content-Disposition": `inline; filename="${fileName}"`,
    },
  });
}
