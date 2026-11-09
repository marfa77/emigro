import type { ReactNode } from "react";
import { FrDocumentLang } from "@/components/fr/FrDocumentLang";

export default function FrLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="fr";`,
        }}
      />
      <FrDocumentLang />
      {/* Raw HTML carries the language too (root <html> stays ru): crawlers and screen readers use the nearest lang. */}
      <div lang="fr" className="contents">
        {children}
      </div>
    </>
  );
}
