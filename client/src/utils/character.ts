import { type CharacterLook, DEFAULT_CHARACTER_LOOK, SKIN_OPTIONS, HAIR_OPTIONS, BROW_OPTIONS, EYE_OPTIONS, NOSE_OPTIONS, MOUTH_OPTIONS, ACCESSORY_OPTIONS, TEAM_COLORS } from '@/types/character';

// Player storage utilities for character look data
export function getDraftPlayer() {
  const stored = localStorage.getItem('hd:tempPlayer');
  if (stored) {
    const player = JSON.parse(stored);
    return {
      ...player,
      look: {
        ...DEFAULT_CHARACTER_LOOK,
        ...player.look
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
    look: playerData.look || existing?.look || DEFAULT_CHARACTER_LOOK
  };
  localStorage.setItem('hd:tempPlayer', JSON.stringify(updated));
}

export function getActivePlayer() {
  const stored = localStorage.getItem('hd:player');
  if (stored) {
    const player = JSON.parse(stored);
    return {
      ...player,
      look: {
        ...DEFAULT_CHARACTER_LOOK,
        ...player.look
      }
    };
  }
  return null;
}

// Random character look generator
export function generateRandomCharacterLook(): CharacterLook {
  const skin = SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)];
  const hair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)];
  const brows = BROW_OPTIONS[Math.floor(Math.random() * BROW_OPTIONS.length)];
  const eyes = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)];
  const nose = NOSE_OPTIONS[Math.floor(Math.random() * NOSE_OPTIONS.length)];
  const mouth = MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)];
  const accessory = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)];
  const teamColors = Object.values(TEAM_COLORS);
  const color = teamColors[Math.floor(Math.random() * teamColors.length)];

  return {
    skin,
    hair,
    brows,
    eyes,
    nose,
    mouth,
    accessory,
    jerseyColor: color,
    shortsColor: color,
    teamNumber: Math.floor(Math.random() * 99) + 1,
  };
}