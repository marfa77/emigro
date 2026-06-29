import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { buildCorridorFacts } from "@/lib/facts/build";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const facts = await buildCorridorFacts(params.slug);
  if (!facts) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }
  return NextResponse.json(facts, { headers: META_CACHE_HEADERS });
}
