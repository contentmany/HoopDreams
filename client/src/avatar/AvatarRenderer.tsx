import type { ReactNode } from "react";
import { HAIR, HAIR_COLORS, HEAD_ANCHOR, type HairStyleId } from "./AvatarKit";
import { renderHair } from "./SvgHair";
import { renderFacial, type FacialId } from "./SvgFacialHair";

export type AvatarDNA = {
  skinTone: "light" | "tan" | "brown" | "deep";
  hairStyle: HairStyleId;
  hairColor: keyof typeof HAIR_COLORS;
  brows: "on" | "off";
  facialHair: FacialId;
  eyes: "brown" | "hazel" | "blue" | "green";
  eyeShape?: "round" | "almond" | "sleepy";
  mouth?: "neutral" | "smile" | "frown" | "smirk";
};

const SKIN_TONES: Record<AvatarDNA["skinTone"], { base: string; shadow: string; highlight: string }> = {
  light: { base: "#f1c9a5", shadow: "#d9a06b", highlight: "#ffd9ba" },
  tan: { base: "#d9a06b", shadow: "#b07844", highlight: "#f2be8d" },
  brown: { base: "#a8693a", shadow: "#824b26", highlight: "#c58555" },
  deep: { base: "#6b3b1f", shadow: "#4b2513", highlight: "#865237" },
};

const EYE_COLORS: Record<AvatarDNA["eyes"], string> = {
  brown: "#3a2f25",
  hazel: "#5b3a2e",
  blue: "#1f2d57",
  green: "#0a6a4f",
};

const backgroundColor = "#2a2320";

const darken = (hex: string, factor = 0.85) => {
  const value = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const lighten = (hex: string, factor = 1.1) => {
  const value = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, Math.min(255, Math.round(((value >> 16) & 0xff) * factor)));
  const g = Math.max(0, Math.min(255, Math.round(((value >> 8) & 0xff) * factor)));
  const b = Math.max(0, Math.min(255, Math.round((value & 0xff) * factor)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

const headCx = HEAD_ANCHOR.x + HEAD_ANCHOR.w / 2;
const headCy = HEAD_ANCHOR.y + HEAD_ANCHOR.h / 2;

function renderEyes(dna: AvatarDNA): ReactNode {
  const irisColor = EYE_COLORS[dna.eyes];
  const shape = dna.eyeShape ?? "round";
  const eyePositions = [
    { cx: headCx - HEAD_ANCHOR.w * 0.2, cy: HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.45 },
    { cx: headCx + HEAD_ANCHOR.w * 0.2, cy: HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.45 },
  ];
  return (
    <g id="eyes">
      {eyePositions.map((pos, index) => (
        <g key={index}>
          <ellipse cx={pos.cx} cy={pos.cy} rx={HEAD_ANCHOR.w * 0.12} ry={HEAD_ANCHOR.h * 0.1} fill="#fff" />
          {shape === "round" && (
            <ellipse cx={pos.cx} cy={pos.cy + HEAD_ANCHOR.h * 0.015} rx={HEAD_ANCHOR.w * 0.055} ry={HEAD_ANCHOR.h * 0.055} fill={irisColor} />
          )}
          {shape === "almond" && (
            <path
              d={`M ${pos.cx - HEAD_ANCHOR.w * 0.075} ${pos.cy} Q ${pos.cx} ${pos.cy - HEAD_ANCHOR.h * 0.045} ${pos.cx + HEAD_ANCHOR.w * 0.075} ${
                pos.cy
              } Q ${pos.cx} ${pos.cy + HEAD_ANCHOR.h * 0.045} ${pos.cx - HEAD_ANCHOR.w * 0.075} ${pos.cy} Z`}
              fill={irisColor}
            />
          )}
          {shape === "sleepy" && (
            <path
              d={`M ${pos.cx - HEAD_ANCHOR.w * 0.08} ${pos.cy + HEAD_ANCHOR.h * 0.015} Q ${pos.cx} ${pos.cy - HEAD_ANCHOR.h * 0.015} ${
                pos.cx + HEAD_ANCHOR.w * 0.08
              } ${pos.cy + HEAD_ANCHOR.h * 0.015} Q ${pos.cx} ${pos.cy + HEAD_ANCHOR.h * 0.07} ${pos.cx - HEAD_ANCHOR.w * 0.08} ${
                pos.cy + HEAD_ANCHOR.h * 0.015
              } Z`}
              fill={irisColor}
            />
          )}
          <ellipse
            cx={pos.cx + HEAD_ANCHOR.w * 0.025}
            cy={pos.cy - HEAD_ANCHOR.h * 0.03}
            rx={HEAD_ANCHOR.w * 0.02}
            ry={HEAD_ANCHOR.h * 0.02}
            fill="#fff"
            fillOpacity={0.85}
          />
        </g>
      ))}
    </g>
  );
}

function renderBrows(hairColor: { base: string }, dna: AvatarDNA): ReactNode {
  if (dna.brows === "off") return null;
  const browColor = darken(hairColor.base, 0.92);
  return (
    <g id="brows">
      <path
        d={`M ${headCx - HEAD_ANCHOR.w * 0.38} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.33} Q ${headCx - HEAD_ANCHOR.w * 0.18} ${
          HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.3
        } ${headCx - HEAD_ANCHOR.w * 0.02} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.34}`}
        stroke={browColor}
        strokeWidth={HEAD_ANCHOR.h * 0.04}
        strokeLinecap="round"
      />
      <path
        d={`M ${headCx + HEAD_ANCHOR.w * 0.38} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.33} Q ${headCx + HEAD_ANCHOR.w * 0.18} ${
          HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.3
        } ${headCx + HEAD_ANCHOR.w * 0.02} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.34}`}
        stroke={browColor}
        strokeWidth={HEAD_ANCHOR.h * 0.04}
        strokeLinecap="round"
      />
    </g>
  );
}

function renderMouth(dna: AvatarDNA, skin: { shadow: string }): ReactNode {
  const expression = dna.mouth ?? "neutral";
  const baseY = HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.72;
  const left = headCx - HEAD_ANCHOR.w * 0.18;
  const right = headCx + HEAD_ANCHOR.w * 0.18;
  let controlY = baseY + HEAD_ANCHOR.h * 0.02;
  if (expression === "smile") controlY = baseY + HEAD_ANCHOR.h * 0.06;
  if (expression === "frown") controlY = baseY - HEAD_ANCHOR.h * 0.02;
  if (expression === "smirk") {
    return (
      <path
        d={`M ${left} ${baseY + HEAD_ANCHOR.h * 0.01} Q ${headCx + HEAD_ANCHOR.w * 0.02} ${baseY + HEAD_ANCHOR.h * 0.05} ${right} ${
          baseY - HEAD_ANCHOR.h * 0.03
        }`}
        stroke={darken(skin.shadow, 0.85)}
        strokeWidth={HEAD_ANCHOR.h * 0.035}
        strokeLinecap="round"
        fill="none"
      />
    );
  }
  return (
    <path
      d={`M ${left} ${baseY} Q ${headCx} ${controlY} ${right} ${baseY}`}
      stroke={darken(skin.shadow, 0.85)}
      strokeWidth={HEAD_ANCHOR.h * 0.035}
      strokeLinecap="round"
      fill="none"
    />
  );
}

export function AvatarSVG({ dna }: { dna: AvatarDNA }) {
  const skin = SKIN_TONES[dna.skinTone];
  const hair = HAIR[dna.hairStyle];
  const hairColor = HAIR_COLORS[dna.hairColor] ?? HAIR_COLORS.black;
  const facialColor = {
    base: darken(hairColor.base, 0.9),
    shine: darken(hairColor.shine, 0.9),
  };

  const neckCy = HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.96;
  const neckRx = HEAD_ANCHOR.w * 0.25;
  const neckRy = HEAD_ANCHOR.h * 0.15;

  const underHair = renderHair(dna.hairStyle, { anchor: hair.anchor, color: hairColor, layer: "under" });
  const overHair = renderHair(dna.hairStyle, { anchor: hair.anchor, color: hairColor, layer: "over" });

  return (
    <svg viewBox="0 0 1000 1000" width="100%" height="100%" role="img" aria-label="avatar">
      <rect x={0} y={0} width={1000} height={1000} fill={backgroundColor} rx={80} />
      {underHair}
      <g id="face">
        <ellipse cx={headCx} cy={neckCy} rx={neckRx} ry={neckRy} fill={skin.base} />
        <ellipse cx={headCx} cy={neckCy} rx={neckRx} ry={neckRy} fill={skin.shadow} opacity={0.3} />
        <ellipse cx={headCx} cy={headCy} rx={HEAD_ANCHOR.w * 0.48} ry={HEAD_ANCHOR.h * 0.62} fill={skin.base} />
        <ellipse cx={headCx} cy={headCy + HEAD_ANCHOR.h * 0.18} rx={HEAD_ANCHOR.w * 0.28} ry={HEAD_ANCHOR.h * 0.2} fill={skin.shadow} opacity={0.22} />
        <ellipse
          cx={HEAD_ANCHOR.x + HEAD_ANCHOR.w * 0.08}
          cy={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.48}
          rx={HEAD_ANCHOR.w * 0.08}
          ry={HEAD_ANCHOR.h * 0.12}
          fill={skin.base}
        />
        <ellipse
          cx={HEAD_ANCHOR.x + HEAD_ANCHOR.w * 0.92}
          cy={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.48}
          rx={HEAD_ANCHOR.w * 0.08}
          ry={HEAD_ANCHOR.h * 0.12}
          fill={skin.base}
        />
        <path
          d={`M ${headCx} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.5} Q ${headCx - HEAD_ANCHOR.w * 0.04} ${HEAD_ANCHOR.y +
            HEAD_ANCHOR.h * 0.6} ${headCx - HEAD_ANCHOR.w * 0.03} ${HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.65}`}
          stroke={darken(skin.shadow, 0.8)}
          strokeWidth={HEAD_ANCHOR.h * 0.025}
          strokeLinecap="round"
        />
        <circle cx={headCx - HEAD_ANCHOR.w * 0.03} cy={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.66} r={HEAD_ANCHOR.h * 0.018} fill={darken(skin.shadow, 0.75)} />
      </g>
      {renderEyes(dna)}
      {renderMouth(dna, skin)}
      {renderBrows(hairColor, dna)}
      {hair.overOccludesBrow && (
        <rect
          x={HEAD_ANCHOR.x}
          y={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.26}
          width={HEAD_ANCHOR.w}
          height={HEAD_ANCHOR.h * 0.08}
          fill="rgba(0,0,0,0.06)"
        />
      )}
      {overHair}
      {renderFacial(dna.facialHair, { color: facialColor })}
      <ellipse
        cx={headCx}
        cy={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.83}
        rx={HEAD_ANCHOR.w * 0.26}
        ry={HEAD_ANCHOR.h * 0.16}
        fill={darken(skin.base, 0.9)}
        opacity={0.12}
      />
      <ellipse
        cx={headCx}
        cy={HEAD_ANCHOR.y + HEAD_ANCHOR.h * 0.32}
        rx={HEAD_ANCHOR.w * 0.15}
        ry={HEAD_ANCHOR.h * 0.09}
        fill={lighten(skin.base, 1.08)}
        opacity={0.25}
      />
    </svg>
  );
}
