import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { getProgramTypes } from "@/lib/api/meta-queries";

export async function GET() {
  const types = await getProgramTypes();
  return NextResponse.json({ program_types: types }, { headers: META_CACHE_HEADERS });
}
