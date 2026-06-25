import Link from "next/link";
import { EmigroMark } from "./EmigroMark";

export function EmigroLogo({
  href = "/ru",
  showWordmark = true,
  inverted = false,
}: {
  href?: string;
  showWordmark?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5">
      <EmigroMark className="h-9 w-9 shrink-0" />
      {showWordmark && (
        <span className={`text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-corridor-900"}`}>
          Emigro
        </span>
      )}
    </Link>
  );
}
