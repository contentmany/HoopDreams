const KEY = "hd.avatar.v1";

export type StoredAvatar = { dataUrl: string; ts: number };

export function saveAvatar(dataUrl: string){
  const rec: StoredAvatar = { dataUrl, ts: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(rec));
}

export function loadAvatar(): StoredAvatar | null {
  const raw = localStorage.getItem(KEY);
  try {
    return raw ? (JSON.parse(raw) as StoredAvatar) : null;
  } catch {
    return null;
  }
}

export function clearAvatar(){
  localStorage.removeItem(KEY);
}
