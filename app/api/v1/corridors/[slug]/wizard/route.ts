import { NextResponse } from "next/server";
import { getCorridorBySlug, getWizardForCorridor } from "@/lib/corridor/queries";

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  const corridor = await getCorridorBySlug(params.slug);
  if (!corridor) {
    return NextResponse.json({ error: "Corridor not found" }, { status: 404 });
  }

  const wizard = await getWizardForCorridor(corridor.id);
  if (!wizard) {
    return NextResponse.json({ error: "Wizard not found" }, { status: 404 });
  }

  return NextResponse.json(wizard);
}
