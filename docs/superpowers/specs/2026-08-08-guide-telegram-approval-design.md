# Guide posts to @Emigro_news with owner DM approval

**Date:** 2026-08-08  
**Status:** implemented (Approach A + SEO pillars only)

## Decisions

| Topic | Choice |
|-------|--------|
| Source | SEO pillars `content/guides/ru/*` only (satellite notes later) |
| Approval | Approach A — Supabase `guide_telegram_drafts` + inline ✅/❌ |
| Fact-check | Critical gate before DM; on critical → owner DM alert + try next guide |
| Cadence | ≤1 **published** channel post / day; ≤1 **pending** approval at a time |
| Format | Soft editorial (spotlight-like): hook + 2–3 takeaways + link to `/ru/guides/{slug}` |
| Bot | Same Emigro news bot + `/api/telegram/news-webhook` |

## Flow

1. Cron (daily, spaced from stories/lightning) picks next unpublished SEO guide.
2. Fact-check slug → if any `critical` → DM summary → mark draft `skipped_critical` → next guide (max N tries/run).
3. Gemini writes post HTML from title/excerpt/quick_answer/takeaways.
4. Insert `guide_telegram_drafts` (`pending`) → DM owner with buttons `gd:ok:<id>` / `gd:no:<id>`.
5. ✅ → publish to `@Emigro_news`, status `published`.  
   ❌ → status `skipped`.

## Non-goals

- Auto-fix guides  
- Satellite community notes in v1  
- Soft-promo / lightning changes beyond shared webhook handlers  

## Ops

| Item | Value |
|------|--------|
| CLI | `npm run news:guide-promo` (`--dry-run`) |
| Timer | `emigro-news-guide-promo.timer` — 12:30 UTC + ≤2h random |
| Deploy | `bash deploy/news-guide-promo/deploy.sh` (also in `parser/deploy.sh`) |
| Migration | `supabase/migrations/20260808180000_guide_telegram_drafts.sql` |
| Webhook | `gd:ok:` / `gd:no:` on `/api/telegram/news-webhook` |
