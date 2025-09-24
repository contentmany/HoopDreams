// Lightweight pub/sub system for save state changes
export const saveBus = new EventTarget();

export function publishSaveChanged() {
  saveBus.dispatchEvent(new Event('save-changed'));
}