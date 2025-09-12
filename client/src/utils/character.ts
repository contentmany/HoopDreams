import { type Appearance, DEFAULT_APPEARANCE } from '@/types/appearance';

// Player storage utilities for appearance data
export function getDraftPlayer() {
  const stored = localStorage.getItem('hd:tempPlayer');
  if (stored) {
    const player = JSON.parse(stored);
    return {
      ...player,
      appearance: {
        ...DEFAULT_APPEARANCE,
        ...player.appearance
      }
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
      appearance: {
        ...DEFAULT_APPEARANCE,
        ...player.appearance
      }
    };
  }
  return null;
}

// Random appearance generator
export function generateRandomAppearance(): Appearance {
  const teamColors = ['#7A5BFF', '#38E1C6', '#FF6B35', '#4CAF50', '#E91E63', '#FF9800'];
  const hasHeadband = Math.random() < 0.15; // 15% chance for headband
  
  return {
    skinTone: Math.floor(Math.random() * 6) + 1,
    hairStyle: Math.floor(Math.random() * 10) + 1,
    hairColor: ['black', 'dark-brown', 'brown', 'blonde', 'red', 'grey'][Math.floor(Math.random() * 6)] as any,
    eyes: Math.floor(Math.random() * 3) + 1,
    headband: Math.floor(Math.random() * 4) + 1,
    jersey: Math.floor(Math.random() * 4) + 1,
    accessory: hasHeadband ? 'headband' : null,
    accessoryColor: hasHeadband ? teamColors[Math.floor(Math.random() * teamColors.length)] : '#FFFFFF'
  };
}