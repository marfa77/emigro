import { publicSiteUrl, SITE_URL } from "@/lib/site-url";

export const EMIGRO_LOGO_URL = `${SITE_URL}/icon.svg`;

export const EMIGRO_PUBLISHER = {
  "@type": "Organization" as const,
  name: "Emigro",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: EMIGRO_LOGO_URL,
    width: 512,
    height: 512,
  },
};

export function emigroAuthorOrg() {
  return { "@type": "Organization" as const, name: "Emigro" };
}

export function schemaImage(url: string) {
  const origin = publicSiteUrl();
  return url.startsWith("http") ? url : `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}
