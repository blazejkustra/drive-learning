import { DEG, boxCorners, boxesOverlap, circleOverlapsBox, distance, dot, fromAngle, normalizeAngle, pointInBox, sub, type Box } from './geometry.ts';
import type { Level, Obstacle, TargetZone } from './level-types.ts';
import { CAR, carBox, carCentre, movePose, nextSpeed, poseFromCentre, type Gear, type Pedals, type Pose } from './physics.ts';
import { Trail } from './trail.ts';

export type SessionStatus = 'driving' | 'finished' | 'failed';

export interface Alignment {
  headingError: number;
  sideOffset: number;
  quality: 'great' | 'good' | 'crooked';
}

export interface Result {
  time: number;
  touches: number;
  alignment: Alignment;
  stars: number;
}

export interface SessionEvents {
  bump: (obstacle: Obstacle) => void;
  finish: (result: Result) => void;
  fail: () => void;
  gearBlocked: () => void;
  checkpoint: (index: number, total: number) => void;
}

const MAX_SUBSTEP = 0.04;
const BUMP_COOLDOWN = 1.2;
const HOLD_TO_FINISH = 0.7;
const STOPPED = 0.05;
const TARGET_MARGIN = 0.15;

export function targetBox(target: TargetZone): Box {
  return {
    cx: target.x,
    cy: target.y,
    halfLength: target.length / 2,
    halfWidth: target.width / 2,
    angle: target.heading * DEG,
  };
}

function headingError(heading: number, target: TargetZone): number {
  const direct = Math.abs(normalizeAngle(heading - target.heading * DEG));
  if (!target.either) return direct;
  return Math.min(direct, Math.PI - direct);
}

export function overlapsObstacle(box: Box, obstacle: Obstacle): boolean {
  if (obstacle.shape === 'circle') return circleOverlapsBox(obstacle, box);
  return boxesOverlap(box, obstacle.box);
}

export class GameSession {
  readonly level: Level;
  pose: Pose;
  speed = 0;
  steer = 0;
  gear: Gear = 'P';
  pedals: Pedals = { gas: false, brake: false };
  status: SessionStatus = 'driving';
  time = 0;
  started = false;
  touches = 0;
  checkpointsPassed = 0;
  holdProgress = 0;
  inTarget = false;
  aligned = false;
  lastBump: { obstacle: Obstacle; time: number } | null = null;
  readonly trail = new Trail();
  private inContact = false;
  private readonly events: SessionEvents;

  constructor(level: Level, events: SessionEvents) {
    this.level = level;
    this.events = events;
    this.pose = poseFromCentre(level.start.x, level.start.y, level.start.heading);
    this.trail.record(this.pose, 0);
  }

  get target(): TargetZone {
    return this.level.target;
  }

  get allCheckpointsPassed(): boolean {
    return this.checkpointsPassed >= this.level.checkpoints.length;
  }

  setGear(gear: Gear): boolean {
    if (this.status !== 'driving' || gear === this.gear) return false;
    if (Math.abs(this.speed) > 0.15) {
      this.events.gearBlocked();
      return false;
    }
    this.gear = gear;
    this.speed = 0;
    if (gear !== 'P') this.started = true;
    return true;
  }

  update(dt: number): void {
    if (this.status !== 'driving') return;
    if (this.started) this.time += dt;
    this.speed = nextSpeed(this.speed, this.gear, this.pedals, dt);
    this.move(this.speed * dt);
    this.updateCheckpoints();
    this.updateTarget(dt);
  }

  private move(distanceToTravel: number): void {
    if (distanceToTravel === 0) return;
    const steps = Math.ceil(Math.abs(distanceToTravel) / MAX_SUBSTEP);
    const step = distanceToTravel / steps;
    for (let i = 0; i < steps; i++) {
      const candidate = movePose(this.pose, step, this.steer);
      const hit = this.findCollision(carBox(candidate));
      if (hit) {
        this.registerBump(hit);
        this.speed = 0;
        return;
      }
      this.pose = candidate;
      this.inContact = false;
      this.trail.record(this.pose, this.time);
    }
  }

  private findCollision(box: Box): Obstacle | null {
    return this.level.map.obstacles.find((obstacle) => overlapsObstacle(box, obstacle)) ?? null;
  }

  private registerBump(obstacle: Obstacle): void {
    const recent = this.lastBump !== null && this.time - this.lastBump.time < BUMP_COOLDOWN;
    const alreadyCounted = this.inContact || recent;
    this.inContact = true;
    if (alreadyCounted) return;

    this.touches += 1;
    this.lastBump = { obstacle, time: this.time };
    this.events.bump(obstacle);
    if (this.level.maxTouches !== undefined && this.touches > this.level.maxTouches) {
      this.status = 'failed';
      this.events.fail();
    }
  }

  private updateCheckpoints(): void {
    const next = this.level.checkpoints[this.checkpointsPassed];
    if (!next) return;
    if (distance(carCentre(this.pose), next) <= next.r) {
      this.checkpointsPassed += 1;
      this.events.checkpoint(this.checkpointsPassed, this.level.checkpoints.length);
    }
  }

  private updateTarget(dt: number): void {
    const zone = targetBox(this.target);
    const corners = boxCorners(carBox(this.pose));
    const inside = corners.every((corner) => pointInBox(corner, zone, TARGET_MARGIN));
    this.inTarget = inside && this.allCheckpointsPassed;
    this.aligned = this.inTarget && headingError(this.pose.heading, this.target) <= this.target.headingTolerance * DEG;

    const stopped = Math.abs(this.speed) < STOPPED && (this.pedals.brake || this.gear === 'P');
    this.holdProgress = this.aligned && stopped && this.started ? this.holdProgress + dt / HOLD_TO_FINISH : 0;
    if (this.holdProgress >= 1) this.finish();
  }

  private finish(): void {
    this.status = 'finished';
    this.speed = 0;
    const alignment = this.measureAlignment();
    this.events.finish({
      time: this.time,
      touches: this.touches,
      alignment,
      stars: starsFor(this.time, this.touches, alignment, this.level.parTime),
    });
  }

  private measureAlignment(): Alignment {
    const error = headingError(this.pose.heading, this.target);
    const across = fromAngle(this.target.heading * DEG + Math.PI / 2);
    const offset = Math.abs(dot(sub(carCentre(this.pose), this.target), across));
    const slack = Math.max(0.1, (this.target.width - CAR.width) / 2);
    const tolerance = this.target.headingTolerance * DEG;
    let quality: Alignment['quality'] = 'crooked';
    if (error <= tolerance * 0.4 && offset <= slack * 0.6) quality = 'great';
    else if (error <= tolerance * 0.75) quality = 'good';
    return { headingError: error / DEG, sideOffset: offset, quality };
  }
}

export function starsFor(time: number, touches: number, alignment: Alignment, parTime: number): number {
  let stars = 3;
  if (touches >= 1) stars -= 1;
  if (touches >= 3) stars -= 1;
  if (alignment.quality === 'crooked') stars -= 1;
  if (time > parTime) stars -= 1;
  return Math.max(1, stars);
}
