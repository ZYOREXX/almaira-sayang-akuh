import { WORLD } from '../config.js';

/** Memetakan koordinat dunia (meter) ke piksel canvas. */
export class Camera {
  constructor() {
    this.scale = 1;
    this.dpr = 1;
    this.cssWidth = 0;
    this.cssHeight = 0;
  }

  resize(cssWidth, dpr) {
    this.dpr = dpr;
    this.cssWidth = cssWidth;
    this.scale = cssWidth / WORLD.width;
    this.cssHeight = WORLD.height * this.scale;
  }

  /** Set transform ctx sehingga 1 unit = 1 meter. */
  apply(ctx) {
    const k = this.scale * this.dpr;
    ctx.setTransform(k, 0, 0, k, -WORLD.minX * k, -WORLD.minY * k);
  }

  /** Transform piksel layar (CSS px × dpr) untuk teks yang tajam. */
  applyScreen(ctx) {
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  toScreen(x, y) {
    return { x: (x - WORLD.minX) * this.scale, y: (y - WORLD.minY) * this.scale };
  }
}
