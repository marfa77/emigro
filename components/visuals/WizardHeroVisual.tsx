/** Decision tree / compass for wizard */
export function WizardHeroVisual() {
  return (
    <svg viewBox="0 0 260 220" className="mx-auto h-36 w-full max-w-[260px] opacity-90" aria-hidden>
      <circle cx="130" cy="110" r="88" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.2" />
      <circle cx="130" cy="110" r="58" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.25" />

      {/* Branches */}
      {[
        [130, 110, 48, 48],
        [130, 110, 212, 48],
        [130, 110, 48, 172],
        [130, 110, 212, 172],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      ))}

      {/* Nodes */}
      {[
        [48, 48, "Паспорт"],
        [212, 48, "Доход"],
        [48, 172, "Семья"],
        [212, 172, "Капитал"],
      ].map(([cx, cy, label]) => (
        <g key={String(label)}>
          <circle cx={cx as number} cy={cy as number} r="22" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" />
          <text
            x={cx as number}
            y={(cy as number) + 4}
            textAnchor="middle"
            fill="white"
            fillOpacity="0.85"
            fontSize="8"
            fontFamily="system-ui"
            fontWeight="600"
          >
            {label as string}
          </text>
        </g>
      ))}

      {/* Center compass */}
      <circle cx="130" cy="110" r="26" fill="white" fillOpacity="0.2" />
      <path d="M130 92 L134 118 L130 114 L126 118 Z" fill="white" fillOpacity="0.95" />
      <path d="M130 128 L127 104 L130 108 L133 104 Z" fill="white" fillOpacity="0.4" />
    </svg>
  );
}
