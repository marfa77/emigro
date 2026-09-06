"use client";

import { SatelliteCityChatCta } from "@/components/satellite/SatelliteCityChatCta";

type Props = {
  source: "portugal_satellite_hub" | "portugal_satellite_note";
  noteSlug?: string;
};

export function PortoChatCta({ source, noteSlug }: Props) {
  return <SatelliteCityChatCta countryKey="portugal" source={source} noteSlug={noteSlug} />;
}
