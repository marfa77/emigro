import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { rootMetadata } from "@/lib/seo";

export const metadata = rootMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
