import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { getStepTypes } from "@/lib/api/meta-queries";

export async function GET() {
  const types = await getStepTypes();
  return NextResponse.json({ step_types: types }, { headers: META_CACHE_HEADERS });
}
