/** Keep satellite hub HTML focused while the full note inventory stays in the sitemap and tag pages. */
export const SATELLITE_HUB_GUIDE_PREVIEW_LIMIT = 10;
export const SATELLITE_HUB_FEED_PREVIEW_LIMIT = 6;

export function previewHubNotes<T>(notes: T[], limit: number) {
  return {
    visible: notes.slice(0, limit),
    hiddenCount: Math.max(0, notes.length - limit),
  };
}
