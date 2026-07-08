/** Shared mobile-first Tailwind primitives. Keep class strings literal for Tailwind JIT. */

export const layoutContain = "min-w-0 max-w-full";

export const mobileScrollRow =
  "flex w-full max-w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden";

export const mobileSwipeHint = "mt-2 text-[11px] text-slate-500 sm:hidden";

export const heroTitle = "text-3xl font-bold sm:text-4xl";

export const heroTitleLg = "text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl";

export const formField = "w-full rounded-lg border border-slate-300 px-3 py-3 sm:py-2";

export const formFieldWhite = `${formField} bg-white`;

export const tapTarget = "min-h-[44px]";

export const tapTargetSmReset = "sm:min-h-0";

export const pricingCardHeaderRow =
  "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4";

export const satelliteMain = "satellite-main mx-auto min-w-0 max-w-3xl px-4 py-10";

export const noteContentImageClass = "aspect-[1200/630] h-auto w-full max-w-full object-cover";

export const NOTE_CONTENT_IMAGE_SIZES = "(max-width: 768px) 100vw, 672px";

export const safeAreaTopStyle = { paddingTop: "max(0px, env(safe-area-inset-top))" } as const;
