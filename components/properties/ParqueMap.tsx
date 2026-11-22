"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { TRANSIT_STOPS } from "@/lib/properties/geo-data";
import { PARK_CENTER, PARQUE_DA_CIDADE_RING } from "@/lib/properties/park";

export type MapPoint = {
  slug: string;
  pin: number;
  name: string;
  lat: number;
  lng: number;
  href: string;
  caption: string;
};

type Props = {
  points: MapPoint[];
  /** Highlight one pin (detail page) and zoom closer. */
  focus?: string;
  /** Pin highlighted from the list (hover). */
  active?: string | null;
  onSelect?: (slug: string) => void;
  className?: string;
};

/**
 * Leaflet map with the park outline, metro / metrobus stops and numbered project pins.
 * Tiles: OpenStreetMap standard, desaturated in CSS so pins and the park read first. Loaded client-side only; the list next to it is the
 * accessible version of the same data.
 */
export function ParqueMap({ points, focus, active, onSelect, className }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const markers = useRef(new Map<string, { el: HTMLElement }>());
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    let disposed = false;
    let map: import("leaflet").Map | null = null;
    (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !box.current) return;
      map = L.map(box.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        className: "parque-tiles",
      }).addTo(map);

      L.polygon(
        PARQUE_DA_CIDADE_RING.map(([lng, lat]) => [lat, lng] as [number, number]),
        { color: "#15803d", weight: 1.5, fillColor: "#4ade80", fillOpacity: 0.28 }
      )
        .bindTooltip("Parque da Cidade", { direction: "center", permanent: !focus, className: "parque-map-label" })
        .addTo(map);

      for (const stop of TRANSIT_STOPS) {
        const isBus = stop.kind === "metrobus";
        L.marker([stop.lat, stop.lng], {
          icon: L.divIcon({
            className: "",
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            html: `<span class="parque-stop${isBus ? " is-bus" : ""}">${isBus ? "MB" : "M"}</span>`,
          }),
          keyboard: false,
          zIndexOffset: -500,
        })
          .bindTooltip(`${isBus ? "Метробус" : "Метро"}: ${stop.name}`, { direction: "top", offset: [0, -11] })
          .addTo(map);
      }

      const bounds = L.latLngBounds(PARQUE_DA_CIDADE_RING.map(([lng, lat]) => [lat, lng] as [number, number]));
      markers.current.clear();
      for (const p of points) {
        const isFocus = focus === p.slug;
        const size = isFocus ? 40 : 30;
        const icon = L.divIcon({
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
          html: `<span data-pin="${p.slug}" style="--pin:#0f172a;width:${size}px;height:${size}px" class="parque-pin${isFocus ? " is-focus" : ""}${focus && !isFocus ? " is-dim" : ""}">${p.pin}</span>`,
        });
        const marker = L.marker([p.lat, p.lng], { icon, title: p.name, riseOnHover: true }).addTo(map);
        marker.bindTooltip(`<strong>${p.name}</strong><br/>${p.caption}`, { direction: "top", offset: [0, -size / 2] });
        marker.on("click", () => {
          if (selectRef.current) selectRef.current(p.slug);
          else window.location.href = p.href;
        });
        const el = marker.getElement()?.querySelector<HTMLElement>("[data-pin]");
        if (el) markers.current.set(p.slug, { el });
        bounds.extend([p.lat, p.lng]);
      }

      const target = focus ? points.find((p) => p.slug === focus) : undefined;
      if (target) {
        map.setView([target.lat, target.lng], 16);
      } else if (points.length) {
        map.fitBounds(bounds.pad(0.08));
      } else {
        map.setView(PARK_CENTER, 15);
      }
    })();
    return () => {
      disposed = true;
      map?.remove();
    };
    // points/focus are static for the page; re-creating the map on hover would flicker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    markers.current.forEach(({ el }, slug) => {
      el.classList.toggle("is-active", slug === active);
    });
  }, [active]);

  return (
    <div className={className}>
      <div ref={box} className="h-full w-full" aria-label="Карта новостроек вокруг Parque da Cidade" role="region" />
      <style>{`
        .parque-tiles{filter:grayscale(1) brightness(1.06) contrast(.88)}
        .parque-pin{display:flex;align-items:center;justify-content:center;border-radius:9999px;background:var(--pin);color:#fff;font:600 13px/1 ui-sans-serif,system-ui,sans-serif;border:2px solid #fff;box-shadow:0 2px 6px rgba(15,23,42,.35);transition:transform .15s ease;cursor:pointer}
        .parque-pin.is-active,.parque-pin:hover{transform:scale(1.25)}
        .parque-pin.is-focus{font-size:16px;box-shadow:0 0 0 6px color-mix(in srgb,var(--pin) 25%,transparent),0 2px 8px rgba(15,23,42,.4)}
        .parque-pin.is-dim{opacity:.55}
        .parque-stop{display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:6px;background:#dc2626;color:#fff;font:700 11px/1 ui-sans-serif,system-ui,sans-serif;border:2px solid #fff;box-shadow:0 1px 3px rgba(15,23,42,.3)}
        .parque-stop.is-bus{background:#7c3aed;font-size:9px}
        .parque-map-label{background:transparent;border:0;box-shadow:none;color:#166534;font-weight:600;letter-spacing:.02em}
        .parque-map-label::before{display:none}
      `}</style>
    </div>
  );
}
