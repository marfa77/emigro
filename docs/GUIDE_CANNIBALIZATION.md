# Guide cannibalization map (www Emigro)

Policy: [SEO_GUIDE_STANDARD.md](./SEO_GUIDE_STANDARD.md) § Canonical vs partial.  
Черновик → допконтент в **канон**; partial comparison при наличии полного → **слить + 301**.

## Canonical hubs (keep one URL)

| Intent | Canonical | Do not keep as separate |
|--------|-----------|-------------------------|
| Digital Nomad Europe comparison | `digital-nomad-vizy-evropy-sravnenie-2026` | ~~`digital-nomad-portugaliya-ispaniya-italiya-2026`~~ → 301 |
| Germany all VNJ paths | `vnj-germaniya-2026` | ~~`germaniya-blue-card-chancenkarte-2026-sng`~~ → 301 |
| EU work / Blue Card multi-country | `rabota-v-evrope-dlya-rossiyan-2026` | ~~`germaniya-vs-niderlandy-blue-card`~~ → 301 |
| Nordics overview | `vnj-skandinaviya-2026` (**hub only**) | Country depth → `vnj-shvetsiya-…`, `vnj-norvegiya-…` |
| PT D7 vs D8 | `d7-vs-digital-nomad-visa-sravnenie` | — (different intent: inside PT) |
| PT vs ES general VNJ | `portugaliya-vs-ispaniya-vnj-2026` | — (not DN-only; keep) |
| EU tax special regimes | `nalogovye-spetsrezhimy-es-2026` | — |
| RU tax exit / DTT | `nalogi-pri-pereezde-v-evropu-2026` | — (different: РФ-резидентство) |

## Keep differentiated (not merges)

| Slugs | Why OK |
|-------|--------|
| `kuda-pereehat-…` vs `kuda-uehat-…srochno…` | Plan vs urgency |
| `ukraina-evropa-vnj-marshruty` vs `ukraintsy-belorusy-…tp…` vs `belorusy-v-evropu…` | UA routes / TP framing / BY-only |
| Country DN pillars vs Europe DN hub | Hub = filter; pillar = depth |
| `grazhdanstvo-portugaliya-ispaniya` vs ARI / birth GV niches | Cohort-specific |
| first-30 per country | Different geo how-to |

## Watchlist (soft risk — differentiate, don’t merge yet)

| Pair | Action if GSC shows overlap |
|------|-----------------------------|
| `vnj-skandinaviya` ↔ `vnj-shvetsiya` | Hub already points to SE pillar; keep SE numbers only in SE |
| `investitsionnyy-vnj-evropa-golden-visa` ↔ country GV sections | Hub = Europe table; country = local process |
| `ees-shengenskaya` ↔ `shengen-turist-vs-vnzh` | EES tech vs tourist/VNJ decision |
| Thin first-30 (FR/NL/DE/AT/CZ) | Strengthen or noindex later — not cannibalization of pillars |

## Redirects

See `next.config.mjs` → `redirects()` for merged slugs.

Last audit: 2026-08-01.
