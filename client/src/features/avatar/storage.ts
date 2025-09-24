export type AvatarPhoto = { dataUrl: string; updatedAt: number };

const KEY = "avatar.photo.v1";

export function saveAvatarPhoto(dataUrl: string) {
  const payload: AvatarPhoto = { dataUrl, updatedAt: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function getAvatarPhoto(): AvatarPhoto | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AvatarPhoto) : null;
  } catch {
    return null;
  }
}

export function clearAvatarPhoto() {
  localStorage.removeItem(KEY);
}