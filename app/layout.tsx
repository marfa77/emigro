import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import { rootMetadata } from "@/lib/seo";
import { WizardFunnelTracker } from "@/components/analytics/WizardFunnelTracker";
import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-9PYSNNXYLY";

export const metadata = rootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="dRBcrY3DcqZxP4UJpw1KAg"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Suspense fallback={null}>
          <SiteAnalytics />
          <YandexMetrika />
          <WizardFunnelTracker />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
