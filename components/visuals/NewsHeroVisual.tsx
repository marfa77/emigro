import Image from "next/image";

/** Weekly digest visual — generated WebP, not inline SVG. */
export function NewsHeroVisual() {
  return (
    <div className="relative aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-2xl">
      <Image
        src="/images/emigro-news-digest-portugal.webp"
        alt=""
        fill
        sizes="360px"
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
    </div>
  );
}
