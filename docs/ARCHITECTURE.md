# Emigro — Corridor-First Architecture

> Live relocation corridors — source-backed scoring, corridor digests, and local provider handoff for specific applicant audiences.
>
> Status: **IDEA / design phase** — this document captures architecture decisions from planning sessions.
>
> **Detailed DB & API:** [SCHEMA_AND_API.md](./SCHEMA_AND_API.md) — full tables, endpoints, extension cookbook (no hardcode).
>
> **LLM contributor API:** [API_CONTRIBUTOR_GUIDE.md](./API_CONTRIBUTOR_GUIDE.md) · [CONTRIBUTOR_PROMPT.md](./CONTRIBUTOR_PROMPT.md)
>
> **Audit & MVP cut:** [AUDIT.md](./AUDIT.md)
>
> **Market failure pre-mortem:** [MARKET_FAILURE_AUDIT.md](./MARKET_FAILURE_AUDIT.md)
>
> **Launch philosophy:** [CORRIDOR_STRATEGY.md](./CORRIDOR_STRATEGY.md) — corridor-first, starting with RU-speaking → Portugal.

---

## 1. Product summary

**Emigro** is a corridor-first relocation navigator. It starts with one deep corridor — **Russian-speaking applicants with RU/BY/UA/KZ passports moving to Portugal** — and expands corridor by corridor. The user completes a wizard about passport, goals, finances, work, family, and timeline — without choosing a single path. The engine checks the profile in parallel across all axes (labor, capital, family ties, later birth citizenship) and shows all matching routes with cost, timeline, complexity, official sources, and local provider handoff.

Under the hood: a **universal engine** and **knowledge base** instead of hardcoded content. Programs, requirements, passport restrictions, corridor digests, roadmap steps, and providers live in the database. The same engine can support Spain, France, LATAM, or francophone corridors later, but launch and distribution are corridor-specific. **Users pay nothing.** In MVP, we manually connect qualified applicants to local providers; marketplace billing and contributor revshare come after corridor validation.

---

## 2. Core principle: corridors first, engine underneath

```
┌─────────────────────────────────────────────────────────┐
│  CORRIDOR PRODUCT (public surface)                      │
│  RU-speaking → Portugal · digest · wizard · providers   │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  PRESENTATION (Next.js)                                 │
│  Corridor landing · Wizard · Results · Roadmap · Leads  │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  ENGINE (internal, reusable)                            │
│  Rule Evaluator · Wizard Runner · Roadmap Builder       │
│  Manual Lead Handoff · later Provider Matcher           │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  CORRIDOR KNOWLEDGE BASE (PostgreSQL)                   │
│  Corridors · Programs · Proofs · Passports · Digest     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│  OPERATIONS + INGESTION                                 │
│  CIPLE migration · Manual updates · later contributor API│
└─────────────────────────────────────────────────────────┘
```

The public product starts from a corridor (`ru-speaking-to-portugal`), not from a global list of visas. The engine remains generic: it evaluates programs selected by the active corridor, using rules and proofs from the database.

---

## 2.1 Mandatory proofs (sources) — non-negotiable

**Every factual claim about a program must link to a proof.** No source → no publish. This is core product trust, not optional metadata.

### What counts as a proof

| Field | Required | Purpose |
|-------|----------|---------|
| `source_url` | ✅ | Link user can open (official page, embassy, gazette, PDF) |
| `raw_excerpt` | ✅ on ingest | Quote/snippet proving the extracted value |
| `last_verified` | ✅ | When we last confirmed URL still supports the claim |
| `source_type` | ✅ | `official` · `embassy` · `legislation` · `secondary` |

**Preferred:** `official` / `legislation` (MFA, immigration authority, government gazette).  
**`secondary`** (news, blogs) — allowed only with T2+ human review; never sole source for costs or passport blocks.

### Where proofs are mandatory

| Entity | Minimum |
|--------|---------|
| **Program** | ≥1 `program_sources` (official) before `status = active` |
| **Each requirement** | `source_url` + excerpt per row |
| **Each cost** | `source_url` + excerpt |
| **Passport eligibility** | `source_url` + excerpt per passport × program |
| **Timeline step** (if factual) | source or inherit from program version |
| **Scoring output** | every matched/failed rule includes `source_url` from requirement |
| **Contributor proposal** | `provenance.source_url` — auto-reject without |

### Publish gate

```
program can go active ONLY IF:
  ✓ ≥1 official program_sources
  ✓ all requirements in published version have source_url
  ✓ all passport_eligibility rows have source_url
  ✓ all costs have source_url
```

### UI (always visible)

- **Program page:** «Sources» block — list of official links + last verified
- **Wizard results:** each criterion — ✓/✗ + «Source» link + verified date
- **Compare table:** footnote «Data as of {last_verified}»
- **Roadmap steps:** link to relevant official checklist where applicable

Disclaimer on every page: *Informational only, not legal advice. Verify with official source before acting.*

### Ingestion

- L0: reject proposal without `source_url` + `raw_excerpt`
- L1/L2: verify excerpt supports claimed value
- Stale source (>90 days on high-risk fields) → flag for re-verification

See [SCHEMA_AND_API.md §2.2](./SCHEMA_AND_API.md) for schema constraints.

---

## 3. Program types (internal route taxonomy)

Program types are internal route taxonomy used inside corridors. They are **not** public product categories and not a promise to cover the whole world.

| # | Type | Code | Covers |
|---|------|------|--------|
| 1 | Capital | `CAPITAL` | Golden Visa, CBI/RBI, business/real estate investment, passive income / retirement thresholds |
| 2 | Labor | `LABOR` | Work visa, Blue Card, digital nomad, startup/entrepreneur, intra-company, study → work path |
| 3 | Bond | `BOND` | Family reunification, marriage, ancestry / jus sanguinis |
| 4 | Birth | `BIRTH` | Jus soli — citizenship for child at birth; separate parent path rules |
| 5 | Special | `SPECIAL` | Humanitarian, talent visas — **Phase 2**, non-monetizable routes |

**MVP-A corridor:** use 3 types only — `LABOR`, `CAPITAL`, `BOND`. `BIRTH` and `SPECIAL` are deferred until a corridor requires them and legal review is ready.

### Secondary dimensions (where diversity lives)

Do not add more top-level types. Use:

| Dimension | Examples |
|-----------|----------|
| `program_subtype` | nomad, sponsored, startup, passive_income, cbi, golden_visa, descent, spouse |
| `outcome` | temporary · residency · permanent_residency · citizenship_direct · citizenship_path |
| `evaluation_mode` | threshold · points_based · checklist · lottery |
| `requirement_slots` | ~25–40 typed keys, grows with new programs |

**Combinatorics:** 4 types × ~8 subtypes × 5 outcomes × 4 eval modes × 30 requirements = thousands of combinations without exploding enums in code.

### BIRTH type (birth tourism)

Separate from CAPITAL/LABOR/BOND because:

- Eligibility focuses on **pregnancy timeline, child citizenship**, not applicant assets alone
- Outcome = **citizenship for child** (jus soli); parents often have **no automatic residency**
- Different roadmap: clinic → birth → registration → consulate → parent options
- Different providers: birth agencies, hospitals, OBGYN — not only immigration lawyers

Key fields:

```
citizenship_basis: jus_soli
parent_citizenship_path: none | limited | investor_parallel
requirements: min_stay_before_birth, hospital_booking, pregnant_entry_allowed, birth_cost, insurance
risks: birth tourism crackdown, visa denial if pregnant
```

UI must clearly state: "Child: citizenship at birth" / "Parents: no PR / tourist stay only / see parallel LABOR route".

---

## 4. Multi-axis wizard (not single fork)

Users can qualify via **multiple routes simultaneously** — e.g. has money for Golden Visa, spouse is PT citizen, and works remotely as digital nomad.

### Wrong approach

```
Q: "What is your main asset?" → one branch → one program type
```

### Correct approach

```
Core questions (everyone)
  +
Axis modules (activate by data, NOT mutually exclusive)
  +
Engine evaluates ALL axes against ALL programs
  +
Results = ranked routes grouped by axis + compare table
```

**Program type = axis of the program, not axis of the user.** A user profile can have multiple sections filled at once.

### User profile structure

```typescript
UserProfile {
  core: {
    citizenship: string          // applicant passport(s)
    age: number
    destination_countries: string[]
    goal: "residency" | "citizenship" | "temporary" | "citizenship_for_child"
    timeline_months: number
    criminal_record: boolean
  }

  capital?: {
    liquid_assets_eur: number
    willing_to_invest_eur: number
    passive_income_monthly_eur: number | null
  }

  bond?: {
    spouse_citizenship: string | null
    spouse_residence: string | null
    marriage_duration_months: number | null
    ancestor_country: string | null
  }

  labor?: {
    employment_type: "employed" | "remote" | "freelance" | "startup"
    monthly_income_eur: number
    employer_country: string
    profession: string
    degree: string
  }

  birth?: {
    planning: boolean
    due_month: string
    budget_usd: number
    stay_weeks: number
    parent_passports: string[]
  }
}
```

### Wizard phases

**Phase 1 — Core (~6 questions):** citizenship, destination, goal, timeline, age, criminal record.

**Phase 2 — Axis modules (skippable, not exclusive):**

- 💰 Finances → `capital` section
- 👨‍👩‍👧 Family & ties → `bond` section
- 💼 Work → `labor` section
- 👶 Birth / passport for child → `birth` section

Strategy: **progressive linear questions + smart hints** — one flow, no early fork, hints like "this answer opens family route".

**Phase 3 — Results:**

- N routes ranked by match score
- Compare table: cost, time, complexity, path to citizenship
- "Our pick" — rule-based recommendation with explanation
- Incomplete routes: "Tell us about spouse to check family route" → fill section → re-evaluate

### Engine: parallel evaluation

```
for program in active_programs(destination):
  axis = program.program_type
  section = profile[axis.toLowerCase()]
  if section is empty → status: incomplete, missing_fields
  else → rule_evaluator(program.eligibility_rules, full_profile)

return group_by_axis(routes).sort_by(score, cost, timeline).add_recommendation()
```

Evaluation always receives the **full profile**. Rules can cross-reference axes (e.g. simplified Golden Visa if spouse is EU citizen).

---

## 5. Domain model

> Full SQL tables, API endpoints, and extension cookbook: **[SCHEMA_AND_API.md](./SCHEMA_AND_API.md)**.

### Reference data (slow-growing)

```
audience_languages       ru, es, fr...
countries
program_types            CAPITAL | LABOR | BOND | later BIRTH
requirement_types        min_investment_eur, language_level, clean_criminal_record, ...
step_types               eligibility_check, document_gathering, application_prep, ...
provider_categories      legal, relocation, translation, photos, language_courses
```

### Corridors (primary public product)

```
Corridor
├── slug: ru-speaking-to-portugal
├── audience_language: ru
├── passport_cluster: RU / BY / UA / KZ
├── destinations: PT
├── corridor_programs[]      ← selected routes, ordered for this audience
├── corridor_sources[]       ← source set monitored for this corridor
├── corridor_digest_items[]  ← changes, CIPLE/citizenship updates, practical notes
└── providers[]              ← local providers able to handle this audience
```

The global program database supports many corridors, but users enter through a corridor page and wizard.

### Programs

```
Program
├── country_id, program_type_id
├── slug, title, status (active | draft | suspended)
├── outcome, program_subtype[]
├── evaluation_mode
├── target_audience (jsonb)
├── eligibility_rules (jsonb — JSON Logic)
├── roadmap_template[] (step_type + order)
│
├── ProgramVersion[]
│   ├── effective_from
│   ├── costs[]
│   ├── requirements[]     { type, operator, value, unit, source_url }
│   ├── timeline[]
│   └── sources[]          { url, last_verified, content_hash }
│
└── PassportEligibility[]
    ├── applicant_passport
    ├── status: eligible | blocked | conditional
    └── conditions[]
```

### Wizard

```
WizardModule
├── code: core | capital | labor | bond | birth
├── axis (maps to profile section)
├── questions (jsonb)
├── activation_hint
└── skippable: boolean
```

### Providers & monetization

```
Provider
├── name, logo, website, geo_coverage[]
├── categories[]
├── service_languages[]             ← ru / en / pt / es / fr
├── supported_passports[]           ← RU / BY / UA / KZ...
├── licensed_in / verification
└── status: pending_review | active | suspended

ManualLead
├── corridor_id, profile_id, selected_route
├── applicant contact + explicit consent
├── lead_packet jsonb
└── status: new | assigned | accepted | rejected | invoiced

LeadAssignment
├── manual_lead_id, provider_id
├── rejection_reason, accepted_at
└── agreed_cpl_eur
```

### Results

```
UserProfile (session or user-bound)
EligibilityResult
├── profile_id, program_id, axis
├── score, status: matched | partial | failed | incomplete
├── matched_rules[], failed_rules[]
└── recommendation_rank
```

---

## 6. Engine modules (build once)

| Module | Responsibility |
|--------|----------------|
| **Wizard Runner** | Load modules from DB, progressive intake, save multi-section profile |
| **Rule Evaluator** | JSON Logic on active corridor programs × full profile; explainable output |
| **Roadmap Builder** | Template steps + version costs/timelines + corridor notes |
| **Manual Lead Handoff** | Build qualified lead packet and assign to local providers |
| **Provider Matcher** | Later: rank providers by corridor, language, passport support, quality |
| **Click Tracker** | Later: CPC marketplace and revshare allocation |

### Rule Evaluator example

Rules stored as JSON Logic in `program.eligibility_rules`:

```json
{
  "and": [
    { ">=": [{ "var": "capital.liquid_assets_eur" }, 500000] },
    { "in": [{ "var": "core.citizenship" }, ["RU", "BY", "KZ"]] },
    { "!=": [{ "var": "core.criminal_record" }, true] }
  ]
}
```

Every failed/matched rule includes `source_url` and `last_verified` in output.

---

## 7. Knowledge ingestion API

Multiple sources write through **one API**. Engine and site read only from **published layer**.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ LLM pipeline│  │ LLM pipeline│  │ Contributor │
│ (Gemini)    │  │ (Claude)    │  │ (public API)│
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       └────────────────┼────────────────┘
                        ▼
              POST /api/v1/knowledge/proposals
              validate · dedup vs published · tier review
                        ▼
              published_*  ← site + engine read here
```

### Deduplication (do not push what already exists)

Every ingest request is checked against **published knowledge** and **pending proposals** before entering review. Goal: no duplicate programs, no re-submission of identical facts, no review queue spam.

#### Natural keys (one row per key)

| entity_type | natural_key | Example |
|-------------|-------------|---------|
| `country` | `country_code` | `PT` |
| `program` | `program_slug` | `portugal-golden-visa` |
| `program_requirement` | `program_slug + requirement_type` | `portugal-golden-visa:min_investment_eur` |
| `passport_eligibility` | `program_slug + applicant_passport` | `portugal-golden-visa:RU` |
| `program_version` | `program_slug + effective_from` | `portugal-golden-visa:2026-01-01` |
| `roadmap_step` | `program_slug + step_type + order` | `portugal-golden-visa:application_prep:3` |
| `provider` | `provider_slug` or normalized `website` | `silva-immigration` |
| `source_monitor` | `source_url` (normalized) | `aima.gov.pt/golden-visa` |

Keys are computed server-side from payload — contributors cannot invent alternate keys for the same entity.

#### Dedup decision matrix

On `POST /knowledge/proposals`, after schema validation:

| Published state | Incoming payload | Result |
|-----------------|------------------|--------|
| **Not exists** | any valid | `accepted` → review pipeline |
| **Exists, same value** (normalized) | identical fields | `duplicate` — **reject, no review** |
| **Exists, same value** | only `last_verified` / source fresher | `refresh` — T0 auto-bump, no new attribution |
| **Exists, different value** | conflicting fields | `conflict` → T4 review, link both proposals |
| **Pending proposal** same key | same value | `duplicate_pending` — reject |
| **Pending proposal** same key | different value | merge into existing pending or `conflict` |

**Same value** = normalized comparison (see below). Identical duplicate must **not** earn attribution or consume review capacity.

#### Normalization (before compare)

```
- amounts: same currency, rounded to integer EUR/USD
- strings: trim, lowercase, collapse whitespace
- enums: canonical codes (RU not Russia)
- dates: ISO date only (ignore time)
- booleans: strict true/false
- content_hash: SHA256 of canonical JSON of comparable fields
```

#### Preflight API (check before push)

Contributors and LLM pipelines should call this **before** extract + POST:

```http
GET /api/v1/knowledge/exists?entity_type=program_requirement
    &program_slug=portugal-golden-visa
    &requirement_type=min_investment_eur
```

Response:

```json
{
  "exists": true,
  "published": true,
  "natural_key": "portugal-golden-visa:min_investment_eur",
  "current_value": { "operator": ">=", "value": 500000 },
  "content_hash": "a1b2c3...",
  "last_verified": "2026-06-15",
  "contributors": [{ "id": "...", "role": "author" }],
  "hint": "duplicate_if_unchanged"
}
```

Optional batch preflight for pipelines:

```http
POST /api/v1/knowledge/exists/batch
{ "queries": [ { "entity_type": "...", "payload": { ... } }, ... ] }
```

Public read API also exposes `GET /knowledge/programs?country=PT` so pipelines can skip already-seeded slugs.

#### Operation types (explicit intent)

| operation | When allowed |
|-----------|--------------|
| `create` | natural_key **not** in published |
| `update` | natural_key exists **and** at least one comparable field differs |
| `refresh` | same value, new `source_url` or `last_verified` only (T0) |

Reject `create` if key already published → `409` with message: *use `update` or `refresh`*.

#### HTTP responses on ingest

| Status | code | Meaning |
|--------|------|---------|
| `201` | `accepted` | new or material change → review |
| `200` | `duplicate` | identical to published — skipped |
| `200` | `refresh_applied` | T0 verification bump only |
| `409` | `duplicate_pending` | same key already in queue |
| `409` | `use_update` | create attempted but entity exists |
| `202` | `conflict` | different value → T4 queue |

Response always includes `natural_key`, `published_snapshot` (if any), and `next_action` for LLM/human.

#### L0 dedup gate (first step of review)

```
POST proposal
  → compute natural_key + content_hash
  → lookup published_entities[natural_key]
  → lookup pending_proposals[natural_key] WHERE status NOT IN (rejected, published)
  → apply decision matrix
  → if duplicate: return immediately (never reach L1 LLM)
  → if conflict: enqueue T4
  → else: continue L1 → L2 → ...
```

Duplicates **never reach LLM review** — saves cost and queue depth.

#### Contributor UX (dedup hints)

See **Edits & corrections** for full dashboard states. Short rule: identical → skip; outdated → `update`; missing key → `create`.

#### Schema support

```sql
published_entities (
  natural_key TEXT PRIMARY KEY,
  entity_type TEXT,
  entity_id UUID,
  content_hash TEXT,
  payload jsonb,
  published_at,
  last_verified
)

-- partial unique index on pending
CREATE UNIQUE INDEX pending_proposals_active_key
  ON knowledge_proposals (natural_key)
  WHERE status NOT IN ('rejected', 'published', 'duplicate');
```

### Edits & corrections (update what already exists)

Dedup blocks **identical** re-submissions; **corrections are first-class** — new data, new source, or fix outdated values on published entities.

#### Principles

1. **Never edit published rows directly** — all changes go through `operation: update` (or `refresh` for verification-only).
2. **Diff required** — proposal must include `base_content_hash` (what contributor saw) + changed fields; server validates base still matches published or merges as conflict.
3. **Updaters earn attribution** — role `updater` in `entity_contributions` (15% revshare pool split among updaters).
4. **History preserved** — old value kept in `entity_changelog`; program gets new `ProgramVersion` when material fields change.

#### Operations recap

| operation | Use case | Review tier |
|-----------|----------|-------------|
| `create` | new natural_key | per entity type |
| `update` | fix wrong value, add missing field, law changed | per changed field |
| `refresh` | same value, newer source / last_verified | T0 auto |
| `deprecate` | program suspended, route no longer available | T2+ human |

#### Update proposal payload

```json
{
  "entity_type": "program_requirement",
  "operation": "update",
  "natural_key": "portugal-golden-visa:min_investment_eur",
  "base_content_hash": "a1b2c3...",
  "payload": {
    "program_slug": "portugal-golden-visa",
    "requirement_type": "min_investment_eur",
    "operator": ">=",
    "value": 500000
  },
  "previous_snapshot": {
    "operator": ">=",
    "value": 400000
  },
  "change_reason": "Official threshold raised per AIMA bulletin 2026-06",
  "provenance": {
    "source_url": "https://aima.gov.pt/...",
    "raw_excerpt": "..."
  }
}
```

Server checks:

```
if base_content_hash != published.content_hash:
  → 409 stale_base — return current published snapshot; client must re-fetch and resubmit
if normalized(payload) == normalized(published):
  → duplicate
else:
  → accepted as update → review (tier by field sensitivity)
```

#### Entry points (API + UI)

| Channel | Who | Flow |
|---------|-----|------|
| **API** `POST /knowledge/proposals` | LLM pipelines, devs | `operation: update` after preflight |
| **Contributor dashboard** | logged-in contributor | browse published → «Suggest correction» form |
| **Public UI** | anyone | «Report outdated / incorrect» on program page → creates proposal (guest or login) |
| **Flag on published entity** | users | `POST /knowledge/flags` → may spawn contributor task or direct update proposal |

Public read responses include `content_hash`, `last_verified`, `natural_key` so clients can construct valid updates.

```http
GET /api/v1/knowledge/programs/portugal-golden-visa
GET /api/v1/knowledge/entities/{natural_key}   # full payload + hash for editors
```

#### Review: updates vs creates

Same L0→L4 pipeline. Tier determined by **what changed**, not operation:

| Change | Tier | Notes |
|--------|------|-------|
| typo in summary, non-legal text | T0–T1 | may auto-approve |
| cost, timeline, requirement value | T1–T2 | L1+L2 required |
| passport eligibility, BIRTH, blocked→eligible | T2–T3 | peer + human |
| two updates disagree | T4 | human picks |

On approve:

```
published_entities[natural_key] ← new payload + content_hash
entity_changelog ← { from, to, contributor_id, proposal_id, approved_at }
entity_contributions ← add updater share_weight
if program-level change → bump ProgramVersion + optional user notifications
```

#### Stale base (optimistic locking)

Multiple contributors may edit the same entity. **First approve wins**; others get `stale_base` on submit or at review if published changed since proposal created.

Contributor sees: *«Published value changed since you started — review diff and resubmit.»*

Optional: auto-rebase non-conflicting fields in Phase 2.

#### UI: «Suggest correction»

On every published program / requirement (site + contributor portal):

```
Current value:  €400,000 min investment
Last verified:  2026-03-01
Source:         aima.gov.pt/...

[ Suggest correction ]

Form:
  New value (required if changing)
  Source URL (required)
  Excerpt from source (required)
  Why is this wrong? (optional)
```

Submit → `operation: update` with `base_content_hash` from page load.

#### Report incorrect (Phase 2, lightweight in MVP)

User flag without full payload:

```json
POST /knowledge/flags
{ "natural_key": "...", "reason": "outdated", "comment": "..." }
```

Flags surface in contributor dashboard as **«Needs update»** tasks — incentivizes corrections without requiring flags to include structured data.

#### Changelog (public transparency)

```http
GET /api/v1/knowledge/entities/{natural_key}/changelog
```

```json
{
  "entries": [
    {
      "at": "2026-06-20",
      "field": "value",
      "from": 400000,
      "to": 500000,
      "contributor": { "display": "contributor_abc" },
      "source_url": "https://..."
    }
  ]
}
```

Builds trust: users see data evolves and who fixed it.

#### Attribution on updates

| Role | When | Default share |
|------|------|---------------|
| `author` | first publish | 60% |
| `verifier` | peer verify on publish | 25% |
| `updater` | each approved update | 15% split across updaters |

Material update (e.g. cost threshold) can use **higher updater weight** for that revision (config per tier). Prevents author lock-in forever; rewards people who keep data fresh.

#### Contributor dashboard states (revised)

| State | Action |
|-------|--------|
| ➕ **Gap** | submit `create` |
| 🔄 **Outdated** | your source ≠ published → submit `update` |
| ✅ **Current** | matches published — do nothing |
| 🚩 **Flagged** | user reports → good target for `update` |
| ⏳ **Your update pending** | wait for review |

Market messaging: *«Data wrong or outdated? Submit a correction with source — earn updater revshare.»*

---

| entity_type | Example |
|-------------|---------|
| `country` | PT, AE |
| `program` | golden-visa-pt + type, outcome |
| `program_requirement` | min_investment, language_level |
| `passport_eligibility` | RU → PT golden visa: eligible/blocked/conditional |
| `program_version` | costs, timeline, sources |
| `roadmap_step` | step order for program |
| `provider` | legal firm + geo + categories |
| `source_monitor` | URL + fetch schedule for daemon |

### Proposal payload

```json
{
  "entity_type": "program_requirement",
  "operation": "update",
  "natural_key": "portugal-golden-visa:min_investment_eur",
  "base_content_hash": "a1b2c3...",
  "payload": {
    "program_slug": "portugal-golden-visa",
    "requirement_type": "min_investment_eur",
    "operator": ">=",
    "value": 500000,
    "effective_from": "2026-01-01"
  },
  "previous_snapshot": { "operator": ">=", "value": 400000 },
  "change_reason": "Threshold updated per official source",
  "provenance": {
    "source_url": "https://aima.gov.pt/...",
    "extracted_at": "2026-06-23T10:00:00Z",
    "llm_model": "google/gemini-2.5-flash",
    "pipeline_id": "pt-programs-v2",
    "confidence": 0.92,
    "raw_excerpt": "Minimum investment of €500,000..."
  }
}
```

Use `"operation": "create"` when `natural_key` does not exist yet.

### API rules

1. **Dedup first** — check natural key against published + pending before review; identical → reject (`duplicate`), never queue.
2. **Idempotency** — same contributor retries same payload → same `duplicate` response; use `Idempotency-Key` header.
3. **Proposals only** — never direct write to production tables.
4. **Auth per pipeline** — API keys with scope (e.g. `pipeline:pt-programs` → country=PT only).
5. **Schema validation** — Zod/JSON Schema on input; reject raw markdown.
6. **Conflict resolution** — same key, different value → T4; human picks winner.
7. **Preflight** — `GET /knowledge/exists` documented for Cursor/LLM pipelines to check before push.

### API access levels

| Level | Who | Access |
|-------|-----|--------|
| Public read | everyone | published programs, passport matrix |
| Public meta | everyone | `/meta/contributor-guide`, `/meta/ingest-schema`, `/meta/requirement-types` |
| Contributor write | registered + API key | proposals only |
| Provider write | verified business | profile, bids, placements |
| Internal | admin / trusted pipelines | approve, reject, force-publish |

**LLM-friendly design:** agents read `GET /meta/contributor-guide` + `GET /meta/ingest-schema`, preflight via `/knowledge/exists`, submit via `/knowledge/proposals/batch`. See [API_CONTRIBUTOR_GUIDE.md](./API_CONTRIBUTOR_GUIDE.md).

---

## 8. Review pipeline (tiered gates)

**Not every fact needs 2 LLMs + 2 humans.** Risk determines depth.

```
Contributor / LLM pipeline
         │
         ▼
┌────────────────────┐
│ L0: Schema + dedup │  reject duplicate; auto refresh T0; conflict → T4
│     + source       │  auto-reject without source_url
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ L1: Model A          │  extraction matches source?
│ (e.g. Gemini Flash)  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ L2: Model B          │  independent check; must agree with A
│ (e.g. Claude)        │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ L3: Peer contributor │  optional; earns verify share in revshare
│ (reputation > 50)    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ L4: Human 1–2        │  high-risk only
└─────────┬──────────┘
          ▼
      PUBLISHED
```

### Review tiers

| Tier | Content | L1 | L2 | Peer | Human |
|------|---------|:--:|:--:|:----:|:-----:|
| **T0** | last_verified bump, typo | ✓ | — | — | — |
| **T1** | costs, timelines, generic requirements | ✓ | ✓ | — | — |
| **T2** | passport eligibility, entry rules | ✓ | ✓ | ✓ (1) | — |
| **T3** | BIRTH, sanctions, forbidden | ✓ | ✓ | ✓ (1) | ✓ (1) |
| **T4** | conflict between proposals | ✓ | ✓ | — | ✓ (2) |

**Conflict** = Model A and Model B extract different values → auto T4, frozen until human.

Two models check **extraction consistency with source_url and each other**, not "truth in the world". Official source is arbiter on conflict.

### Peer verification

- Contributor B clicks **Verify** (not edit) on another's proposal
- B earns **verify share** (25% of entity revshare pool)
- Cannot verify own proposal
- Requires reputation > threshold
- T2+: if no peer in 48h → escalate to human (T1 can publish without peer)

### Trusted shortcuts

| Source | Shortcut |
|--------|----------|
| Internal LLM pipeline | L1+L2 auto; human only T3 |
| Contributor rep > 200 | T1 without peer |
| Admin / legal partner | human_approved = publish |
| Provider pushing own data | never auto — always T2+ human |

### Proposal statuses

```
draft → submitted
     → l1_pass | l1_fail
     → l2_pass | l2_conflict
     → peer_pending | peer_verified
     → human_pending | human_approved
     → published | rejected
```

---

## 9. Contributors & revshare

> **Full monetization policy:** [MONETIZATION.md](./MONETIZATION.md) — applicants free, manual CPL first, automated marketplace later.

### Corridor-first stance

Public contributor API is **not** the launch wedge. It is a later tool for keeping validated corridors fresh.

MVP data flow:

```txt
Internal team + CIPLE migration
  → manual source-backed corridor pack
  → wizard validates demand
  → manual provider lead handoff
  → paid CPL pilot
```

Phase 2 contributor flow:

```txt
Contributor updates corridor data + source
  → dedup + human/LLM review
  → published into corridor changelog
  → users generate qualified leads
  → provider pays accepted CPL / later CPC
  → contributor receives revshare
```

### Attribution

```sql
entity_contributions (
  entity_id,
  contributor_id,
  role: author | verifier | updater,
  proposal_id,
  share_weight,    -- revshare pool split for this entity
  approved_at
)
```

**Default weights:** author 60% · verifier 25% · updaters 15% (split).

### Payout formula (Phase 2+)

```
contributor_payout =
  (provider_revenue × contributor_pool_rate)  -- accepted CPL first, CPC later
  × (contributor_weight / sum_weights_for_entity)
```

- Pay only on **cleared provider revenue**, not impressions, approvals, or unpaid pilot leads
- **Hold period** 30 days (chargeback/disputes)
- **Minimum payout** threshold (e.g. €50)
- KYC required before first payout (Stripe Connect / Wise)

### Anti-abuse

| Attack | Mitigation |
|--------|------------|
| Spam proposals | rate limit + reputation + captcha |
| Fake sources | URL validation + excerpt match (LLM check) |
| Self-dealing | provider account ≠ contributor on same entity |
| Fake lead / click fraud | session/IP checks, provider dispute window |
| Sybil accounts | KYC for payout, one payout identity |

### Payout timing

Contributor revshare is **a percentage of real provider revenue**. In the corridor MVP, this means accepted CPL invoices; later it can include CPC. Until providers pay, **there are no automatic cash payouts** — this is expected, not a bug.

What happens before first provider payment:

| Event | When | Paid? |
|-------|------|-------|
| Proposal approved → published | on review pass | no |
| Attribution recorded (`entity_contributions`) | on publish | no — but **permanent** |
| User requests provider shortlist | when traffic exists | no, unless provider pays |
| Provider accepts / pays CPL | after manual or automated invoice | yes — revshare distributed |

**Early contributor value:** attribution is fixed at publish time. When corridor revenue starts, payouts flow to contributors already in `entity_contributions` — no retroactive race.

Optional **launch bounties** (platform-funded, separate from revshare): e.g. €50 for first verified PT program pack. Not required; use if chicken-and-egg needs a kickstart.

Dashboard from day one:

```
your programs · clicks · earned (accrued) · paid · pending (hold period)
```

### Launch phases & honest messaging

| Phase | Providers | Contributor payouts | Marketing message |
|-------|-----------|----------------------|-------------------|
| **0 — Corridor bootstrap** | manual pilot | $0; internal data only | «We are building the Portugal corridor.» |
| **1 — Manual CPL revenue** | accepted-lead invoices | optional/manual attribution | no public contributor marketing |
| **2 — Corridor update API** | paying CPL/CPC | real revshare payouts | «Help keep this corridor accurate; earn from provider revenue.» |

**Do not promise before Phase 1:**

- guaranteed income
- payouts from day one
- «use Cursor → instant money»

**Can promise from Phase 0:**

- corridor update API docs (Phase 2)
- review pipeline (human first, LLM later)
- permanent attribution on approved corridor entities
- transparent accrued earnings dashboard once provider revenue exists
- tagline: **Real payouts when providers pay. Your attribution starts on approval.**

### Launch sequence (chicken-and-egg)

```
1. Build RU-speaking → Portugal corridor manually
2. Wizard live → validate demand and shortlist requests
3. Manually recruit Portugal providers
4. First accepted-lead invoices → validate revenue
5. Only then open corridor update API and contributor revshare
```

Before step 5: do **not** market a public contributor earning program.

Phase 0 contributor pitch (Cursor / Claude / consultants):

> Emigro corridor update API is open for the Portugal corridor. Use Claude, Cursor, or any LLM pipeline to submit source-backed corrections and updates. Pass review → attribution is locked. Earn revshare when providers pay for leads generated by your data.

Requires before advertising API: validated corridor demand, provider revenue, OpenAPI quickstart, sandbox/test mode, contributor dashboard, ToS + disclaimer (not legal advice, source required).

---

## 10. Background daemon

Monitors official sources for program changes.

```
Scheduler → FetchWorker → ExtractWorker (LLM for unstructured)
  → diff vs current ProgramVersion
  → ChangeProposal (pending review)
  → approved → new ProgramVersion + changelog
```

- Auto-apply only T0 (last_verified bump)
- Cost/requirement/eligibility changes → review pipeline
- Optional: notify users with saved roadmaps affected by change

---

## 11. Deferred: visa-free layer

**Not in MVP.** Separate knowledge layer for travel entry (not residency):

```
travel_regime: passport × destination → visa_free | visa_required | e_visa | ...
```

Wizard would show "where you can go visa-free" immediately after passport question, then programs for long-term stay. Same ingestion API, different `entity_type`. SEO: `/passport/russia/visa-free`.

---

## 12. Tech stack

| Layer | Technology |
|-------|------------|
| Frontend + API | Next.js 14 App Router |
| Database | PostgreSQL (Supabase) |
| Rule engine | json-logic-js |
| Daemon / workers | Node + BullMQ (Redis) or Supabase Edge Functions + pg_cron |
| LLM extraction | OpenRouter (Gemini Flash for parsing, Claude for review) |
| Auth | Supabase Auth |
| Contributor payouts | Stripe Connect (Phase 2) |
| Admin | Internal CMS or Supabase Studio (MVP) |

---

## 13. MVP scope

> **Full audit and recommended cut (MVP-A / B / C):** [AUDIT.md](./AUDIT.md)  
> **Corridor-first launch plan:** [CORRIDOR_STRATEGY.md](./CORRIDOR_STRATEGY.md)  
> The checklist below keeps the original universal architecture, but MVP-A ships as a **single deep corridor**.

### MVP-A — RU-speaking → Portugal corridor (ship first — 4–6 weeks)

- [ ] Schema subset (L0/L1/L2 + wizard + sessions) **plus corridor tables** — see CORRIDOR_STRATEGY §11
- [ ] **Corridor:** Russian-speaking applicants → Portugal
- [ ] **Passports:** RU primary; BY / UA / KZ as secondary supported rows
- [ ] **Routes:** Portugal D8, D7, family reunification; citizenship/CIPLE path as roadmap/digest layer
- [ ] **Explicitly exclude:** Golden Visa, BIRTH, Spain, France, visa-free
- [ ] Multi-axis wizard (core + labor + capital + bond; no BIRTH)
- [ ] Rule Evaluator (JSON Logic, threshold only) + parallel evaluation
- [ ] Results + simple compare (4 columns)
- [ ] Program pages + **mandatory sources UI**
- [ ] Corridor digest layer migrated from CIPLE A2 where relevant
- [ ] Roadmap steps from DB, including `language_requirement` / CIPLE step
- [ ] Manual lead form: «get provider shortlist»
- [ ] Manual provider CRM: Airtable/Notion/Supabase admin
- [ ] Admin seed scripts + Supabase Studio
- [ ] Disclaimers on every page

### MVP-B (+3–4 weeks)

- [ ] Deepen Portugal corridor: more passport rows, more source-backed route details
- [ ] Ingestion API + dedup L0 + **human review only** for corridor updates
- [ ] Contributor API guide live + exists/batch endpoints, scoped to corridor
- [ ] Update flow + changelog + suggest correction
- [ ] Corridor digest publishing flow

### MVP-C (+4–6 weeks) — first revenue

- [ ] 10-20 manually sourced local Portugal providers
- [ ] Manual qualified lead handoff and accepted-lead tracking
- [ ] Paid CPL pilot (not CPC-Q yet): monthly manual invoices
- [ ] Contributor attribution + accrued balance (manual)
- [ ] L1 LLM review on ingest (optional)

### Full vision (not MVP-A)

- [ ] Schema Phase 1 — see SCHEMA_AND_API.md §16
- [ ] Seed ~5 flagship programs (PT Golden Visa, ES nomad, IT descent, DE family, MX birth)
- [ ] Multi-axis wizard (generic renderer from DB)
- [ ] Rule Evaluator (JSON Logic) + parallel evaluation
- [ ] Results: ranked routes + compare table
- [ ] Ingestion API (proposals → L0 dedup → L1+L2 LLM → human on T2+)
- [ ] Contributor API guide + `llms.txt` + example batch (see API_CONTRIBUTOR_GUIDE.md)
- [ ] Update flow: `operation: update`, stale_base, public changelog
- [ ] «Suggest correction» on published program pages (contributor + public flag)
- [ ] Sources UI on program page + per-rule proof links in wizard results
- [ ] Publish gate: program cannot go active without official sources
- [ ] Contributor accounts + attribution (manual payout)
- [ ] Provider placements + CPC‑Q billing (see MONETIZATION.md)
- [ ] Manual daemon reminders (auto-fetch Phase 2)

### Out of scope (Phase 2+)

- Visa-free / travel regime layer
- Peer contributor verification
- Automated revshare + Stripe Connect
- Community flag / report incorrect
- SPECIAL program type (humanitarian)
- SEO auto-pages at scale
- User accounts (save roadmap, change notifications)

---

## 14. Key decisions log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Program taxonomy | internal route types; MVP uses LABOR/CAPITAL/BOND | Corridors decide what is exposed |
| Wizard model | Multi-axis profile, not single fork | User can qualify via capital + bond + labor simultaneously |
| Rules format | JSON Logic in DB | No deploy for new programs; explainable |
| Write path | Proposals → review → publish | Legal safety; open ingest, closed publish |
| Review depth | Tiered L0–L4 | Speed for low-risk; depth for passport/BIRTH |
| LLM consensus | Two different models (A+B) | Catches hallucinations; conflict → human |
| Monetization | Users free; manual accepted CPL first | Validate provider demand before marketplace |
| Passport dimension | First-class in eligibility | Same program, different result per passport |
| BIRTH | Separate program type | Different outcome, roadmap, providers, risks |
| Visa-free | Deferred | Separate layer; not blocking MVP |
| Contributor payouts | Real only after accepted CPL / later CPC | Not a launch wedge |
| API marketing | Phase 2 corridor update API | Do not market public API before corridor revenue |
| Dedup on ingest | natural_key vs published + pending | No re-push of existing data; preflight API |
| Edits to published | `update` + base_content_hash + changelog | Corrections welcome; updaters earn revshare |
| Applicant pricing | always free (core product) | Revenue from providers only |
| Provider pricing | manual accepted CPL first → automated CPL → CPC later | Validate provider demand before marketplace |
| Platform take rate | 25–35% | remainder → contributor pool (~65–75%) |
| Config vs code | taxonomy/rules in DB; engine = interpreters | See SCHEMA_AND_API.md §1, §13 |
| Program proofs | source_url mandatory on every fact | No publish without official links |
| Launch strategy | corridor-first | Universal engine, but first market is RU-speaking → Portugal |
| Provider GTM | manual qualified lead handoff before marketplace | Sell CPL pilots before CPC infrastructure |
| CIPLE A2 asset | migrate as Portugal corridor digest | Existing monitoring becomes trust/distribution layer |

---

## 15. Corridor Update API — Phase 2 go-to-market

Positioning after corridor validation: not «global open immigration API», but **help keep a specific live corridor accurate**.

This is **not MVP-A**. It only launches after:

- RU-speaking → Portugal wizard has real completions
- providers accept/pay for leads
- we know which data changes matter
- internal update workflow works manually

### Target audiences

| Audience | Hook |
|----------|------|
| Developers (Cursor / Claude) | Submit source-backed corrections to the Portugal corridor |
| Immigration consultants / expats | Verify corridor updates from official sources |
| LLM enthusiasts | Pipeline: AIMA / consulate page → structured corridor proposal |
| CIPLE / Portugal community | Keep citizenship and language requirement digest fresh |

Cursor and Claude are **corridor update tools**, not the primary product.

### Starter kit (multiplier for dev adoption)

```
emigro-contributor-starter/
├── CONTRIBUTOR_PROMPT.md    # Claude extraction prompt (copy from docs/)
├── API_CONTRIBUTOR_GUIDE.md # full LLM-readable API spec
├── .cursor/rules            # schema-aware extraction rules
├── examples/portugal-d8-batch.json
└── scripts/push-proposal.ts
```

Flow: point LLM at **API_CONTRIBUTOR_GUIDE** + official corridor source → preflight → batch POST → review → published into corridor changelog → attribution.

`GET /llms.txt` and `GET /api/v1/meta/contributor-guide` for agent discovery.

### Advertising channels (Phase 2 only)

- Cursor / Claude communities — «maintain a live Portugal relocation corridor»
- Portugal / CIPLE communities — «report official changes and earn attribution»
- Telegram expat channels — «help keep the corridor accurate»
- SEO: `/contributors`, `/api/docs` only after corridor PMF

### Optional launch incentives

- Waitlist: «first 20 Portugal corridor updaters»
- Corridor bounties: fixed €X for approved source-backed updates (platform budget)
- Provider side: manual first leads free, then accepted CPL

---

## 16. Open questions

- [ ] Separate repo `emigro` vs monorepo with shared infra?
- [ ] Legal partner per jurisdiction before public launch?
- [ ] Which RU-speaking passport rows are highest priority after RU/BY/UA/KZ?
- [ ] Admin CMS build vs Supabase Studio + seed scripts for MVP?
- [ ] Domain: emigro.com / emigro.io — TBD

---

*Last updated: 2026-06-23 (edits & corrections flow)*
