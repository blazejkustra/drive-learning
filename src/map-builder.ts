import { DEG, rectBox } from './geometry.ts';
import type { GroundKind, MapData, Marking, Obstacle, ObstacleKind, PaintColor, Surface, SurfaceKind } from './level-types.ts';
import { CAR } from './physics.ts';

const PARKED_COLOURS = ['#c9cdd2', '#2b2f35', '#f1f2f3', '#34466b', '#8e3b36', '#6f757d', '#47604f', '#b8ad98'];

interface LineStyle {
  color?: PaintColor;
  width?: number;
  dash?: number[];
}

export class MapBuilder {
  private readonly data: MapData;
  private colourIndex = 0;

  constructor(ground: GroundKind = 'grass') {
    this.data = { ground, surfaces: [], markings: [], obstacles: [] };
  }

  surface(kind: SurfaceKind, x: number, y: number, w: number, h: number): this {
    this.data.surfaces.push({ shape: 'rect', kind, box: rectBox(x, y, w, h) });
    return this;
  }

  asphalt(x: number, y: number, w: number, h: number): this {
    return this.surface('asphalt', x, y, w, h);
  }

  ring(kind: SurfaceKind, cx: number, cy: number, r1: number, r2: number, a0: number, a1: number): this {
    const surface: Surface = { shape: 'ring', kind, cx, cy, r1, r2, a0: a0 * DEG, a1: a1 * DEG };
    this.data.surfaces.push(surface);
    return this;
  }

  private block(kind: ObstacleKind, x: number, y: number, w: number, h: number): this {
    this.data.obstacles.push({ shape: 'box', kind, box: rectBox(x, y, w, h) });
    return this;
  }

  kerb(x: number, y: number, w: number, h: number): this {
    return this.block('kerb', x, y, w, h);
  }

  wall(x: number, y: number, w: number, h: number): this {
    return this.block('wall', x, y, w, h);
  }

  hedge(x: number, y: number, w: number, h: number): this {
    return this.block('hedge', x, y, w, h);
  }

  building(x: number, y: number, w: number, h: number): this {
    return this.block('building', x, y, w, h);
  }

  /** Approximates a curved kerb or wall with short straight pieces. Angles in degrees. */
  arc(kind: ObstacleKind, cx: number, cy: number, rInner: number, rOuter: number, a0: number, a1: number): this {
    const sweep = (a1 - a0) * DEG;
    const middle = (rInner + rOuter) / 2;
    const count = Math.max(2, Math.ceil((Math.abs(sweep) * middle) / 0.7));
    const step = sweep / count;
    for (let i = 0; i < count; i++) {
      const angle = a0 * DEG + step * (i + 0.5);
      this.data.obstacles.push({
        shape: 'box',
        kind,
        box: {
          cx: cx + Math.cos(angle) * middle,
          cy: cy + Math.sin(angle) * middle,
          halfLength: (Math.abs(step) * rOuter) / 2 + 0.03,
          halfWidth: (rOuter - rInner) / 2,
          angle: angle + Math.PI / 2,
        },
      });
    }
    return this;
  }

  car(cx: number, cy: number, headingDeg: number, color?: string): this {
    const obstacle: Obstacle = {
      shape: 'box',
      kind: 'car',
      color: color ?? PARKED_COLOURS[this.colourIndex++ % PARKED_COLOURS.length],
      box: { cx, cy, halfLength: CAR.length / 2, halfWidth: CAR.width / 2, angle: headingDeg * DEG },
    };
    this.data.obstacles.push(obstacle);
    return this;
  }

  cone(x: number, y: number): this {
    this.data.obstacles.push({ shape: 'circle', kind: 'cone', x, y, r: 0.25 });
    return this;
  }

  planter(x: number, y: number, r: number): this {
    this.data.obstacles.push({ shape: 'circle', kind: 'planter', x, y, r });
    return this;
  }

  pillar(x: number, y: number, size = 0.5): this {
    return this.block('pillar', x - size / 2, y - size / 2, size, size);
  }

  post(x: number, y: number): this {
    return this.block('post', x - 0.15, y - 0.15, 0.3, 0.3);
  }

  line(x1: number, y1: number, x2: number, y2: number, style: LineStyle = {}): this {
    const marking: Marking = {
      shape: 'line',
      x1,
      y1,
      x2,
      y2,
      width: style.width ?? 0.12,
      color: style.color ?? 'white',
      dash: style.dash,
    };
    this.data.markings.push(marking);
    return this;
  }

  dashed(x1: number, y1: number, x2: number, y2: number, color: PaintColor = 'white'): this {
    return this.line(x1, y1, x2, y2, { color, dash: [2, 2.5] });
  }

  arcLine(cx: number, cy: number, r: number, a0: number, a1: number, style: LineStyle = {}): this {
    this.data.markings.push({
      shape: 'arc',
      cx,
      cy,
      r,
      a0: a0 * DEG,
      a1: a1 * DEG,
      width: style.width ?? 0.12,
      color: style.color ?? 'white',
      dash: style.dash,
    });
    return this;
  }

  arrow(x: number, y: number, headingDeg: number): this {
    this.data.markings.push({ shape: 'arrow', x, y, heading: headingDeg * DEG });
    return this;
  }

  bayDividers(x1: number, x2: number, ys: number[]): this {
    for (const y of ys) this.line(x1, y, x2, y);
    return this;
  }

  build(): MapData {
    return this.data;
  }
}

export function evenly(start: number, step: number, count: number): number[] {
  return Array.from({ length: count }, (_, i) => start + step * i);
}
