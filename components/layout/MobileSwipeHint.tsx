import type { ReactNode } from "react";
import { mobileSwipeHint } from "@/lib/ui/mobile";

export function MobileSwipeHint({ children }: { children: ReactNode }) {
  return <p className={mobileSwipeHint}>{children}</p>;
}
