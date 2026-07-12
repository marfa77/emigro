# Guide review tiers

Editorial policy for RU pillar guides in `content/guides/ru/`.

## Tiers

| Tier | `review_tier` | `factcheck_cadence` | When to review |
|------|---------------|---------------------|----------------|
| **Volatile** | `volatile` | `quarterly` | Thresholds, rates, deadlines, sanctions, EES, salaries, fees, citizenship rules |
| **Evergreen** | `evergreen` | `annual` or `evergreen` | Process/checklist content; slow-changing mechanics |

Registry: `lib/guides/review-tiers.ts` (`GUIDE_REVIEW_TIER_BY_SLUG`).

Frontmatter `review_tier:` is optional — if omitted, tier is resolved from the registry in `lib/guides/load.ts`.

## Volatile signals

Volatile guides tied to Portugal/Spain corridors also feed Telegram fact-check:

- `npm run portugal:guide-factcheck`
- `npm run spain:guide-factcheck`

Configs in `lib/guides/portugal-telegram-citations.ts` and `lib/guides/spain-telegram-citations.ts` attach `reviewTier` and `factcheckCadence` automatically.

## Evergreen cadence

Most evergreen guides use **annual** review. Three slugs use **`evergreen`** cadence (update on user report or major process change only):

- `dokumenty-dlya-pereezda-iz-rossii-2026-apostil-nesudimost`
- `konsulskaya-podacha-rf-by-kz-2026-yurisdiktsiya`
- `otkaz-v-natsionalnoy-vize-konsulstvo-2026`

## CLI

```bash
npm run guides:review-tiers
npm run guides:review-tiers -- --tier=volatile
npm run guides:review-tiers -- --json
```

## Validation

`npm run validate:site-consistency` fails if any published guide slug lacks a tier entry or the registry contains stale slugs.

## Adding a new guide

1. Add markdown under `content/guides/ru/`.
2. Add slug → tier in `GUIDE_REVIEW_TIER_BY_SLUG`.
3. Run `npm run validate:site-consistency` and `npm run guides:review-tiers`.
