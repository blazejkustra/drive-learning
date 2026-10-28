export interface Vec {
  x: number;
  y: number;
}

export interface Box {
  cx: number;
  cy: number;
  halfLength: number;
  halfWidth: number;
  angle: number;
}

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export const DEG = Math.PI / 180;

export function vec(x: number, y: number): Vec {
  return { x, y };
}

export function add(a: Vec, b: Vec): Vec {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Vec, b: Vec): Vec {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function scale(a: Vec, s: number): Vec {
  return { x: a.x * s, y: a.y * s };
}

export function dot(a: Vec, b: Vec): number {
  return a.x * b.x + a.y * b.y;
}

export function distance(a: Vec, b: Vec): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function fromAngle(angle: number): Vec {
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

export function normalizeAngle(angle: number): number {
  let a = angle % (2 * Math.PI);
  if (a > Math.PI) a -= 2 * Math.PI;
  if (a <= -Math.PI) a += 2 * Math.PI;
  return a;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function boxAxes(box: Box): [Vec, Vec] {
  const forward = fromAngle(box.angle);
  return [forward, { x: -forward.y, y: forward.x }];
}

export function boxCorners(box: Box): Vec[] {
  const [f, r] = boxAxes(box);
  const centre = vec(box.cx, box.cy);
  const along = scale(f, box.halfLength);
  const across = scale(r, box.halfWidth);
  return [
    add(add(centre, along), across),
    add(sub(centre, along), across),
    sub(sub(centre, along), across),
    sub(add(centre, along), across),
  ];
}

function projectRange(points: Vec[], axis: Vec): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const p of points) {
    const d = dot(p, axis);
    min = Math.min(min, d);
    max = Math.max(max, d);
  }
  return [min, max];
}

export function boxesOverlap(a: Box, b: Box): boolean {
  const cornersA = boxCorners(a);
  const cornersB = boxCorners(b);
  const axes = [...boxAxes(a), ...boxAxes(b)];
  return axes.every((axis) => {
    const [minA, maxA] = projectRange(cornersA, axis);
    const [minB, maxB] = projectRange(cornersB, axis);
    return maxA > minB && maxB > minA;
  });
}

export function toBoxLocal(box: Box, point: Vec): Vec {
  const [f, r] = boxAxes(box);
  const d = sub(point, vec(box.cx, box.cy));
  return { x: dot(d, f), y: dot(d, r) };
}

export function circleOverlapsBox(circle: Circle, box: Box): boolean {
  const local = toBoxLocal(box, circle);
  const nearestX = clamp(local.x, -box.halfLength, box.halfLength);
  const nearestY = clamp(local.y, -box.halfWidth, box.halfWidth);
  return Math.hypot(local.x - nearestX, local.y - nearestY) < circle.r;
}

export function pointInBox(point: Vec, box: Box, margin = 0): boolean {
  const local = toBoxLocal(box, point);
  return Math.abs(local.x) <= box.halfLength + margin && Math.abs(local.y) <= box.halfWidth + margin;
}

export function rectBox(x: number, y: number, w: number, h: number): Box {
  return { cx: x + w / 2, cy: y + h / 2, halfLength: w / 2, halfWidth: h / 2, angle: 0 };
}
