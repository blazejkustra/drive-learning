import { DEG } from '../geometry.ts';
import { GameSession, type Result } from '../game.ts';
import { KeyboardControls, type PedalName } from '../input/keyboard.ts';
import { GearSelector, Pedal } from '../input/pedals.ts';
import { SteeringWheel } from '../input/steering-wheel.ts';
import type { BumpKind } from '../bump.ts';
import { chapterText, levelText, t } from '../i18n/index.ts';
import type { Level, Obstacle } from '../level-types.ts';
import { LEVELS, chapterOf } from '../levels.ts';
import { carCentre, steerFromWheel, type Gear } from '../physics.ts';
import { Camera, type Viewport } from '../render/camera.ts';
import { drawScene } from '../render/scene.ts';
import { getSettings, isUnlocked, lessonSeen, markLessonSeen, recordResult } from '../storage.ts';
import { formatTime, h, onTap } from './dom.ts';
import { icons, starRow } from './icons.ts';
import { guideLegend } from './legend.ts';
import { TurningLesson } from './lesson.ts';

export interface PlayCallbacks {
  exit: () => void;
  play: (level: Level) => void;
}

type CameraMode = 'fit' | 'follow';

const BUMP_FLASH_SECONDS = 0.9;
const TOAST_SECONDS = 2.6;

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
  const hud = t().hud;
  if (amount === 0) return hud.straight;
  return steerDeg > 0 ? hud.steerRight(amount) : hud.steerLeft(amount);
}

function resultHeading(stars: number): string {
  const result = t().result;
  if (stars === 3) return result.perfect;
  if (stars === 2) return result.nicelyDone;
  return result.madeIt;
}

function bumpMessage(obstacle: Obstacle, kind: BumpKind): string {
  const bump = t().bump;
  if (kind === 'general') return `${bump.into[obstacle.kind]} ${bump.backOff}`;
  return bump[kind];
}

export class PlayScreen {
  readonly element: HTMLElement;
  private readonly level: Level;
  private readonly callbacks: PlayCallbacks;
  private readonly session: GameSession;
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly camera = new Camera();
  private readonly wheel = new SteeringWheel();
  private readonly gas = new Pedal(t().controls.gas, 'gas');
  private readonly brake = new Pedal(t().controls.brake, 'brake');
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
  private readonly hud: HTMLElement;
  private readonly steerPanel: HTMLElement;
  private readonly drivePanel: HTMLElement;
  private readonly menuButton: HTMLButtonElement;

  private showGuides: boolean;
  private showTrail = true;
  private slowMotion = false;
  private cameraMode: CameraMode = 'follow';
  private lesson: TurningLesson | null = null;
  private tipIndex = 0;
  private paused = true;
  private frameHandle = 0;
  private lastFrame = 0;
  private toastTimer = 0;
  private pixelRatio = 1;
  private view: Viewport = { x: 0, y: 0, w: 100, h: 100 };
  private readonly resizeObserver: ResizeObserver;

  constructor(level: Level, callbacks: PlayCallbacks) {
    this.level = level;
    this.callbacks = callbacks;
    this.showGuides = level.guides;
    this.session = new GameSession(level, {
      bump: (obstacle, kind) => this.onBump(obstacle, kind),
      finish: (result) => this.onFinish(result),
      fail: () => this.onFail(),
      gearBlocked: () => this.showToast(t().toasts.stopFirst),
      checkpoint: (index, total) => this.showToast(index === total ? t().toasts.allGapsDone : t().toasts.gapDone(index, total), 'good'),
    });

    this.canvas = h('canvas', { class: 'scene' });
    this.ctx = this.canvas.getContext('2d')!;
    this.gears = new GearSelector((gear) => this.selectGear(gear));
    this.gears.show(this.session.gear);
    this.keyboard = new KeyboardControls({
      pedal: (pedal, down) => this.pressPedalKey(pedal, down),
      gear: (gear) => this.selectGear(gear),
    });

    const text = levelText(level);
    const hudText = t().hud;
    this.tipText = h('span', { class: 'tip-text' }, [text.tips[0]]);
    const nextTip = h('button', { class: 'tip-next', type: 'button', 'aria-label': hudText.nextTip }, [icons.next()]);
    onTap(nextTip, () => this.cycleTip());

    const back = h('button', { class: 'hud-button back', type: 'button' }, [icons.back(), h('span', {}, [hudText.levels])]);
    onTap(back, () => this.callbacks.exit());

    this.toggles = {
      guides: toggleButton(hudText.guides, icons.guides()),
      trail: toggleButton(hudText.trail, icons.trail()),
      camera: toggleButton(hudText.wholeArea, icons.camera()),
      slow: toggleButton(hudText.slow, icons.slow()),
    };
    onTap(this.toggles.guides, () => this.setGuides(!this.showGuides));
    onTap(this.toggles.trail, () => this.setTrail(!this.showTrail));
    onTap(this.toggles.camera, () => this.setCamera(this.cameraMode === 'fit' ? 'follow' : 'fit'));
    onTap(this.toggles.slow, () => this.setSlow(!this.slowMotion));
    const restart = h('button', { class: 'hud-button', type: 'button' }, [icons.restart(), h('span', {}, [hudText.restart])]);
    onTap(restart, () => this.callbacks.play(this.level));
    this.menuButton = h('button', { class: 'hud-button menu-button', type: 'button', 'aria-expanded': 'false' }, [icons.menu(), h('span', {}, [hudText.menu])]);
    onTap(this.menuButton, () => this.setMenu(!this.element.classList.contains('menu-open')));
    const menuBackdrop = h('div', { class: 'menu-backdrop' });
    onTap(menuBackdrop, () => this.setMenu(false));

    this.hint = h('span', { class: 'hint-text' });
    this.hintBar = h('span', { class: 'hint-progress' });
    this.toast = h('div', { class: 'toast', role: 'status' });

    this.stats = {
      time: h('strong', {}, ['0:00']),
      touches: h('strong', {}, ['0']),
      speed: h('strong', {}, ['0']),
    };

    this.steerValue = h('strong', { class: 'steer-value' }, [hudText.straight]);
    this.steerMarker = h('span', { class: 'steer-marker' });

    const chapter = chapterOf(level);
    const levelNumber = LEVELS.indexOf(level) + 1;

    this.hud = h('header', { class: 'hud' }, [
      back,
      h('div', { class: 'hud-title' }, [
        h('div', { class: 'hud-heading' }, [
          h('strong', {}, [text.title]),
          h('span', { class: 'hud-sub' }, [t().levelOf(chapterText(chapter).title, levelNumber)]),
        ]),
        h('div', { class: 'tip' }, [this.tipText, text.tips.length > 1 && nextTip]),
      ]),
      this.menuButton,
      h('div', { class: 'hud-menu scrollable' }, [
        h('div', { class: 'hud-toggles' }, [this.toggles.guides, this.toggles.trail, this.toggles.camera, this.toggles.slow, restart]),
        h('div', { class: 'menu-tips' }, [h('p', { class: 'menu-title' }, [hudText.tips]), h('ul', {}, text.tips.map((tip) => h('li', {}, [tip])))]),
        guideLegend(),
      ]),
    ]);

    this.steerPanel = h('aside', { class: 'panel steer-panel' }, [
      guideLegend(),
      h('div', { class: 'steer-readout' }, [
        h('span', { class: 'steer-label' }, [hudText.frontWheels]),
        this.steerValue,
        h('div', { class: 'steer-gauge' }, [h('span', { class: 'steer-centre' }), this.steerMarker]),
      ]),
      this.wheel.element,
    ]);

    this.drivePanel = h('aside', { class: 'panel drive-panel' }, [
      h('dl', { class: 'stats' }, [
        h('div', {}, [h('dt', {}, [hudText.time]), h('dd', {}, [this.stats.time])]),
        h('div', {}, [h('dt', {}, [hudText.touches]), h('dd', {}, [this.stats.touches, level.maxTouches !== undefined && h('span', { class: 'limit' }, [` / ${level.maxTouches}`])])]),
        h('div', {}, [h('dt', {}, [hudText.speedUnit]), h('dd', {}, [this.stats.speed])]),
      ]),
      h('div', { class: 'controls' }, [this.gears.element, this.brake.element, this.gas.element]),
      h('p', { class: 'key-hint' }, [hudText.keyHint]),
    ]);

    this.overlay = h('div', { class: 'overlay hidden' });

    const settings = getSettings();
    this.element = h('div', { class: `play${settings.wheelOnRight ? ' wheel-right' : ''}` }, [
      this.canvas,
      menuBackdrop,
      this.hud,
      h('div', { class: 'hint' }, [this.hint, this.hintBar]),
      this.toast,
      this.steerPanel,
      this.drivePanel,
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
    this.camera.follow(carCentre(this.session.pose), this.viewport(), 1);
    this.lastFrame = performance.now();
    this.frameHandle = requestAnimationFrame(this.frame);
  }

  destroy(): void {
    cancelAnimationFrame(this.frameHandle);
    this.resizeObserver.disconnect();
    this.keyboard.destroy();
    this.lesson?.destroy();
    window.clearTimeout(this.toastTimer);
  }

  private readonly frame = (now: number): void => {
    const elapsed = Math.min(0.05, (now - this.lastFrame) / 1000);
    this.lastFrame = now;
    const dt = this.slowMotion ? elapsed * 0.4 : elapsed;
    if (!this.frozen) this.wheel.selfCentre(this.session.speed * dt);
    this.session.steer = steerFromWheel(this.wheel.angle);
    this.session.pedals = { gas: this.gas.pressed, brake: this.brake.pressed };
    if (!this.frozen) this.session.update(dt);
    this.render(elapsed);
    this.updateHud();
    this.frameHandle = requestAnimationFrame(this.frame);
  };

  private get frozen(): boolean {
    return this.paused || this.element.classList.contains('menu-open');
  }

  private viewport(): Viewport {
    return this.view;
  }

  private measureClearArea(): Viewport {
    const frame = this.element.getBoundingClientRect();
    const [left, right] = [this.steerPanel, this.drivePanel].map((panel) => panel.getBoundingClientRect()).sort((a, b) => a.left - b.left);
    const x = left.right - frame.left;
    const y = this.hud.getBoundingClientRect().bottom - frame.top + 8;
    return { x, y, w: Math.max(100, right.left - frame.left - x), h: Math.max(100, frame.height - y - 10) };
  }

  private resize(): void {
    if (getComputedStyle(this.menuButton).display === 'none') this.setMenu(false);
    this.pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    const width = this.element.clientWidth;
    const height = this.element.clientHeight;
    this.canvas.width = Math.round(width * this.pixelRatio);
    this.canvas.height = Math.round(height * this.pixelRatio);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.view = this.measureClearArea();
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
    const hints = t().hints;
    if (s.status !== 'driving') return '';
    if (!s.started) return hints.chooseGear;
    if (s.aligned) return s.gear === 'P' || s.pedals.brake ? hints.holdStill : hints.linedUp;
    if (s.inTarget) return hints.almost;
    const remaining = this.level.checkpoints.length - s.checkpointsPassed;
    if (remaining > 0) return hints.driveGap(s.checkpointsPassed + 1, this.level.checkpoints.length);
    return '';
  }

  private selectGear(gear: Gear): void {
    if (this.frozen) return;
    if (this.session.setGear(gear)) {
      this.gears.show(gear);
      if (gear === 'P') this.gas.release();
    }
  }

  private pressPedalKey(pedal: PedalName, down: boolean): void {
    if (down && (this.frozen || (pedal === 'gas' && this.session.gear === 'P'))) return;
    this[pedal].holdKey(down);
  }

  private cycleTip(): void {
    const tips = levelText(this.level).tips;
    this.tipIndex = (this.tipIndex + 1) % tips.length;
    this.tipText.textContent = tips[this.tipIndex];
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
    setToggle(this.toggles.camera, mode === 'follow', mode === 'fit' ? t().hud.wholeArea : t().hud.followCar);
  }

  private setMenu(open: boolean): void {
    this.element.classList.toggle('menu-open', open);
    this.menuButton.setAttribute('aria-expanded', String(open));
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

  private onBump(obstacle: Obstacle, kind: BumpKind): void {
    const limit = this.level.maxTouches;
    const allowed = limit !== undefined ? ` ${t().bump.allowed(this.session.touches, limit)}` : '';
    this.showToast(`${bumpMessage(obstacle, kind)}${allowed}`);
  }

  private openOverlay(card: HTMLElement): void {
    this.setMenu(false);
    card.classList.add('scrollable');
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
    if (chapter.lesson && !lessonSeen(chapter.lesson)) {
      this.showLesson();
      return;
    }
    const copy = t().intro;
    const text = levelText(this.level);
    const startButton = h('button', { class: 'primary', type: 'button' }, [copy.startDriving]);
    onTap(startButton, () => {
      this.closeOverlay();
      this.paused = false;
    });
    const lessonButton = chapter.lesson && h('button', { class: 'secondary with-icon', type: 'button' }, [icons.guides(), copy.howTurningWorks]);
    if (lessonButton) onTap(lessonButton, () => this.showLesson());
    this.openOverlay(
      h('div', { class: 'card intro-card' }, [
        h('h2', {}, [text.title]),
        h('p', { class: 'card-sub' }, [t().levelOfTotal(chapterText(chapter).title, LEVELS.indexOf(this.level) + 1, LEVELS.length)]),
        h('p', { class: 'goal' }, [text.goal]),
        h('ul', { class: 'tips' }, text.tips.map((tip) => h('li', {}, [tip]))),
        this.level.maxTouches !== undefined && h('p', { class: 'strict' }, [copy.allowedTouches(this.level.maxTouches)]),
        h('div', { class: 'card-actions' }, [lessonButton, startButton]),
      ]),
    );
  }

  private showLesson(): void {
    const lessonId = chapterOf(this.level).lesson;
    if (!lessonId) return;
    this.lesson?.destroy();
    this.lesson = new TurningLesson(() => this.finishLesson());
    this.openOverlay(this.lesson.element);
    this.lesson.start();
    markLessonSeen(lessonId);
  }

  private finishLesson(): void {
    this.lesson?.destroy();
    this.lesson = null;
    this.showIntro();
  }

  private onFinish(result: Result): void {
    recordResult(this.level.id, result.stars, result.time);
    const next = LEVELS[LEVELS.indexOf(this.level) + 1];
    const actions: HTMLElement[] = [];
    const copy = t().result;
    const retry = h('button', { class: 'secondary', type: 'button' }, [copy.tryAgain]);
    onTap(retry, () => this.callbacks.play(this.level));
    const levels = h('button', { class: 'secondary', type: 'button' }, [copy.allLevels]);
    onTap(levels, () => this.callbacks.exit());
    actions.push(levels, retry);
    if (next && isUnlocked(next.id)) {
      const nextButton = h('button', { class: 'primary', type: 'button' }, [copy.nextLevel]);
      onTap(nextButton, () => this.callbacks.play(next));
      actions.push(nextButton);
    }
    const touchesText = result.touches === 0 ? copy.noTouches : copy.touchCount(result.touches);
    const timeText = `${formatTime(result.time)}${result.time > this.level.parTime ? ` (${copy.aimFor(formatTime(this.level.parTime))})` : ''}`;
    window.setTimeout(() => {
      this.openOverlay(
        h('div', { class: 'card result-card' }, [
          h('h2', {}, [resultHeading(result.stars)]),
          starRow(result.stars, 3, 'stars big'),
          h('dl', { class: 'result-stats' }, [
            h('div', {}, [h('dt', {}, [copy.time]), h('dd', {}, [timeText])]),
            h('div', {}, [h('dt', {}, [copy.touches]), h('dd', {}, [touchesText])]),
            h('div', {}, [h('dt', {}, [copy.position]), h('dd', {}, [copy[result.alignment.quality]])]),
          ]),
          h('div', { class: 'card-actions' }, actions),
        ]),
      );
    }, 450);
  }

  private onFail(): void {
    const copy = t().result;
    const retry = h('button', { class: 'primary', type: 'button' }, [copy.tryAgain]);
    onTap(retry, () => this.callbacks.play(this.level));
    const levels = h('button', { class: 'secondary', type: 'button' }, [copy.allLevels]);
    onTap(levels, () => this.callbacks.exit());
    this.openOverlay(
      h('div', { class: 'card result-card' }, [
        h('h2', {}, [copy.failTitle]),
        h('p', { class: 'goal' }, [copy.failBody]),
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
