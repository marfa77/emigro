# Portugal news stories (single-tile) — design

**Date:** 2026-08-08  
**Status:** approved for implementation  
**Surface:** https://www.emigro.online/ru/news?country=portugal

## Goal

Publish **short, auto-generated RU story tiles** for Portugal relocation-relevant news: one story = one card = one short Emigro page + link to the original. Keep existing weekly digests untouched.

## Product decisions

| Decision | Choice |
|----------|--------|
| Format | Clean **1 story = 1 tile** (not weekly digest) |
| Curation | Full auto; some noise OK |
| Volume | ~**7–15** stories/week (hard cap **≤3/day**, **≤15/week**) |
| Click target | Short Emigro page (`/ru/news/[slug]`): what happened + why it matters + original link |
| Old digests | **Do not modify**; leave published as-is |
| Feed mix | One chronological list; badges **«Кратко»** vs **«Дайджест»** |
| Data model | Extend `emigro_news_digests` with `format`: `digest` \| `story` |
| Scope v1 | **Portugal only** |
| Sources v1 | **Observador only** (`https://observador.pt/feed/`) — simplest + broadest RSS; TPN / gov.pt later |

## Economics (must stay cheap)

1. Collect RSS items → dedupe by URL/title → **free keyword/score filter**
2. Only score-passing candidates within daily cap → **one lead-paragraph fetch** from the article page
3. **One Gemini Flash batch** per daily run → RU title, excerpt, short body, takeaways
4. Cron **1×/day** (VPS systemd, same pattern as Prep2Go)
5. No Pro model, no second fact-check LLM, no images, no full-article HTML parse beyond lead

## Content rules

- RU only; calm tone; facts from source only
- Body ~800–1200 characters; not a guide/checklist
- Always publishable `source_url` (no Google News wrappers)
- Soft relevance: visas, AIMA, residency/citizenship, taxes (NHR/IFI), housing, work, banks, schools, major laws — noise allowed, no manual approve

## Architecture

```
RSS (Observador — v1 single source)
  → dedupe + score
  → cap (≤3/day, ≤15/week)
  → fetch lead paragraph (passed only)
  → geminiFastJson batch → story fields
  → insert emigro_news_digests (format=story, status=published)
  → revalidate + optional Telegram
```

- Prep2Go weekly digests continue unchanged
- Story slug pattern: `portugal-story-{yyyy-mm-dd}-{short-hash}` (must be allowed by revalidate route)
- `week_start` / `week_end` = story date for stories

## UI

- Index card: badge, title (no «Еженедельный обзор» prefix), excerpt, source · date
- Article: short body, «Для кого важно» bullets, «Читать оригинал», optional soft guide CTA by tag
- Digests keep current weekly chrome

## Errors

- 0 candidates → exit 0
- Per-item Gemini/QA fail → skip item
- Duplicate URL/slug → skip
- One feed down → continue others

## Out of scope (v1)

Other countries, manual moderation UI, images, separate table, disabling digests, archive edits.
