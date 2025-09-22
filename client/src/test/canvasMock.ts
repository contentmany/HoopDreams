const ctx = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 0,
  lineCap: "butt",
  imageSmoothingEnabled: false,
  globalAlpha: 1,
  globalCompositeOperation: "source-over",
  clearRect() {},
  fillRect() {},
  beginPath() {},
  arc() {},
  fill() {},
  stroke() {},
  moveTo() {},
  lineTo() {},
  quadraticCurveTo() {},
  drawImage() {},
} as unknown as CanvasRenderingContext2D;

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: () => ctx,
});

class Img {
  onload: null | (() => void) = null;
  onerror: null | (() => void) = null;
  set src(_: string) {
    // Pretend the image loaded successfully
    setTimeout(() => this.onload && this.onload(), 0);
  }
}
(globalThis as any).Image = Img;
