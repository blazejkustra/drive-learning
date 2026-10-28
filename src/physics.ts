import { DEG, add, clamp, fromAngle, scale, vec, type Box, type Vec } from './geometry.ts';

export const CAR = {
  length: 4.5,
  width: 1.8,
  wheelbase: 2.7,
  rearOverhang: 0.9,
  track: 1.56,
  tyreLength: 0.66,
  tyreWidth: 0.24,
  maxSteer: 37 * DEG,
  wheelLockDeg: 270,
};

export const CENTRE_OFFSET = CAR.length / 2 - CAR.rearOverhang;

const DRIVE = {
  maxForward: 2.6,
  maxReverse: 1.6,
  creepForward: 0.75,
  creepReverse: 0.6,
  accel: 1.0,
  creepAccel: 0.7,
  coastDecel: 0.8,
  brakeDecel: 4.5,
};

export type Gear = 'P' | 'R' | 'D';

export interface Pedals {
  gas: boolean;
  brake: boolean;
}

/** Pose of the rear axle centre; heading in radians, 0 = east, y axis points down. */
export interface Pose {
  x: number;
  y: number;
  heading: number;
}

export interface WheelPoints {
  frontLeft: Vec;
  frontRight: Vec;
  rearLeft: Vec;
  rearRight: Vec;
}

export function poseFromCentre(x: number, y: number, headingDeg: number): Pose {
  const heading = headingDeg * DEG;
  const f = fromAngle(heading);
  return { x: x - f.x * CENTRE_OFFSET, y: y - f.y * CENTRE_OFFSET, heading };
}

export function localToWorld(pose: Pose, forward: number, right: number): Vec {
  const f = fromAngle(pose.heading);
  return vec(pose.x + f.x * forward - f.y * right, pose.y + f.y * forward + f.x * right);
}

export function carCentre(pose: Pose): Vec {
  return localToWorld(pose, CENTRE_OFFSET, 0);
}

export function carBox(pose: Pose): Box {
  const centre = carCentre(pose);
  return {
    cx: centre.x,
    cy: centre.y,
    halfLength: CAR.length / 2,
    halfWidth: CAR.width / 2,
    angle: pose.heading,
  };
}

export function wheelPoints(pose: Pose): WheelPoints {
  const half = CAR.track / 2;
  return {
    frontLeft: localToWorld(pose, CAR.wheelbase, -half),
    frontRight: localToWorld(pose, CAR.wheelbase, half),
    rearLeft: localToWorld(pose, 0, -half),
    rearRight: localToWorld(pose, 0, half),
  };
}

export function steerFromWheel(wheelDeg: number): number {
  const ratio = CAR.wheelLockDeg / (CAR.maxSteer / DEG);
  return clamp((wheelDeg / ratio) * DEG, -CAR.maxSteer, CAR.maxSteer);
}

export function turningRadius(steer: number): number | null {
  if (Math.abs(steer) < 0.002) return null;
  return CAR.wheelbase / Math.tan(steer);
}

export function turningCentre(pose: Pose, steer: number): Vec | null {
  const radius = turningRadius(steer);
  if (radius === null) return null;
  return localToWorld(pose, 0, radius);
}

/** Ackermann geometry: the inner front wheel turns more than the outer one. */
export function frontWheelAngles(steer: number): { left: number; right: number } {
  const radius = turningRadius(steer);
  if (radius === null) return { left: steer, right: steer };
  const half = CAR.track / 2;
  return {
    left: Math.atan(CAR.wheelbase / (radius + half)),
    right: Math.atan(CAR.wheelbase / (radius - half)),
  };
}

export function movePose(pose: Pose, distance: number, steer: number): Pose {
  const radius = turningRadius(steer);
  if (radius === null) {
    const f = fromAngle(pose.heading);
    return { ...add(pose, scale(f, distance)), heading: pose.heading };
  }
  const heading = pose.heading + distance / radius;
  return {
    x: pose.x + radius * (Math.sin(heading) - Math.sin(pose.heading)),
    y: pose.y - radius * (Math.cos(heading) - Math.cos(pose.heading)),
    heading,
  };
}

function approach(value: number, target: number, step: number): number {
  if (value < target) return Math.min(target, value + step);
  return Math.max(target, value - step);
}

export function nextSpeed(speed: number, gear: Gear, pedals: Pedals, dt: number): number {
  if (gear === 'P') return 0;
  if (pedals.brake) return approach(speed, 0, DRIVE.brakeDecel * dt);

  const direction = gear === 'D' ? 1 : -1;
  const creep = gear === 'D' ? DRIVE.creepForward : DRIVE.creepReverse;
  const max = gear === 'D' ? DRIVE.maxForward : DRIVE.maxReverse;
  const targetMagnitude = pedals.gas ? max : creep;
  const magnitude = speed * direction;

  if (magnitude < targetMagnitude) {
    const accel = pedals.gas ? DRIVE.accel : DRIVE.creepAccel;
    return direction * Math.min(targetMagnitude, magnitude + accel * dt);
  }
  return direction * Math.max(targetMagnitude, magnitude - DRIVE.coastDecel * dt);
}
