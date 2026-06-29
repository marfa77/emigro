import { NextResponse } from "next/server";
import {
  COST_TYPES,
  ENTITY_TYPES,
  PASSPORT_ELIGIBILITY_STATUSES,
  PROPOSAL_OPERATIONS,
  SOURCE_TYPES,
} from "@/lib/api/meta-catalog";
import { META_CACHE_HEADERS } from "@/lib/api/meta-cache";
import { getCorridorMetaSchema } from "@/lib/api/meta-queries";

export async function GET() {
  return NextResponse.json(
    {
      corridors: getCorridorMetaSchema(),
      enums: {
        entity_types: ENTITY_TYPES,
        proposal_operations: PROPOSAL_OPERATIONS,
        source_types: SOURCE_TYPES,
        cost_types: COST_TYPES,
        passport_eligibility_statuses: PASSPORT_ELIGIBILITY_STATUSES,
      },
    },
    { headers: META_CACHE_HEADERS }
  );
}
