import Image from "next/image";
import { QUARTER_GEO } from "@/lib/properties/house-geo";
import type { CatalogQuarter } from "@/lib/properties/house-catalog";

/** Footprint plan of the quarter from OpenStreetMap: shows at a glance whether it is rows, pairs or villas. */
export function QuarterPlan({ slug, className = "" }: { slug: string; className?: string }) {
  const geo = QUARTER_GEO[slug];
  if (!geo) return <div className={`bg-slate-100 ${className}`} />;
  const cos = Math.cos((41.17 * Math.PI) / 180);
  const all = geo.ring.concat(...geo.buildings);
  const xs = all.map(([lng]) => lng * cos);
  const ys = all.map(([, lat]) => -lat);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX;
  const h = Math.max(...ys) - minY;
  const pad = Math.max(w, h) * 0.06;
  const pts = (ring: [number, number][]) =>
    ring.map(([lng, lat]) => `${((lng * cos - minX) * 1e5).toFixed(1)},${((-lat - minY) * 1e5).toFixed(1)}`).join(" ");
  return (
    <svg
      viewBox={`${(-pad * 1e5).toFixed(1)} ${(-pad * 1e5).toFixed(1)} ${((w + 2 * pad) * 1e5).toFixed(1)} ${((h + 2 * pad) * 1e5).toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      className={`bg-[#f4f1ea] ${className}`}
      role="img"
      aria-label="План квартала: контуры домов по OpenStreetMap"
    >
      <polygon points={pts(geo.ring)} fill="#e7efe3" stroke="#9db59a" strokeWidth={Math.max(w, h) * 1e5 * 0.004} />
      {geo.buildings.map((b, i) => (
        <polygon key={i} points={pts(b)} fill="#334155" />
      ))}
    </svg>
  );
}

/** Cover: photo with credit, or the footprint plan when there is no photo. */
export function QuarterCover({
  quarter,
  sizes,
  priority,
  className = "",
}: {
  quarter: CatalogQuarter;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const photo = quarter.photo;
  if (!photo) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <QuarterPlan slug={quarter.slug} className="absolute inset-0 h-full w-full" />
        <span className="absolute bottom-1.5 right-2 rounded bg-white/80 px-1.5 py-0.5 text-[10px] leading-none text-slate-600">
          план по OpenStreetMap
        </span>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <span className="absolute bottom-1.5 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] leading-none text-white/90">
        фото: {photo.credit}
      </span>
    </div>
  );
}
