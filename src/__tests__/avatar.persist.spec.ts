import {
  saveAvatarState,
  loadAvatarState,
  clearAvatarState,
  exportAvatarJSON,
  exportAvatarPNG,
  DEFAULT_AVATAR_KEY,
} from "../lib/storage/avatarStorage";
import type { AvatarState } from "../avatar/types";

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length() {
    return this.store.size;
  }

  clear() {
    this.store.clear();
  }

  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number) {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string) {
    this.store.delete(key);
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

function installStorage() {
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
  Object.defineProperty(globalThis, "window", { value: { localStorage: storage }, configurable: true });
}

describe("avatar storage helpers", () => {
  const exampleState: AvatarState = {
    head: { x: 1, y: 2, w: 3, h: 4, tilt: 0 },
    hairId: "hair_afro",
    accessories: ["glasses_round"],
  };

  beforeEach(() => {
    installStorage();
  });

  test("saveAvatarState writes versioned payload", () => {
    saveAvatarState(exampleState, "test-key");
    const raw = localStorage.getItem("test-key");
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.v).toBe(1);
    expect(parsed.data).toEqual(exampleState);
    expect(typeof parsed.savedAt).toBe("number");
  });

  test("loadAvatarState restores persisted data", () => {
    localStorage.setItem(
      DEFAULT_AVATAR_KEY,
      JSON.stringify({ v: 1, data: exampleState, savedAt: 123 }),
    );
    const loaded = loadAvatarState<AvatarState>();
    expect(loaded).toEqual(exampleState);
  });

  test("clearAvatarState removes stored data", () => {
    localStorage.setItem(DEFAULT_AVATAR_KEY, "value");
    clearAvatarState();
    expect(localStorage.getItem(DEFAULT_AVATAR_KEY)).toBe(null);
  });

  test("exportAvatarJSON formats readable output", () => {
    const json = exportAvatarJSON(exampleState);
    expect(json.indexOf("\"data\"") >= 0).toBe(true);
    const parsed = JSON.parse(json);
    expect(parsed.data).toEqual(exampleState);
  });

  test("exportAvatarPNG resolves blob from canvas", async () => {
    const calls: BlobCallback[] = [];
    const canvas = {
      toBlob(callback: BlobCallback) {
        calls.push(callback);
        callback(new Blob(["data"], { type: "image/png" }));
      },
    } as unknown as HTMLCanvasElement;
    const blob = await exportAvatarPNG(canvas);
    expect(blob instanceof Blob).toBe(true);
    expect(calls.length).toBe(1);
  });
});
