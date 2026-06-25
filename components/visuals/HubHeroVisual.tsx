import Image from "next/image";

/** Product visual — no gradient overlay on the image (overlay was hiding the mockup). */
export function HubHeroVisual() {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border-2 border-white/30 bg-white shadow-2xl">
      <Image
        src="/images/emigro-main-hero.webp"
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
    </div>
  );
}
