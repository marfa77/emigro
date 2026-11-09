type BatchResult = {
  published: boolean;
  reason?: string;
  messageId?: number;
  title?: string;
  url?: string;
  sourceId?: string;
  count?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Post every new event. A failed draft or a Telegram limit does not block the rest. */
export async function publishDue<T>(
  due: T[],
  options: { dryRun?: boolean } | undefined,
  publishOne: (ev: T, options?: { dryRun?: boolean }) => Promise<BatchResult>
): Promise<BatchResult> {
  let posted = 0;
  let dry = false;
  let last: BatchResult = { published: false, reason: "no-draftable-event" };
  for (let i = 0; i < due.length; i++) {
    let result: BatchResult = { published: false, reason: "send-failed" };
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await publishOne(due[i]!, options);
        break;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`[outdoor-batch] ${message}`);
        const retry = /429|retry after|too many requests/i.test(message);
        if (!retry || attempt === 2) break;
        const wait = /retry after (\d+)/i.exec(message);
        await sleep(wait ? Number(wait[1]) * 1000 + 500 : 8000);
      }
    }
    last = result;
    if (result.reason === "dry-run") dry = true;
    if (result.published) posted += 1;
    if (result.published && i < due.length - 1) await sleep(3500);
  }
  if (dry) return { ...last, published: false, reason: "dry-run", count: due.length };
  if (posted > 0) return { ...last, published: true, count: posted };
  return { published: false, reason: "no-draftable-event", count: 0 };
}
