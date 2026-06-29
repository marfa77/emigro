import { NextResponse } from "next/server";
import { INGEST_BATCH_SCHEMA } from "@/lib/api/ingest-schema";

export async function GET() {
  return NextResponse.json(INGEST_BATCH_SCHEMA, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
