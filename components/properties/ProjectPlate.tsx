import { BAND_COLOR, PARQUE_DA_CIDADE_RING, nearestParkPoint } from "@/lib/properties/park";
import type { CatalogProject } from "@/lib/properties/catalog";

/**
 * Drawn location plate: the park, the ocean edge, the project and the straight line to
 * the nearest park edge. Our own picture, so it can go on every card without photo rights.
 */
export function ProjectPlate({
  project,
  className,
  compact = false,
}: {
  project: CatalogProject;
  className?: string;
  compact?: boolean;
}) {
  const W = compact ? 300 : 400;
  const H = 240;
  const cosLat = Math.cos((41.169 * Math.PI) / 180);
  const M_PER_DEG = 111_320;
  let minLng = -8.6885;
  let maxLng = -8.671;
  let minLat = 41.165;
  let maxLat = 41.1738;
  if (project.lat != null && project.lng != null) {
    if (compact) {
      // Thumbnail: zoom on the project and its nearest park edge so the pin is centred.
      const [elng, elat] = nearestParkPoint(project.lat, project.lng);
      const cLat = (project.lat + elat) / 2;
      const cLng = (project.lng + elng) / 2;
      const halfY = Math.max(380, (project.parkM ?? 0) * 0.9) / M_PER_DEG;
      const halfX = (halfY * (W / H)) / cosLat;
      minLng = cLng - halfX;
      maxLng = cLng + halfX;
      minLat = cLat - halfY;
      maxLat = cLat + halfY;
    } else {
      const pad = 0.0022;
      minLng = Math.min(minLng, project.lng) - pad * 1.6;
      maxLng = Math.max(maxLng, project.lng) + pad;
      minLat = Math.min(minLat, project.lat) - pad;
      maxLat = Math.max(maxLat, project.lat) + pad;
    }
  }
  const cos = Math.cos((41.169 * Math.PI) / 180);
  const spanX = (maxLng - minLng) * cos;
  const spanY = maxLat - minLat;
  const scale = Math.min(W / spanX, H / spanY);
  const offX = (W - spanX * scale) / 2;
  const offY = (H - spanY * scale) / 2;
  const px = (lng: number, lat: number): [number, number] => [
    offX + (lng - minLng) * cos * scale,
    offY + (maxLat - lat) * scale,
  ];
  const parkPath =
    PARQUE_DA_CIDADE_RING.map(([lng, lat], i) => {
      const [x, y] = px(lng, lat);
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z";
  // Coastline, roughly: Matosinhos beach → Castelo do Queijo → Foz.
  const coast = [
    [-8.6915, 41.1900],
    [-8.6905, 41.1805],
    [-8.6895, 41.1745],
    [-8.6905, 41.1705],
    [-8.6915, 41.1665],
    [-8.6885, 41.1625],
    [-8.6855, 41.1585],
    [-8.6800, 41.1500],
  ].map(([lng, lat]) => px(lng!, lat!));
  const coastPath = `M-50 -50 L${coast.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")} L-50 ${H + 50} Z`;
  const [cx0, cy0] = px(-8.6905, 41.1805);
  const color = project.band ? BAND_COLOR[project.band] : "#64748b";
  const has = project.lat != null && project.lng != null;
  const [x, y] = has ? px(project.lng!, project.lat!) : [0, 0];
  const [ex, ey] = has ? px(...(nearestParkPoint(project.lat!, project.lng!) as [number, number])) : [0, 0];
  // Boavista and Circunvalação as thin guide lines.
  const boavista = [px(-8.6875, 41.1665), px(-8.663, 41.1628)];
  const circ = [px(-8.6895, 41.1745), px(-8.672, 41.1752)];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={`Схема: ${project.name} и Parque da Cidade`}>
      <rect width={W} height={H} fill="#f8fafc" />
      <path d={coastPath} fill="#dbeafe" />
      <text x={Math.max(6, cx0 - 40)} y={H - 10} fontSize="10" fill="#1d4ed8" opacity=".7">
        океан
      </text>
      <line x1={boavista[0]![0]} y1={boavista[0]![1]} x2={boavista[1]![0]} y2={boavista[1]![1]} stroke="#cbd5e1" strokeWidth="3" />
      <line x1={circ[0]![0]} y1={circ[0]![1]} x2={circ[1]![0]} y2={circ[1]![1]} stroke="#cbd5e1" strokeWidth="3" />
      {compact ? null : (
        <>
      <text x={boavista[1]![0] - 4} y={boavista[1]![1] + 13} fontSize="9" fill="#64748b" textAnchor="end">
        Av. da Boavista
      </text>
      <text x={circ[1]![0] + 2} y={circ[1]![1] - 5} fontSize="9" fill="#64748b" textAnchor="end">
        Circunvalação
      </text>
        </>
      )}
      <path d={parkPath} fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.2" />
      <text x={px(-8.6795, 41.1695)[0]} y={px(-8.6795, 41.1695)[1]} fontSize="11" fill="#166534" fontWeight="600" textAnchor="middle">
        Parque da Cidade
      </text>
      {has ? (
        <>
          <line x1={x} y1={y} x2={ex} y2={ey} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx={x} cy={y} r="13" fill={color} opacity=".18" />
          <circle cx={x} cy={y} r="7" fill={color} stroke="#fff" strokeWidth="2" />
          {project.parkM != null ? (
            <text x={x + 12} y={y - 10} fontSize="11" fontWeight="600" fill={color}>
              {project.parkM === 0 ? "в парке" : `${project.parkM} м`}
            </text>
          ) : null}
        </>
      ) : (
        <text x={W / 2} y={H - 14} fontSize="11" fill="#9f1239" textAnchor="middle">
          Точный адрес не опубликован
        </text>
      )}
    </svg>
  );
}
