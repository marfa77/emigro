import type { ReactNode } from "react";
import { EsDocumentLang } from "@/components/es/EsDocumentLang";

/**
 * ES segment: flip document language as early as possible for browsers/a11y.
 * Root html stays lang="ru" (avoids dynamizing the whole app via headers()).
 * Middleware also sends Content-Language: es on /es responses.
 */
export default function EsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="es";`,
        }}
      />
      <EsDocumentLang />
      {/* Raw HTML carries the language too (root <html> stays ru): crawlers and screen readers use the nearest lang. */}
      <div lang="es" className="contents">
        {children}
      </div>
    </>
  );
}
