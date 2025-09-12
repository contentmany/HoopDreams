import { type Appearance, DEFAULT_APPEARANCE } from '@/types/appearance';

// Player storage utilities for appearance data
export function getDraftPlayer() {
  const stored = localStorage.getItem('hd:tempPlayer');
  if (stored) {
    const player = JSON.parse(stored);
    return {
      ...player,
      appearance: player.appearance || DEFAULT_APPEARANCE
    };
  }
  return null;
}

export function saveDraftPlayer(playerData: any) {
  const existing = getDraftPlayer();
  const updated = {
    ...existing,
    ...playerData,
    appearance: playerData.appearance || existing?.appearance || DEFAULT_APPEARANCE
  };
  localStorage.setItem('hd:tempPlayer', JSON.stringify(updated));
}

export function getActivePlayer() {
  const stored = localStorage.getItem('hd:player');
  if (stored) {
    const player = JSON.parse(stored);
    return {
      ...player,
      appearance: player.appearance || DEFAULT_APPEARANCE
    };
  }
  return null;
}

// Random appearance generator
export function generateRandomAppearance(): Appearance {
  return {
    skinTone: Math.floor(Math.random() * 6) + 1,
    hairStyle: Math.floor(Math.random() * 10) + 1,
    hairColor: ['black', 'dark-brown', 'brown', 'blonde', 'red', 'grey'][Math.floor(Math.random() * 6)] as any,
    eyes: Math.floor(Math.random() * 3) + 1,
    headband: Math.floor(Math.random() * 4) + 1,
    jersey: Math.floor(Math.random() * 4) + 1,
  };
}