import { DEG, boxCorners, distance, normalizeAngle, pointInBox } from '../src/geometry.ts';
import { overlapsObstacle, targetBox } from '../src/game.ts';
import type { Level } from '../src/level-types.ts';
import { LEVELS } from '../src/levels.ts';
import { CAR, carBox, carCentre, movePose, poseFromCentre, type Pose } from '../src/physics.ts';

const STEERS = [-1, -0.6, -0.3, 0, 0.3, 0.6, 1].map((f) => f * CAR.maxSteer);
const SEGMENT = 0.6;
const MAX_NODES = 250_000;

interface Node {
  pose: Pose;
  checkpoint: number;
  cost: number;
  moves: number;
}

function collides(level: Level, pose: Pose): boolean {
  const box = carBox(pose);
  return level.map.obstacles.some((obstacle) => overlapsObstacle(box, obstacle));
}

function reachedTarget(level: Level, node: Node): boolean {
  if (node.checkpoint < level.checkpoints.length) return false;
  const zone = targetBox(level.target);
  const inside = boxCorners(carBox(node.pose)).every((c) => pointInBox(c, zone, 0.15));
  const error = Math.abs(normalizeAngle(node.pose.heading - level.target.heading * DEG));
  return inside && error <= level.target.headingTolerance * DEG;
}

function key(node: Node, direction: number): string {
  const h = Math.round(normalizeAngle(node.pose.heading) / (6 * DEG));
  return `${Math.round(node.pose.x / 0.3)},${Math.round(node.pose.y / 0.3)},${h},${node.checkpoint},${direction}`;
}

function advance(level: Level, node: Node, direction: number, steer: number): Node | null {
  let pose = node.pose;
  let checkpoint = node.checkpoint;
  const steps = 6;
  for (let i = 0; i < steps; i++) {
    pose = movePose(pose, (direction * SEGMENT) / steps, steer);
    if (collides(level, pose)) return null;
    const next = level.checkpoints[checkpoint];
    if (next && distance(carCentre(pose), next) <= next.r) checkpoint += 1;
  }
  return { pose, checkpoint, cost: 0, moves: node.moves + 1 };
}

function heuristic(level: Level, node: Node): number {
  const goal = level.checkpoints[node.checkpoint] ?? level.target;
  const remaining = level.checkpoints.length - node.checkpoint;
  return distance(carCentre(node.pose), goal) + remaining * 8;
}

interface Entry {
  node: Node;
  direction: number;
  score: number;
}

class MinHeap {
  private items: Entry[] = [];

  get size(): number {
    return this.items.length;
  }

  push(entry: Entry): void {
    const items = this.items;
    items.push(entry);
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].score <= items[i].score) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop(): Entry {
    const items = this.items;
    const top = items[0];
    const last = items.pop()!;
    if (items.length === 0) return top;
    items[0] = last;
    let index = 0;
    let child = this.smallerChild(index);
    while (child !== null && items[child].score < items[index].score) {
      [items[child], items[index]] = [items[index], items[child]];
      index = child;
      child = this.smallerChild(index);
    }
    return top;
  }

  private smallerChild(index: number): number | null {
    const left = index * 2 + 1;
    const right = left + 1;
    if (left >= this.items.length) return null;
    if (right >= this.items.length) return left;
    return this.items[left].score <= this.items[right].score ? left : right;
  }
}

function solve(level: Level): Node | null {
  const start: Node = { pose: poseFromCentre(level.start.x, level.start.y, level.start.heading), checkpoint: 0, cost: 0, moves: 0 };
  const open = new MinHeap();
  open.push({ node: start, direction: 0, score: 0 });
  const seen = new Set<string>();
  let expanded = 0;
  while (open.size > 0 && expanded < MAX_NODES) {
    const current = open.pop();
    const k = key(current.node, current.direction);
    if (seen.has(k)) continue;
    seen.add(k);
    expanded += 1;
    if (reachedTarget(level, current.node)) return current.node;
    for (const direction of [1, -1]) {
      for (const steer of STEERS) {
        const next = advance(level, current.node, direction, steer);
        if (!next) continue;
        const switchPenalty = current.direction !== 0 && current.direction !== direction ? 3 : 0;
        next.cost = current.node.cost + SEGMENT + switchPenalty + (direction < 0 ? 0.1 : 0);
        open.push({ node: next, direction, score: next.cost + heuristic(level, next) * 1.5 });
      }
    }
  }
  return null;
}

let problems = 0;
for (const level of LEVELS) {
  const start = poseFromCentre(level.start.x, level.start.y, level.start.heading);
  const targetPose = poseFromCentre(level.target.x, level.target.y, level.target.heading);
  const issues: string[] = [];
  if (collides(level, start)) issues.push('start pose collides');
  if (collides(level, targetPose)) issues.push('target pose collides');
  const solution = issues.length === 0 ? solve(level) : null;
  if (!solution) issues.push('no solution found');
  problems += issues.length;
  const summary = solution ? `solved in ${solution.moves} moves` : '';
  console.log(`${issues.length ? 'FAIL' : 'ok  '} ${level.id.padEnd(20)} ${summary} ${issues.join(', ')}`);
}
if (problems > 0) process.exitCode = 1;
