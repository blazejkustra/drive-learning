import { distance, type Vec } from './geometry.ts';
import { wheelPoints, type Pose, type WheelPoints } from './physics.ts';

export interface TrailSample extends WheelPoints {
  time: number;
}

const SPACING = 0.12;
const MAX_SAMPLES = 1600;

export class Trail {
  samples: TrailSample[] = [];
  private last: Vec | null = null;

  record(pose: Pose, time: number): void {
    if (this.last && distance(this.last, pose) < SPACING) return;
    this.last = { x: pose.x, y: pose.y };
    this.samples.push({ ...wheelPoints(pose), time });
    if (this.samples.length > MAX_SAMPLES) this.samples.shift();
  }

  clear(): void {
    this.samples = [];
    this.last = null;
  }
}
