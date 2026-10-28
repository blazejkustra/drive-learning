import { DEG, distance, type Vec } from '../geometry.ts';
import type { GuidePaths } from '../guides.ts';
import { t } from '../i18n/index.ts';
import type { Checkpoint, Obstacle, TargetZone } from '../level-types.ts';
import type { Pose } from '../physics.ts';
import type { TrailSample } from '../trail.ts';
import type { Camera } from './camera.ts';
import { drawGhostCar } from './car.ts';
import { COLOURS } from './palette.ts';
import { obstacleOutline } from './world.ts';

const TRAIL_FADE_SECONDS = 40;
const TRAIL_CHUNK = 12;

function polyline(ctx: CanvasRenderingContext2D, points: Vec[]): void {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const p of points.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function chevron(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.4, -size * 0.75);
  ctx.lineTo(-size * 0.1, 0);
  ctx.lineTo(-size * 0.4, size * 0.75);
  ctx.closePath();
  ctx.fill();
}

export function drawTarget(ctx: CanvasRenderingContext2D, target: TargetZone, aligned: boolean, camera: Camera): void {
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.rotate(target.heading * DEG);
  const w = target.length;
  const h = target.width;
  ctx.fillStyle = aligned ? 'rgba(63, 194, 122, 0.42)' : 'rgba(63, 194, 122, 0.18)';
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.strokeStyle = COLOURS.target;
  ctx.lineWidth = camera.px(3);
  ctx.setLineDash([camera.px(10), camera.px(7)]);
  ctx.strokeRect(-w / 2, -h / 2, w, h);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.translate(w / 2 - 0.9, 0);
  chevron(ctx, 0.55);
  if (target.either) {
    ctx.translate(-(w - 1.8), 0);
    ctx.rotate(Math.PI);
    chevron(ctx, 0.55);
  }
  ctx.restore();
}

export function drawCheckpoints(ctx: CanvasRenderingContext2D, checkpoints: Checkpoint[], passed: number, camera: Camera): void {
  checkpoints.forEach((cp, i) => {
    const done = i < passed;
    const next = i === passed;
    ctx.beginPath();
    ctx.arc(cp.x, cp.y, cp.r, 0, Math.PI * 2);
    ctx.fillStyle = done ? 'rgba(63, 194, 122, 0.28)' : next ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.lineWidth = camera.px(next ? 3 : 2);
    ctx.strokeStyle = done ? COLOURS.target : next ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash(done ? [] : [camera.px(8), camera.px(6)]);
    ctx.stroke();
    ctx.setLineDash([]);
    drawWorldLabel(ctx, camera, { x: cp.x, y: cp.y }, done ? '✓' : String(i + 1), done ? COLOURS.target : '#ffffff', 18);
  });
}

function trailChunks(samples: TrailSample[], pick: (s: TrailSample) => Vec, now: number): { points: Vec[]; alpha: number }[] {
  const chunks: { points: Vec[]; alpha: number }[] = [];
  for (let start = 0; start < samples.length - 1; start += TRAIL_CHUNK) {
    const slice = samples.slice(start, start + TRAIL_CHUNK + 1);
    const age = now - slice[slice.length - 1].time;
    const alpha = 1 - age / TRAIL_FADE_SECONDS;
    if (alpha > 0.02) chunks.push({ points: slice.map(pick), alpha });
  }
  return chunks;
}

export function drawTrail(ctx: CanvasRenderingContext2D, samples: TrailSample[], now: number, camera: Camera): void {
  const wheels: { pick: (s: TrailSample) => Vec; colour: string }[] = [
    { pick: (s) => s.frontLeft, colour: '255, 255, 255' },
    { pick: (s) => s.frontRight, colour: '255, 255, 255' },
    { pick: (s) => s.rearLeft, colour: '56, 200, 227' },
    { pick: (s) => s.rearRight, colour: '56, 200, 227' },
  ];
  ctx.lineWidth = camera.px(2.5);
  ctx.lineCap = 'round';
  for (const wheel of wheels) {
    for (const chunk of trailChunks(samples, wheel.pick, now)) {
      ctx.strokeStyle = `rgba(${wheel.colour}, ${(chunk.alpha * 0.7).toFixed(3)})`;
      polyline(ctx, chunk.points);
    }
  }
  ctx.lineCap = 'butt';
}

export function drawGuides(ctx: CanvasRenderingContext2D, paths: GuidePaths, steer: number, camera: Camera): void {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = camera.px(2.5);
  for (const path of paths.frontWheels) polyline(ctx, path);

  ctx.strokeStyle = COLOURS.rearPath;
  ctx.lineWidth = camera.px(4);
  for (const path of paths.rearWheels) polyline(ctx, path);

  if (Math.abs(steer) > 0.5 * DEG) drawSwingPath(ctx, paths.swingCorner, camera);
  ctx.lineCap = 'butt';
  drawGhostCar(ctx, paths.endPose, camera.px(1));
}

export function drawSwingPath(ctx: CanvasRenderingContext2D, points: Vec[], camera: Camera): void {
  ctx.strokeStyle = COLOURS.swingPath;
  ctx.lineWidth = camera.px(3);
  ctx.setLineDash([camera.px(9), camera.px(6)]);
  polyline(ctx, points);
  ctx.setLineDash([]);
}

export function drawPivot(ctx: CanvasRenderingContext2D, pivot: Vec | null, pose: Pose, camera: Camera): void {
  if (!pivot || distance(pivot, pose) > 25) return;
  ctx.strokeStyle = 'rgba(56, 200, 227, 0.75)';
  ctx.lineWidth = camera.px(2);
  ctx.setLineDash([camera.px(5), camera.px(5)]);
  ctx.beginPath();
  ctx.moveTo(pose.x, pose.y);
  ctx.lineTo(pivot.x, pivot.y);
  ctx.stroke();
  ctx.setLineDash([]);

  const r = camera.px(9);
  ctx.fillStyle = 'rgba(20, 28, 38, 0.75)';
  ctx.beginPath();
  ctx.arc(pivot.x, pivot.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = COLOURS.rearPath;
  ctx.lineWidth = camera.px(2.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(pivot.x - r * 0.55, pivot.y);
  ctx.lineTo(pivot.x + r * 0.55, pivot.y);
  ctx.moveTo(pivot.x, pivot.y - r * 0.55);
  ctx.lineTo(pivot.x, pivot.y + r * 0.55);
  ctx.stroke();
  drawWorldLabel(ctx, camera, { x: pivot.x, y: pivot.y + camera.px(22) }, t().legend.pivotLabel, 'rgba(255, 255, 255, 0.9)', 13);
}

export function drawBumpHighlight(ctx: CanvasRenderingContext2D, obstacle: Obstacle, strength: number, camera: Camera): void {
  if (strength <= 0 || obstacle.kind === 'edge') return;
  obstacleOutline(ctx, obstacle);
  ctx.strokeStyle = `rgba(255, 216, 74, ${strength.toFixed(3)})`;
  ctx.lineWidth = camera.px(5);
  ctx.stroke();
}

export function drawWorldLabel(ctx: CanvasRenderingContext2D, camera: Camera, at: Vec, text: string, colour: string, sizePx: number): void {
  ctx.save();
  ctx.translate(at.x, at.y);
  const s = camera.px(1);
  ctx.scale(s, s);
  ctx.font = `600 ${sizePx}px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(20, 28, 38, 0.6)';
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = colour;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}
