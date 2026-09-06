import type { SatelliteCityChat } from "@/lib/satellite/city-chats";
import {
  CITY_CHAT_JOIN_HINT,
  CITY_CHAT_KICKER,
  CITY_CHAT_PILLARS,
  cityChatHeadline,
  cityChatLead,
} from "@/lib/satellite/city-chat-copy";

type Props = {
  chat: SatelliteCityChat;
  headingId?: string;
  compact?: boolean;
};

/** Shared pitch: для своих = важное + общение + эксперты. */
export function CityChatPitch({ chat, headingId, compact = false }: Props) {
  return (
    <>
      <p className="text-xs font-bold uppercase tracking-wide text-sky-900">{CITY_CHAT_KICKER}</p>
      <h2
        id={headingId}
        className={compact ? "mt-1 text-lg font-semibold text-slate-900" : "mt-1 text-xl font-semibold text-slate-900"}
      >
        {cityChatHeadline(chat)}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{cityChatLead(chat)}</p>
      <ul
        className={
          compact
            ? "mt-3 space-y-1.5 text-sm text-slate-700"
            : "mt-4 grid gap-3 sm:grid-cols-3"
        }
      >
        {CITY_CHAT_PILLARS.map((p) => (
          <li
            key={p.key}
            className={compact ? "" : "rounded-lg border border-sky-100 bg-white/80 px-3 py-2.5"}
          >
            <p className="font-semibold text-slate-900">
              {compact ? `· ${p.title}. ` : p.title}
              {compact ? <span className="font-normal text-slate-700">{p.text}</span> : null}
            </p>
            {compact ? null : <p className="mt-1 text-xs leading-relaxed text-slate-600">{p.text}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-slate-600">{CITY_CHAT_JOIN_HINT}</p>
    </>
  );
}
