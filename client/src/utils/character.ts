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
  const randomSkin = SKIN_OPTIONS[Math.floor(Math.random() * SKIN_OPTIONS.length)];
  const randomHair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)];
  const randomBrow = BROW_OPTIONS[Math.floor(Math.random() * BROW_OPTIONS.length)];
  const randomEye = EYE_OPTIONS[Math.floor(Math.random() * EYE_OPTIONS.length)];
  const randomNose = NOSE_OPTIONS[Math.floor(Math.random() * NOSE_OPTIONS.length)];
  const randomMouth = MOUTH_OPTIONS[Math.floor(Math.random() * MOUTH_OPTIONS.length)];
  const randomAccessory = ACCESSORY_OPTIONS[Math.floor(Math.random() * ACCESSORY_OPTIONS.length)];
  const randomTeamColor = TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)];
  
  return {
    skinTone: randomSkin.id,
    hairStyle: randomHair.id,
    browStyle: randomBrow.id,
    eyeStyle: randomEye.id,
    noseStyle: randomNose.id,
    mouthStyle: randomMouth.id,
    accessoryStyle: randomAccessory.id,
    jerseyColor: randomTeamColor.color,
    shortsColor: randomTeamColor.color,
    teamNumber: Math.floor(Math.random() * 99) + 1
  };
}