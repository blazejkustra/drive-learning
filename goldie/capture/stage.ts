import { LEVELS } from '../../src/levels.ts';
import { movePose, type Gear, type Pose } from '../../src/physics.ts';

type WheelPoint = [metres: number, degrees: number];

interface Leg {
  gear: Gear;
  wheel: WheelPoint[];
  stopAt: number;
}

interface DriveScene {
  level: string;
  skipMetres?: number;
  legs: Leg[];
}

interface Session {
  pose: Pose;
  speed: number;
}

interface DriveHook {
  session: Session;
  wheel: (degrees: number) => void;
  gear: (gear: Gear) => void;
}

const STORAGE_KEY = 'drive-practice:v1';
const SCENE_KEY = 'goldie-scene';
const LEVELS_PLAYED = 'parallel-park';
const BRAKE_METRES_PER_SPEED_SQUARED = 1 / 9;

const PILLAR_WHEEL: WheelPoint[] = [[0, 0], [19.5, 0], [20.5, 270], [25.2, 270], [26.2, 0], [37.7, 0]];
const PARALLEL_FORWARD: WheelPoint[] = [[0, 0], [21, 0]];
const PARALLEL_REVERSE: WheelPoint[] = [[0, 0], [1, 0], [2, 270], [4, 270], [5, -270], [7, -270], [8, 0], [8.2, 0]];

const DRIVES: Record<string, DriveScene> = {
  '1': { level: 'pillar-turn', skipMetres: 12, legs: [{ gear: 'D', wheel: PILLAR_WHEEL, stopAt: 22.4 }] },
  '3': {
    level: 'parallel-park',
    skipMetres: 12,
    legs: [
      { gear: 'D', wheel: PARALLEL_FORWARD, stopAt: 21 },
      { gear: 'R', wheel: PARALLEL_REVERSE, stopAt: 3.6 },
    ],
  },
  '5': { level: 'pillar-turn', skipMetres: 11, legs: [{ gear: 'D', wheel: PILLAR_WHEEL, stopAt: 31 }] },
  '6': {
    level: 'parallel-park',
    skipMetres: 12,
    legs: [
      { gear: 'D', wheel: PARALLEL_FORWARD, stopAt: 21 },
      { gear: 'R', wheel: PARALLEL_REVERSE, stopAt: 8.2 },
    ],
  },
};

const LESSON_SCENE = '2';
const LEVEL_LIST_SCENE = '4';

const nextFrame = () => new Promise(requestAnimationFrame);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const hook = () => (window as unknown as { __drive: DriveHook }).__drive;

function click(selector: string): void {
  document.querySelector<HTMLElement>(selector)?.click();
}

function pedal(key: 'w' | 's', down: boolean): void {
  window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { key }));
}

function wheelAt(points: WheelPoint[], metres: number): number {
  const next = points.findIndex(([at]) => metres <= at);
  if (next <= 0) return next === 0 ? points[0][1] : points[points.length - 1][1];
  const [fromAt, fromDeg] = points[next - 1];
  const [toAt, toDeg] = points[next];
  return fromDeg + ((toDeg - fromDeg) * (metres - fromAt)) / (toAt - fromAt);
}

function seedSave(levelsPlayed: number, lessonSeen: boolean): void {
  const progress = Object.fromEntries(LEVELS.slice(0, levelsPlayed).map((level, i) => [level.id, { stars: i % 4 === 3 ? 2 : 3, bestTime: 30 }]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ progress, settings: { wheelOnRight: false }, lessonsSeen: lessonSeen ? ['turning'] : [] }));
}

function levelIndex(id: string): number {
  return LEVELS.findIndex((level) => level.id === id);
}

function openLevel(index: number): void {
  document.querySelectorAll<HTMLElement>('.level-row')[index].click();
  click('.preview-actions .primary');
}

async function runLeg(leg: Leg, skip: number): Promise<void> {
  const drive = hook();
  drive.wheel(wheelAt(leg.wheel, skip));
  drive.gear(leg.gear);
  let travelled = skip;
  let last = drive.session.pose;
  pedal('w', true);
  while (travelled < leg.stopAt) {
    await nextFrame();
    const { pose, speed } = drive.session;
    travelled += Math.hypot(pose.x - last.x, pose.y - last.y);
    last = pose;
    drive.wheel(wheelAt(leg.wheel, travelled));
    if (leg.stopAt - travelled <= speed * speed * BRAKE_METRES_PER_SPEED_SQUARED) break;
  }
  pedal('w', false);
  pedal('s', true);
  while (Math.abs(drive.session.speed) > 0.01) {
    await nextFrame();
    drive.wheel(wheelAt(leg.wheel, travelled));
  }
}

async function runDrive(scene: DriveScene): Promise<void> {
  openLevel(levelIndex(scene.level));
  await nextFrame();
  const skip = scene.skipMetres ?? 0;
  const { session } = hook();
  session.pose = movePose(session.pose, skip, 0);
  await sleep(1200);
  click('.overlay .primary');
  await nextFrame();
  for (const [i, leg] of scene.legs.entries()) {
    await runLeg(leg, i === 0 ? skip : 0);
    if (i < scene.legs.length - 1) pedal('s', false);
  }
}

async function runLesson(): Promise<void> {
  openLevel(levelIndex('street-corner'));
  await nextFrame();
  click('.lesson-actions .primary');
  await nextFrame();
  click('.lesson-actions .primary');
}

async function runScene(id: string): Promise<void> {
  if (id === LESSON_SCENE) await runLesson();
  else if (DRIVES[id]) await runDrive(DRIVES[id]);
}

function requestScene(id: string): void {
  if (id !== LESSON_SCENE && id !== LEVEL_LIST_SCENE && !DRIVES[id]) return;
  seedSave(id === LESSON_SCENE ? levelIndex('street-corner') : levelIndex(LEVELS_PLAYED), id !== LESSON_SCENE);
  sessionStorage.setItem(SCENE_KEY, id);
  location.reload();
}

window.addEventListener('keydown', (event) => requestScene(event.key));

const pending = sessionStorage.getItem(SCENE_KEY);
sessionStorage.removeItem(SCENE_KEY);
if (pending) window.addEventListener('load', () => void runScene(pending));
