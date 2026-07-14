import { telegramShareUrl } from "@/lib/telegram/public-url";

export type ShareNetwork = "x" | "threads" | "telegram" | "vk" | "facebook" | "linkedin";

function encodeUrl(url: string) {
  return encodeURIComponent(url);
}

function encodeText(text: string) {
  return encodeURIComponent(text);
}

/** Build platform share URLs. OG/Twitter meta on the page supplies preview cards where applicable. */
export function buildShareUrl(network: ShareNetwork, params: { url: string; title: string }): string {
  const { url, title } = params;
  const encodedUrl = encodeUrl(url);
  const encodedTitle = encodeText(title);

  switch (network) {
    case "x":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "threads":
      return `https://www.threads.net/intent/post?text=${encodedTitle}&url=${encodedUrl}`;
    case "telegram":
      return telegramShareUrl({ url, text: title });
    case "vk":
      return `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }
}
