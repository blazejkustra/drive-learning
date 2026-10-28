import { LANGUAGES, chapterText, currentLanguage, levelText, t, type Language } from '../i18n/index.ts';
import type { Chapter, Level } from '../level-types.ts';
import { CHAPTERS, LEVELS, chapterOf } from '../levels.ts';
import { poseFromCentre } from '../physics.ts';
import { Camera } from '../render/camera.ts';
import { drawScene } from '../render/scene.ts';
import { getSettings, isUnlocked, nextLevelToPlay, progressFor, totalStars, updateSettings } from '../storage.ts';
import { h, onTap } from './dom.ts';
import { icons, starRow } from './icons.ts';

export interface HomeCallbacks {
  play: (level: Level) => void;
  changeLanguage: (language: Language, selectedId: string) => void;
}

function chapterStars(chapter: Chapter): number {
  return chapter.levels.reduce((sum, level) => sum + (progressFor(level.id)?.stars ?? 0), 0);
}

export class HomeScreen {
  readonly element: HTMLElement;
  private readonly callbacks: HomeCallbacks;
  private readonly canvas: HTMLCanvasElement;
  private readonly info: HTMLElement;
  private readonly rows = new Map<string, HTMLButtonElement>();
  private readonly resizeObserver: ResizeObserver;
  private selected: Level;

  constructor(callbacks: HomeCallbacks, selectedId?: string) {
    this.callbacks = callbacks;
    this.selected = LEVELS.find((level) => level.id === (selectedId ?? nextLevelToPlay())) ?? LEVELS[0];
    this.canvas = h('canvas', { class: 'preview-canvas' });
    this.info = h('div', { class: 'preview-info' });

    const list = h('div', { class: 'home-list scrollable' }, [
      this.header(),
      ...CHAPTERS.map((chapter, i) => this.chapterSection(chapter, i + 1)),
      this.settings(),
    ]);

    this.element = h('div', { class: 'home' }, [list, h('section', { class: 'home-preview' }, [this.canvas, this.info])]);
    this.resizeObserver = new ResizeObserver(() => this.drawPreview());
    this.resizeObserver.observe(this.canvas);
    this.select(this.selected);
  }

  start(): void {
    this.rows.get(this.selected.id)?.scrollIntoView({ block: 'center' });
    this.drawPreview();
  }

  destroy(): void {
    this.resizeObserver.disconnect();
  }

  private header(): HTMLElement {
    const stars = totalStars();
    return h('header', { class: 'home-header' }, [
      h('h1', {}, [t().appName]),
      h('p', {}, [t().home.intro]),
      h('p', { class: 'home-progress' }, [starRow(1, 1, 'stars inline'), t().home.progress(stars, LEVELS.length * 3)]),
      this.languagePicker(),
    ]);
  }

  private languagePicker(): HTMLElement {
    const buttons = LANGUAGES.map((option) => {
      const active = option.code === currentLanguage();
      const button = h('button', { class: `language${active ? ' active' : ''}`, type: 'button', lang: option.htmlLang, 'aria-pressed': String(active) }, [option.name]);
      onTap(button, () => {
        if (!active) this.callbacks.changeLanguage(option.code, this.selected.id);
      });
      return button;
    });
    return h('div', { class: 'language-picker', role: 'group', 'aria-label': t().home.language }, buttons);
  }

  private chapterSection(chapter: Chapter, number: number): HTMLElement {
    const earned = chapterStars(chapter);
    return h('section', { class: 'chapter' }, [
      h('div', { class: 'chapter-head' }, [
        h('span', { class: 'chapter-number' }, [String(number)]),
        h('div', { class: 'chapter-text' }, [
          h('h2', {}, [chapterText(chapter).title]),
          h('p', {}, [chapterText(chapter).summary]),
        ]),
        h('span', { class: 'chapter-stars' }, [`${earned}/${chapter.levels.length * 3}`]),
      ]),
      h('ol', { class: 'level-list' }, chapter.levels.map((level) => h('li', {}, [this.levelRow(level)]))),
    ]);
  }

  private levelRow(level: Level): HTMLButtonElement {
    const progress = progressFor(level.id);
    const unlocked = isUnlocked(level.id);
    const row = h('button', { class: `level-row${unlocked ? '' : ' locked'}`, type: 'button' }, [
      h('span', { class: 'level-number' }, [String(LEVELS.indexOf(level) + 1)]),
      h('span', { class: 'level-title' }, [levelText(level).title]),
      unlocked ? starRow(progress?.stars ?? 0) : icons.lock(),
    ]);
    onTap(row, () => this.select(level));
    this.rows.set(level.id, row);
    return row;
  }

  private settings(): HTMLElement {
    const toggle = h('button', { class: 'setting', type: 'button' }, [icons.swap(), h('span', {}, [])]);
    const label = toggle.querySelector('span')!;
    const refresh = (): void => {
      label.textContent = getSettings().wheelOnRight ? t().home.wheelOnRight : t().home.wheelOnLeft;
    };
    onTap(toggle, () => {
      updateSettings({ wheelOnRight: !getSettings().wheelOnRight });
      refresh();
    });
    refresh();
    return h('footer', { class: 'home-settings' }, [toggle]);
  }

  private select(level: Level): void {
    this.selected = level;
    for (const [id, row] of this.rows) row.classList.toggle('selected', id === level.id);
    const unlocked = isUnlocked(level.id);
    const progress = progressFor(level.id);
    const chapter = chapterOf(level);
    const play = h('button', { class: 'primary', type: 'button', disabled: !unlocked }, [progress ? t().home.playAgain : t().home.start]);
    onTap(play, () => {
      if (unlocked) this.callbacks.play(level);
    });
    this.info.replaceChildren(
      h('div', { class: 'preview-text' }, [
        h('h2', {}, [levelText(level).title]),
        h('p', { class: 'card-sub' }, [t().levelOf(chapterText(chapter).title, LEVELS.indexOf(level) + 1)]),
        h('p', { class: 'goal' }, [levelText(level).goal]),
        !unlocked && h('p', { class: 'locked-note' }, [t().home.lockedNote]),
      ]),
      h('div', { class: 'preview-actions' }, [progress ? starRow(progress.stars, 3, 'stars big') : null, play]),
    );
    this.drawPreview();
  }

  private drawPreview(): void {
    const ctx = this.canvas.getContext('2d');
    const rect = this.canvas.getBoundingClientRect();
    if (!ctx || rect.width === 0) return;
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = Math.round(rect.width * ratio);
    this.canvas.height = Math.round(rect.height * ratio);
    const infoHeight = this.info.offsetHeight;
    const camera = new Camera();
    camera.fit(this.selected.bounds, { x: 0, y: 0, w: rect.width, h: rect.height - infoHeight }, 24);
    const { start } = this.selected;
    drawScene(ctx, camera, ratio, this.selected, {
      pose: poseFromCentre(start.x, start.y, start.heading),
      steer: 0,
      gear: 'D',
      time: 0,
      checkpointsPassed: 0,
      aligned: false,
      showGuides: false,
      showTrail: false,
      trail: [],
      bump: null,
    });
  }
}
