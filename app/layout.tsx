import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { rootMetadata } from "@/lib/seo";
import { WizardFunnelTracker } from "@/components/analytics/WizardFunnelTracker";

export const metadata = rootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="dRBcrY3DcqZxP4UJpw1KAg"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Suspense fallback={null}>
          <WizardFunnelTracker />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
