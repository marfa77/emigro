# Satellite guides: cheap draft → Sol review → search → images

Guides are **not** one-model output. Cheap agent drafts; **GPT Sol** (`gpt-5.6-sol-medium`) reviews before stocked. Search and unique heroes happen **in the same batch**, not after launch.

## Who does what

| Pass | Model (Cursor Task) | Job |
|------|---------------------|-----|
| Draft | cheap: `composer-2.5-fast` (or grok-fast) | Full body from Portugal clone + **live search**. No silent law. |
| Review | **`gpt-5.6-sol-medium`** | Re-fetch official URLs, competitor SERP, `mustAnswer`, horizon 4–6, Nota, no pad. Overlay — do not shorten. |
| Images | orchestrator (same session) | Unique WebP **for every slug in the batch** + `COMMITTED_NOTE_OG_SLUGS` **before** calling the batch done. |

Orchestrator (parent) wires routes/chat/assert. It **does not** ship CORE or life 7 until Sol signs that batch.

If Sol rejects: cheap revises; Sol again. Do not upsert stubs.

If you **are** Sol in the parent chat: you may skip the extra Task, but you still **re-search** — do not trust a prior cheap draft’s links.

## SEO + AEO — same batch, not a follow-up

Do **not** ship a gold guide and «допилить мета / llms / ai:description» later. Cheap draft writes the fields; Sol rejects if they miss the gate; assert fails the satellite.

Per slot, `SATELLITE_LAUNCH_SLOT_META` has:

- `primaryQuery` — SERP to beat (substitute `{city}`)
- `aeoQuestion` — the ChatGPT question `quick_answer` + FAQ must answer
- `seoAnyOf` — at least one token must appear in title + description + quick_answer + FAQ

### Fields (ship with the body)

| Field | Bar |
|-------|-----|
| `seo_title` | year + geo + hook; 24–58 chars; beats competitor title for `primaryQuery` |
| `seo_description` | 140–165; Schengen≠residencia / office / portal hook; not a title clone |
| `excerpt` | ≥80 chars, **not** equal to `seo_description` (card snippet) |
| `quick_answer` | ≥180 chars — the AEO snippet: official fact + city practice + 4–6 month sting |
| FAQ | ≥4; ≥2 answers with **По правилам** + **На практике** (user-question wording = `aeoQuestion`) |
| `topic_tags` | ≥3 |
| `official_links` | ≥2 `https://` host-gov |

Runtime (already in note template — do not skip when cloning a new country):

- `<head>`: `withSatelliteAiMetadata` → `ai:description`, `ai:category`, `text/plain` → `{country}.emigro.online/llms`
- `data-llm="facts"` on the sr-only AI block; `data-llm="commercial"` on llms + Assist/wizard
- FAQPage / Article / speakable JSON-LD
- satellite `/llms` links stamped with `utm_source=llm`

Gate: `satelliteGuideSeoAeoGaps` inside `satellite:assert-launch`. Empty gaps = pass.

## Search (both passes)

Cheap **and** Sol must use WebSearch / WebFetch (or equivalent). Lawyer blogs are secondary.

Per slot, before the body is final:

1. **Official** — host-country gov + consulate + BOE/equivalent. Record URL in `official_links` and Nota (OK / soft / fixed / **UNCHECKED**).
2. **SERP** — primary query (demonym + 2026 + hook). Beat competitor `seo_title` / description (see competitor-seo-strengthen).
3. **City practice** — office names, cita/Termin portals, districts. If the page 404s, soft-verify in Nota — never invent a street.

No search → no ship. «Похоже на Portugal» is not a source.

## Images — all 15, immediately

Do **not** leave heroes to Vercel cron or «потом». Cards and OG 404 if WebP is untracked.

For **each** of the 15 slugs, in the same session as the Sol OK:

1. `npm run {country}:generate-note-images -- {slug}` (clone `scripts/spain-generate-note-images.ts`; seed = editorial guides, not only DB).
2. File exists: `public/images/community-notes/{slug}.webp` ≥ 20 KB (`hasNoteOgImageFile`).
3. Slug in `COMMITTED_NOTE_OG_SLUGS` (`appendCommittedNoteOgSlug` / manifest).
4. **Unique file** — two slugs must not share the same image hash (no copy-paste DEFAULT_OG, no one Pexels for all).
5. `git add` the WebPs with the guide files. CLI-only deploy without git drops `public/images/` on the next Git deploy.

Batch order: generate heroes for CORE 8 as soon as Sol accepts CORE; same for life 7. Hub must not launch with 15 texts and 0 pictures.

Pin a Pexels photo id per slug when search is too generic (`SLUG_PEXELS_PHOTO_IDS` in `note-og-image.ts`). Verify the photo page.

## Task prompts (orchestrator)

Cheap writer — one slot or CORE batch:

```
Country {country} focus {city}. Slot {slot}.
Read SATELLITE_LAUNCH_CLONE_FROM + PT caveats + SATELLITE_LAUNCH_SLOT_META (mustAnswer, primaryQuery, aeoQuestion, seoAnyOf).
WebSearch + WebFetch official pages.
SERP for primaryQuery (demonym + 2026 + hook). Beat competitor seo_title — do not write a weak «Страна 2026: тема» title.
Write full guide ≥1200, mustAnswer, «к 4–6 месяцу», Nota Emigro.
SEO+AEO in this draft (not later): seo_title 24–58 with year+geo+hook; seo_description 140–165; excerpt ≠ description; quick_answer ≥180 answering aeoQuestion; ≥4 FAQ with По правилам / На практике; ≥3 topic_tags; ≥2 https official_links.
Do not invent law. Do not shorten. Do not skip official_links. Do not leave meta for a follow-up pass.
```

Sol reviewer:

```
Review satellite guide {slug} as gold (Portugal depth, not Spain-thin).
Re-fetch every official_links URL.
SERP vs primaryQuery: seo_title must beat competitor hooks.
AEO: quick_answer is the ChatGPT snippet for aeoQuestion; FAQ are real user questions with По правилам / На практике.
Check mustAnswer, glossary first, horizon 4–6, Nota statuses, seoAnyOf tokens.
Reject padding. Overlay fact-check; keep full body.
Reject if SEO/AEO would need a second pass.
Confirm hero WebP unique + committed — if missing, fail the review.
```
