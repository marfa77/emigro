import { publicSiteUrl } from "@/lib/site-url";

export const EMIGRO_LOGO_URL = `${publicSiteUrl()}/icon.svg`;

export const EMIGRO_PUBLISHER = {
  "@type": "Organization" as const,
  name: "Emigro",
  url: publicSiteUrl(),
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
