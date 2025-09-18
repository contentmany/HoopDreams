export type HairStyleId =
  | "bald"
  | "buzz_fade"
  | "waves"
  | "short_curls"
  | "braids_box"
  | "twists_two_strand"
  | "locs_medium";

export type Anchor = { x: number; y: number; w: number; h: number };
export type LayerName = "under" | "over";

export type HairMeta = {
  id: HairStyleId;
  label: string;
  anchor: Anchor;
  overOccludesBrow?: boolean;
  defaultLayer: LayerName;
};

export const HEAD_ANCHOR: Anchor = { x: 270, y: 210, w: 460, h: 420 };

export const HAIR: Record<HairStyleId, HairMeta> = {
  bald: {
    id: "bald",
    label: "Bald",
    anchor: HEAD_ANCHOR,
    defaultLayer: "under",
  },
  buzz_fade: {
    id: "buzz_fade",
    label: "Buzz Fade",
    anchor: HEAD_ANCHOR,
    defaultLayer: "under",
  },
  waves: {
    id: "waves",
    label: "Waves",
    anchor: HEAD_ANCHOR,
    defaultLayer: "under",
    overOccludesBrow: true,
  },
  short_curls: {
    id: "short_curls",
    label: "Short Curls",
    anchor: HEAD_ANCHOR,
    defaultLayer: "under",
  },
  braids_box: {
    id: "braids_box",
    label: "Box Braids",
    anchor: HEAD_ANCHOR,
    defaultLayer: "over",
  },
  twists_two_strand: {
    id: "twists_two_strand",
    label: "Two-Strand Twists",
    anchor: HEAD_ANCHOR,
    defaultLayer: "over",
  },
  locs_medium: {
    id: "locs_medium",
    label: "Medium Locs",
    anchor: HEAD_ANCHOR,
    defaultLayer: "over",
  },
};

export type HairColor = { base: string; shine: string };

export const HAIR_COLORS: Record<string, HairColor> = {
  black: { base: "#1b1b1b", shine: "#2a2a2a" },
  deep_brown: { base: "#3a2c22", shine: "#4a3a2d" },
  brown: { base: "#5a4331", shine: "#6b5341" },
  dark_blond: { base: "#ad895f", shine: "#c59e74" },
};
