import { AssetDef } from "./types";

export const HAIR: AssetDef[] = [
  {
    id: "hair_afro",
    kind: "hair",
    imagePath: "/assets/hair/afro.svg",
    fit: {
      mode: "coverWidth",
      scaleMin: 0.95,
      scaleMax: 1.25,
      padTop: 24,
      padSides: 8,
    },
    split: { hasBackLayer: true, maskHeadOverlap: true },
  },
  {
    id: "hair_straight_long",
    kind: "hair",
    imagePath: "/assets/hair/straight_long.svg",
    fit: {
      mode: "coverWidth",
      scaleMin: 1.0,
      scaleMax: 1.35,
      padTop: 6,
      padSides: 4,
    },
    split: { hasBackLayer: true, maskHeadOverlap: true },
  },
  {
    id: "hair_buzz",
    kind: "hair",
    imagePath: "/assets/hair/buzz.svg",
    fit: {
      mode: "coverEllipse",
      scaleMin: 0.95,
      scaleMax: 1.05,
      padTop: 0,
      padSides: 0,
    },
    split: { hasBackLayer: false, maskHeadOverlap: true },
  },
];

export const ACCESSORIES: AssetDef[] = [
  {
    id: "glasses_round",
    kind: "accessory",
    imagePath: "/assets/acc/glasses_round.svg",
    fit: { mode: "pin" },
  },
  {
    id: "beanie",
    kind: "accessory",
    imagePath: "/assets/acc/beanie.svg",
    fit: {
      mode: "coverWidth",
      scaleMin: 0.95,
      scaleMax: 1.2,
      padTop: 6,
      padSides: 2,
    },
    split: { hasBackLayer: false, maskHeadOverlap: true },
  },
];
