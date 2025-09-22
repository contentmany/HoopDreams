codex/install-hybrid-pixel-avatar-files
export { PixelAvatar8 as PixelAvatar } from "./PixelAvatar8";
export type { PixelAvatarProps } from "./PixelAvatar8";
import React, { useEffect, useMemo, useRef } from "react";
import { AvatarDNA, DEFAULT_DNA } from "./types";
import { eyeHex, hairHex, skinHex } from "./palettes";

/** We paint to a 64×64 grid, then scale up with imageRendering: pixelated */
const GRID = 64;

/* ---------- tiny pixel helpers ---------- */
function px(g: CanvasRenderingContext2D, x: number, y: number, w = 1, h = 1, color?: string) {
  if (color) g.fillStyle = color;
  g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
function hline(g: CanvasRenderingContext2D, x1: number, x2: number, y: number, color: string) {
  px(g, Math.min(x1, x2), y, Math.abs(x2 - x1) + 1, 1, color);
}
function shade(hex: string, pct: number) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  r = Math.min(255, Math.max(0, Math.round(r + r * pct)));
  g = Math.min(255, Math.max(0, Math.round(g + g * pct)));
  b = Math.min(255, Math.max(0, Math.round(b + b * pct)));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* ---------- proportional layout (anatomy-ish) ---------- */
type Layout = {
  cx: number;
  top: number;
  chin: number;
  wTop: number;
  jaw: number;
  eyeY: number;
  noseY: number;
  mouthY: number;
  earY: number;
  sep: number; // half eye separation
  hairlineY: number;
};

function layoutFromDNA(dna: AvatarDNA): Layout {
  const cx = 32;
  const top = 6;
  const chin = 58;
  const H = chin - top;

  // head width/shape
  const shape = dna.headShape ?? DEFAULT_DNA.headShape ?? "round";
  const wTop = (
    {
      round: 22,
      oval: 20,
      square: 23,
    } as const
  )[shape];
  const jaw = (
    {
      round: 18,
      oval: 17,
      square: 20,
    } as const
  )[shape];

  // landmarks (rough human proportions on the grid)
  const eyeY = Math.round(top + H * 0.42);
  const noseY = Math.round(top + H * 0.6);
  const mouthY = Math.round(top + H * 0.73);
  const earY = eyeY + 1;

  // eye spacing
  const spacing = dna.eyeSpacing ?? DEFAULT_DNA.eyeSpacing ?? "normal";
  const sep = (
    {
      narrow: 9,
      normal: 11,
      wide: 13,
    } as const
  )[spacing];

  // hairline
  const hairline = dna.hairline ?? DEFAULT_DNA.hairline ?? "medium";
  const hairlineY = (
    {
      low: top + 10,
      medium: top + 8,
      high: top + 6,
    } as const
  )[hairline];

  return { cx, top, chin, wTop, jaw, eyeY, noseY, mouthY, earY, sep, hairlineY };
}

/* ---------- draw head with jaw taper and dither shadow ---------- */
function drawHead(g: CanvasRenderingContext2D, dna: AvatarDNA, L: Layout) {
  g.clearRect(0, 0, GRID, GRID);
  const skin = skinHex[dna.skin];
  const H = L.chin - L.top;

  for (let y = L.top; y <= L.chin; y++) {
    const t = (y - L.top) / H; // 0 at crown, 1 at chin
    const ellipseHalf = L.wTop * Math.sqrt(1 - Math.pow(t * 1.1 - 0.5, 2)); // oval-ish top
    const jawHalf = L.jaw * (1 - Math.pow(clamp((t - 0.6) / 0.4, 0, 1), 1.2)); // wider near cheeks, taper to chin
    const half = Math.max(8, Math.round(Math.max(ellipseHalf, jawHalf)));
    hline(g, L.cx - half, L.cx + half, y, skin);

    // left-side shadow (checker dither) for volume
    if (y % 2 === 0) {
      const len = Math.round(half * 0.35);
      hline(g, L.cx - half - 2, L.cx - half - 2 + len, y, shade(skin, -0.22));
    }
  }

  // ears: align with eye line
  for (let y = -2; y <= 2; y++) {
    hline(g, L.cx - (L.wTop + 5), L.cx - (L.wTop + 3), L.earY + y, skin);
    hline(g, L.cx + (L.wTop + 3), L.cx + (L.wTop + 5), L.earY + y, skin);
  }
}

/* ---------- eyes, brows, nose, mouth ---------- */
function drawEyes(g: CanvasRenderingContext2D, dna: AvatarDNA, L: Layout) {
  const shape = dna.eyeShape ?? DEFAULT_DNA.eyeShape;
  const w = shape === "almond" ? 7 : 6;
  const h = shape === "almond" ? 3 : 4;
  const iris = eyeHex[dna.eyeColor];

  for (const side of [-1, 1] as const) {
    const ex = L.cx + side * L.sep;
    // sclera
    for (let y = -Math.floor(h / 2); y <= Math.floor(h / 2); y++) {
      for (let x = -Math.floor(w / 2); x <= Math.floor(w / 2); x++) {
        px(g, ex + x, L.eyeY + y, 1, 1, "#fff");
      }
    }
    // iris/pupil 3×3
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        px(g, ex + x, L.eyeY + y, 1, 1, iris);
      }
    }
    // subtle upper lid line
    hline(g, ex - Math.floor(w / 2), ex + Math.floor(w / 2), L.eyeY - Math.ceil(h / 2) - 1, "#2a2a2a");
  }
}

function drawBrows(g: CanvasRenderingContext2D, dna: AvatarDNA, L: Layout) {
  const hasBrows = dna.brows ?? DEFAULT_DNA.brows ?? true;
  if (!hasBrows) return;
  const thickness = dna.browThickness ?? DEFAULT_DNA.browThickness ?? "medium";
  const thick = (
    {
      thin: 1,
      medium: 2,
      thick: 3,
    } as const
  )[thickness];
  const brow = "#232323";
  for (const side of [-1, 1] as const) {
    const ex = L.cx + side * L.sep;
    for (let i = 0; i < thick; i++) {
      hline(g, ex - 8, ex + 8, L.eyeY - 5 - i, brow);
    }
  }
}

function drawNose(g: CanvasRenderingContext2D, dna: AvatarDNA, L: Layout) {
  const bridge = shade(skinHex[dna.skin], -0.28);
  const baseWidth = dna.nose ?? DEFAULT_DNA.nose ?? "medium";
  const baseW = (
    {
      small: 3,
      medium: 5,
      wide: 7,
    } as const
  )[baseWidth];
  // bridge
  for (let y = -3; y <= 1; y++) {
    px(g, L.cx, L.noseY + y, 1, 1, bridge);
  }
  // base / nostrils
  const half = Math.floor(baseW / 2);
  for (let x = -half; x <= half; x++) {
    px(g, L.cx + x, L.noseY + 2, 1, 1, bridge);
  }
}

function drawMouth(g: CanvasRenderingContext2D, dna: AvatarDNA, L: Layout) {
  const lip = shade(skinHex[dna.skin], -0.55);
  if (dna.mouth === "neutral") {
    hline(g, L.cx - 8, L.cx + 8, L.mouthY, lip);
  } else {
    for (let x = -8; x <= 8; x++) {
      const y = L.mouthY + Math.floor((Math.abs(x) - 8) / 3);
      px(g, L.cx + x, y, 1, 1, lip);
    }
  }
}

/* ---------- hair & facial hair: guaranteed above hairline, away from eyes ---------- */
type HG = (g: CanvasRenderingContext2D, color: string, L: Layout) => void;

type HairStyles = Record<AvatarDNA["hair"], HG>;
const hair: HairStyles = {
  buzzFade: (g, color, L) => {
    for (let y = L.hairlineY - 1; y <= L.eyeY - 1; y++) {
      const t = (y - L.hairlineY) / Math.max(1, L.eyeY - 1 - L.hairlineY);
      const half = Math.round((L.wTop - 2) * (1 - t * 0.15));
      hline(g, L.cx - half, L.cx + half, y, color);
    }
  },
  shortCurls: (g, color, L) => {
    for (let y = L.hairlineY - 4; y <= L.eyeY - 2; y += 3) {
      for (let x = L.cx - (L.wTop - 4) + (((y / 3) & 1) ? 2 : 0); x <= L.cx + (L.wTop - 4); x += 6) {
        px(g, x, y, 2, 2, color);
        px(g, x - 1, y + 1, 1, 1, shade(color, -0.2));
        px(g, x + 2, y + 1, 1, 1, shade(color, -0.2));
      }
    }
    hline(g, L.cx - (L.wTop - 2), L.cx + (L.wTop - 2), L.hairlineY, color);
  },
  boxBraids: (g, color, L) => {
    // crown tiles
    for (let y = L.hairlineY - 6; y <= L.hairlineY; y += 2) {
      for (let x = L.cx - (L.wTop - 6); x <= L.cx + (L.wTop - 6); x += 4) {
        px(g, x, y, 3, 2, color);
      }
    }
    // vertical strands; stop above chin, never over eyes
    for (let x = L.cx - (L.wTop - 6); x <= L.cx + (L.wTop - 6); x += 6) {
      for (let y = L.hairlineY + 1; y <= Math.min(L.chin - 6, L.eyeY + 16); y += 2) {
        px(g, x, y, 2, 2, color);
        if ((y / 2) % 2 === 0) {
          px(g, x + 1, y + 1, 1, 1, shade(color, -0.25));
        }
      }
      px(g, x, Math.min(L.chin - 6, L.eyeY + 16) + 2, 2, 2, shade(color, -0.35));
    }
  },
  waves: (g, color, L) => {
    for (let y = L.hairlineY - 2; y <= L.eyeY - 1; y += 2) {
      for (let x = L.cx - (L.wTop - 6); x <= L.cx + (L.wTop - 6); x += 5) {
        const offset = Math.floor((y - (L.hairlineY - 2)) / 2);
        px(g, x + offset, y, 3, 1, color);
      }
    }
    hline(g, L.cx - (L.wTop - 2), L.cx + (L.wTop - 2), L.hairlineY, color);
  },
  twistsShort: (g, color, L) => {
    for (let x = L.cx - (L.wTop - 6); x <= L.cx + (L.wTop - 6); x += 4) {
      for (let y = L.hairlineY - 3; y <= L.eyeY - 2; y += 3) {
        px(g, x, y, 2, 2, color);
        px(g, x + 1, y + 2, 1, 1, shade(color, -0.25));
      }
    }
    hline(g, L.cx - (L.wTop - 2), L.cx + (L.wTop - 2), L.hairlineY, color);
  },
};

type FG = (g: CanvasRenderingContext2D, color: string, L: Layout) => void;
const facial: Record<AvatarDNA["facialHair"], FG> = {
  none: () => {},
  mustache: (g, color, L) => {
    const y = L.mouthY - 2;
    for (let x = -6; x <= 6; x++) {
      px(g, L.cx + x, y + Math.floor(Math.abs(x) / 4), 1, 1, color);
    }
  },
  goatee: (g, color, L) => {
    for (let x = -3; x <= 3; x++) {
      px(g, L.cx + x, L.mouthY + 2 + Math.floor(Math.abs(x) / 2), 1, 1, color);
    }
    for (let y = L.mouthY + 3; y <= L.mouthY + 7; y++) {
      px(g, L.cx - 2, y, 4, 1, color);
    }
  },
  fullBeard: (g, color, L) => {
    // cheeks down to jaw
    for (let y = L.mouthY - 1; y <= L.chin - 2; y++) {
      px(g, L.cx - (L.wTop - 10), y, 1, 1, color);
      px(g, L.cx + (L.wTop - 10), y, 1, 1, color);
    }
    // under-mouth
    for (let x = -(L.wTop - 8); x <= L.wTop - 8; x++) {
      px(g, L.cx + x, L.mouthY + 3 + Math.floor(Math.abs(x) / 6), 1, 1, color);
    }
  },
};

export type PixelAvatarProps = { dna?: AvatarDNA; size?: number; className?: string };

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ dna = DEFAULT_DNA, size = 128, className }) => {
  const outRef = useRef<HTMLCanvasElement>(null);
  const normalized = useMemo<AvatarDNA>(() => ({ ...DEFAULT_DNA, ...dna }), [dna]);
  const layout = useMemo(() => layoutFromDNA(normalized), [normalized]);
  const hairColor = useMemo(() => hairHex[normalized.hairColor], [normalized.hairColor]);

  useEffect(() => {
    const out = outRef.current;
    if (!out) return;

    const grid = document.createElement("canvas");
    grid.width = GRID;
    grid.height = GRID;
    const g = grid.getContext("2d");
    if (!g) return;
    g.imageSmoothingEnabled = false;

    drawHead(g, normalized, layout);
    drawEyes(g, normalized, layout);
    drawBrows(g, normalized, layout);
    drawNose(g, normalized, layout);
    drawMouth(g, normalized, layout);
    const hairRenderer = hair[normalized.hair] ?? hair.buzzFade;
    hairRenderer(g, hairColor, layout);
    const facialRenderer = facial[normalized.facialHair] ?? facial.none;
    facialRenderer(g, hairColor, layout);

    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, out.width, out.height);
    ctx.drawImage(grid, 0, 0, out.width, out.height);
  }, [normalized, layout, hairColor]);

  const finalSize = size ?? 128;
  return (
    <canvas
      ref={outRef}
      width={finalSize}
      height={finalSize}
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
};
 main
