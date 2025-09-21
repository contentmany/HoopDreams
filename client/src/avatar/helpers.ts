import {
  type AvatarDNA,
  DEFAULT_DNA,
  type FacialHairId,
  type HairColor,
  type HairId,
  type SkinTone,
  type HeadShape,
  type EyeShape,
  type EyeSpacing,
  type BrowThickness,
  type Hairline,
  type Nose,
} from "./types";

const SKINS: SkinTone[] = ["porcelain", "light", "tan", "brown", "deep"];
const HAIRS: HairId[] = ["buzzFade", "shortCurls", "boxBraids", "waves", "twistsShort"];
const HAIR_COLORS: HairColor[] = ["black", "darkBrown", "brown", "blonde", "grey"];
const EYE_COLORS: AvatarDNA["eyeColor"][] = ["brown", "hazel", "green", "blue"];
const EYE_SHAPES: EyeShape[] = ["round", "almond"];
const EYE_SPACING: EyeSpacing[] = ["narrow", "normal", "wide"];
const BROW_THICKNESS: BrowThickness[] = ["thin", "medium", "thick"];
const HAIRLINES: Hairline[] = ["low", "medium", "high"];
const HEAD_SHAPES: HeadShape[] = ["round", "oval", "square"];
const NOSES: Nose[] = ["small", "medium", "wide"];
const FACIAL_HAIR: FacialHairId[] = ["none", "mustache", "goatee", "fullBeard"];

export const AVATAR_STORAGE_KEY = "avatar:dna";
export const AVATAR_EVENT = "avatar:updated";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** xorshift32 seeded by a string for stable randomness */
function seed32(seed: string) {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash ^ seed.charCodeAt(i)) * 16777619 >>> 0;
  }
  let state = hash || 0x9e3779b9;
  return () => {
    state ^= state << 13;
    state >>>= 0;
    state ^= state >> 17;
    state >>>= 0;
    state ^= state << 5;
    state >>>= 0;
    return (state >>> 0) / 0xffffffff;
  };
}

function pick<T>(random: () => number, values: readonly T[]): T {
  const index = Math.floor(random() * values.length);
  return values[index];
}

/** Create a believable, varied avatar from a seed (or time-based seed). */
export function randomizeAvatar(seed?: string): AvatarDNA {
  const rnd = seed32(seed ?? String(Date.now()));
  const skin = pick(rnd, SKINS);

  const hairColor = (() => {
    const pool: HairColor[] =
      skin === "porcelain"
        ? ["black", "darkBrown", "brown", "blonde", "grey"]
        : skin === "light"
        ? ["black", "darkBrown", "brown", "blonde", "grey"]
        : skin === "tan"
        ? ["black", "darkBrown", "brown", "grey"]
        : skin === "brown"
        ? ["black", "darkBrown", "brown", "grey"]
        : ["black", "darkBrown", "grey"];
    return pick(rnd, pool);
  })();

  const hair = pick(rnd, HAIRS);
  const facialHair: FacialHairId = rnd() < 0.35 ? pick(rnd, FACIAL_HAIR.filter((style) => style !== "none")) : "none";

  return {
    skin,
    hair,
    hairColor,
    facialHair,
    eyeColor: pick(rnd, EYE_COLORS),
    eyeShape: pick(rnd, EYE_SHAPES),
    eyeSpacing: pick(rnd, EYE_SPACING),
    brows: true,
    browThickness: pick(rnd, BROW_THICKNESS),
    mouth: rnd() < 0.45 ? "smile" : "neutral",
    headShape: pick(rnd, HEAD_SHAPES),
    hairline: pick(rnd, HAIRLINES),
    nose: pick(rnd, NOSES),
  };
}

/** Merge + clamp unknowns back to defaults. */
export function normalizeDNA(partial?: Partial<AvatarDNA>): AvatarDNA {
  return { ...DEFAULT_DNA, ...(partial ?? {}) };
}

function dispatchAvatarEvent(detail: AvatarDNA) {
  if (!isBrowser() || typeof window.dispatchEvent !== "function") return;
  try {
    const event = typeof window.CustomEvent === "function"
      ? new CustomEvent<AvatarDNA>(AVATAR_EVENT, { detail })
      : ((): Event => {
          const fallback = document.createEvent("CustomEvent");
          fallback.initCustomEvent(AVATAR_EVENT, false, false, detail);
          return fallback;
        })();
    window.dispatchEvent(event);
  } catch {
    // ignore dispatch failures
  }
}

/** Persist / load */
export function saveAvatarDNA(dna: AvatarDNA) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(dna));
    dispatchAvatarEvent(dna);
  } catch {
    // ignore storage errors
  }
}

export function loadAvatarDNA(): AvatarDNA {
  if (!isBrowser()) return DEFAULT_DNA;
  try {
    const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return DEFAULT_DNA;
    const parsed = JSON.parse(raw) as Partial<AvatarDNA>;
    return normalizeDNA(parsed);
  } catch {
    return DEFAULT_DNA;
  }
}

export function clearAvatarDNA() {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  dispatchAvatarEvent(DEFAULT_DNA);
}
