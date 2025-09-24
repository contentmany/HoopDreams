// Character Look system for 2D full-body characters
export type CharacterLook = {
  skin: 'light' | 'tan' | 'brown' | 'dark';
  hair: 'short' | 'fade' | 'afro' | 'braids' | 'buzz' | 'curly';
  brows: 'straight' | 'angled';
  eyes: 'default' | 'focused';
  nose: 'small' | 'medium';
  mouth: 'neutral' | 'smile';
  accessory: 'none' | 'headband' | 'goggles';
  jerseyColor: string;
  shortsColor: string;
  teamNumber?: number;
};

export const DEFAULT_CHARACTER_LOOK: CharacterLook = {
  skin: 'tan',
  hair: 'short',
  brows: 'straight',
  eyes: 'default',
  nose: 'medium',
  mouth: 'neutral',
  accessory: 'none',
  jerseyColor: '#7A5BFF',
  shortsColor: '#5A4BCF',
  teamNumber: undefined
};

// Character variant options for UI
export const SKIN_OPTIONS = ['light', 'tan', 'brown', 'dark'] as const;
export const HAIR_OPTIONS = ['short', 'fade', 'afro', 'braids', 'buzz', 'curly'] as const;
export const BROW_OPTIONS = ['straight', 'angled'] as const;
export const EYE_OPTIONS = ['default', 'focused'] as const;
export const NOSE_OPTIONS = ['small', 'medium'] as const;
export const MOUTH_OPTIONS = ['neutral', 'smile'] as const;
export const ACCESSORY_OPTIONS = ['none', 'headband', 'goggles'] as const;

// Layer rendering order (bottom to top)
export const LAYER_ORDER = [
  'shoes',
  'socks', 
  'legs',
  'shorts',
  'jersey',
  'head',
  'mouth',
  'nose',
  'eyes',
  'brows',
  'hair',
  'accessory'
] as const;

// Default team colors
export const TEAM_COLORS = {
  primary: '#7A5BFF',   // Court purple
  secondary: '#38E1C6', // Electric teal
  accent: '#FF6B35'     // Basketball orange
};

// Helper function to darken color for shorts
export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}