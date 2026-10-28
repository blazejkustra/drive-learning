import type { Box } from '../geometry.ts';
import type { Level, Marking, Obstacle, Surface } from '../level-types.ts';
import { drawCarBody } from './car.ts';
import { COLOURS, SURFACE_COLOURS } from './palette.ts';

export type Scene = Pick<Level, 'bounds' | 'map'>;

export function withBox(ctx: CanvasRenderingContext2D, box: Box, draw: () => void): void {
  ctx.save();
  ctx.translate(box.cx, box.cy);
  ctx.rotate(box.angle);
  draw();
  ctx.restore();
}

function boxPath(ctx: CanvasRenderingContext2D, box: Box, radius = 0): void {
  ctx.beginPath();
  ctx.roundRect(-box.halfLength, -box.halfWidth, box.halfLength * 2, box.halfWidth * 2, radius);
}

function drawGround(ctx: CanvasRenderingContext2D, level: Scene): void {
  const pad = 80;
  const { x, y, w, h } = level.bounds;
  if (level.map.ground === 'garage') {
    ctx.fillStyle = COLOURS.garageGround;
    ctx.fillRect(x - pad, y - pad, w + pad * 2, h + pad * 2);
    return;
  }
  ctx.fillStyle = COLOURS.grass;
  ctx.fillRect(x - pad, y - pad, w + pad * 2, h + pad * 2);
  ctx.fillStyle = COLOURS.grassStripe;
  for (let sx = x - pad; sx < x + w + pad; sx += 6) ctx.fillRect(sx, y - pad, 3, h + pad * 2);
}

function drawSurface(ctx: CanvasRenderingContext2D, surface: Surface): void {
  ctx.fillStyle = SURFACE_COLOURS[surface.kind];
  if (surface.shape === 'rect') {
    withBox(ctx, surface.box, () => {
      ctx.fillRect(-surface.box.halfLength, -surface.box.halfWidth, surface.box.halfLength * 2, surface.box.halfWidth * 2);
    });
    return;
  }
  ctx.beginPath();
  ctx.arc(surface.cx, surface.cy, surface.r2, surface.a0, surface.a1);
  if (surface.r1 > 0) ctx.arc(surface.cx, surface.cy, surface.r1, surface.a1, surface.a0, true);
  else ctx.lineTo(surface.cx, surface.cy);
  ctx.closePath();
  ctx.fill();
}

function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, heading: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);
  ctx.fillStyle = 'rgba(244, 243, 238, 0.75)';
  ctx.beginPath();
  ctx.moveTo(1.6, 0);
  ctx.lineTo(0.4, -0.75);
  ctx.lineTo(0.4, -0.25);
  ctx.lineTo(-1.6, -0.25);
  ctx.lineTo(-1.6, 0.25);
  ctx.lineTo(0.4, 0.25);
  ctx.lineTo(0.4, 0.75);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawMarking(ctx: CanvasRenderingContext2D, marking: Marking): void {
  if (marking.shape === 'arrow') {
    drawArrow(ctx, marking.x, marking.y, marking.heading);
    return;
  }
  ctx.strokeStyle = marking.color === 'yellow' ? COLOURS.paintYellow : COLOURS.paintWhite;
  ctx.lineWidth = marking.width;
  ctx.setLineDash(marking.dash ?? []);
  ctx.beginPath();
  if (marking.shape === 'line') {
    ctx.moveTo(marking.x1, marking.y1);
    ctx.lineTo(marking.x2, marking.y2);
  } else {
    ctx.arc(marking.cx, marking.cy, marking.r, marking.a0, marking.a1);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawShadow(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
  if (obstacle.kind === 'edge' || obstacle.kind === 'kerb') return;
  ctx.fillStyle = COLOURS.shadow;
  if (obstacle.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(obstacle.x + 0.15, obstacle.y + 0.2, obstacle.r, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  const shifted = { ...obstacle.box, cx: obstacle.box.cx + 0.15, cy: obstacle.box.cy + 0.22 };
  withBox(ctx, shifted, () => {
    boxPath(ctx, shifted, obstacle.kind === 'car' ? 0.4 : 0.05);
    ctx.fill();
  });
}

function drawCircleObstacle(ctx: CanvasRenderingContext2D, obstacle: Extract<Obstacle, { shape: 'circle' }>): void {
  const { x, y, r } = obstacle;
  if (obstacle.kind === 'cone') {
    ctx.fillStyle = COLOURS.cone;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.07;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  ctx.fillStyle = COLOURS.tree;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLOURS.treeLight;
  ctx.beginPath();
  ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.55, 0, Math.PI * 2);
  ctx.fill();
}

function drawBoxObstacle(ctx: CanvasRenderingContext2D, obstacle: Extract<Obstacle, { shape: 'box' }>): void {
  const { box } = obstacle;
  if (obstacle.kind === 'car') {
    withBox(ctx, box, () => drawCarBody(ctx, obstacle.color ?? '#c9cdd2', true));
    return;
  }
  withBox(ctx, box, () => {
    const w = box.halfLength * 2;
    const h = box.halfWidth * 2;
    const left = -box.halfLength;
    const top = -box.halfWidth;
    switch (obstacle.kind) {
      case 'kerb': {
        ctx.fillStyle = SURFACE_COLOURS.pavement;
        ctx.fillRect(left, top, w, h);
        ctx.strokeStyle = COLOURS.kerb;
        ctx.lineWidth = Math.min(0.3, w, h);
        ctx.strokeRect(left + ctx.lineWidth / 2, top + ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
        break;
      }
      case 'hedge':
        ctx.fillStyle = COLOURS.hedge;
        boxPath(ctx, box, Math.min(0.25, h / 2, w / 2));
        ctx.fill();
        ctx.fillStyle = COLOURS.hedgeLight;
        ctx.fillRect(left + 0.08, top + 0.08, Math.max(0, w - 0.16), Math.max(0, h * 0.4));
        break;
      case 'building':
        ctx.fillStyle = COLOURS.building;
        ctx.fillRect(left, top, w, h);
        ctx.strokeStyle = COLOURS.buildingEdge;
        ctx.lineWidth = 0.25;
        ctx.strokeRect(left + 0.125, top + 0.125, w - 0.25, h - 0.25);
        break;
      case 'pillar':
        ctx.fillStyle = COLOURS.pillar;
        ctx.fillRect(left, top, w, h);
        ctx.strokeStyle = '#c8cacd';
        ctx.lineWidth = 0.06;
        ctx.strokeRect(left + 0.05, top + 0.05, w - 0.1, h - 0.1);
        break;
      case 'post':
        ctx.fillStyle = COLOURS.post;
        ctx.fillRect(left, top, w, h);
        break;
      case 'wall':
        ctx.fillStyle = COLOURS.wall;
        ctx.fillRect(left, top, w, h);
        ctx.fillStyle = COLOURS.wallTop;
        ctx.fillRect(left, top, w, Math.min(h, 0.12));
        break;
      default:
        break;
    }
  });
}

export function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
  if (obstacle.kind === 'edge') return;
  if (obstacle.shape === 'circle') drawCircleObstacle(ctx, obstacle);
  else drawBoxObstacle(ctx, obstacle);
}

export function obstacleOutline(ctx: CanvasRenderingContext2D, obstacle: Obstacle): void {
  if (obstacle.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(obstacle.x, obstacle.y, obstacle.r, 0, Math.PI * 2);
    return;
  }
  ctx.save();
  ctx.translate(obstacle.box.cx, obstacle.box.cy);
  ctx.rotate(obstacle.box.angle);
  boxPath(ctx, obstacle.box, obstacle.kind === 'car' ? 0.4 : 0);
  ctx.restore();
}

export function drawWorld(ctx: CanvasRenderingContext2D, level: Scene): void {
  drawGround(ctx, level);
  for (const surface of level.map.surfaces) drawSurface(ctx, surface);
  for (const marking of level.map.markings) drawMarking(ctx, marking);
}

export function drawObstacles(ctx: CanvasRenderingContext2D, level: Scene): void {
  for (const obstacle of level.map.obstacles) drawShadow(ctx, obstacle);
  for (const obstacle of level.map.obstacles) drawObstacle(ctx, obstacle);
}
