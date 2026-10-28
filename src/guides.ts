import type { Vec } from './geometry.ts';
import { CAR, localToWorld, movePose, turningCentre, type Pose } from './physics.ts';

export interface GuidePaths {
  frontWheels: [Vec[], Vec[]];
  rearWheels: [Vec[], Vec[]];
  swingCorner: Vec[];
  endPose: Pose;
  pivot: Vec | null;
}

const STEP = 0.2;
const MAX_TURN = Math.PI * 1.2;

export function predictPaths(pose: Pose, steer: number, direction: 1 | -1, distance: number): GuidePaths {
  const half = CAR.track / 2;
  const front = CAR.length - CAR.rearOverhang;
  const swingSide = steer >= 0 ? -CAR.width / 2 : CAR.width / 2;
  const paths: GuidePaths = {
    frontWheels: [[], []],
    rearWheels: [[], []],
    swingCorner: [],
    endPose: pose,
    pivot: turningCentre(pose, steer),
  };

  const steps = Math.ceil(distance / STEP);
  for (let i = 0; i <= steps; i++) {
    const p = movePose(pose, direction * i * STEP, steer);
    if (Math.abs(p.heading - pose.heading) > MAX_TURN) break;
    paths.frontWheels[0].push(localToWorld(p, CAR.wheelbase, -half));
    paths.frontWheels[1].push(localToWorld(p, CAR.wheelbase, half));
    paths.rearWheels[0].push(localToWorld(p, 0, -half));
    paths.rearWheels[1].push(localToWorld(p, 0, half));
    paths.swingCorner.push(localToWorld(p, front, swingSide));
    paths.endPose = p;
  }
  return paths;
}
