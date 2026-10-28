import type { Language } from './i18n/index.ts';
import type { LessonId } from './level-types.ts';
import { LEVELS } from './levels.ts';

export interface LevelProgress {
  stars: number;
  bestTime: number;
}

export interface Settings {
  wheelOnRight: boolean;
  language?: Language;
}

interface SavedData {
  progress: Record<string, LevelProgress>;
  settings: Settings;
  lessonsSeen: LessonId[];
}

const KEY = 'drive-practice:v1';

function emptyData(): SavedData {
  return { progress: {}, settings: { wheelOnRight: false }, lessonsSeen: [] };
}

function load(): SavedData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as Partial<SavedData>;
    return {
      progress: parsed.progress ?? {},
      settings: { ...emptyData().settings, ...parsed.settings },
      lessonsSeen: parsed.lessonsSeen ?? [],
    };
  } catch {
    return emptyData();
  }
}

const data = load();

function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Private browsing can refuse storage; progress then lasts for this visit only.
  }
}

export function progressFor(levelId: string): LevelProgress | undefined {
  return data.progress[levelId];
}

export function recordResult(levelId: string, stars: number, time: number): void {
  const previous = data.progress[levelId];
  data.progress[levelId] = {
    stars: Math.max(stars, previous?.stars ?? 0),
    bestTime: Math.min(time, previous?.bestTime ?? Infinity),
  };
  save();
}

export function isUnlocked(levelId: string): boolean {
  const index = LEVELS.findIndex((level) => level.id === levelId);
  if (index <= 0 || progressFor(levelId) !== undefined) return true;
  return progressFor(LEVELS[index - 1].id) !== undefined;
}

export function totalStars(): number {
  return Object.values(data.progress).reduce((sum, p) => sum + p.stars, 0);
}

export function nextLevelToPlay(): string {
  const open = LEVELS.find((level) => !progressFor(level.id) && isUnlocked(level.id));
  return (open ?? LEVELS[0]).id;
}

export function getSettings(): Settings {
  return data.settings;
}

export function updateSettings(change: Partial<Settings>): void {
  data.settings = { ...data.settings, ...change };
  save();
}

export function lessonSeen(lesson: LessonId): boolean {
  return data.lessonsSeen.includes(lesson);
}

export function markLessonSeen(lesson: LessonId): void {
  if (lessonSeen(lesson)) return;
  data.lessonsSeen.push(lesson);
  save();
}
