import { EMIGRO_ORG_ID, emigroGlobalJsonLd } from "@/lib/seo/global-schema";

export function GlobalJsonLd() {
  const blocks = emigroGlobalJsonLd();
  return (
    <>
      {blocks.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}

export { EMIGRO_ORG_ID };
