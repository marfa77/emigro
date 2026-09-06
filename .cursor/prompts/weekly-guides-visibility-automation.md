# Emigro — weekly guides fact-check + Google/LLM visibility (Cursor Automation)

**Repo:** emigro · **branch:** `main`

## Cloud Agent prerequisites (blocking)

1. Add secrets at [Cloud Agents → Secrets](https://cursor.com/dashboard/cloud-agents) for this repo’s environment.
2. Automation must use a **Cloud Environment** (secrets are not injected when the run skips the environment).
3. Required (minimum):

```text
GOOGLE_API_KEY
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
INDEXNOW_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Optional: `OPENROUTER_API_KEY` if citation-test uses OpenRouter.

Copy from local `.env.local` (do not commit).

---

## Prompt (paste into Agent Instructions)

```
Emigro — weekly guides: fact-check + Google/LLM visibility → prod.
Repo: emigro, branch main.
Goal: accurate volatile facts + fresher ranking/citation signals for Google/Yandex/LLM.
Money path: guide → /ru/wizard (or corridor).

## Secrets gate (first step)
Verify non-empty: GOOGLE_API_KEY (or OPENROUTER_API_KEY), TELEGRAM_BOT_TOKEN. If missing, ABORT and list missing names. Do not invent SEO signals. Do not open a PR.

## Hard rules
- Exactly 5 published guides under content/guides/ru/ per run.
- Do NOT pick a guide fact-checked in the last 2 months. Use Memories: read prior weekly slugs; after run, append this week's 5 slugs + date.
- Prefer review_tier volatile / stale date_modified / priority URLs from docs/SEO_GROWTH_PLAN.md when choosing among eligible guides.
- No new guides. Edit existing MD only. Do not shorten full guides (see .cursor/rules/full-guides-no-shorten.mdc).
- Soften unverified claims; hard numbers only with official_sources. Append docs/FACTCHECK_BACKLOG.md when a new bad pattern is found.
- One primary lever per guide besides fact fixes: title/meta OR FAQ OR cluster links OR quick_answer — not a full rewrite.

## Steps
1) npm run guides:volatile-factcheck (or per-slug) for the 5 selected guides; fix critical issues in MD.
2) Apply one visibility lever per guide grounded in docs/SEO_GROWTH_PLAN.md — not competitor gaps alone.
3) Update date_modified on edited guides.
4) When INDEXNOW_KEY is set: npm run seo:indexnow for changed URLs (or project-equivalent).
5) When keys allow: npm run llm:citation-test -- --write --json.
6) Build/check. Ship via PR only — never force-push main. Merge only if CI green and diff is guides + backlog/docs only.
7) Memory: append 5 slugs + date.

## Success
- 5 guides fact-checked + visibility lever, or clear abort if secrets missing / no eligible guides.
- Never a silent “no signals” success caused by missing env.
```
