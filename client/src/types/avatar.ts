export interface AvatarData {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyes: string;
  brows: string;
  nose: string;
  mouth: string;
  facialHair: string;
  headband: {
    on: boolean;
    color: string;
  };
  jerseyColor: string;
  shortsColor: string;
  shoesColor: string;
}

export const DEFAULT_AVATAR: AvatarData = {
  skinTone: 'tan',
  hairStyle: 'short',
  hairColor: '#4a3728',
  eyes: 'default',
  brows: 'default',
  nose: 'default',
  mouth: 'default',
  facialHair: 'none',
  headband: {
    on: false,
    color: '#7a5bff'
  },
  jerseyColor: '#7a5bff',
  shortsColor: '#5a4bcf',
  shoesColor: '#ffffff'
};

export const SKIN_TONE_OPTIONS = [
  'light', 'tan', 'olive', 'brown', 'dark', 'deep'
];

export const HAIR_STYLE_OPTIONS = [
  'short', 'curly', 'afro', 'braids', 'buzz', 'fade', 'bald'
];

export const EYE_OPTIONS = [
  'default'
];

export const BROW_OPTIONS = [
  'default'
];

export const NOSE_OPTIONS = [
  'default'
];

export const MOUTH_OPTIONS = [
  'default'
];

export const FACIAL_HAIR_OPTIONS = [
  'none', 'default'
];

export type AvatarStageSize = 'xs' | 'sm' | 'md' | 'lg';

export const STAGE_DIMENSIONS = {
  xs: { width: 72, height: 96 },
  sm: { width: 96, height: 128 },
  md: { width: 112, height: 148 },
  lg: { width: 128, height: 168 }
} as const;