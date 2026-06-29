import Image from "next/image";
import { countryCardImage } from "@/lib/brand/country-accents";

/** Country photo card — no gradient overlay (same fix as HubHeroVisual: overlay hid the image). */
export function CorridorHeroVisual({ segment }: { segment?: string }) {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border-2 border-white/30 bg-white shadow-2xl">
      <Image
        src={countryCardImage(segment)}
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
    </div>
  );
}
