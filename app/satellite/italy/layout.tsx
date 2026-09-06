import type { Metadata } from "next";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";
import { italySatelliteUrl } from "@/lib/site-url";
import { ItalySatelliteFooter, ItalySatelliteHeader } from "@/components/satellite/ItalySatelliteLayout";

export const metadata: Metadata = {
  metadataBase: new URL(italySatelliteUrl("/")),
  title: {
    default: `${ITALY_SATELLITE.title} | Emigro`,
    template: `%s | Emigro IT`,
  },
  description: ITALY_SATELLITE.tagline,
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

export default function ItalySatelliteRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ItalySatelliteHeader />
      {children}
      <ItalySatelliteFooter />
    </>
  );
}
