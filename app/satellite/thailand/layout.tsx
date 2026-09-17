import type { Metadata } from "next";
import { ThailandSatelliteFooter, ThailandSatelliteHeader } from "@/components/satellite/ThailandSatelliteLayout";
import { THAILAND_SATELLITE } from "@/lib/satellite/thailand";
import { thailandSatelliteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(thailandSatelliteUrl("/")),
  title: {
    default: `${THAILAND_SATELLITE.title} | Emigro`,
    template: "%s | Emigro TH",
  },
  description: THAILAND_SATELLITE.tagline,
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

export default function ThailandSatelliteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThailandSatelliteHeader />
      {children}
      <ThailandSatelliteFooter />
    </>
  );
}
