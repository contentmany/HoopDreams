// Lightweight, versioned localStorage helpers for AvatarState
export type PersistVersion = 1;
const VERSION: PersistVersion = 1;
const KEY_DEFAULT = "avatar:v1:current";

export interface Persisted<T> { v: PersistVersion; data: T; savedAt: number; }

export function saveAvatarState<T>(state: T, key: string = KEY_DEFAULT) {
  try {
    const wrapped: Persisted<T> = { v: VERSION, data: state, savedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(wrapped));
  } catch { /* ignore quota / privacy mode */ }
}

export function loadAvatarState<T>(key: string = KEY_DEFAULT): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Persisted<T>;
    if (!parsed || typeof parsed.v !== "number" || !parsed.data) return null;
    // if we ever bump VERSION, migrate here
    return parsed.data as T;
  } catch {
    return null;
  }
}

export function clearAvatarState(key: string = KEY_DEFAULT) {
  try { localStorage.removeItem(key); } catch {}
}

export function exportAvatarJSON<T>(state: T) {
  return JSON.stringify({ v: VERSION, data: state }, null, 2);
}

export async function exportAvatarPNG(canvas: HTMLCanvasElement): Promise<Blob | null> {
  try { return await new Promise(res => canvas.toBlob(b => res(b), "image/png")); }
  catch { return null; }
}

export const DEFAULT_AVATAR_KEY = KEY_DEFAULT;
