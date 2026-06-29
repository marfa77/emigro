import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { enrichCorridorFactsList } from "@/lib/facts/build";

export async function GET() {
  const body = await enrichCorridorFactsList();
  return NextResponse.json(body, { headers: META_CACHE_HEADERS });
}
