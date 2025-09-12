import type { AvatarDNA } from './types';
import { dnaFromSeed, mergeDNA } from './factory';
import { renderHeadPNG } from './render';

export interface Avatar {
  dna: AvatarDNA;
  toDataURL: (size?: number) => string;
}

export function createAvatar(seedOrDNA: number | Partial<AvatarDNA>): Avatar {
  let dna: AvatarDNA;
  
  if (typeof seedOrDNA === 'number') {
    dna = dnaFromSeed(seedOrDNA);
  } else {
    // Start with a base DNA from seed 0, then merge overrides
    const baseDNA = dnaFromSeed(seedOrDNA.seed || 0);
    dna = mergeDNA(baseDNA, seedOrDNA);
  }
  
  return {
    dna,
    toDataURL: (size = 96) => renderHeadPNG(dna, size)
  };
}

export function randomAvatar(seed: number): Avatar {
  return createAvatar(seed);
}

// Export main types and functions
export type { AvatarDNA } from './types';
export { dnaFromSeed, mergeDNA, npcSeed } from './factory';
export { renderHeadPNG } from './render';