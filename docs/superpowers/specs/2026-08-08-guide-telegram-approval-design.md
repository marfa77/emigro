# Guide posts to @Emigro_news (auto-publish)

**Date:** 2026-08-08 (updated 2026-08-15)  
**Status:** guide SEO posts auto-publish; soft promo / digests still Approach A approve

## Decisions

| Topic | Choice |
|-------|--------|
| Source | SEO pillars `content/guides/ru/*` only (satellite notes later) |
| Guide posts | **Auto-publish** after fact-check (no owner ✅) — FYI DM only |
| Soft promo / digests | Still `guide_telegram_drafts` + inline ✅/❌ |
| Lightning | Separate flow — **always** owner DM approve |
| Fact-check | Critical gate before publish; on critical → owner DM alert + try next guide |
| Cadence | ≤1 **published** guide channel post / day from this queue |
| Dedup | **One guide = one post.** DB handled slugs ∪ full `@Emigro_news` archive (`t.me/s?before=`). Never re-queue a slug that already has a channel link. |
| Voice | Reject memoir, CTA fluff, LLM stamps, telegraphic «Что делать:»; try next guide (slug not burned) |
| Format | House style @Emigro_news: sharp title-thesis + dense fact paragraphs + link |
| Bot | Same Emigro news bot + `/api/telegram/news-webhook` |

## Flow (guides)

1. Cron loads handled slugs from DB **and** paginates `t.me/s/Emigro_news`; missing archive slugs are seeded as `published` (no new post).
2. Picks next SEO guide whose slug is not in that set.
3. Fact-check slug → if any `critical` → DM summary → mark `skipped_critical` → next guide (max N tries/run).
4. Claude writes post HTML → voice gate; on fail → DM + next guide (no row, can retry another day).
5. Insert draft → **publish to `@Emigro_news`** → status `published`.
6. Owner gets a plain FYI DM (no buttons).

## Non-goals

- Auto-publishing lightning  
- Satellite community notes in v1  

## Ops

| Item | Value |
|------|--------|
| CLI | `npm run news:guide-promo` (`--dry-run`) |
| Timer | `emigro-news-guide-promo.timer` — 12:30 UTC + ≤2h random |
| Deploy | `bash deploy/news-guide-promo/deploy.sh` |
| Migration | `supabase/migrations/20260808180000_guide_telegram_drafts.sql` |
| Legacy webhook | `gd:ok:` / `gd:no:` still work for soft promo / old pending |
