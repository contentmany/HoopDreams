import { layoutAsset, headTopY } from "../avatar/layout";
import { HAIR, ACCESSORIES } from "../avatar/assets";
import { renderAvatar } from "../avatar/render";
import { AvatarState } from "../avatar/types";

function makeCanvas(w = 360, h = 420) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c as HTMLCanvasElement;
}

describe("Procedural avatar", () => {
  const head = { x: 70, y: 40, w: 220, h: 260, tilt: 0 };

  test("afro hair above scalp and scaled", async () => {
    const afro = HAIR.find((h) => h.id === "hair_afro")!;
    const placed = await layoutAsset(afro, head);
    const p = placed[0];
    expect(p.y).toBeLessThanOrEqual(headTopY(head));
    expect(p.w).toBeGreaterThan(0);
  });

  test("buzz hair coverEllipse clamp", async () => {
    const buzz = HAIR.find((h) => h.id === "hair_buzz")!;
    const placed = await layoutAsset(buzz, head);
    const p = placed[0];
    expect(p.y).toBeLessThanOrEqual(headTopY(head));
    expect(p.w / p.image!.width).toBeGreaterThanOrEqual(0.95 - 1e-6);
    expect(p.w / p.image!.width).toBeLessThanOrEqual(1.05 + 1e-6);
  });

  test("beanie renders without crash", async () => {
    const canvas = makeCanvas();
    const state: AvatarState = { head, hairId: "hair_buzz", accessories: ["beanie"] };
    await renderAvatar(canvas, state);
    expect(canvas.getContext("2d")).toBeDefined();
  });

  test("glasses accessory layer=accFront", async () => {
    const glasses = ACCESSORIES.find((a) => a.id === "glasses_round")!;
    const placed = await layoutAsset(glasses, head);
    expect(placed[placed.length - 1].layer).toBe("accFront");
  });
});
