import Image from "next/image";
import { countryCardImage } from "@/lib/brand/country-accents";

export function CorridorHeroVisual({ segment }: { segment?: string }) {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
      <Image
        src={countryCardImage(segment)}
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-corridor-950/20 to-transparent" />
    </div>
  );
}
