import { predictPaths } from '../guides.ts';
import type { Level, Obstacle } from '../level-types.ts';
import type { Gear, Pose } from '../physics.ts';
import type { TrailSample } from '../trail.ts';
import type { Camera } from './camera.ts';
import { drawPlayerCar } from './car.ts';
import { drawBumpHighlight, drawCheckpoints, drawGuides, drawPivot, drawTarget, drawTrail } from './overlays.ts';
import { drawObstacles, drawWorld } from './world.ts';

export interface SceneState {
  pose: Pose;
  steer: number;
  gear: Gear;
  time: number;
  checkpointsPassed: number;
  aligned: boolean;
  showGuides: boolean;
  showTrail: boolean;
  trail: TrailSample[];
  bump: { obstacle: Obstacle; strength: number } | null;
}

const GUIDE_DISTANCE = 5;

export function drawScene(ctx: CanvasRenderingContext2D, camera: Camera, pixelRatio: number, level: Level, state: SceneState): void {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  camera.apply(ctx, pixelRatio);

  drawWorld(ctx, level);
  drawTarget(ctx, level.target, state.aligned, camera);
  drawCheckpoints(ctx, level.checkpoints, state.checkpointsPassed, camera);
  if (state.showTrail) drawTrail(ctx, state.trail, state.time, camera);
  drawObstacles(ctx, level);
  if (state.bump) drawBumpHighlight(ctx, state.bump.obstacle, state.bump.strength, camera);

  if (state.showGuides) {
    const direction = state.gear === 'R' ? -1 : 1;
    const paths = predictPaths(state.pose, state.steer, direction, GUIDE_DISTANCE);
    drawGuides(ctx, paths, state.steer, camera);
    drawPlayerCar(ctx, state.pose, { steer: state.steer, bumped: state.bump?.strength ?? 0 });
    drawPivot(ctx, paths.pivot, state.pose, camera);
    return;
  }
  drawPlayerCar(ctx, state.pose, { steer: state.steer, bumped: state.bump?.strength ?? 0 });
}
