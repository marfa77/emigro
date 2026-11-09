import type { ReactNode } from "react";

/** italy.emigro.online/en — English guides. Root <html> stays ru; middleware sends Content-Language: en. */
export default function ItalyEnLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" className="contents">
      {children}
    </div>
  );
}
