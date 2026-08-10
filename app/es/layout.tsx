import type { ReactNode } from "react";
import { EsDocumentLang } from "@/components/es/EsDocumentLang";

export default function EsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <EsDocumentLang />
      {children}
    </>
  );
}
