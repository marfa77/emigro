# Portugal News Stories Implementation Plan

> **For agentic workers:** Execute inline. Steps use checkbox syntax.

**Goal:** Auto-publish cheap Portugal single-story tiles (`format=story`) from **Observador only** into `/ru/news`.

**Architecture:** Extend `emigro_news_digests` with `format`; daily VPS cron: Observador RSS → score → lead fetch → Gemini Flash batch → publish. Digests untouched. TPN/gov.pt later.

**Tech Stack:** Next.js, Supabase, Gemini Flash (`geminiFastJson`), rss-parser, systemd on VPS.

## Global Constraints

- Super cheap: Flash only, 1×/day, lead-only fetch, batch LLM, ≤3/day ≤15/week
- Portugal only; do not modify existing digest rows
- Always fetch lead for score-passing candidates
- Story slugs must work with `/api/revalidate/news`

---

### Task 1: Schema + types + display helpers

**Files:**
- Create: `supabase/migrations/20260808160000_emigro_news_digest_format.sql`
- Modify: `lib/news/digests.ts`
- Modify: `lib/news/topics/paths.ts` (story slug helper)
- Modify: `app/api/revalidate/news/route.ts` (accept story slugs)

### Task 2: UI badges + story article chrome

**Files:**
- Modify: `components/news/NewsDigest.tsx`
- Modify: `app/ru/news/[slug]/page.tsx`
- Modify: `components/news/LatestNewsTeaser.tsx` if weekly-only copy

### Task 3: Feeds, lead fetch, scoring

**Files:**
- Modify: `lib/news/direct-feeds.ts` (Observador, gov.pt; keep TPN)
- Modify: `lib/news/scoring.ts` (observador.pt trusted)
- Create: `lib/news/fetch-lead.ts`

### Task 4: Story pipeline + CLI + systemd

**Files:**
- Create: `lib/news/generate-portugal-stories.ts`
- Create: `scripts/run-portugal-news-stories.ts`
- Modify: `package.json` (`news:portugal-stories`)
- Create: `deploy/portugal-news-stories/run_scheduled.sh`
- Create: `deploy/systemd/emigro-portugal-news-stories.{service,timer}`
- Create: `docs/PORTUGAL_NEWS_STORIES_CRON.md`

### Task 5: Smoke test + commit

- Dry-run script if possible; `npm run news:test-quality` still passes
- Commit coherent change set
