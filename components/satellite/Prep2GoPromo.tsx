import { CiplePrepTile } from "@/components/satellite/CiplePrepTile";

/** CIPLE note footer — same organic tile as the Portugal hub (Anki for RU + timed mock). */
export function Prep2GoPromo({ noteSlug }: { noteSlug: string }) {
  return <CiplePrepTile placement="satellite_ciple_note" noteSlug={noteSlug} />;
}
