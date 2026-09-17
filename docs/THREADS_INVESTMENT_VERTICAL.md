# Threads: Investment Migration vertical

## Purpose and boundary

This is a **separate, preparation-only Threads vertical** for Russian-language
material about legal status and documents connected with property or investment.
It is not a property listings feed and must not imply that buying property
automatically grants a visa, residence, permanent residence, or citizenship.

Allowed editorial scope:

- legal status attached to a verified investment route;
- property ownership and transaction documents relevant to that status;
- source-verified programme changes and deadlines;
- applicant, source-of-funds, asset, intermediary, and family-document checks.

Exclude lifestyle, tourism, neighbourhoods, yields, listings, sales copy, and
general Thailand content. Thailand may appear only when the post is specifically
about legal status/documents linked to property or investment.

## Account isolation

- Use a dedicated account identity in `THREADS_INVESTMENT_USERNAME`.
- Never reuse `THREADS_USERNAME`, `THREADS_USER_ID`, `THREADS_ACCESS_TOKEN`, or
  the Thailand/general satellite stream.
- The repository does **not** create an account, perform OAuth, load investment
  account credentials, schedule posts, or publish for this vertical.
- `autoPublish` is hard-coded to `false`; there is no investment publisher hook.
- Do not add this vertical to `threads:daily`, `threads:satellites`, lightning,
  replies, shared day-budget, systemd, or Vercel cron without a separate review.

## Inventory hook

`lib/threads/investment-vertical.ts` exposes:

- `loadThreadsInvestmentVerticalConfig()` — identity and editorial metadata only;
- `assertThreadsInvestmentAccountIsolated()` — rejects the main account identity;
- `buildThreadsInvestmentInventory()` — registry-backed, source-first records
  for `/ru/invest/{country}` with a dedicated UTM campaign.

Every inventory item is marked `reviewRequired: true`. Before any manual use,
verify the legal claim against the official source, keep the caveat, and link to
the relevant investment country page. Existing Threads conventions still apply:
native factual root first, concise factual continuation, source link last.

Reserved namespace: `THREADS_INVESTMENT_*`. Only
`THREADS_INVESTMENT_USERNAME` is read today; token and publishing variables are
intentionally unsupported.
