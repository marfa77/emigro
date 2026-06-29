import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { buildProgramFacts } from "@/lib/facts/build";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const facts = await buildProgramFacts(params.slug);
  if (!facts) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }
  return NextResponse.json(facts, { headers: META_CACHE_HEADERS });
}
