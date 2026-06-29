import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { getCountries } from "@/lib/api/meta-queries";

export async function GET() {
  const countries = await getCountries();
  return NextResponse.json({ countries }, { headers: META_CACHE_HEADERS });
}
