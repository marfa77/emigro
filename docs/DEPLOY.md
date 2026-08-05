# Production deploy checklist (Vercel)

Always verify the app builds locally before shipping to production. Prefer **one** Production build per change.

## Default path (Git → Vercel)

`main` triggers Production via Vercel Git integration.

1. **Build** — `npm run deploy:check` (or `npm run build`) must exit 0.
2. **Commit** — one coherent commit when possible.
3. **Push** — `git push origin main`.
4. **Wait** — `npm run deploy:status` until the new Production deploy is **Ready**. Do not start a second deploy.

Do **not** run `vercel --prod` after that push for the same commit.

## Emergency path (CLI only)

Only if Git deploys are broken, or you need a CLI ship **without** pushing the same change again.

1. `npm run deploy:status` — abort if any Production row is **Building**.
2. `npm run deploy:cli` — local build, then `vercel --prod`.

Never: push to `main` **and** `deploy:cli` in the same turn.

## Scripts

| Script | What it does |
|--------|----------------|
| `npm run deploy:check` | Local production build only |
| `npm run deploy:status` | Recent Vercel deployments (look for Building / Error / Ready) |
| `npm run deploy:cli` | Guarded CLI Production deploy (refuses if Production already Building) |
| `npm run deploy:vercel` | Alias of `deploy:cli` (legacy name) |

## Do not

- Expect a green Vercel deploy without a successful local build first.
- Double-deploy (Git push + CLI) for one commit — causes concurrent Production builds, timeouts, and flaky failures.
- Ship known build errors “to fix in prod.”
- Rely on an outdated global Vercel CLI (prefer ≥ 58). Upgrade: `npm i -g vercel@latest`.

## Build timeouts on Vercel

If logs show `static-page-generation-timeout` / SIGTERM while collecting page data for `/ru/[country]` or satellite routes, check `staticPageGenerationTimeout` in `next.config.mjs` (currently 180s). Raising it or cutting SSG work is the fix — not rapid redeploy spam.

## Related

- [BACKUPS.md](./BACKUPS.md) — migrations via git, weekly `db dump`, pre-migration snapshots
- [PORTUGAL_SATELLITE.md](./PORTUGAL_SATELLITE.md) — Portugal subdomain DNS and satellite setup
- [SPAIN_SATELLITE.md](./SPAIN_SATELLITE.md) — Spain subdomain DNS and satellite setup
- [YANDEX_SEO.md](./YANDEX_SEO.md) — post-deploy SEO routine
