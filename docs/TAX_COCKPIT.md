# Tax Year Cockpit — operator notes

**Surface:** `@emigro_chat_bot` → menu **Налоги** · `/tax` · deep link `tax` / `tax_YYYY`  
**Landing (SEO/AEO):** [emigro.online/ru/nalogi](https://www.emigro.online/ru/nalogi) · also `/llms.txt` + hub CTA  
**Spec:** `docs/superpowers/specs/2026-10-22-tax-year-cockpit-design.md`  
**Plan:** `docs/superpowers/plans/2026-10-23-tax-year-cockpit.md`

## What it does

1. Presence ledger (manual dates or ticket photo/PDF → confirm)  
2. Residency traffic-light report (EU + UAE + UK + US packs; stubs = yellow only)  
3. Counsel on ledger numbers (Gemini tools: `read_ledger` / `read_pack` / `web_search`)  
4. Events in `emigro_bot_events` for a later $50/mo trial (no paywall in v1)

## Env

| Var | Where | Purpose |
|-----|--------|---------|
| `GEMINI_API_KEY` or `GOOGLE_API_KEY` | Vercel + local | Ticket OCR + counsel |
| Supabase admin URL/key | already on bot | Ledger + events |
| Chat bot token | already | File download + replies |

## Tests

```bash
npm run test:tax-day-math
npm run test:tax-residency
npm run test:tax-ingest-manual
npm run test:tax-ingest-ticket
npm run test:tax-counsel-empty
npx tsx scripts/test-bot-router.ts
```

## CLI (Pavel)

```bash
npx tsx scripts/tax-cockpit-cli.ts ledger --user <tgId> --year 2026
npm run tax:report -- --user <tgId> --year 2026
npm run tax:ask -- --user <tgId> --year 2026 -- "вопрос"
```

Skill: `.cursor/skills/tax-counsel/SKILL.md` — never auto-change Finanças / IRS / HMRC addresses.

## Manual date format

```
PT 2026-01-10..2026-03-01
AE 2026-03-01..2026-06-15
Португалия 10.01.2026 - 01.03.2026
```

## Day rule

Default: **arrive inclusive, depart exclusive** (night in country = day). Packs may override (documented in pack files).

## Analytics events

`tax_open` · `ticket_add` · `residency_report` · `counsel_ask` · `country_focus`  
`return_7d` is derived (two `tax_open` within 7 days), not a button.
