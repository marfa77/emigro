/**
 * Back-compat: Geo2Go-only runner delegates to multi-source outdoor pipeline.
 */
import { runPortugalOutdoorChannel } from "@/lib/news/outdoor/run";

export async function runGeo2goEventsChannel(options?: {
  dryRun?: boolean;
  forceUrl?: string;
}): Promise<{
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
}> {
  return runPortugalOutdoorChannel({
    dryRun: options?.dryRun,
    forceUrl: options?.forceUrl,
    sources: options?.forceUrl ? undefined : ["geo2go"],
  });
}
