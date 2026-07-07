# Production deploy checklist (Vercel)

Always verify the app builds locally before pushing or deploying to production.

## Checklist

1. **Build** — `npm run build` (or `npm run deploy:check`) must exit 0. Fix all TS and Next.js errors first.
2. **Commit** — one coherent commit per deploy when possible.
3. **Push** — push to the branch that triggers Vercel (usually `main`).
4. **Deploy** — either wait for the Vercel Git integration, or run `npm run deploy:vercel` (runs build again, then `vercel --prod`).

## Scripts

| Script | What it does |
|--------|----------------|
| `npm run deploy:check` | Local production build only; fails if build fails |
| `npm run deploy:vercel` | `npm run build && vercel --prod` — never deploys if build fails |

## Do not

- Run `vercel --prod` or push expecting a green deploy without a successful local `npm run build`.
- Ship known build errors to production.

## Related

- [PORTUGAL_SATELLITE.md](./PORTUGAL_SATELLITE.md) — subdomain DNS and satellite setup
- [YANDEX_SEO.md](./YANDEX_SEO.md) — post-deploy SEO routine
