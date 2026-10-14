import type { ReactNode } from "react";
import { EnDocumentLang } from "@/components/en/EnDocumentLang";

/** EN segment: flip document language early (root html stays lang="ru"); middleware sends Content-Language: en. */
export default function EnLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="en";`,
        }}
      />
      <EnDocumentLang />
      {children}
    </>
  );
}
