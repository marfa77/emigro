# Thailand satellite

- Host: `thailand.emigro.online`
- Canonical fallback route: `/satellite/thailand`
- Focus city: Phuket
- Commercial corridor: `https://www.emigro.online/ru/thailand`
- Pillar: `tailand-dlya-rossiyan-2026`
- Owned group: private `Пхукет и вокруг`, joined only through `@emigro_chat_bot?start=phuket_chat`

## Funnel order

1. Owned Phuket chat when `EMIGRO_PHUKET_CHAT_ID` is set.
2. Free Assist request with `source=thailand_satellite`.
3. Phuket property request with provider attribution `empyreal-estate-phuket`.
4. Main Thailand corridor and long-status guide.

Property ownership and immigration status are separate products. No satellite surface may promise an automatic visa from buying property.

## Launch gate

```bash
npm run satellite:assert-launch -- --country=thailand --city=phuket
```

The satellite is `stocked` after 15 guides and unique committed heroes pass. It is `community` only after the private group ID is live. Systemd files must be installed on the VPS before the status can be called `launched`.
