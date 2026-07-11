# Spain guide fact-check (Telegram → pillar guides)

Workflow for grounding **pillar guides** on [emigro.online](https://www.emigro.online) in lived experience from third-party relocant Telegram chats — without replacing official sources.

## Channels (parsed daily)

| Channel | Focus |
|---------|--------|
| `@spain_granitsa` | Border/immigration, extranjería, TIE, DNV/UGE — general Spain (~5k) |
| `@spainchats` | Country-wide relocants Q&A (~12k) |
| `@valenforum` | Valencia forum, rent, local practice (~4.8k) |
| `@valenciarusia` | Valencia VNJ/life, no ads (~4.2k) |
| `@migranty_barselona` | Barcelona extranjería practice (~3.7k) |

Configured in `parser/groups.yaml`. Ingest: `npm run spain:daily` → table `community_signals` (Supabase).

## When to cite Telegram vs official source

| Use official (primary) | Use Telegram (secondary) |
|------------------------|---------------------------|
| Law, thresholds (DNV income, Beckham eligibility) | Wait times, cita previa hunting, regional bottlenecks |
| Extranjería / AEAT / consulate procedures | NIE↔empadronamiento↔bank chicken-egg, KYC quirks |
| Tax rates, Golden Visa closure (3 Apr 2025) | Common misconceptions in chats (e.g. «24% Beckham for any nomad») |
| Document lists from inclusion.gob.es | «На практике» ordering of steps, pitfalls in first 30 days |

**Rules:**

1. TG citations **supplement** — never replace legal facts or official links.
2. Always attribute: `@spain_granitsa`, `@spainchats`, `@valenforum`, etc.
3. Include period: `2025–2026`, `июль 2026` where possible.
4. Phrasing: «часто пишут», «в чатах повторяют» — not «все знают» or «официально».
5. **Do not invent quotes** — only signals from `community_signals` or curated `SEED_FACTCHECK_SIGNALS`.

## Helper

```ts
import { formatSpainChatCitation } from "@/lib/guides/spain-telegram-citations";

formatSpainChatCitation({
  channels: ["spain_granitsa", "spainchats"],
  topic: "TIE",
  claim: "cita extranjería в Madrid/BCN часто ждут 2–4 месяца — бронируйте сразу после прилёта",
  period: "2025–2026",
});
// → В локальных чатах эмигрантов (@spain_granitsa, @spainchats) в 2025–2026 часто пишут, что ...
```

Constants: `SPAIN_CHAT_CHANNELS`, `SPAIN_GUIDE_FACTCHECK`, `SEED_FACTCHECK_SIGNALS`.

## Run fact-check script

```bash
# All configured pillar guides
npm run spain:guide-factcheck

# One guide (partial slug / alias)
npm run spain:guide-factcheck -- --guide=vnj-ispaniya

# Filter by topic keyword
npm run spain:guide-factcheck -- --topic=tie --limit=20

# JSON export (for review spreadsheet)
npm run spain:guide-factcheck -- --json

# Seed only (no Supabase — dev / offline)
npm run spain:guide-factcheck -- --seed-only
```

**Output columns:** excerpt · date · channel · suggested guide section.

**Guides in scope (initial):**

- `vnj-ispaniya-2026.md`
- `pervye-30-dnej-v-ispanii-2026.md`
- `portugaliya-vs-ispaniya-vnj-2026.md` (ES-side signals)

Add new guides in `lib/guides/spain-telegram-citations.ts` → `SPAIN_GUIDE_FACTCHECK`.

## Ongoing workflow

1. **Daily:** VPS timer runs `npm run spain:daily` (see `docs/SPAIN_CRON.md`).
2. **Before guide edit:** `npm run spain:guide-factcheck -- --guide=<slug>`.
3. **Pick 3–4 citations max** per guide — quality over quantity; match markdown tone.
4. **Embed** in relevant sections (TIE, NIE/bank, Beckham myths, first 30 days).
5. **Cross-check** official facts unchanged; TG block clearly secondary.
6. **Build:** `npm run build` if TS changed.
7. **Deploy:** per `docs/DEPLOY.md` — local build green first.

## Review checklist before deploy

- [ ] Official thresholds / law unchanged and still cited (inclusion.gob.es, BOE, AEAT).
- [ ] Each TG phrase attributes channel(s) and period.
- [ ] No fabricated chat quotes (traceable to `community_signals` or seed editorial).
- [ ] ≤4 new chat citations per guide; no wall of «в чатах пишут».
- [ ] Beckham / tax sections: chat cites **misconceptions**, official block states eligibility.
- [ ] Golden Visa sections: chat cites closure myths, official block states 3 Apr 2025.
- [ ] `npm run build` passes.
- [ ] Optional: re-run `npm run spain:guide-factcheck -- --guide=<slug>` to spot fresh signals.

## Related

- Satellite config: `lib/satellite/spain.ts`
- Practice block on corridor: `components/spain/SpainFeaturedNotes.tsx`
- Playbook: `docs/CORRIDOR_SATELLITE_PLAYBOOK.md`
