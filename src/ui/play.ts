import { DEG } from '../geometry.ts';
import { GameSession, type Result } from '../game.ts';
import { KeyboardControls, type PedalName } from '../input/keyboard.ts';
import { GearSelector, Pedal } from '../input/pedals.ts';
import { SteeringWheel } from '../input/steering-wheel.ts';
import type { Level, Obstacle } from '../level-types.ts';
import { LEVELS, chapterOf } from '../levels.ts';
import { carCentre, steerFromWheel, type Gear } from '../physics.ts';
import { Camera, type Viewport } from '../render/camera.ts';
import { drawScene } from '../render/scene.ts';
import { getSettings, isUnlocked, recordResult } from '../storage.ts';
import { formatTime, h, onTap } from './dom.ts';
import { icons, starRow } from './icons.ts';
import { guideLegend } from './legend.ts';

export interface PlayCallbacks {
  exit: () => void;
  play: (level: Level) => void;
}

type CameraMode = 'fit' | 'follow';

const BUMP_FLASH_SECONDS = 0.9;
const TOAST_SECONDS = 2.6;

const OBSTACLE_NAMES: Partial<Record<Obstacle['kind'], string>> = {
  kerb: 'the kerb',
  wall: 'the wall',
  hedge: 'the hedge',
  building: 'the building',
  car: 'a parked car',
  cone: 'a cone',
  pillar: 'a pillar',
  post: 'a gate post',
  planter: 'a tree',
  edge: 'the edge of the practice area',
};

function toggleButton(label: string, icon: SVGSVGElement): HTMLButtonElement {
  return h('button', { class: 'hud-button toggle', type: 'button', 'aria-pressed': 'false' }, [icon, h('span', {}, [label])]);
}

function setToggle(button: HTMLButtonElement, on: boolean, label?: string): void {
  button.setAttribute('aria-pressed', String(on));
  button.classList.toggle('on', on);
  if (label) button.querySelector('span')!.textContent = label;
}

function steerDescription(steerDeg: number): string {
  const amount = Math.round(Math.abs(steerDeg));
  if (amount === 0) return 'Straight';
  return `${amount}° ${steerDeg > 0 ? 'right' : 'left'}`;
}

function resultHeading(stars: number): string {
  if (stars === 3) return 'Perfect';
  if (stars === 2) return 'Nicely done';
  return 'You made it';
}

const ALIGNMENT_TEXT = { great: 'Neatly lined up', good: 'Lined up', crooked: 'A little crooked' };

export class PlayScreen {
  readonly element: HTMLElement;
  private readonly level: Level;
  private readonly callbacks: PlayCallbacks;
  private readonly session: GameSession;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera = new Camera();
  private readonly wheel = new SteeringWheel();
  private readonly gas = new Pedal('Gas', 'gas');
  private readonly brake = new Pedal('Brake', 'brake');
  private readonly gears: GearSelector;
  private readonly keyboard: KeyboardControls;

  private readonly tipText: HTMLElement;
  private readonly hint: HTMLElement;
  private readonly hintBar: HTMLElement;
  private readonly toast: HTMLElement;
  private readonly stats: { time: HTMLElement; touches: HTMLElement; speed: HTMLElement };
  private readonly steerValue: HTMLElement;
  private readonly steerMarker: HTMLElement;
  private readonly toggles: { guides: HTMLButtonElement; trail: HTMLButtonElement; camera: HTMLButtonElement; slow: HTMLButtonElement };
  private readonly overlay: HTMLElement;

  private showGuides: boolean;
  private showTrail = true;
  private slowMotion = false;
  private cameraMode: CameraMode = 'fit';
  private tipIndex = 0;
  private paused = true;
  private frameHandle = 0;
  private lastFrame = 0;
  private toastTimer = 0;
  private pixelRatio = 1;
  private readonly resizeObserver: ResizeObserver;

  constructor(level: Level, callbacks: PlayCallbacks) {
    this.level = level;
    this.callbacks = callbacks;
    this.showGuides = level.guides;
    this.session = new GameSession(level, {
      bump: (obstacle) => this.onBump(obstacle),
      finish: (result) => this.onFinish(result),
      fail: () => this.onFail(),
      gearBlocked: () => this.showToast('Stop the car first, then change gear.'),
      checkpoint: (index, total) => this.showToast(index === total ? 'All gaps done. Now head for the box.' : `Gap ${index} of ${total} done.`, 'good'),
    });

    this.canvas = h('canvas', { class: 'scene' });
    this.ctx = this.canvas.getContext('2d')!;
    this.gears = new GearSelector((gear) => this.selectGear(gear));
    this.gears.show(this.session.gear);
    this.keyboard = new KeyboardControls({
      pedal: (pedal, down) => this.pressPedalKey(pedal, down),
      gear: (gear) => this.selectGear(gear),
    });

    this.tipText = h('span', { class: 'tip-text' }, [level.tips[0]]);
    const nextTip = h('button', { class: 'tip-next', type: 'button', 'aria-label': 'Next tip' }, [icons.next()]);
    onTap(nextTip, () => this.cycleTip());

    const back = h('button', { class: 'hud-button back', type: 'button' }, [icons.back(), h('span', {}, ['Levels'])]);
    onTap(back, () => this.callbacks.exit());

    this.toggles = {
      guides: toggleButton('Guides', icons.guides()),
      trail: toggleButton('Trail', icons.trail()),
      camera: toggleButton('Whole area', icons.camera()),
      slow: toggleButton('Slow', icons.slow()),
    };
    onTap(this.toggles.guides, () => this.setGuides(!this.showGuides));
    onTap(this.toggles.trail, () => this.setTrail(!this.showTrail));
    onTap(this.toggles.camera, () => this.setCamera(this.cameraMode === 'fit' ? 'follow' : 'fit'));
    onTap(this.toggles.slow, () => this.setSlow(!this.slowMotion));
    const restart = h('button', { class: 'hud-button', type: 'button' }, [icons.restart(), h('span', {}, ['Restart'])]);
    onTap(restart, () => this.callbacks.play(this.level));

    this.hint = h('span', { class: 'hint-text' });
    this.hintBar = h('span', { class: 'hint-progress' });
    this.toast = h('div', { class: 'toast', role: 'status' });

    this.stats = {
      time: h('strong', {}, ['0:00']),
      touches: h('strong', {}, ['0']),
      speed: h('strong', {}, ['0']),
    };

    this.steerValue = h('strong', { class: 'steer-value' }, ['Straight']);
    this.steerMarker = h('span', { class: 'steer-marker' });

    const chapter = chapterOf(level);
    const levelNumber = LEVELS.indexOf(level) + 1;

    const hud = h('header', { class: 'hud' }, [
      back,
      h('div', { class: 'hud-title' }, [
        h('div', { class: 'hud-heading' }, [h('strong', {}, [level.title]), h('span', { class: 'hud-sub' }, [`${chapter.title}, level ${levelNumber}`])]),
        h('div', { class: 'tip' }, [this.tipText, level.tips.length > 1 && nextTip]),
      ]),
      h('div', { class: 'hud-toggles' }, [this.toggles.guides, this.toggles.trail, this.toggles.camera, this.toggles.slow, restart]),
    ]);

    const steerPanel = h('aside', { class: 'panel steer-panel' }, [
      guideLegend(),
      h('div', { class: 'steer-readout' }, [
        h('span', { class: 'steer-label' }, ['Front wheels']),
        this.steerValue,
        h('div', { class: 'steer-gauge' }, [h('span', { class: 'steer-centre' }), this.steerMarker]),
      ]),
      this.wheel.element,
    ]);

    const drivePanel = h('aside', { class: 'panel drive-panel' }, [
      h('dl', { class: 'stats' }, [
        h('div', {}, [h('dt', {}, ['Time']), h('dd', {}, [this.stats.time])]),
        h('div', {}, [h('dt', {}, ['Touches']), h('dd', {}, [this.stats.touches, level.maxTouches !== undefined && h('span', { class: 'limit' }, [` / ${level.maxTouches}`])])]),
        h('div', {}, [h('dt', {}, ['km/h']), h('dd', {}, [this.stats.speed])]),
      ]),
      h('div', { class: 'controls' }, [this.gears.element, this.brake.element, this.gas.element]),
      h('p', { class: 'key-hint' }, ['W gas · S brake · R/D/P gear']),
    ]);

    this.overlay = h('div', { class: 'overlay hidden' });

    const settings = getSettings();
    this.element = h('div', { class: `play${settings.wheelOnRight ? ' wheel-right' : ''}` }, [
      this.canvas,
      hud,
      h('div', { class: 'hint' }, [this.hint, this.hintBar]),
      this.toast,
      steerPanel,
      drivePanel,
      this.overlay,
    ]);

    this.setGuides(this.showGuides);
    this.setTrail(this.showTrail);
    this.setCamera(this.cameraMode);
    this.setSlow(false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.element);
    this.showIntro();
    this.exposeForTesting();
  }

  start(): void {
    this.resize();
    this.lastFrame = performance.now();
    this.frameHandle = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    cancelAnimationFrame(this.frameHandle);
    this.resizeObserver.disconnect();
    this.keyboard.destroy();
    window.clearTimeout(this.toastTimer);
  }

  private readonly frame = (now: number): void => {
    const elapsed = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const dt = this.slowMotion ? elapsed * 0.4 : elapsed;
    if (!this.paused) this.wheel.selfCentre(this.session.speed * dt);
    this.session.steer = steerFromWheel(this.wheel.angle);
    this.session.pedals = { gas: this.gas.pressed, brake: this.brake.pressed };
    if (!this.paused) this.session.update(dt);
    this.render(elapsed);
    this.updateHud();
    this.frameHandle = requestAnimationFrame(this.frame);
  };

  private viewport(): Viewport {
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    const side = Math.min(268, width * 0.24);
    const top = 84;
    return { x: side, y: top, w: Math.max(100, width - side * 2), h: Math.max(100, height - top - 10) };
  }

  private resize(): void {
    this.pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    this.canvas.width = Math.round(width * this.pixelRatio);
    this.canvas.height = Math.round(height * this.pixelRatio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    if (this.cameraMode === 'fit') this.camera.fit(this.level.bounds, this.viewport());
  }

  private render(elapsed: number): void {
    if (this.cameraMode === 'follow') {
      this.camera.follow(carCentre(this.session.pose), this.viewport(), Math.min(1, elapsed * 3));
    } else {
      this.camera.fit(this.level.bounds, this.viewport());
    }
    const bump = this.session.lastBump;
    const strength = bump ? 1 - (this.session.time - bump.time) / BUMP_FLASH_SECONDS : 0;
    drawScene(this.ctx, this.camera, this.pixelRatio, this.level, {
      pose: this.session.pose,
      steer: this.session.steer,
      gear: this.session.gear,
      time: this.session.time,
      checkpointsPassed: this.session.checkpointsPassed,
      aligned: this.session.aligned,
      showGuides: this.showGuides,
      showTrail: this.showTrail,
      trail: this.session.trail.samples,
      bump: bump && strength > 0 ? { obstacle: bump.obstacle, strength } : null,
    });
  }

  private updateHud(): void {
    const s = this.session;
    this.stats.time.textContent = formatTime(s.time);
    this.stats.touches.textContent = String(s.touches);
    this.stats.speed.textContent = String(Math.round(Math.abs(s.speed) * 3.6));
    const steerDeg = s.steer / DEG;
    this.steerValue.textContent = steerDescription(steerDeg);
    this.steerMarker.style.left = `${50 + (this.wheel.angle / 270) * 50}%`;
    this.gas.element.disabled = s.gear === 'P';
    this.hint.textContent = this.currentHint();
    this.hintBar.style.transform = `scaleX(${Math.min(1, s.holdProgress)})`;
  }

  private currentHint(): string {
    const s = this.session;
    if (s.status !== 'driving') return '';
    if (!s.started) return 'Choose D to drive forward or R to reverse.';
    if (s.aligned) return s.gear === 'P' || s.pedals.brake ? 'Hold still...' : 'Lined up. Hold the brake to finish.';
    if (s.inTarget) return 'Almost. Straighten the car to match the arrow in the box.';
    const remaining = this.level.checkpoints.length - s.checkpointsPassed;
    if (remaining > 0) return `Drive through the marked gap ${s.checkpointsPassed + 1} of ${this.level.checkpoints.length}.`;
    return '';
  }

  private selectGear(gear: Gear): void {
    if (this.paused) return;
    if (this.session.setGear(gear)) {
      this.gears.show(gear);
      if (gear === 'P') this.gas.release();
    }
  }

  private pressPedalKey(pedal: PedalName, down: boolean): void {
    if (down && (this.paused || (pedal === 'gas' && this.session.gear === 'P'))) return;
    this[pedal].holdKey(down);
  }

  private cycleTip(): void {
    this.tipIndex = (this.tipIndex + 1) % this.level.tips.length;
    this.tipText.textContent = this.level.tips[this.tipIndex];
  }

  private setGuides(on: boolean): void {
    this.showGuides = on;
    setToggle(this.toggles.guides, on);
  }

  private setTrail(on: boolean): void {
    this.showTrail = on;
    setToggle(this.toggles.trail, on);
  }

  private setCamera(mode: CameraMode): void {
    this.cameraMode = mode;
    setToggle(this.toggles.camera, mode === 'follow', mode === 'fit' ? 'Whole area' : 'Follow car');
  }

  private setSlow(on: boolean): void {
    this.slowMotion = on;
    setToggle(this.toggles.slow, on);
  }

  private showToast(message: string, tone: 'soft' | 'good' = 'soft'): void {
    this.toast.textContent = message;
    this.toast.className = `toast visible ${tone}`;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => this.toast.classList.remove('visible'), TOAST_SECONDS * 1000);
  }

  private onBump(obstacle: Obstacle): void {
    const name = OBSTACLE_NAMES[obstacle.kind] ?? 'something';
    const limit = this.level.maxTouches;
    const extra = limit !== undefined ? ` (${this.session.touches} of ${limit} allowed)` : '';
    this.showToast(`Gentle bump into ${name}${extra}. Back off a little and try again.`);
  }

  private openOverlay(card: HTMLElement): void {
    this.overlay.replaceChildren(card);
    this.overlay.classList.remove('hidden');
    this.gas.release();
    this.brake.release();
  }

  private closeOverlay(): void {
    this.overlay.classList.add('hidden');
    this.overlay.replaceChildren();
  }

  private showIntro(): void {
    const chapter = chapterOf(this.level);
    const startButton = h('button', { class: 'primary', type: 'button' }, ['Start driving']);
    onTap(startButton, () => {
      this.closeOverlay();
      this.paused = false;
    });
    this.openOverlay(
      h('div', { class: 'card intro-card' }, [
        h('h2', {}, [this.level.title]),
        h('p', { class: 'card-sub' }, [`${chapter.title}, level ${LEVELS.indexOf(this.level) + 1} of ${LEVELS.length}`]),
        h('p', { class: 'goal' }, [this.level.goal]),
        h('ul', { class: 'tips' }, this.level.tips.map((tip) => h('li', {}, [tip]))),
        this.level.maxTouches !== undefined && h('p', { class: 'strict' }, [`Allowed touches: ${this.level.maxTouches}.`]),
        h('div', { class: 'card-actions' }, [startButton]),
      ]),
    );
  }

  private onFinish(result: Result): void {
    recordResult(this.level.id, result.stars, result.time);
    const next = LEVELS[LEVELS.indexOf(this.level) + 1];
    const actions: HTMLElement[] = [];
    const retry = h('button', { class: 'secondary', type: 'button' }, ['Try again']);
    onTap(retry, () => this.callbacks.play(this.level));
    const levels = h('button', { class: 'secondary', type: 'button' }, ['All levels']);
    onTap(levels, () => this.callbacks.exit());
    actions.push(levels, retry);
    if (next && isUnlocked(next.id)) {
      const nextButton = h('button', { class: 'primary', type: 'button' }, ['Next level']);
      onTap(nextButton, () => this.callbacks.play(next));
      actions.push(nextButton);
    }
    const touchesText = result.touches === 0 ? 'No touches' : result.touches === 1 ? '1 touch' : `${result.touches} touches`;
    const timeText = `${formatTime(result.time)}${result.time > this.level.parTime ? ` (aim for ${formatTime(this.level.parTime)})` : ''}`;
    window.setTimeout(() => {
      this.openOverlay(
        h('div', { class: 'card result-card' }, [
          h('h2', {}, [resultHeading(result.stars)]),
          starRow(result.stars, 3, 'stars big'),
          h('dl', { class: 'result-stats' }, [
            h('div', {}, [h('dt', {}, ['Time']), h('dd', {}, [timeText])]),
            h('div', {}, [h('dt', {}, ['Touches']), h('dd', {}, [touchesText])]),
            h('div', {}, [h('dt', {}, ['Position']), h('dd', {}, [ALIGNMENT_TEXT[result.alignment.quality]])]),
          ]),
          h('div', { class: 'card-actions' }, actions),
        ]),
      );
    }, 450);
  }

  private onFail(): void {
    const retry = h('button', { class: 'primary', type: 'button' }, ['Try again']);
    onTap(retry, () => this.callbacks.play(this.level));
    const levels = h('button', { class: 'secondary', type: 'button' }, ['All levels']);
    onTap(levels, () => this.callbacks.exit());
    this.openOverlay(
      h('div', { class: 'card result-card' }, [
        h('h2', {}, ['Let’s try that one again']),
        h('p', { class: 'goal' }, ['That was one touch too many for this spot. Take it slower and lean on the guide lines.']),
        h('div', { class: 'card-actions' }, [levels, retry]),
      ]),
    );
  }

  private exposeForTesting(): void {
    if (!import.meta.env.DEV) return;
    Object.assign(window, {
      __drive: {
        session: this.session,
        wheel: (degrees: number) => this.wheel.turnTo(degrees),
        gear: (gear: Gear) => this.selectGear(gear),
      },
    });
  }
}
