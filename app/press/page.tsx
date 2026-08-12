import { redirect } from "next/navigation";

/** Canonical press kit lives under the RU surface. */
export default function PressRedirectPage() {
  redirect("/ru/press");
}
