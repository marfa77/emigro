import { countryAccent } from "@/lib/brand/country-accents";

export function CorridorHeroVisual({ segment }: { segment?: string }) {
  const accent = countryAccent(segment);

  return (
    <svg viewBox="0 0 280 260" className="h-auto w-full max-w-[280px] drop-shadow-lg" aria-hidden>
      <defs>
        <linearGradient id="corridor-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent.glow} />
          <stop offset="100%" stopColor="white" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Passport / document stack */}
      <rect x="52" y="48" width="120" height="155" rx="10" fill="white" fillOpacity="0.12" stroke="white" strokeOpacity="0.25" />
      <rect x="68" y="36" width="120" height="155" rx="10" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.35" />
      <rect x="84" y="24" width="120" height="155" rx="10" fill="white" fillOpacity="0.92" />

      {/* Stamp circle */}
      <circle cx="144" cy="108" r="36" fill="none" stroke={accent.from} strokeWidth="2.5" strokeOpacity="0.55" />
      <circle cx="144" cy="108" r="28" fill={accent.from} fillOpacity="0.08" />
      <path
        d="M144 88 L150 112 L144 106 L138 112 Z"
        fill={accent.from}
        fillOpacity="0.85"
      />

      {/* Check path to residence card */}
      <rect x="168" y="130" width="88" height="58" rx="8" fill="url(#corridor-grad)" fillOpacity="0.35" stroke="white" strokeOpacity="0.5" />
      <path
        d="M188 158 L200 170 L236 142"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Family dots */}
      <g fill="white" fillOpacity="0.75">
        <circle cx="108" cy="198" r="5" />
        <circle cx="128" cy="198" r="5" />
        <circle cx="148" cy="198" r="4" />
        <circle cx="162" cy="198" r="4" />
      </g>
      <text x="140" y="222" textAnchor="middle" fill="white" fillOpacity="0.55" fontSize="8" fontFamily="system-ui">
        solo → семья
      </text>
    </svg>
  );
}
