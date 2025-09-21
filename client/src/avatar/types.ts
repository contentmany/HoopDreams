export type SkinTone = "porcelain" | "light" | "tan" | "brown" | "deep";
export type HairColor = "black" | "darkBrown" | "brown" | "blonde" | "grey";
export type HairId = "buzzFade" | "shortCurls" | "boxBraids" | "waves" | "twistsShort";
export type FacialHairId = "none" | "mustache" | "goatee" | "fullBeard";

/** Subtle shape controls: defaults match our previous look */
export type HeadShape = "round" | "oval" | "square";
export type EyeShape = "round" | "almond";
export type EyeSpacing = "narrow" | "normal" | "wide";
export type BrowThickness = "thin" | "medium" | "thick";
export type Hairline = "low" | "medium" | "high";
export type Nose = "small" | "medium" | "wide";

export type AvatarDNA = {
  skin: SkinTone;
  hair: HairId;
  hairColor: HairColor;
  facialHair: FacialHairId;

  eyeColor: "brown" | "hazel" | "green" | "blue";
  eyeShape: EyeShape;
  eyeSpacing?: EyeSpacing;

  brows?: boolean;
  browThickness?: BrowThickness;

  mouth: "neutral" | "smile";

  headShape?: HeadShape;
  hairline?: Hairline;
  nose?: Nose;
};

export const DEFAULT_DNA: AvatarDNA = {
  skin: "tan",
  hair: "buzzFade",
  hairColor: "black",
  facialHair: "none",

  eyeColor: "brown",
  eyeShape: "round",
  eyeSpacing: "normal",

  brows: true,
  browThickness: "medium",

  mouth: "neutral",

  headShape: "round",
  hairline: "medium",
  nose: "medium",
};
