import { DEG, boxCorners, clamp, pointInBox, toBoxLocal, type Box, type Vec } from './geometry.ts';
import type { Obstacle } from './level-types.ts';
import { CAR, CENTRE_OFFSET } from './physics.ts';

export type BumpKind = 'insideRear' | 'frontSwing' | 'frontSwingReverse' | 'general';

const MIN_STEER = 8 * DEG;
const FRONT_AXLE = CAR.wheelbase - CENTRE_OFFSET;
const OUTER_CORNER = CAR.width * 0.3;

function average(points: Vec[]): Vec {
  const sum = points.reduce((total, p) => ({ x: total.x + p.x, y: total.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

function clampToCar(car: Box, local: Vec): Vec {
  return { x: clamp(local.x, -car.halfLength, car.halfLength), y: clamp(local.y, -car.halfWidth, car.halfWidth) };
}

/** Contact point is in car space: x forward from the car centre, y towards the right side. */
function contactPoint(car: Box, obstacle: Obstacle): Vec {
  if (obstacle.shape === 'circle') return clampToCar(car, toBoxLocal(car, obstacle));
  const obstacleCorners = boxCorners(obstacle.box).filter((corner) => pointInBox(corner, car));
  if (obstacleCorners.length > 0) return toBoxLocal(car, average(obstacleCorners));
  const carCorners = boxCorners(car).filter((corner) => pointInBox(corner, obstacle.box));
  if (carCorners.length > 0) return toBoxLocal(car, average(carCorners));
  return clampToCar(car, toBoxLocal(car, { x: obstacle.box.cx, y: obstacle.box.cy }));
}

export function classifyBump(car: Box, steer: number, direction: number, obstacle: Obstacle): BumpKind {
  if (obstacle.kind === 'edge' || Math.abs(steer) < MIN_STEER) return 'general';
  const contact = contactPoint(car, obstacle);
  const sideways = contact.y * Math.sign(steer);
  if (direction > 0 && sideways > 0 && contact.x < FRONT_AXLE) return 'insideRear';
  if (sideways < -OUTER_CORNER && contact.x > FRONT_AXLE) return direction > 0 ? 'frontSwing' : 'frontSwingReverse';
  return 'general';
}
