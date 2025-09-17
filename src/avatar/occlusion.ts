import { HeadBox } from "./types";

export function headEllipsePath(
  ctx: CanvasRenderingContext2D,
  head: HeadBox,
) {
  const cx = head.x + head.w / 2;
  const cy = head.y + head.h / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(head.tilt || 0);
  ctx.scale(head.w / 2, head.h / 2);
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.restore();
}

export function withHeadMask(
  ctx: CanvasRenderingContext2D,
  head: HeadBox,
  draw: () => void,
) {
  ctx.save();
  headEllipsePath(ctx, head);
  ctx.clip();
  draw();
  ctx.restore();
}

export function withHeadExclusion(
  ctx: CanvasRenderingContext2D,
  head: HeadBox,
  draw: () => void,
) {
  ctx.save();
  ctx.save();
  headEllipsePath(ctx, head);
  ctx.globalCompositeOperation = "destination-out";
  ctx.fill();
  ctx.restore();
  draw();
  ctx.restore();
}
