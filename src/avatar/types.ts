export type Px = number;

export type Layer =
  | "body"
  | "head"
  | "hairBack"
  | "accBehind"
  | "face"
  | "accFront"
  | "hairFront";

export interface HeadBox {
  x: Px;
  y: Px;
  w: Px;
  h: Px;
  tilt: number;
}

export interface AssetDef {
  id: string;
  kind: "hair" | "accessory";
  imagePath: string;
  fit: {
    mode: "coverWidth" | "coverEllipse" | "pin";
    scaleMin?: number;
    scaleMax?: number;
    padTop?: number;
    padSides?: number;
  };
  split?: {
    hasBackLayer: boolean;
    maskHeadOverlap?: boolean;
  };
  offset?: {
    dx: number;
    dy: number;
  };
}

export interface AvatarState {
  head: HeadBox;
  hairId?: string;
  accessories: string[];
}
