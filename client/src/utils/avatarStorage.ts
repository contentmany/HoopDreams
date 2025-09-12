import { AvatarData, DEFAULT_AVATAR, SKIN_TONE_OPTIONS, HAIR_STYLE_OPTIONS, EYE_OPTIONS, BROW_OPTIONS, NOSE_OPTIONS, MOUTH_OPTIONS, FACIAL_HAIR_OPTIONS } from '@/types/avatar';

const AVATAR_STORAGE_KEY = 'hd:avatar';
const PLAYER_AVATAR_STORAGE_KEY = 'hd:player.avatar';

export const avatarStorage = {
  get(): AvatarData {
    try {
      const stored = localStorage.getItem(AVATAR_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_AVATAR, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse avatar data:', e);
    }
    return DEFAULT_AVATAR;
  },

  set(avatar: AvatarData): void {
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatar));
    } catch (e) {
      console.warn('Failed to save avatar data:', e);
    }
  },

  clear(): void {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  }
};

export const playerAvatarStorage = {
  get(): AvatarData | null {
    try {
      const stored = localStorage.getItem(PLAYER_AVATAR_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_AVATAR, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse player avatar data:', e);
    }
    return null;
  },

  set(avatar: AvatarData): void {
    try {
      localStorage.setItem(PLAYER_AVATAR_STORAGE_KEY, JSON.stringify(avatar));
    } catch (e) {
      console.warn('Failed to save player avatar data:', e);
    }
  },

  clear(): void {
    localStorage.removeItem(PLAYER_AVATAR_STORAGE_KEY);
  }
};

export const generateRandomAvatar = (teamPrimaryColor: string = '#7a5bff'): AvatarData => {
  const randomChoice = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
  
  const avatar: AvatarData = {
    skinTone: randomChoice(SKIN_TONE_OPTIONS),
    hairStyle: randomChoice(HAIR_STYLE_OPTIONS),
    hairColor: randomChoice(['#4a3728', '#2d1b14', '#8b6914', '#d4b852', '#c95429', '#000000']),
    eyes: randomChoice(EYE_OPTIONS),
    brows: randomChoice(BROW_OPTIONS),
    nose: randomChoice(NOSE_OPTIONS),
    mouth: randomChoice(MOUTH_OPTIONS),
    facialHair: randomChoice(FACIAL_HAIR_OPTIONS),
    headband: {
      on: Math.random() < 0.1, // 10% chance
      color: teamPrimaryColor
    },
    jerseyColor: teamPrimaryColor,
    shortsColor: teamPrimaryColor,
    shoesColor: randomChoice(['#ffffff', '#000000', teamPrimaryColor])
  };
  
  return avatar;
};

export const copyAvatarToPlayer = (): void => {
  const currentAvatar = avatarStorage.get();
  playerAvatarStorage.set(currentAvatar);
};