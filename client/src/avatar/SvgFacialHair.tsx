import type { ReactNode } from "react";
import type { HairColor } from "./AvatarKit";

export const JAW_ANCHOR = { x: 360, y: 540, w: 280, h: 180 } as const;

export type FacialId = "goatee_small" | "goatee_full" | "mustache_thin" | "none";

const darken = (hex: string, factor = 0.9) => {
  const value = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const shineOpacity = 0.35;

const rel = (anchor: typeof JAW_ANCHOR, tX: number, tY: number) => ({
  x: anchor.x + anchor.w * tX,
  y: anchor.y + anchor.h * tY,
});

function goateeSmall(color: HairColor): ReactNode {
  const { x, y } = rel(JAW_ANCHOR, 0.5, 0.72);
  return (
    <g data-part="facial" data-style="goatee_small">
      <ellipse cx={x} cy={y} rx={JAW_ANCHOR.w * 0.2} ry={JAW_ANCHOR.h * 0.25} fill={darken(color.base, 0.92)} />
      <ellipse
        cx={x}
        cy={y - JAW_ANCHOR.h * 0.05}
        rx={JAW_ANCHOR.w * 0.12}
        ry={JAW_ANCHOR.h * 0.12}
        fill={color.shine}
        fillOpacity={shineOpacity}
      />
    </g>
  );
}

function goateeFull(color: HairColor): ReactNode {
  const top = rel(JAW_ANCHOR, 0.5, 0.55);
  const bottom = rel(JAW_ANCHOR, 0.5, 0.88);
  return (
    <g data-part="facial" data-style="goatee_full">
      <path
        d={`M ${JAW_ANCHOR.x + JAW_ANCHOR.w * 0.1} ${top.y} Q ${top.x} ${top.y + JAW_ANCHOR.h * 0.18} ${JAW_ANCHOR.x +
          JAW_ANCHOR.w * 0.1} ${bottom.y} L ${JAW_ANCHOR.x + JAW_ANCHOR.w * 0.9} ${bottom.y} Q ${top.x} ${top.y +
          JAW_ANCHOR.h * 0.18} ${JAW_ANCHOR.x + JAW_ANCHOR.w * 0.9} ${top.y} Z`}
        fill={darken(color.base, 0.88)}
      />
      <path
        d={`M ${JAW_ANCHOR.x + JAW_ANCHOR.w * 0.18} ${top.y + JAW_ANCHOR.h * 0.1} Q ${top.x} ${top.y +
          JAW_ANCHOR.h * 0.24} ${JAW_ANCHOR.x + JAW_ANCHOR.w * 0.82} ${top.y + JAW_ANCHOR.h * 0.1}`}
        stroke={color.shine}
        strokeWidth={JAW_ANCHOR.h * 0.08}
        strokeLinecap="round"
        opacity={shineOpacity}
      />
    </g>
  );
}

function mustacheThin(color: HairColor): ReactNode {
  const mid = rel(JAW_ANCHOR, 0.5, 0.5);
  return (
    <g data-part="facial" data-style="mustache_thin">
      <path
        d={`M ${mid.x - JAW_ANCHOR.w * 0.4} ${mid.y} Q ${mid.x - JAW_ANCHOR.w * 0.1} ${mid.y - JAW_ANCHOR.h * 0.15} ${mid.x} ${
          mid.y - JAW_ANCHOR.h * 0.02
        } Q ${mid.x + JAW_ANCHOR.w * 0.1} ${mid.y - JAW_ANCHOR.h * 0.15} ${mid.x + JAW_ANCHOR.w * 0.4} ${mid.y}`}
        stroke={darken(color.base, 0.85)}
        strokeWidth={JAW_ANCHOR.h * 0.18}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M ${mid.x - JAW_ANCHOR.w * 0.38} ${mid.y - JAW_ANCHOR.h * 0.02} Q ${mid.x} ${mid.y - JAW_ANCHOR.h * 0.2} ${mid.x +
          JAW_ANCHOR.w * 0.38} ${mid.y - JAW_ANCHOR.h * 0.02}`}
        stroke={color.shine}
        strokeWidth={JAW_ANCHOR.h * 0.08}
        strokeLinecap="round"
        fill="none"
        opacity={shineOpacity}
      />
    </g>
  );
}

export function renderFacial(id: FacialId, opts: { color: HairColor }): ReactNode {
  if (id === "none") return null;
  switch (id) {
    case "goatee_small":
      return goateeSmall(opts.color);
    case "goatee_full":
      return goateeFull(opts.color);
    case "mustache_thin":
      return mustacheThin(opts.color);
    default:
      return null;
  }
}
