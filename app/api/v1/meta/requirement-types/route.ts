import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { getRequirementTypes } from "@/lib/api/meta-queries";

export async function GET() {
  const types = await getRequirementTypes();
  return NextResponse.json({ requirement_types: types }, { headers: META_CACHE_HEADERS });
}
