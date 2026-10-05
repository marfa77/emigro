import Image from "next/image";
import type { ComoGuideMap as ComoGuideMapData } from "@/lib/italy/como-media";

export function ComoGuideMap({ map }: { map: ComoGuideMapData }) {
  return (
    <figure className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="relative aspect-[20/13]">
        <Image
          src={map.baseSrc}
          alt={map.alt}
          fill
          sizes="(min-width: 768px) 736px, calc(100vw - 32px)"
          className="object-cover"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 650"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {map.routes.map((route) => (
            <polyline
              key={route.label}
              points={route.points}
              fill="none"
              stroke={route.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={route.dashed ? "16 13" : undefined}
              className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
            />
          ))}
          {map.points.map((point) => (
            <g key={point.id} transform={`translate(${point.x} ${point.y})`}>
              <circle r="18" fill="#064e3b" stroke="#ffffff" strokeWidth="5" />
              <text
                x="0"
                y="1"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize="20"
                fontWeight="700"
              >
                {point.id}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="border-t border-slate-200 bg-white px-4 py-4 text-sm leading-relaxed text-slate-700">
        {map.caption}{" "}
        <a href={map.officialUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-800 underline">
          {map.officialLabel}
        </a>
      </figcaption>
      <ol className="grid gap-3 border-t border-slate-200 bg-white p-4 sm:grid-cols-2">
        {map.points.map((point) => (
          <li key={point.id} className="grid grid-cols-[2rem_1fr] gap-2 text-sm leading-relaxed text-slate-700">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-900 font-bold text-white">
              {point.id}
            </span>
            <span>
              <strong className="block text-slate-950">{point.label}</strong>
              {point.description}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
