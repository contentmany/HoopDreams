import type { AvatarDNA } from './types';
import { SKIN_TONES, EYE_COLORS, EYE_SHAPES, BROW_STYLES, HAIR_STYLES, FACIAL_HAIR_STYLES, HEAD_GEAR_OPTIONS, ACCENT_OPTIONS } from './types';
import { hairPalette, headGearColorPalette } from './colors';

// Mulberry32 deterministic RNG
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

// Pick random item from array using RNG
function pickRandom<T>(rng: () => number, array: readonly T[]): T {
  return array[Math.floor(rng() * array.length)];
}

// Generate DNA from seed
export function dnaFromSeed(seed: number): AvatarDNA {
  const rng = mulberry32(seed);
  
  const skin = pickRandom(rng, SKIN_TONES);
  const eyeColor = pickRandom(rng, EYE_COLORS);
  const eyeShape = pickRandom(rng, EYE_SHAPES);
  const brow = pickRandom(rng, BROW_STYLES);
  const hairStyle = pickRandom(rng, HAIR_STYLES);
  const hairColor = pickRandom(rng, hairPalette);
  const facialHair = pickRandom(rng, FACIAL_HAIR_STYLES);
  const headGear = pickRandom(rng, HEAD_GEAR_OPTIONS);
  const accent = pickRandom(rng, ACCENT_OPTIONS);
  
  // Head gear color only if headGear is not 'none'
  const headGearColor = headGear === 'none' ? undefined : pickRandom(rng, headGearColorPalette);
  
  // Default app theme primary color for jersey
  const jerseyColor = '#7A5BFF';

  return {
    seed,
    skin,
    eyeColor,
    eyeShape,
    brow,
    hairStyle,
    hairColor,
    facialHair,
    headGear,
    headGearColor,
    accent,
    jerseyColor
  };
}

// Merge DNA with overrides
export function mergeDNA(base: AvatarDNA, overrides: Partial<AvatarDNA>): AvatarDNA {
  return {
    ...base,
    ...overrides
  };
}

// Generate stable NPC seed
export function npcSeed(teamId: number, index: number): number {
  // Use a simple hash to ensure different team/index combinations produce different seeds
  return ((teamId * 1000) + index) * 1337;
}