import type { Metadata } from "next";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { PortugalSatelliteFooter, PortugalSatelliteHeader } from "@/components/satellite/PortugalSatelliteLayout";

export const metadata: Metadata = {
  metadataBase: new URL(portugalSatelliteUrl("/")),
  title: {
    default: `${PORTUGAL_SATELLITE.title} | Emigro`,
    template: `%s | Emigro PT`,
  },
  description: PORTUGAL_SATELLITE.tagline,
  robots: { index: true, follow: true },
};

export default function PortugalSatelliteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PortugalSatelliteHeader />
      {children}
      <PortugalSatelliteFooter />
    </>
  );
}
