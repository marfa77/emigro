# Emigro Corridor Update API — Contributor Guide (LLM-friendly, Phase 2)

> **Audience:** human developers, Cursor/Claude agents, automated pipelines.  
> **Goal:** after a corridor is validated, point your LLM at this document → it extracts source-backed corridor updates → submits valid proposals.  
> **Prompt template:** [CONTRIBUTOR_PROMPT.md](./CONTRIBUTOR_PROMPT.md)  
> **Example batch:** [../examples/contributor/portugal-d8-batch.json](../examples/contributor/portugal-d8-batch.json)

---

## 0. Discovery (for agents)

| Resource | URL |
|----------|-----|
| This guide (markdown) | `GET /api/v1/meta/contributor-guide` → markdown body |
| Machine schema | `GET /api/v1/meta/ingest-schema` → JSON Schema |
| Requirement types | `GET /api/v1/meta/requirement-types` |
| Program types | `GET /api/v1/meta/program-types` |
| Countries | `GET /api/v1/meta/countries` |
| Active corridor | `GET /api/v1/corridors/ru-speaking-to-portugal` |
| Corridor programs | `GET /api/v1/corridors/ru-speaking-to-portugal/programs` |
| llms.txt | `GET /llms.txt` |

**Base URL:** `https://api.emigro.io` (staging: `https://api.staging.emigro.io`)

**Auth:** `Authorization: Bearer <EMIGRO_API_KEY>` on all write endpoints.

---

## 1. Agent workflow (step by step)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOAD META                                                │
│    GET /meta/requirement-types, /meta/program-types           │
├─────────────────────────────────────────────────────────────┤
│ 2. DISCOVER CORRIDOR GAPS                                   │
│    GET /corridors/{slug}/programs  → current route set      │
│    GET /corridors/{slug}/gaps      → explicit gap list      │
├─────────────────────────────────────────────────────────────┤
│ 3. FETCH OFFICIAL SOURCE                                    │
│    User URL or MFA / immigration authority only             │
├─────────────────────────────────────────────────────────────┤
│ 4. EXTRACT + PREFLIGHT (per fact)                            │
│    POST /knowledge/exists  →  skip if duplicate             │
├─────────────────────────────────────────────────────────────┤
│ 5. BUILD PROPOSALS (ordered batch)                          │
│    program → source → requirements → costs → passports      │
├─────────────────────────────────────────────────────────────┤
│ 6. SUBMIT                                                   │
│    POST /knowledge/proposals/batch                          │
├─────────────────────────────────────────────────────────────┤
│ 7. REPORT                                                   │
│    Return accepted / duplicate / rejected per item          │
└─────────────────────────────────────────────────────────────┘
```

### Submit order (dependencies)

| Order | entity_type | natural_key pattern |
|-------|-------------|---------------------|
| 1 | `program` | `{program_slug}` |
| 2 | `program_source` | `{program_slug}:source:{id}` |
| 3 | `program_requirement` | `{program_slug}:{requirement_type}` |
| 4 | `program_cost` | `{program_slug}:{cost_type}` |
| 5 | `program_timeline_step` | `{program_slug}:{step_type}:{order}` |
| 6 | `passport_eligibility` | `{program_slug}:{passport_code}` |

---

## 2. Core rules

### 2.1 Proofs (mandatory)

Every proposal **must** include `provenance`:

```json
{
  "source_url": "https://official-government-page.gov/...",
  "raw_excerpt": "Verbatim quote from page proving the value (min 20 characters)",
  "source_type": "official",
  "extracted_at": "2026-06-23T12:00:00Z",
  "llm_model": "your-model-id",
  "pipeline_id": "your-pipeline-name",
  "confidence": 0.92
}
```

| source_type | When to use |
|-------------|-------------|
| `official` | Immigration authority, government portal |
| `embassy` | Embassy / consulate official page |
| `legislation` | Law, decree, gazette |
| `secondary` | News, blog — **avoid**; triggers human review |

**Reject conditions (L0):** missing `source_url`, missing `raw_excerpt`, URL not HTTP 200, excerpt does not contain claimed value.

### 2.2 Operations

| operation | When |
|-----------|------|
| `create` | `GET /exists` returns `exists: false` |
| `update` | value changed; include `base_content_hash` from `GET /entities/{key}` |
| `refresh` | same value, newer verification date or source only |
| `deprecate` | program closed / route removed |

### 2.3 Dedup

- Identical to published → `200 duplicate` — **do not retry**
- `create` on existing key → `409 use_update`
- Always preflight:

```http
GET /api/v1/knowledge/exists?entity_type=program_requirement
    &program_slug=portugal-d8-digital-nomad
    &requirement_type=min_monthly_income_eur
```

```json
{
  "exists": true,
  "published": true,
  "natural_key": "portugal-d8-digital-nomad:min_monthly_income_eur",
  "content_hash": "a1b2c3d4...",
  "current_value": { "operator": ">=", "value": 3480 },
  "hint": "duplicate_if_unchanged | use_update_if_different"
}
```

---

## 3. Endpoints

### 3.1 Meta (read, no auth or public key)

```http
GET /api/v1/meta/contributor-guide     # this document
GET /api/v1/meta/ingest-schema         # JSON Schema for proposals[]
GET /api/v1/meta/requirement-types     # valid requirement_type codes
GET /api/v1/meta/program-types         # CAPITAL, LABOR, BOND, BIRTH
GET /api/v1/meta/countries             # ISO codes
GET /api/v1/meta/step-types
GET /api/v1/meta/outcomes
```

### 3.2 Read published (preflight / updates)

```http
GET /api/v1/programs
GET /api/v1/programs/{slug}
GET /api/v1/knowledge/entities/{natural_key}
GET /api/v1/knowledge/gaps?country=PT&program_type=LABOR
```

**Gaps response** (what LLM should fill):

```json
{
  "country": "PT",
  "gaps": [
    {
      "gap_type": "missing_program",
      "suggested_slug": "portugal-d7-passive-income",
      "program_type": "CAPITAL"
    },
    {
      "gap_type": "missing_passport",
      "program_slug": "portugal-d8-digital-nomad",
      "passport": "IN"
    },
    {
      "gap_type": "missing_requirement",
      "program_slug": "portugal-d8-digital-nomad",
      "requirement_type": "clean_criminal_record"
    }
  ]
}
```

### 3.3 Write (contributor API key)

```http
GET  /api/v1/knowledge/exists
POST /api/v1/knowledge/exists/batch

POST /api/v1/knowledge/proposals          # single
POST /api/v1/knowledge/proposals/batch    # recommended, max 50

GET  /api/v1/knowledge/proposals          # your proposals
GET  /api/v1/knowledge/proposals/{id}
```

**Headers:**

```
Authorization: Bearer <api_key>
Content-Type: application/json
Idempotency-Key: <uuid>          # required on batch
X-Pipeline-Id: pt-labor-v1       # optional, for analytics
```

---

## 4. Entity schemas

### 4.1 `program`

```json
{
  "entity_type": "program",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad",
  "payload": {
    "slug": "portugal-d8-digital-nomad",
    "country_code": "PT",
    "program_type": "LABOR",
    "outcome": "residency",
    "evaluation_mode": "threshold",
    "title_i18n": { "en": "Portugal D8 Digital Nomad Visa" },
    "summary_i18n": { "en": "..." },
    "eligibility_rules": { "and": [ "... JSON Logic using profile paths ..." ] },
    "program_subtypes": ["nomad"],
    "status": "draft"
  },
  "provenance": { "...": "..." }
}
```

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | kebab-case, unique globally |
| `program_type` | enum | `CAPITAL` \| `LABOR` \| `BOND` \| `BIRTH` |
| `outcome` | enum | `temporary` \| `residency` \| `pr` \| `citizenship_direct` \| `citizenship_path` |
| `eligibility_rules` | JSON Logic | refs: `core.*`, `capital.*`, `labor.*`, `bond.*`, `birth.*` |

**Profile paths for JSON Logic:**

```
core.citizenship, core.age, core.criminal_record, core.destination_countries
capital.liquid_assets_eur, capital.willing_to_invest_eur, capital.passive_income_monthly_eur
labor.employment_type, labor.monthly_income_eur, labor.employer_country
bond.spouse_citizenship, bond.marriage_duration_months, bond.ancestor_country
birth.planning, birth.due_month, birth.budget_usd
```

### 4.2 `program_source`

```json
{
  "entity_type": "program_source",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad:source:aima",
  "payload": {
    "program_slug": "portugal-d8-digital-nomad",
    "url": "https://aima.gov.pt/...",
    "title_i18n": { "en": "AIMA — Digital nomad visa" },
    "source_type": "official",
    "is_primary": true
  },
  "provenance": { "...": "..." }
}
```

**Required:** at least one `is_primary: true` official source per program before activation.

### 4.3 `program_requirement`

```json
{
  "entity_type": "program_requirement",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad:min_monthly_income_eur",
  "payload": {
    "program_slug": "portugal-d8-digital-nomad",
    "requirement_type": "min_monthly_income_eur",
    "operator": ">=",
    "value": 3480,
    "effective_from": "2026-01-01"
  },
  "provenance": { "...": "..." }
}
```

**Operators:** `>=`, `<=`, `==`, `!=`, `in`, `not_in`

**Common requirement_type codes** (load full list from meta):

| code | value example |
|------|---------------|
| `min_investment_eur` | 500000 |
| `min_monthly_income_eur` | 3480 |
| `min_age` | 18 |
| `max_age` | 55 |
| `clean_criminal_record` | true |
| `language_level` | "A2" |
| `remote_work` | true |
| `marriage_duration_months` | 24 |
| `ancestor_generations` | 3 |

Do **not** invent codes — fetch `GET /meta/requirement-types` first.

### 4.4 `program_cost`

```json
{
  "entity_type": "program_cost",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad:government_fee",
  "payload": {
    "program_slug": "portugal-d8-digital-nomad",
    "cost_type": "government_fee",
    "amount": 90,
    "currency": "EUR",
    "notes_i18n": { "en": "Visa application fee" }
  },
  "provenance": { "...": "..." }
}
```

**cost_type:** `government_fee`, `legal_estimate`, `min_investment`, `health_insurance_annual`, `other`

### 4.5 `program_timeline_step`

```json
{
  "entity_type": "program_timeline_step",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad:application_prep:2",
  "payload": {
    "program_slug": "portugal-d8-digital-nomad",
    "step_type": "application_prep",
    "order_index": 2,
    "duration_days_min": 14,
    "duration_days_max": 30,
    "notes_i18n": { "en": "Gather documents and apply at consulate" }
  },
  "provenance": { "...": "..." }
}
```

**step_type:** load from `GET /meta/step-types` — e.g. `eligibility_check`, `document_gathering`, `application_prep`, `submission`, `biometrics`, `language_requirement`, `relocation`

### 4.6 `passport_eligibility`

```json
{
  "entity_type": "passport_eligibility",
  "operation": "create",
  "natural_key": "portugal-d8-digital-nomad:RU",
  "payload": {
    "program_slug": "portugal-d8-digital-nomad",
    "applicant_passport": "RU",
    "status": "eligible",
    "conditions": ["standard_requirements_met"],
    "notes_i18n": { "en": "Apply at Portuguese consulate" }
  },
  "provenance": { "...": "..." }
}
```

**status:** `eligible` | `blocked` | `conditional` | `unknown`

Submit **one row per passport** you have evidence for. Use `GET /knowledge/gaps` to see missing passports.

### 4.7 `update` example

```json
{
  "entity_type": "program_requirement",
  "operation": "update",
  "natural_key": "portugal-golden-visa:min_investment_eur",
  "base_content_hash": "from GET /knowledge/entities/{key}",
  "payload": {
    "program_slug": "portugal-golden-visa",
    "requirement_type": "min_investment_eur",
    "operator": ">=",
    "value": 500000
  },
  "previous_snapshot": { "operator": ">=", "value": 400000 },
  "change_reason": "Threshold updated per AIMA 2026 bulletin",
  "provenance": { "...": "..." }
}
```

---

## 5. Batch submit

```http
POST /api/v1/knowledge/proposals/batch
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

```json
{
  "proposals": [ "... array of proposal objects ..." ]
}
```

**Response:**

```json
{
  "idempotency_key": "550e8400-e29b-41d4-a716-446655440000",
  "results": [
    {
      "index": 0,
      "natural_key": "portugal-d8-digital-nomad",
      "status": "accepted",
      "code": "accepted",
      "proposal_id": "uuid",
      "review_tier": "T1"
    },
    {
      "index": 2,
      "natural_key": "portugal-d8-digital-nomad:min_monthly_income_eur",
      "status": "duplicate",
      "code": "duplicate",
      "message": "Identical to published entity"
    }
  ],
  "summary": { "accepted": 3, "duplicate": 1, "rejected": 0 }
}
```

---

## 6. Response codes

| HTTP | code | Agent action |
|------|------|--------------|
| 201 | `accepted` | Log proposal_id; wait for review |
| 200 | `duplicate` | Skip; do not retry |
| 200 | `refresh_applied` | Verification bumped |
| 409 | `use_update` | Change operation to `update` |
| 409 | `duplicate_pending` | Skip or wait |
| 409 | `stale_base` | Re-fetch entity; resubmit update |
| 422 | `validation_error` | Fix fields in `errors[]` |
| 422 | `missing_provenance` | Add source_url + raw_excerpt |
| 422 | `unknown_requirement_type` | Use code from /meta/requirement-types |

---

## 7. LLM extraction checklist

Before adding to batch, verify each fact:

- [ ] Value appears verbatim (or clearly) in `raw_excerpt`
- [ ] `source_url` is official (.gov, aima.gov.pt, homeoffice.gov.uk, etc.)
- [ ] `requirement_type` exists in meta API
- [ ] `natural_key` matches pattern for entity_type
- [ ] Preflight returned `exists: false` (for create)
- [ ] JSON Logic vars match profile paths (§4.1)
- [ ] Numbers include currency / unit where applicable
- [ ] No legal advice language in payload — facts only

---

## 8. Example agent script (pseudocode)

```python
BASE = os.environ["EMIGRO_BASE_URL"]
KEY = os.environ["EMIGRO_API_KEY"]
headers = {"Authorization": f"Bearer {KEY}"}

# 1. Load valid requirement types
req_types = get(f"{BASE}/api/v1/meta/requirement-types", headers=headers).json()

# 2. Check gaps
gaps = get(f"{BASE}/api/v1/knowledge/gaps?country=PT", headers=headers).json()

# 3. LLM extracts facts from official_url → list[Proposal]
facts = llm_extract(official_url, req_types, schema_url=f"{BASE}/api/v1/meta/ingest-schema")

# 4. Preflight + filter
batch = []
for fact in facts:
    exists = get(f"{BASE}/api/v1/knowledge/exists", params=fact.preflight_params, headers=headers).json()
    if exists["hint"] == "duplicate_if_unchanged":
        continue
    batch.append(fact.to_proposal(operation="update" if exists["exists"] else "create"))

# 5. Submit
r = post(f"{BASE}/api/v1/knowledge/proposals/batch",
         json={"proposals": batch},
         headers={**headers, "Idempotency-Key": str(uuid4())})
return r.json()
```

---

## 9. Cursor / Claude setup

1. Copy [CONTRIBUTOR_PROMPT.md](./CONTRIBUTOR_PROMPT.md) → system prompt or `.cursor/rules/emigro-contributor.mdc`
2. Set env: `EMIGRO_API_KEY`, `EMIGRO_BASE_URL`
3. User task:

```
Read https://api.emigro.io/api/v1/meta/contributor-guide
Extract all facts from {OFFICIAL_URL} for program slug portugal-d8-digital-nomad
Preflight each. Submit batch. Report summary.
```

4. Reference example: `examples/contributor/portugal-d8-batch.json`

---

## 10. Rate limits

| Tier | Requests/min | Batch size |
|------|--------------|------------|
| New contributor | 30 | 20 |
| reputation > 50 | 60 | 50 |
| reputation > 200 | 120 | 50 |

---

## 11. What happens after submit

```
proposal → L0 dedup + provenance check
        → L1 Model A (excerpt matches value?)
        → L2 Model B (independent confirm)
        → L3 peer (T2+)
        → L4 human (T3/T4)
        → published → live on site + attribution locked
```

Contributor earns revshare when providers pay for clicks on attributed programs. See [MONETIZATION.md](./MONETIZATION.md).

---

*Version: 1.0 · 2026-06-23*
