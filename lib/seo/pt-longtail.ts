/** @deprecated Import from ./query-longtail — kept for backward compatibility. */
export type { QueryLongTailTarget as PtLongTailTarget } from "./query-longtail";
export {
  QUERY_LONG_TAIL_TARGETS as PT_LONG_TAIL_TARGETS,
  getLongTailByGuideSlug as getPtLongTailByGuideSlug,
  getLongTailByPath as getPtLongTailByPath,
} from "./query-longtail";

import { QUERY_LONG_TAIL_TARGETS } from "./query-longtail";

export const PT_LONG_TAIL_QUERIES = QUERY_LONG_TAIL_TARGETS.flatMap((t) => t.queries);
