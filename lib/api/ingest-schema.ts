/** JSON Schema for POST /api/v1/knowledge/proposals/batch — minimal live subset. */
export const INGEST_PROPOSAL_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://www.emigro.online/api/v1/meta/ingest-schema",
  title: "EmigroKnowledgeProposal",
  type: "object",
  required: ["entity_type", "operation", "natural_key", "payload", "provenance"],
  properties: {
    entity_type: {
      type: "string",
      enum: [
        "program",
        "program_source",
        "program_requirement",
        "program_cost",
        "program_timeline_step",
        "passport_eligibility",
      ],
    },
    operation: { type: "string", enum: ["create", "update", "refresh", "deprecate"] },
    natural_key: { type: "string", minLength: 1 },
    base_content_hash: { type: "string" },
    payload: { type: "object" },
    previous_snapshot: { type: "object" },
    change_reason: { type: "string" },
    provenance: {
      type: "object",
      required: ["source_url", "raw_excerpt", "source_type", "extracted_at"],
      properties: {
        source_url: { type: "string", format: "uri" },
        raw_excerpt: { type: "string", minLength: 20 },
        source_type: { type: "string", enum: ["official", "embassy", "legislation", "secondary"] },
        extracted_at: { type: "string", format: "date-time" },
        llm_model: { type: "string" },
        pipeline_id: { type: "string" },
        confidence: { type: "number", minimum: 0, maximum: 1 },
      },
      additionalProperties: false,
    },
  },
  additionalProperties: false,
} as const;

export const INGEST_BATCH_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://www.emigro.online/api/v1/meta/ingest-schema",
  title: "EmigroKnowledgeProposalBatch",
  type: "object",
  required: ["proposals"],
  properties: {
    proposals: {
      type: "array",
      minItems: 1,
      maxItems: 50,
      items: INGEST_PROPOSAL_SCHEMA,
    },
  },
  additionalProperties: false,
} as const;
