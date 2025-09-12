export type SkinTone = 'porcelain' | 'fair' | 'olive' | 'tan' | 'brown' | 'deep';

export type EyeColor = 'brown' | 'darkBrown' | 'hazel' | 'green' | 'blue' | 'gray';

export type EyeShape = 'round' | 'almond' | 'narrow';

export type BrowStyle = 'straight' | 'soft' | 'arched';

export type HairStyle = 'short' | 'fade' | 'waves' | 'afroLow' | 'afroHigh' | 'braids' | 'twists' | 'locs' | 'buzz' | 'bald';

export type FacialHair = 'none' | 'goatee' | 'mustache' | 'beardShort' | 'beardFull';

export type HeadGear = 'none' | 'headband' | 'durag' | 'beanie';

export type Accent = 'none' | 'earringL' | 'earringR' | 'earringBoth';

export interface AvatarDNA {
  seed: number;
  skin: SkinTone;
  eyeColor: EyeColor;
  eyeShape: EyeShape;
  brow: BrowStyle;
  hairStyle: HairStyle;
  hairColor: string; // hex string
  facialHair: FacialHair;
  headGear: HeadGear;
  headGearColor?: string; // hex string, optional
  accent: Accent;
  jerseyColor: string; // hex string for tiny collar hint
}

export const SKIN_TONES: SkinTone[] = ['porcelain', 'fair', 'olive', 'tan', 'brown', 'deep'];
export const EYE_COLORS: EyeColor[] = ['brown', 'darkBrown', 'hazel', 'green', 'blue', 'gray'];
export const EYE_SHAPES: EyeShape[] = ['round', 'almond', 'narrow'];
export const BROW_STYLES: BrowStyle[] = ['straight', 'soft', 'arched'];
export const HAIR_STYLES: HairStyle[] = ['short', 'fade', 'waves', 'afroLow', 'afroHigh', 'braids', 'twists', 'locs', 'buzz', 'bald'];
export const FACIAL_HAIR_STYLES: FacialHair[] = ['none', 'goatee', 'mustache', 'beardShort', 'beardFull'];
export const HEAD_GEAR_OPTIONS: HeadGear[] = ['none', 'headband', 'durag', 'beanie'];
export const ACCENT_OPTIONS: Accent[] = ['none', 'earringL', 'earringR', 'earringBoth'];