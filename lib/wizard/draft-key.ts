export function draftStorageKey(mode: string, corridorSlug: string, wizardId: string) {
  return `emigro-wizard-draft:v1:${mode}:${corridorSlug}:${wizardId}`;
}
