"use client";

import { WizardSatellitePracticeCta } from "@/components/wizard/WizardSatellitePracticeCta";
import { cityChatForCountry } from "@/lib/satellite/city-chats";

export type WizardPortugalPracticePlacement = "wizard_hub_results" | "wizard_corridor_results";

type Props = {
  sessionId: string;
  placement: WizardPortugalPracticePlacement;
};

/** Portugal wizard results — city chat via @emigro_chat_bot?start=porto_chat. */
export function WizardPortugalPracticeCta({ sessionId, placement }: Props) {
  const chat = cityChatForCountry("portugal");
  if (!chat) return null;
  return (
    <WizardSatellitePracticeCta
      sessionId={sessionId}
      placement={placement}
      countryKey="portugal"
      chat={chat}
    />
  );
}
