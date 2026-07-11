import type { Metadata } from "next";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { spainSatelliteUrl } from "@/lib/site-url";
import { SpainSatelliteFooter, SpainSatelliteHeader } from "@/components/satellite/SpainSatelliteLayout";

export const metadata: Metadata = {
  metadataBase: new URL(spainSatelliteUrl("/")),
  title: {
    default: `${SPAIN_SATELLITE.title} | Emigro`,
    template: `%s | Emigro ES`,
  },
  description: SPAIN_SATELLITE.tagline,
  robots: { index: true, follow: true },
};

export default function SpainSatelliteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SpainSatelliteHeader />
      {children}
      <SpainSatelliteFooter />
    </>
  );
}
