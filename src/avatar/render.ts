import { AvatarState, Layer } from "./types";
import { HAIR, ACCESSORIES } from "./assets";
import { layoutAsset, Placed } from "./layout";
import { withHeadExclusion } from "./occlusion";

const ORDER: Layer[] = [
  "body",
  "head",
  "hairBack",
  "accBehind",
  "face",
  "accFront",
  "hairFront",
];

function drawBody(ctx: CanvasRenderingContext2D, state: AvatarState) {
  const { head } = state;
  const cx = head.x + head.w / 2;
  const baseY = head.y + head.h;
  const shoulderW = head.w * 1.4;
  const shoulderH = head.h * 0.8;
  ctx.save();
  ctx.fillStyle = "#2a2320";
  ctx.beginPath();
  ctx.moveTo(cx - shoulderW / 2, baseY + shoulderH * 0.4);
  ctx.quadraticCurveTo(cx, baseY + shoulderH * 0.1, cx + shoulderW / 2, baseY + shoulderH * 0.4);
  ctx.lineTo(cx + shoulderW / 2, baseY + shoulderH);
  ctx.lineTo(cx - shoulderW / 2, baseY + shoulderH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawHead(ctx: CanvasRenderingContext2D, state: AvatarState) {
  const { head } = state;
  const cx = head.x + head.w / 2;
  const cy = head.y + head.h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(head.tilt || 0);
  ctx.scale(head.w / 2, head.h / 2);
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fillStyle = "#f1c9a5";
  ctx.fill();
  ctx.restore();
}

function drawFace(ctx: CanvasRenderingContext2D, state: AvatarState) {
  const { head } = state;
  const cx = head.x + head.w / 2;
  const eyeY = head.y + head.h * 0.45;
  const eyeOffset = head.w * 0.22;
  const eyeRadiusX = head.w * 0.1;
  const eyeRadiusY = head.h * 0.07;

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffset, eyeY, eyeRadiusX, eyeRadiusY, head.tilt || 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffset, eyeY, eyeRadiusX, eyeRadiusY, head.tilt || 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3a2f25";
  const pupilRadius = eyeRadiusX * 0.4;
  ctx.beginPath();
  ctx.ellipse(cx - eyeOffset, eyeY, pupilRadius, pupilRadius, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeOffset, eyeY, pupilRadius, pupilRadius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#3a2f25";
  ctx.lineWidth = Math.max(1, head.w * 0.03);
  ctx.beginPath();
  const browY = eyeY - eyeRadiusY * 1.6;
  ctx.moveTo(cx - eyeOffset - eyeRadiusX * 0.8, browY);
  ctx.quadraticCurveTo(cx - eyeOffset, browY - eyeRadiusY * 0.6, cx - eyeOffset + eyeRadiusX * 0.8, browY);
  ctx.moveTo(cx + eyeOffset - eyeRadiusX * 0.8, browY);
  ctx.quadraticCurveTo(cx + eyeOffset, browY - eyeRadiusY * 0.6, cx + eyeOffset + eyeRadiusX * 0.8, browY);
  ctx.stroke();

  ctx.strokeStyle = "#c75b39";
  ctx.lineWidth = Math.max(1.5, head.w * 0.02);
  const mouthY = head.y + head.h * 0.7;
  ctx.beginPath();
  ctx.moveTo(cx - head.w * 0.18, mouthY);
  ctx.quadraticCurveTo(cx, mouthY + head.h * 0.05, cx + head.w * 0.18, mouthY);
  ctx.stroke();
  ctx.restore();
}

async function collectPlacements(state: AvatarState) {
  const placements: Placed[] = [];
  const hair = HAIR.find((h) => h.id === state.hairId);
  if (hair) {
    placements.push(...(await layoutAsset(hair, state.head)));
  }
  for (const id of state.accessories) {
    const acc = ACCESSORIES.find((a) => a.id === id);
    if (!acc) continue;
    placements.push(...(await layoutAsset(acc, state.head)));
  }
  return placements;
}

function drawPlacement(
  ctx: CanvasRenderingContext2D,
  placement: Placed,
  head: AvatarState["head"],
) {
  if (!placement.image) return;
  ctx.save();
  ctx.translate(placement.x + placement.w / 2, placement.y + placement.h / 2);
  ctx.rotate(placement.rotation);
  ctx.translate(-placement.w / 2, -placement.h / 2);
  const draw = () => {
    ctx.drawImage(placement.image!, 0, 0, placement.w, placement.h);
  };
  if (
    placement.layer === "hairFront" ||
    placement.layer === "hairBack" ||
    placement.layer === "accFront"
  ) {
    withHeadExclusion(ctx, head, draw);
  } else {
    draw();
  }
  ctx.restore();
}

export async function renderAvatar(
  canvas: HTMLCanvasElement,
  state: AvatarState,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.fillStyle = "#f8f5f2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  const placements = await collectPlacements(state);

  for (const layer of ORDER) {
    if (layer === "body") {
      drawBody(ctx, state);
      continue;
    }
    if (layer === "head") {
      drawHead(ctx, state);
      continue;
    }
    if (layer === "face") {
      drawFace(ctx, state);
      continue;
    }
    for (const placement of placements.filter((p) => p.layer === layer)) {
      drawPlacement(ctx, placement, state.head);
    }
  }
}
