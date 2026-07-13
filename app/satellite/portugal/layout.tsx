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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.svg" }],
  },
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
