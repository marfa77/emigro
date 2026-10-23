import { permanentRedirect } from "next/navigation";

/** EN assist redirected to RU — see next.config.mjs. Page kept so nested routes resolve. */
export default function EnglishAssistRedirectPage() {
  permanentRedirect("/ru/assist");
}
