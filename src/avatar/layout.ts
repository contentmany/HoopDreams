import { AssetDef, HeadBox } from "./types";

export interface Placed {
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  image: HTMLImageElement | SVGImageElement | null;
  layer: "hairBack" | "hairFront" | "accBehind" | "accFront";
  assetId: string;
}

const warnedMissing = new Set<string>();

async function loadImage(path: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const im = new Image();
    im.width = im.width || 256;
    im.height = im.height || 256;
    let settled = false;
    const finish = (img: HTMLImageElement | null) => {
      if (settled) return;
      settled = true;
      resolve(img);
    };
    im.onload = () => finish(im);
    im.onerror = () => finish(im);
    try {
      im.src = path;
    } catch (err) {
      if (!warnedMissing.has(path)) {
        warnedMissing.add(path);
        console.warn("[avatar] invalid image path", path, err);
      }
      finish(im);
    }
    setTimeout(() => finish(im), 0);
  });
}

export function headTopY(head: HeadBox) {
  return head.y;
}

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (typeof min === "number") next = Math.max(min, next);
  if (typeof max === "number") next = Math.min(max, next);
  return next;
}

function resolvePadSides(w: number, padSides = 0) {
  return { width: w + padSides * 2, left: padSides };
}

export async function layoutAsset(
  asset: AssetDef,
  head: HeadBox,
): Promise<Placed[]> {
  const im = await loadImage(asset.imagePath);
  if (!im && !warnedMissing.has(asset.imagePath)) {
    warnedMissing.add(asset.imagePath);
    console.warn("[avatar] missing", asset.imagePath);
  }

  let scale = 1;
  const naturalW = im?.width || head.w;
  const naturalH = im?.height || head.h;
  if (asset.fit.mode === "coverWidth") {
    scale = head.w / naturalW;
  } else if (asset.fit.mode === "coverEllipse") {
    const s1 = head.w / naturalW;
    const s2 = head.h / naturalH;
    scale = Math.max(s1, s2);
  }
  scale = clamp(scale, asset.fit.scaleMin, asset.fit.scaleMax);

  const scaledW = naturalW * scale;
  const scaledH = naturalH * scale;
  const centerX = head.x + head.w / 2;
  const padTop = asset.fit.padTop ?? 0;
  const padSides = asset.fit.padSides ?? 0;
  const offsetX = asset.offset?.dx ?? 0;
  const offsetY = asset.offset?.dy ?? 0;

  let x = centerX - scaledW / 2;
  let y = headTopY(head) - padTop - 0.0001;

  if (asset.fit.mode === "pin") {
    const eyeLine = head.y + head.h * 0.45;
    x = centerX - scaledW / 2;
    y = eyeLine - scaledH / 2;
  }

  const padded = resolvePadSides(scaledW, padSides);
  x -= padded.left;
  const drawW = padded.width;
  const drawH = scaledH;
  x += offsetX;
  y += offsetY;

  const rotation = head.tilt || 0;
  const front = asset.kind === "hair" ? "hairFront" : "accFront";
  const back = asset.kind === "hair" ? "hairBack" : "accBehind";

  const placements: Placed[] = [];
  if (asset.split?.hasBackLayer) {
    placements.push({
      x,
      y,
      w: drawW,
      h: drawH,
      rotation,
      image: im,
      layer: back,
      assetId: asset.id,
    });
  }
  placements.push({
    x,
    y,
    w: drawW,
    h: drawH,
    rotation,
    image: im,
    layer: front,
    assetId: asset.id,
  });

  return placements;
}
