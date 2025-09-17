const g = globalThis;

if (!g.window) {
  g.window = g;
}

if (!g.navigator) {
  g.navigator = { userAgent: "node" };
}

class MockCanvasRenderingContext2D {
  constructor(canvas) {
    this.canvas = canvas;
    this.fillStyle = "#000";
    this.strokeStyle = "#000";
    this.lineWidth = 1;
    this.globalCompositeOperation = "source-over";
    this.imageSmoothingEnabled = true;
  }
  save() {}
  restore() {}
  translate() {}
  rotate() {}
  scale() {}
  setTransform() {}
  beginPath() {}
  closePath() {}
  moveTo() {}
  lineTo() {}
  quadraticCurveTo() {}
  bezierCurveTo() {}
  arc() {}
  ellipse() {}
  rect() {}
  fill() {}
  stroke() {}
  clip() {}
  clearRect() {}
  fillRect() {}
  drawImage() {}
  measureText(text) {
    return { width: String(text).length * 8 };
  }
}

class MockCanvas {
  constructor() {
    this.width = 300;
    this.height = 150;
    this.style = {};
    this._ctx = null;
  }
  getContext(type) {
    if (type === "2d") {
      if (!this._ctx) {
        this._ctx = new MockCanvasRenderingContext2D(this);
      }
      return this._ctx;
    }
    return null;
  }
  toDataURL() {
    return "data:image/png;base64,";
  }
  addEventListener() {}
  removeEventListener() {}
  getBoundingClientRect() {
    return { x: 0, y: 0, width: this.width, height: this.height, top: 0, left: 0, right: this.width, bottom: this.height };
  }
}

class MockImage {
  constructor() {
    this.width = 256;
    this.height = 256;
    this.onload = null;
    this.onerror = null;
    this._src = "";
  }
  set src(value) {
    this._src = value;
    queueMicrotask(() => {
      if (typeof this.onload === "function") {
        this.onload();
      }
    });
  }
  get src() {
    return this._src;
  }
  addEventListener(type, handler) {
    if (type === "load") this.onload = handler;
    if (type === "error") this.onerror = handler;
  }
  removeEventListener(type) {
    if (type === "load") this.onload = null;
    if (type === "error") this.onerror = null;
  }
}

function ensureDocument() {
  if (g.document) return;
  const document = {
    createElement(tag) {
      if (tag === "canvas") {
        return new MockCanvas();
      }
      if (tag === "img") {
        return new MockImage();
      }
      return {
        tagName: tag.toUpperCase(),
        style: {},
        children: [],
        appendChild(child) {
          this.children.push(child);
          return child;
        },
        setAttribute(name, value) {
          this[name] = value;
        },
        getContext() {
          return null;
        },
      };
    },
    body: {
      appendChild() {},
      removeChild() {},
    },
  };
  g.document = document;
}

ensureDocument();

g.HTMLCanvasElement = MockCanvas;
g.CanvasRenderingContext2D = MockCanvasRenderingContext2D;
g.Image = MockImage;

g.requestAnimationFrame = g.requestAnimationFrame || ((cb) => setTimeout(() => cb(Date.now()), 16));
g.cancelAnimationFrame = g.cancelAnimationFrame || ((id) => clearTimeout(id));

g.getComputedStyle = g.getComputedStyle || ((el) => ({ width: `${el.width}px`, height: `${el.height}px` }));
