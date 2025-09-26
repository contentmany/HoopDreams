// Character builder persistence utilities
const BUILDER_DRAFT_KEY = 'hd.builderDraft.v1';

export interface BuilderDraft {
  firstName?: string;
  lastName?: string;
  position?: string;
  archetype?: string;
  heightInCm?: number;
  attributes?: Record<string, number>;
}

export function saveBuilderDraft(draft: BuilderDraft): void {
  try {
    sessionStorage.setItem(BUILDER_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.warn('Failed to save builder draft:', error);
  }
}

export function loadBuilderDraft(): BuilderDraft {
  try {
    const stored = sessionStorage.getItem(BUILDER_DRAFT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load builder draft:', error);
    return {};
  }
}

export function clearBuilderDraft(): void {
  try {
    sessionStorage.removeItem(BUILDER_DRAFT_KEY);
  } catch (error) {
    console.warn('Failed to clear builder draft:', error);
  }
}