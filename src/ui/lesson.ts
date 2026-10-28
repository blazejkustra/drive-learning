import { overlapsObstacle } from '../game.ts';
import { clamp, type Vec } from '../geometry.ts';
import type { Messages } from '../i18n/en.ts';
import { t } from '../i18n/index.ts';
import type { MapData, Obstacle, StartPose } from '../level-types.ts';
import { MapBuilder, evenly } from '../map-builder.ts';
import { CAR, carBox, localToWorld, movePose, poseFromCentre, wheelPoints, type Pose } from '../physics.ts';
import { Camera } from '../render/camera.ts';
import { drawPlayerCar } from '../render/car.ts';
import { drawBumpHighlight, drawSwingPath, drawTrail } from '../render/overlays.ts';
import { drawObstacles, drawWorld, type Scene } from '../render/world.ts';
import type { TrailSample } from '../trail.ts';
import { h, onTap } from './dom.ts';
import { icons } from './icons.ts';
import { guideLegend } from './legend.ts';

type StepId = keyof Messages['lesson']['steps'];

interface Scenario {
  id: StepId;
  start: StartPose;
  straight: number;
  turn: number;
  direction: 1 | -1;
  pillar: boolean;
}

interface Frame {
  pose: Pose;
  steer: number;
  sample: TrailSample;
  corner: Vec;
}

interface Run {
  frames: Frame[];
  hit: Obstacle | null;
}

const BOUNDS = { x: 0, y: 0, w: 26, h: 14 };
const STEP = 0.05;
const STEER_RAMP = 0.8;
const SPEED = 2.6;
const HOLD_SECONDS = 2.2;

const SCENARIOS: Scenario[] = [
  { id: 'paths', start: { x: 7, y: 4, heading: 0 }, straight: 8, turn: 6.6, direction: 1, pillar: false },
  { id: 'pillarHit', start: { x: 7, y: 4, heading: 0 }, straight: 6.5, turn: 6.6, direction: 1, pillar: true },
  { id: 'pillarClear', start: { x: 7, y: 4, heading: 0 }, straight: 9, turn: 6.6, direction: 1, pillar: true },
  { id: 'reverse', start: { x: 23, y: 3.6, heading: 0 }, straight: 1, turn: 5.6, direction: -1, pillar: false },
];

function lessonScene(withPillar: boolean): Scene {
  const m = new MapBuilder('garage');
  m.surface('garage', 0.5, 0.5, 25, 13);
  m.wall(0, 0, 26, 0.5);
  const lines = evenly(4, 2.8, 5);
  for (const x of lines) m.line(x, 7.2, x, 12.7);
  lines.slice(0, -1).forEach((x, i) => m.car(x + 1.4, 9.95, i % 2 === 0 ? 90 : -90));
  if (withPillar) m.pillar(15.3, 6.9, 0.6);
  const map: MapData = m.build();
  return { bounds: BOUNDS, map };
}

function steerAt(travelled: number, scenario: Scenario): number {
  return CAR.maxSteer * clamp((travelled - scenario.straight) / STEER_RAMP, 0, 1);
}

function frameAt(pose: Pose, steer: number): Frame {
  const swingSide = -CAR.width / 2;
  return {
    pose,
    steer,
    sample: { ...wheelPoints(pose), time: 0 },
    corner: localToWorld(pose, CAR.length - CAR.rearOverhang, swingSide),
  };
}

function simulate(scenario: Scenario, scene: Scene): Run {
  let pose = poseFromCentre(scenario.start.x, scenario.start.y, scenario.start.heading);
  const frames = [frameAt(pose, 0)];
  const total = scenario.straight + scenario.turn;
  for (let travelled = STEP; travelled <= total; travelled += STEP) {
    const steer = steerAt(travelled, scenario);
    const next = movePose(pose, scenario.direction * STEP, steer);
    const hit = scene.map.obstacles.find((obstacle) => overlapsObstacle(carBox(next), obstacle));
    if (hit) return { frames, hit };
    pose = next;
    frames.push(frameAt(pose, steer));
  }
  return { frames, hit: null };
}

export class TurningLesson {
  readonly element: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera = new Camera();
  private readonly text: HTMLElement;
  private readonly counter: HTMLElement;
  private readonly backButton: HTMLButtonElement;
  private readonly nextButton: HTMLButtonElement;
  private readonly scenes = { plain: lessonScene(false), pillar: lessonScene(true) };
  private readonly runs: Run[];
  private readonly onDone: () => void;
  private stepIndex = 0;
  private stepStarted = 0;
  private frameHandle = 0;

  constructor(onDone: () => void) {
    this.onDone = onDone;
    this.runs = SCENARIOS.map((scenario) => simulate(scenario, this.sceneFor(scenario)));
    const copy = t().lesson;
    this.canvas = h('canvas', { class: 'lesson-canvas' });
    this.ctx = this.canvas.getContext('2d')!;
    this.text = h('p', { class: 'lesson-text' });
    this.counter = h('span', { class: 'lesson-counter' });

    const replay = h('button', { class: 'secondary with-icon', type: 'button' }, [icons.restart(), copy.replay]);
    onTap(replay, () => this.showStep(this.stepIndex));
    this.backButton = h('button', { class: 'secondary', type: 'button' }, [copy.back]);
    onTap(this.backButton, () => this.showStep(this.stepIndex - 1));
    this.nextButton = h('button', { class: 'primary', type: 'button' });
    onTap(this.nextButton, () => this.next());

    this.element = h('div', { class: 'card lesson-card' }, [
      h('h2', {}, [copy.title]),
      h('div', { class: 'lesson-stage' }, [this.canvas, guideLegend(['rear', 'front', 'swing'])]),
      this.text,
      h('div', { class: 'lesson-actions' }, [this.counter, replay, this.backButton, this.nextButton]),
    ]);
    this.showStep(0);
  }

  start(): void {
    this.frameHandle = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    cancelAnimationFrame(this.frameHandle);
  }

  private sceneFor(scenario: Scenario): Scene {
    return scenario.pillar ? this.scenes.pillar : this.scenes.plain;
  }

  private showStep(index: number): void {
    const copy = t().lesson;
    this.stepIndex = clamp(index, 0, SCENARIOS.length - 1);
    const last = this.stepIndex === SCENARIOS.length - 1;
    this.text.textContent = copy.steps[SCENARIOS[this.stepIndex].id];
    this.counter.textContent = copy.stepOf(this.stepIndex + 1, SCENARIOS.length);
    this.backButton.disabled = this.stepIndex === 0;
    this.nextButton.textContent = last ? copy.done : copy.next;
    this.stepStarted = performance.now();
  }

  private next(): void {
    if (this.stepIndex === SCENARIOS.length - 1) this.onDone();
    else this.showStep(this.stepIndex + 1);
  }

  private readonly frame = (now: number): void => {
    const run = this.runs[this.stepIndex];
    const playSeconds = ((run.frames.length - 1) * STEP) / SPEED;
    const elapsed = Math.max(0, now - this.stepStarted) / 1000;
    if (elapsed > playSeconds + HOLD_SECONDS) this.stepStarted = now;
    const index = Math.min(run.frames.length - 1, Math.floor((elapsed * SPEED) / STEP));
    this.draw(run, index, index === run.frames.length - 1);
    this.frameHandle = requestAnimationFrame(this.frame);
  };

  private resizeCanvas(): number {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(this.canvas.clientWidth * ratio);
    const height = Math.round(this.canvas.clientHeight * ratio);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    return ratio;
  }

  private draw(run: Run, index: number, finished: boolean): void {
    const ratio = this.resizeCanvas();
    const { ctx, camera } = this;
    const scene = this.sceneFor(SCENARIOS[this.stepIndex]);
    const shown = run.frames.slice(0, index + 1);
    const current = shown[shown.length - 1];
    const bumped = finished && run.hit ? 1 : 0;

    camera.fit(BOUNDS, { x: 0, y: 0, w: this.canvas.clientWidth, h: this.canvas.clientHeight }, 6);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    camera.apply(ctx, ratio);
    drawWorld(ctx, scene);
    drawTrail(ctx, shown.map((frame) => frame.sample), 0, camera);
    drawSwingPath(ctx, shown.filter((frame) => frame.steer > 0).map((frame) => frame.corner), camera);
    drawObstacles(ctx, scene);
    if (run.hit && bumped) drawBumpHighlight(ctx, run.hit, bumped, camera);
    drawPlayerCar(ctx, current.pose, { steer: current.steer, bumped });
  }
}
