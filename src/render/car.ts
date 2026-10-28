import { CAR, CENTRE_OFFSET, carCentre, frontWheelAngles, type Pose } from '../physics.ts';
import { COLOURS } from './palette.ts';

const HALF_L = CAR.length / 2;
const HALF_W = CAR.width / 2;
const AXLE = CAR.wheelbase / 2;
const TRACK = CAR.track / 2;

function tyre(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, outlined: boolean): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = COLOURS.tyre;
  ctx.beginPath();
  ctx.roundRect(-CAR.tyreLength / 2, -CAR.tyreWidth / 2, CAR.tyreLength, CAR.tyreWidth, 0.06);
  ctx.fill();
  if (outlined) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 0.05;
    ctx.stroke();
  }
  ctx.restore();
}

function cabin(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(22, 30, 40, 0.82)';
  ctx.beginPath();
  ctx.moveTo(1.12, -0.7);
  ctx.lineTo(1.12, 0.7);
  ctx.lineTo(0.42, 0.78);
  ctx.lineTo(0.42, -0.78);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-1.25, -0.74);
  ctx.lineTo(-1.25, 0.74);
  ctx.lineTo(-1.72, 0.64);
  ctx.lineTo(-1.72, -0.64);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.beginPath();
  ctx.roundRect(-1.25, -0.74, 1.67, 1.48, 0.12);
  ctx.fill();
}

function lights(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#fff4cf';
  ctx.fillRect(HALF_L - 0.1, -0.72, 0.08, 0.32);
  ctx.fillRect(HALF_L - 0.1, 0.4, 0.08, 0.32);
  ctx.fillStyle = '#c23b2f';
  ctx.fillRect(-HALF_L + 0.02, -0.74, 0.08, 0.3);
  ctx.fillRect(-HALF_L + 0.02, 0.44, 0.08, 0.3);
}

function mirrors(ctx: CanvasRenderingContext2D, colour: string): void {
  ctx.fillStyle = colour;
  ctx.fillRect(0.5, -HALF_W - 0.14, 0.16, 0.16);
  ctx.fillRect(0.5, HALF_W - 0.02, 0.16, 0.16);
}

/** Draws a car in local space: centre at the origin, facing +x. */
export function drawCarBody(ctx: CanvasRenderingContext2D, colour: string, withTyres: boolean): void {
  if (withTyres) {
    for (const x of [-AXLE, AXLE]) for (const y of [-TRACK, TRACK]) tyre(ctx, x, y, 0, false);
  }
  mirrors(ctx, colour);
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.roundRect(-HALF_L, -HALF_W, CAR.length, CAR.width, 0.42);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 0.04;
  ctx.stroke();
  cabin(ctx);
  lights(ctx);
}

export interface PlayerCarStyle {
  steer: number;
  bumped: number;
}

export function drawPlayerCar(ctx: CanvasRenderingContext2D, pose: Pose, style: PlayerCarStyle): void {
  const centre = carCentre(pose);
  ctx.save();
  ctx.translate(centre.x, centre.y);
  ctx.rotate(pose.heading);

  ctx.fillStyle = COLOURS.shadow;
  ctx.beginPath();
  ctx.roundRect(-HALF_L + 0.12, -HALF_W + 0.18, CAR.length, CAR.width, 0.42);
  ctx.fill();

  drawCarBody(ctx, COLOURS.playerCar, false);

  if (style.bumped > 0) {
    ctx.strokeStyle = `rgba(255, 216, 74, ${style.bumped})`;
    ctx.lineWidth = 0.18;
    ctx.beginPath();
    ctx.roundRect(-HALF_L, -HALF_W, CAR.length, CAR.width, 0.42);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(56, 200, 227, 0.9)';
  ctx.lineWidth = 0.06;
  ctx.beginPath();
  ctx.moveTo(-CENTRE_OFFSET, -TRACK);
  ctx.lineTo(-CENTRE_OFFSET, TRACK);
  ctx.stroke();

  const angles = frontWheelAngles(style.steer);
  tyre(ctx, -AXLE, -TRACK, 0, true);
  tyre(ctx, -AXLE, TRACK, 0, true);
  tyre(ctx, AXLE, -TRACK, angles.left, true);
  tyre(ctx, AXLE, TRACK, angles.right, true);
  ctx.restore();
}

export function drawGhostCar(ctx: CanvasRenderingContext2D, pose: Pose, pixel: number): void {
  const centre = carCentre(pose);
  ctx.save();
  ctx.translate(centre.x, centre.y);
  ctx.rotate(pose.heading);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2 * pixel;
  ctx.setLineDash([6 * pixel, 5 * pixel]);
  ctx.beginPath();
  ctx.roundRect(-HALF_L, -HALF_W, CAR.length, CAR.width, 0.42);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
