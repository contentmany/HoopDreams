import type { SkinTone, EyeColor } from './types';

export const skinHex: Record<SkinTone, string> = {
  porcelain: '#f6d8c9',
  fair: '#eac2a8',
  olive: '#d7b08a',
  tan: '#b9835a',
  brown: '#8a5b3d',
  deep: '#5b3926'
};

export const eyeHex: Record<EyeColor, string> = {
  brown: '#6a4a2f',
  darkBrown: '#3c2a1a',
  hazel: '#7a5a2f',
  green: '#3d7a5a',
  blue: '#3a66a8',
  gray: '#6b6f7a'
};

export const hairPalette = [
  '#1b1b1f', // very dark
  '#222222', // dark
  '#2a251f', // dark brown
  '#3a2d22', // brown
  '#4a3528', // medium brown
  '#5a3d2e'  // light brown
];

export const headGearColorPalette = [
  '#ffffff', // white
  '#ff3b30', // red
  '#34c759', // green
  '#0a84ff', // blue
  '#ffd60a', // yellow
  '#ff9f0a'  // orange
];

// Helper function to darken a color slightly for brow rendering
export function darkenColor(hex: string, amount: number = 0.2): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(255 * amount);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}