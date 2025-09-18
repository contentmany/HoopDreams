import React from "react";
import { HAIR, SKIN } from "./palettes";

type PixelAvatarProps = {
  size?: number;
  skin: keyof typeof SKIN | string;
  hairId: string;
  hairColor: keyof typeof HAIR | string;
};

const getColor = (palette: Record<string, string>, key: string, fallback: string) => {
  return palette[key] ?? (key.startsWith("#") ? key : fallback);
};

const lighten = (hex: string, amt = 0.2) => {
  if (!hex.startsWith("#")) return hex;
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const apply = (v: number) => Math.min(255, Math.max(0, Math.round(v + (255 - v) * amt)));
  const rr = apply(r);
  const gg = apply(g);
  const bb = apply(b);
  return `#${((rr << 16) | (gg << 8) | bb).toString(16).padStart(6, "0")}`;
};

export function PixelAvatar({ size = 160, skin, hairId, hairColor }: PixelAvatarProps) {
  const skinColor = getColor(SKIN, String(skin), SKIN.tan);
  const hairColorHex = getColor(HAIR, String(hairColor), HAIR.dark);
  const hairHighlight = lighten(hairColorHex, 0.35);

  const hair = (() => {
    switch (hairId) {
      case "bald":
        return null;
      case "dreads_medium":
        return (
          <g fill={hairColorHex}>
            {Array.from({ length: 6 }).map((_, i) => (
              <rect
                key={i}
                x={38 + i * 8}
                y={22}
                width={6}
                height={40}
                rx={3}
              />
            ))}
            <path d="M30 36c8-14 68-14 76 0v16H30z" />
          </g>
        );
      case "fro_short":
        return (
          <g fill={hairColorHex}>
            <circle cx={64} cy={30} r={32} />
            <ellipse cx={64} cy={48} rx={42} ry={30} />
          </g>
        );
      case "fade_low":
        return (
          <g>
            <ellipse cx={64} cy={28} rx={36} ry={24} fill={hairColorHex} />
            <ellipse cx={64} cy={32} rx={38} ry={26} fill={lighten(hairColorHex, -0.25)} opacity={0.35} />
          </g>
        );
      case "waves":
        return (
          <g fill={hairColorHex}>
            <ellipse cx={64} cy={30} rx={36} ry={22} />
            {[0, 1, 2].map((row) => (
              <path
                key={row}
                d={`M30 ${32 + row * 6}c6 4 12 4 18 0s12-4 18 0 12 4 18 0 12-4 18 0 12 4 18 0v4c-6 4-12 4-18 0s-12-4-18 0-12 4-18 0-12-4-18 0-12 4-18 0z`}
                fill={hairHighlight}
                opacity={0.45}
              />
            ))}
          </g>
        );
      default:
        return (
          <g fill={hairColorHex}>
            <ellipse cx={64} cy={28} rx={38} ry={24} />
            <path d="M28 40c12-18 60-18 72 0v16H28z" />
          </g>
        );
    }
  })();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label="pixel avatar"
      style={{ display: "block", background: "#1b1714", borderRadius: 16 }}
    >
      {hair}
      <ellipse cx={64} cy={64} rx={32} ry={36} fill={skinColor} />
      <ellipse cx={64} cy={96} rx={16} ry={10} fill={skinColor} />
      <ellipse cx={64} cy={96} rx={16} ry={10} fill={lighten(skinColor, -0.2)} opacity={0.25} />
      <g fill="#fff">
        <ellipse cx={50} cy={60} rx={8} ry={6} />
        <ellipse cx={78} cy={60} rx={8} ry={6} />
      </g>
      <g fill="#1c1c1c">
        <circle cx={50} cy={60} r={3.5} />
        <circle cx={78} cy={60} r={3.5} />
      </g>
      <path d="M48 84c10 6 22 6 32 0" stroke="#1c1c1c" strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M44 72c6-4 12-4 18 0" stroke="#1c1c1c" strokeWidth={3} strokeLinecap="round" fill="none" />
      <path d="M66 72c6-4 12-4 18 0" stroke="#1c1c1c" strokeWidth={3} strokeLinecap="round" fill="none" />
    </svg>
  );
}
