/**
 * Ephemeral politics / government scandal heuristics.
 * Such topics belong in news (with a relocant hook), never as evergreen guides.
 */
export const POLITICS_EPHEMERAL_RE =
  /политическ|министр(?:а|у|ом|е|ы)?|правительств|отставк|скандал|коррупц|парламент|коалиц|премьер|оппозиц|\bmai\b|administração interna|ministro|governo|demissão|inquérito|assembleia da república|невеш|neves/i;

/** Thin crisis-of-the-week titles that must not ship as guides. */
export const POLITICS_GUIDE_TITLE_RE =
  /политическ|шторм в\s+(лиссабон|lisboa)|дело министр|министр\w*\s+невеш|кризис в\s+мвд|отставк\w*\s+министр/i;

export function looksLikeEphemeralPolitics(text: string): boolean {
  return POLITICS_EPHEMERAL_RE.test(text);
}

export function politicsForcedNewsKind(text: string): boolean {
  return looksLikeEphemeralPolitics(text);
}
