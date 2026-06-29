import { NextResponse } from "next/server";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { PROGRAM_OUTCOMES } from "@/lib/api/meta-catalog";
import { getEvaluationOutcomes } from "@/lib/api/meta-queries";

export async function GET() {
  const evaluation_outcomes = await getEvaluationOutcomes();
  return NextResponse.json(
    {
      program_outcomes: PROGRAM_OUTCOMES,
      evaluation_outcomes,
    },
    { headers: META_CACHE_HEADERS }
  );
}
