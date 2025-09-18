export const SKIN = {
  porcelain: "#f7d9c4",
  light: "#f1c9a5",
  tan: "#d8a06b",
  brown: "#a96b43",
  deep: "#6b3b1f",
} as const;

export const HAIR = {
  black: "#1f1a17",
  dark: "#36251c",
  chestnut: "#5a3a27",
  auburn: "#7b4a28",
  blond: "#b48645",
} as const;

export type SkinToneId = keyof typeof SKIN;
export type HairColorId = keyof typeof HAIR;
