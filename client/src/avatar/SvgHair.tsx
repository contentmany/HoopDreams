import type { ReactNode } from "react";
import { type Anchor, type HairColor, type HairStyleId, type LayerName } from "./AvatarKit";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const extendY = (anchor: Anchor) => anchor.y + anchor.h * 1.25;

const relX = (anchor: Anchor, t: number) => {
  const raw = anchor.x + anchor.w * t;
  return clamp(raw, anchor.x, anchor.x + anchor.w);
};

const relY = (anchor: Anchor, t: number) => {
  const raw = anchor.y + anchor.h * t;
  return raw > extendY(anchor) ? extendY(anchor) : raw;
};

const shineOpacity = 0.3;

function buzzFade(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  if (layer !== "under") return null;
  const cx = anchor.x + anchor.w / 2;
  const cy = relY(anchor, 0.38);
  const rx = anchor.w / 2;
  const ry = anchor.h * 0.38;
  return (
    <g data-style="buzz_fade" data-layer={layer}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color.base} />
      <ellipse
        cx={cx}
        cy={cy - ry * 0.25}
        rx={rx * 0.72}
        ry={ry * 0.45}
        fill={color.shine}
        fillOpacity={shineOpacity}
      />
    </g>
  );
}

function waves(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  const cx = anchor.x + anchor.w / 2;
  const baseTop = relY(anchor, 0.05);
  const baseBottom = relY(anchor, 0.82);
  const left = anchor.x;
  const right = anchor.x + anchor.w;

  if (layer === "under") {
    return (
      <g data-style="waves" data-layer="under">
        <path
          fill={color.base}
          d={`M ${left} ${baseBottom} C ${left} ${baseTop} ${right} ${baseTop} ${right} ${baseBottom} Q ${cx} ${relY(
            anchor,
            0.9
          )} ${left} ${baseBottom} Z`}
        />
      </g>
    );
  }

  const crestHeight = relY(anchor, 0.18);
  const trough = relY(anchor, 0.28);
  const waveCount = 4;
  const segment = (right - left) / waveCount;
  const wavePath: string[] = [];
  let x = left;
  wavePath.push(`M ${x} ${trough}`);
  for (let i = 0; i < waveCount; i++) {
    const mid = x + segment / 2;
    const next = x + segment;
    wavePath.push(`Q ${mid} ${crestHeight} ${next} ${trough}`);
    x = next;
  }

  return (
    <g data-style="waves" data-layer="over">
      <path d={wavePath.join(" ")} stroke={color.shine} strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
}

function shortCurls(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  const cx = anchor.x + anchor.w / 2;
  const top = relY(anchor, -0.05);
  const base = relY(anchor, 0.72);
  const offsets = [
    { x: -0.32, y: 0.0 },
    { x: -0.05, y: -0.08 },
    { x: 0.22, y: -0.03 },
    { x: 0.38, y: 0.02 },
  ];
  if (layer === "under") {
    return (
      <g data-style="short_curls" data-layer="under">
        <path
          d={`M ${anchor.x} ${base} C ${anchor.x} ${top} ${anchor.x + anchor.w} ${top} ${anchor.x + anchor.w} ${base} Q ${cx} ${relY(
            anchor,
            0.9
          )} ${anchor.x} ${base} Z`}
          fill={color.base}
        />
      </g>
    );
  }

  return (
    <g data-style="short_curls" data-layer="over">
      {offsets.map((offset, index) => (
        <ellipse
          key={index}
          cx={relX(anchor, 0.5 + offset.x * 0.6)}
          cy={relY(anchor, 0.18 + offset.y)}
          rx={anchor.w * 0.16}
          ry={anchor.h * 0.14}
          fill={color.base}
        />
      ))}
      {offsets.map((offset, index) => (
        <ellipse
          key={`shine-${index}`}
          cx={relX(anchor, 0.5 + offset.x * 0.6)}
          cy={relY(anchor, 0.12 + offset.y)}
          rx={anchor.w * 0.1}
          ry={anchor.h * 0.07}
          fill={color.shine}
          fillOpacity={shineOpacity}
        />
      ))}
    </g>
  );
}

function braidStrand(
  anchor: Anchor,
  x: number,
  top: number,
  bottom: number,
  width: number,
  color: HairColor,
  index: number
) {
  const radius = width / 2;
  const segments = 4;
  const step = (bottom - top) / segments;
  const circles = [];
  for (let i = 0; i < segments; i++) {
    const cy = top + step * i + step / 2;
    circles.push(
      <ellipse key={`strand-${index}-${i}`} cx={x} cy={cy} rx={radius} ry={step * 0.6} fill={color.base} />
    );
  }
  return circles;
}

function braidsBox(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  const left = anchor.x + anchor.w * 0.02;
  const right = anchor.x + anchor.w * 0.98;
  const capTop = relY(anchor, -0.12);
  const capBottom = relY(anchor, 0.32);
  const forehead = relY(anchor, 0.42);

  if (layer === "under") {
    return (
      <g data-style="braids_box" data-layer="under">
        <rect x={left} y={capTop} width={right - left} height={capBottom - capTop} rx={anchor.w * 0.16} fill={color.base} />
        <path
          d={`M ${left} ${capBottom} H ${right}`}
          stroke={color.shine}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={shineOpacity}
        />
      </g>
    );
  }

  const strandCount = 6;
  const spacing = (right - left) / (strandCount + 1);
  const bottom = Math.min(extendY(anchor), forehead + anchor.h * 0.42);
  const strands = [];
  for (let i = 0; i < strandCount; i++) {
    const x = left + spacing * (i + 1);
    const top = capBottom - anchor.h * 0.02;
    const width = anchor.w * 0.08;
    strands.push(...braidStrand(anchor, x, top, bottom, width, color, i));
  }

  return (
    <g data-style="braids_box" data-layer="over">
      {strands}
      <rect
        x={left}
        y={capBottom - anchor.h * 0.04}
        width={right - left}
        height={anchor.h * 0.08}
        fill={color.base}
        opacity={0.8}
      />
    </g>
  );
}

function twistsTwoStrand(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  const left = anchor.x + anchor.w * 0.1;
  const right = anchor.x + anchor.w * 0.9;
  const top = relY(anchor, -0.1);
  const base = relY(anchor, 0.32);

  if (layer === "under") {
    return (
      <g data-style="twists_two_strand" data-layer="under">
        <rect x={left} y={top} width={right - left} height={base - top} rx={anchor.w * 0.18} fill={color.base} />
        <path
          d={`M ${left} ${base} H ${right}`}
          stroke={color.shine}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={shineOpacity}
        />
      </g>
    );
  }

  const strandCount = 5;
  const spacing = (right - left) / strandCount;
  const bottom = Math.min(extendY(anchor), base + anchor.h * 0.55);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < strandCount; i++) {
    const xCenter = left + spacing * (i + 0.5);
    const path = `M ${xCenter - spacing * 0.18} ${base} Q ${xCenter} ${base + (bottom - base) * 0.3} ${xCenter - spacing * 0.12} ${
      base + (bottom - base) * 0.55
    } Q ${xCenter} ${bottom} ${xCenter + spacing * 0.18} ${base + (bottom - base) * 0.95}`;
    nodes.push(
      <path
        key={`twist-${i}`}
        d={path}
        stroke={color.base}
        strokeWidth={spacing * 0.4}
        strokeLinecap="round"
        fill="none"
      />
    );
    nodes.push(
      <path
        key={`twist-shine-${i}`}
        d={path}
        stroke={color.shine}
        strokeWidth={spacing * 0.16}
        strokeLinecap="round"
        fill="none"
        opacity={shineOpacity}
      />
    );
  }
  return (
    <g data-style="twists_two_strand" data-layer="over">
      {nodes}
    </g>
  );
}

function locsMedium(anchor: Anchor, color: HairColor, layer: LayerName): ReactNode {
  const left = anchor.x + anchor.w * 0.08;
  const right = anchor.x + anchor.w * 0.92;
  const top = relY(anchor, -0.12);
  const base = relY(anchor, 0.32);
  if (layer === "under") {
    return (
      <g data-style="locs_medium" data-layer="under">
        <rect x={left} y={top} width={right - left} height={base - top} rx={anchor.w * 0.22} fill={color.base} />
        <path
          d={`M ${left} ${base - anchor.h * 0.02} H ${right}`}
          stroke={color.shine}
          strokeWidth={10}
          strokeLinecap="round"
          opacity={shineOpacity}
        />
      </g>
    );
  }
  const locCount = 7;
  const spacing = (right - left) / (locCount - 1);
  const bottom = Math.min(extendY(anchor), base + anchor.h * 0.5);
  const segments: ReactNode[] = [];
  for (let i = 0; i < locCount; i++) {
    const x = left + spacing * i;
    const sway = i % 2 === 0 ? spacing * 0.2 : -spacing * 0.2;
    const d = `M ${x} ${base} C ${x + sway} ${base + (bottom - base) * 0.3} ${x - sway} ${
      base + (bottom - base) * 0.7
    } ${x} ${bottom}`;
    segments.push(
      <path key={`loc-${i}`} d={d} stroke={color.base} strokeWidth={spacing * 0.55} strokeLinecap="round" fill="none" />
    );
    segments.push(
      <path
        key={`loc-shine-${i}`}
        d={d}
        stroke={color.shine}
        strokeWidth={spacing * 0.2}
        strokeLinecap="round"
        fill="none"
        opacity={shineOpacity}
      />
    );
  }
  return (
    <g data-style="locs_medium" data-layer="over">
      {segments}
    </g>
  );
}

function bald(_: Anchor, __: HairColor, ___: LayerName): ReactNode {
  return null;
}

const RENDERERS: Record<HairStyleId, (anchor: Anchor, color: HairColor, layer: LayerName) => ReactNode> = {
  bald,
  buzz_fade: buzzFade,
  waves,
  short_curls: shortCurls,
  braids_box: braidsBox,
  twists_two_strand: twistsTwoStrand,
  locs_medium: locsMedium,
};

export function renderHair(
  id: HairStyleId,
  opts: { anchor: Anchor; color: HairColor; layer: LayerName }
): ReactNode {
  const renderer = RENDERERS[id];
  if (!renderer) return null;
  return renderer(opts.anchor, opts.color, opts.layer);
}
