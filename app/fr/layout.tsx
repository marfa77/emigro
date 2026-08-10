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
      {children}
    </>
  );
}
