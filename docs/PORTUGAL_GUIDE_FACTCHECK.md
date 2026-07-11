# Portugal guide fact-check (Telegram → pillar guides)

Workflow for grounding **pillar guides** on [emigro.online](https://www.emigro.online) in lived experience from third-party relocant Telegram chats — without replacing official sources.

## Channels (parsed daily)

| Channel | Focus |
|---------|--------|
| `@chatlisboa` | Lisboa / general PT relocants |
| `@por_tugal` | News + practical PT discussion |
| `@lepta` | PT politics, housing, Norte |
| `@autolife_pt` | Auto, IMT, transport |

Configured in `parser/groups.yaml`. Ingest: `npm run portugal:daily` → table `community_signals` (Supabase).

## When to cite Telegram vs official source

| Use official (primary) | Use Telegram (secondary) |
|------------------------|---------------------------|
| Law, thresholds (D7/D8 income, IFICI eligibility) | Wait times, slot hunting, regional bottlenecks |
| AIMA / Finanças / consulate procedures | NIF↔morada↔bank chicken-egg, KYC quirks |
| Tax rates, citizenship rules | Common misconceptions in chats (e.g. «20% IFICI for any IT») |
| Document lists from gov.pt | «На практике» ordering of steps, pitfalls in first 30 days |

**Rules:**

1. TG citations **supplement** — never replace legal facts or official links.
2. Always attribute: `@chatlisboa`, `@por_tugal`, etc.
3. Include period: `2025–2026`, `июль 2026` where possible.
4. Phrasing: «часто пишут», «в чатах повторяют» — not «все знают» or «официально».
5. **Do not invent quotes** — only signals from `community_signals` or curated `lib/community-notes/guides/*`.

## Helper

```ts
import { formatPortugalChatCitation } from "@/lib/guides/portugal-telegram-citations";

formatPortugalChatCitation({
  channels: ["chatlisboa", "por_tugal"],
  topic: "AIMA",
  claim: "слот Agora часто исчезает за минуту — PDF лучше собрать до охоты за записью",
  period: "2025–2026",
});
// → В локальных чатах эмигрантов (@chatlisboa, @por_tugal) в 2025–2026 часто пишут, что ...
```

Constants: `PORTUGAL_CHAT_CHANNELS`, `PORTUGAL_GUIDE_FACTCHECK`, `SEED_FACTCHECK_SIGNALS`.

## Run fact-check script

```bash
# All configured pillar guides
npm run portugal:guide-factcheck

# One guide (partial slug / alias)
npm run portugal:guide-factcheck -- --guide=vnj-portugaliya-d8-d7

# Filter by topic keyword
npm run portugal:guide-factcheck -- --topic=aima --limit=20

# JSON export (for review spreadsheet)
npm run portugal:guide-factcheck -- --json

# Seed only (no Supabase — dev / offline)
npm run portugal:guide-factcheck -- --seed-only
```

**Output columns:** excerpt · date · channel · suggested guide section.

**Guides in scope (initial):**

- `vnj-portugaliya-d8-d7-grazhdanstvo-2026.md`
- `pervye-30-dnej-v-portugalii-2026.md`
- `portugaliya-vs-ispaniya-vnj-2026.md`

Add new guides in `lib/guides/portugal-telegram-citations.ts` → `PORTUGAL_GUIDE_FACTCHECK`.

## Ongoing workflow

1. **Daily:** VPS timer runs `npm run portugal:daily` (see `docs/PORTUGAL_CRON.md`).
2. **Before guide edit:** `npm run portugal:guide-factcheck -- --guide=<slug>`.
3. **Pick 3–5 citations max** per guide — quality over quantity; match markdown tone.
4. **Embed** in relevant sections (AIMA, NIF/bank, IFICI myths, consulado, first 30 days).
5. **Cross-check** official facts unchanged; TG block clearly secondary.
6. **Build:** `npm run build` if TS changed.
7. **Deploy:** per `docs/DEPLOY.md` — local build green first.

## Review checklist before deploy

- [ ] Official thresholds / law unchanged and still cited (aima.gov.pt, financas, DL links).
- [ ] Each TG phrase attributes channel(s) and period.
- [ ] No fabricated chat quotes (traceable to `community_signals` or community-notes editorial).
- [ ] ≤5 new chat citations per guide; no wall of «в чатах пишут».
- [ ] IFICI / tax sections: chat cites **misconceptions**, official block states eligibility.
- [ ] `npm run build` passes.
- [ ] Optional: re-run `npm run portugal:guide-factcheck -- --guide=<slug>` to spot fresh signals.

## Related

- Community notes (satellite): `docs/PORTUGAL_SATELLITE.md`
- Practice enrichment for notes: `npm run portugal:enrich-practice`
- Citation pattern in notes: `lib/community-notes/guides/*.ts`
