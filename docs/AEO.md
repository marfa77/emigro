# AEO / GEO — Emigro

**Layer A gold standard (portfolio):** PixID `docs/AEO_GOLD_STANDARD.md`  
On disk: `/Users/pavelveselov/Projects/PixID3/docs/AEO_GOLD_STANDARD.md`

## npm contract

```bash
npm run check:aeo              # Layer A gate (already wired into validate:site-consistency)
npm run audit:aeo              # alias
npm run llm:citation-test      # prompt coverage vs live /llms.txt
```

## Layer A map

| Check | Where |
|-------|--------|
| `/llms.txt` + UTMs | `lib/seo/llms-full.ts` · `lib/seo/llm-meta.ts` · `app/llms.txt/route.ts` |
| AI robots | `app/robots.ts` (GPTBot, …) |
| `ai:description` + `data-llm` | RU/ES/FR money pages · `rootMetadata` |
| Citation ops | `scripts/llm-citation-test.ts` |
| Press kit | `/press` → `/ru/press` · `docs/PRESS_OUTREACH.md` |

Last updated: 2026-08-12
