import type { Vec } from '../geometry.ts';

export interface Viewport {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
}

const FOLLOW_SCALE = 34;

export class Camera {
  scale = 20;
  centre: Vec = { x: 0, y: 0 };
  viewport: Viewport = { x: 0, y: 0, w: 1, h: 1 };

  fit(bounds: Bounds, viewport: Viewport, padding = 12): void {
    this.viewport = viewport;
    const usableW = Math.max(1, viewport.w - padding * 2);
    const usableH = Math.max(1, viewport.h - padding * 2);
    this.scale = Math.min(usableW / bounds.w, usableH / bounds.h);
    this.centre = { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
  }

  follow(target: Vec, viewport: Viewport, smoothing: number): void {
    this.viewport = viewport;
    this.scale += (FOLLOW_SCALE - this.scale) * smoothing;
    this.centre = {
      x: this.centre.x + (target.x - this.centre.x) * smoothing,
      y: this.centre.y + (target.y - this.centre.y) * smoothing,
    };
  }

  apply(ctx: CanvasRenderingContext2D, pixelRatio: number): void {
    const s = this.scale * pixelRatio;
    const originX = (this.viewport.x + this.viewport.w / 2) * pixelRatio - this.centre.x * s;
    const originY = (this.viewport.y + this.viewport.h / 2) * pixelRatio - this.centre.y * s;
    ctx.setTransform(s, 0, 0, s, originX, originY);
  }

  px(pixels: number): number {
    return pixels / this.scale;
  }
}
