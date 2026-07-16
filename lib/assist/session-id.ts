/** Wizard session IDs are UUIDs from Supabase. */
const SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidWizardSessionId(value: string): boolean {
  return SESSION_ID_RE.test(value.trim());
}
