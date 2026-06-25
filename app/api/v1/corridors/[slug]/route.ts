import { NextResponse } from "next/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }
  return NextResponse.json(corridor);
}
