# Emigro Score — country fitness rating for RU-speaking relocators

**Date:** 2026-08-09  
**Status:** implementing (hero /100 on destinations, hubs, transit)  
**Approach:** B — curated per-country registry; **hero number on card face**, axes on flip/detail

## Problem

Hub / destination cards show bars **Покрытие / Источники / Wizard / Сложность / Assist** — hardcoded identical (`88/95/90/62/78`). Product vanity, not country fitness; users notice they look the same everywhere.

## Goal

**Emigro Score** — editorial rating of how workable a country is for a typical RU-speaking relocator (RU baseline; UA/BY/KZ may differ — see guide). Primary UX: **one number on the card face** so the grid answers «кто круче» at a glance. Same model for EU corridors and transit/settle hubs.

## Non-goals (v1)

- Nomad List clone (COL, Wi‑Fi, nightlife)
- Auto-scoring / LLM scores
- Auto-generated SEO spam pages beyond `/ru/emigro-score` methodology
- Per-passport numeric scores (v2); v1 = RU baseline + UI note
- Nested sub-scores in code for «Перспектива» (rubric for editors only)
- Fake zeros when score missing
- TransitHubLanding score strip (registry only; no new strip in v1)

## Decisions (locked for this draft)

| Topic | Choice |
|-------|--------|
| **Primary UI** | **Hero score on card FRONT** (destination grid + route/country tile). No bars on the face. |
| **Display scale** | **0–100 integer, no decimals** (e.g. `74`). Same grain as axes (multiples of 10 → overall rounded to int). |
| **Internal / axes** | Axes stored **0–100, multiples of 10 only**. Hero = `overall100` (integer). |
| **Detail** | Flip / secondary: 5 axes as compact bars or labeled rows + `why` in `aria-label` |
| **Missing score** | **Omit** score UI; placeholder «Оценка формируется» — **never** show `0.0` / five zeros |
| **Tone (axes)** | ≥75 good · 45–74 warn · **&lt;45 critical (red)** — not “neutral” |
| **Persona label** | UI microcopy: «База — паспорт РФ; для UA/KZ/BY см. гайд» |
| **Axis `next` label** | **Перспектива** (not «Дальше» / not «EU-путь») |
| **Blast radius** | Same tile feeds homepage «Направления» via `resolveCorridorCountryTile` — design for that surface first |
| **Ship gate** | No country loses bars until it has a score; seed all live corridors + transit hubs in the same PR **or** gated removal |
| **Data** | `lib/emigro-score/` TypeScript registry; `asOf` + optional `validUntil`; `why` ≤120 chars |
| **Overall weights** | Kept for the hero number only (see below) |

## Display scale

**Pick:** hero shows **`74`** + small «Emigro» (optional `/100` muted). No decimals.

```
overall100 = round(
  0.25 * entry +
  0.30 * status +
  0.15 * banks +
  0.15 * tax +
  0.15 * next
)
display = overall100   // integer 0–100
```

Tone for hero chip: ≥75 good · 45–74 warn · &lt;45 critical.

## Axes (canonical)

Internal values **0–100**, step **10**. Higher = better for relocator persona.

| id | Label (RU) | Measures |
|----|------------|----------|
| `entry` | Въезд | Visa-free / visa friction, border discretion (RU baseline) |
| `status` | Статус | Realistic stay + work (permit clarity, grey-zone risk) |
| `banks` | Банки | Account / KYC for **RU** passport (conservative) |
| `tax` | Налоги | Predictability + DTT with RF; double-tax / PE traps |
| `next` | Перспектива | EU trampoline **or** durable settle (kind-aware in `why`) |

**Persona:** adult, remote/portable income, RU passport baseline, 3–24 months, not ultra-HNWI GV-only. Mass-market path required for high `status` / `next`.

### Rubric (editors — multiples of 10)

**Въезд**

| ~ | Anchor |
|---|--------|
| 90 | Visa-free ≥90d or trivial e-visa; refusals rare |
| 70 | Visa-free 30–90d or clear published visa; discretion predictable |
| 50 | Visa required (VFS) **or** cumulative/sunset visa-free |
| 30 | High refusal / long queues / passport-based blocks |

**Статус**

| ~ | Anchor |
|---|--------|
| 90 | Mass-market stay+work; published criteria; permit ≥2y |
| 70 | Works but slow/narrow/expensive |
| 50 | Subset only (income/IT/invest) or short unclear renewal |
| 30 | No mass-market route; grey zone |

**Банки / Налоги / Перспектива** — same 30/50/70/90 anchors in implementation PR; editors use guide facts. «Перспектива» mentally blends EU path + settle quality + mobility (no separate stored sub-scores in v1).

### Overall (hero number)

See **Display scale** above — hero is `overall100` integer, no `/10` conversion.

## Data model

```ts
export type EmigroScoreAxisId = "entry" | "status" | "banks" | "tax" | "next";

export type EmigroScoreAxis = {
  id: EmigroScoreAxisId;
  value: number; // 0–100, multiple of 10
  why: string;   // ≤120 chars RU
};

export type EmigroCountryScore = {
  countryId: string; // topic urlSegment / transit slug
  asOf: string;      // YYYY-MM-DD
  validUntil?: string;
  sourceGuide?: string; // e.g. /ru/guides/...
  axes: EmigroScoreAxis[]; // length 5, fixed order
  summary: string; // one line on flip / aria
};

export function getEmigroScore(countryId: string): EmigroCountryScore | null;
export function emigroScoreOverall100(score: EmigroCountryScore): number; // 0–100 int
```


Registry: `lib/emigro-score/registry.ts`.  
Validate in tests: values ∈ [0,100], `% 10 === 0`, why length, every live corridor + transit slug scored **or** on allowlist.

## UI behaviour

### Card FRONT (destination / country tile) — comparison first

```
┌─────────────────────┐
│  🇵🇹  Португалия     │
│                     │
│        74           │  ← large tabular/display integer
│      /100           │  ← muted optional
│    Emigro Score     │
│                     │
│  База: паспорт РФ   │  ← flip-only if face crowded
└─────────────────────┘
```

- No five bars on the face.
- Missing score: no number; «Оценка формируется» — **never** `0`.
- Click/flip still opens detail where useful.

### Card BACK / overlay (optional v1)

| Element | Behaviour |
|---------|-----------|
| Axes | 5 rows or short bars; labels as above; tone good/warn/critical |
| Summary | `summary` one line visible |
| Why | `aria-label` per axis (not `title`-only) |
| Footer | `Emigro Score · ориентир · {asOf}` — **own row**, not truncated 50% slot |
| CTA | existing OPEN / href |

### Other hub layers (News / Guides / Practice / Market)

Unchanged in v1 **or** (preferred same PR) replace fake identical bars with real stats / hide flip ratings so they don’t compete with Emigro Score. Minimum: legend copy must not say all flips are “рейтинги коридора” if only country face is Emigro Score.

### Portugal fork

`lib/portugal/hub.ts` + `PortugalHubTile` — same hero number from `getEmigroScore("portugal")`; no second hardcoded list. Prefer converging on corridor tiles when cheap.

## Initial seed (axes ×10; hero derived)

| countryId | entry | status | banks | tax | next | ≈ overall |
|-----------|------:|-------:|------:|----:|-----:|----------:|
| portugal | 60 | 70 | 60 | 60 | 90 | 69 |
| spain | 50 | 70 | 60 | 50 | 80 | 64 |
| serbia | 70 | 80 | 70 | 70 | 80 | 75 |
| armenia | 70 | 70 | 80 | 80 | 60 | 71 |
| georgia | 70 | 50 | 60 | 40 | 50 | 55 |
| kazakhstan | 70 | 60 | 50 | 70 | 50 | 61 |
| montenegro | 50 | 50 | 60 | 60 | 60 | 55 |
| uae | 70 | 70 | 50 | 80 | 60 | 66 |
| thailand | 70 | 60 | 40 | 50 | 40 | 55 |
| turkey | 80 | 60 | 50 | 60 | 50 | 62 |
| indonesia | 70 | 50 | 40 | 50 | 40 | 52 |
| south-africa | 60 | 60 | 50 | 60 | 40 | 56 |

Plus all remaining EU corridor segments (FR/IT/DE/NL/…) in the same ship PR — refine with rubric + guides. Numbers above already snapped to ×10.

## Content ops

- Guide/hub rewrite → update axes in **same PR**; bump `asOf` / `validUntil`.
- FACTCHECK_BACKLOG row on material score changes.
- Owner: whoever merges the country guide (editor-in-chief on disputed scores).
- If guide and score conflict → **guide wins**; fix score before merge.

## Implementation outline

1. `lib/emigro-score/` types, registry, overall/display helpers, validation test, slug coverage test.
2. Extend resolved tile type with `emigroScore?: { overall100, summary }` (axes optional for flip).
3. `CorridorHubTile` / destination face: hero **0–100 int**; remove product bars from country/route face.
4. Flip: axes + disclaimer row + RU baseline note.
5. Portugal hub wired to same source.
6. Seed all live corridors + transit hubs; gated fallback for unscored.
7. Copy: homepage legend, a11y labels.

## Methodology page (shipped)

- Path: `/ru/emigro-score` — оси, рубрика, формула, таблица стран, дисклеймер
- Links from homepage destinations, tile flip, transit hub score block, Portugal legend

## v2

- `byPassport` modifiers
- Per-persona weights
- Guide frontmatter sync
- Kind-aware axis label (EU-путь vs Долгая жизнь)

## Open (non-blocking)

1. Exact typography of hero number (match existing hub fonts vs new display face) — decide in implementation with design pass.
2. Whether RU baseline line sits on face or only on flip (prefer flip if face feels crowded).
