export type Appearance = {
  skinTone: number;   // 1..6
  hairStyle: number;  // 1..10
  hairColor: 'black' | 'dark-brown' | 'brown' | 'blonde' | 'red' | 'grey';
  eyes: number;       // 1..3
  headband: number;   // 1..4  (1 = off)
  jersey: number;     // 1..4
};

export const DEFAULT_APPEARANCE: Appearance = {
  skinTone: 3,        // Medium tone
  hairStyle: 1,       // Short
  hairColor: 'black',
  eyes: 1,            // Default
  headband: 1,        // Off
  jersey: 1           // Neutral
};

// Skin tone colors (CSS values)
export const SKIN_COLORS = {
  1: '#F4C2A1',  // Light
  2: '#E8B394',  // Light-medium
  3: '#D4A574',  // Medium (tan)
  4: '#C49464',  // Medium-dark
  5: '#A67C52',  // Dark
  6: '#8B4513'   // Very dark
};

// Hair colors
export const HAIR_COLORS = {
  'black': '#2C1810',
  'dark-brown': '#5D4037',
  'brown': '#8D6E63',
  'blonde': '#FFC107',
  'red': '#A0522D',
  'grey': '#9E9E9E'
};

// Hair style names for UI
export const HAIR_STYLE_NAMES = {
  1: 'Short',
  2: 'Fade',
  3: 'Afro',
  4: 'Braids',
  5: 'Buzz',
  6: 'Curly',
  7: 'Twists',
  8: 'Locs',
  9: 'Shag',
  10: 'Bald'
};

// Eye style names
export const EYE_STYLE_NAMES = {
  1: 'Default',
  2: 'Sharp',
  3: 'Soft'
};

// Headband names  
export const HEADBAND_NAMES = {
  1: 'None',
  2: 'White',
  3: 'Black',
  4: 'Team'
};

// Jersey names
export const JERSEY_NAMES = {
  1: 'Neutral',
  2: 'Team A',
  3: 'Team B', 
  4: 'White'
};