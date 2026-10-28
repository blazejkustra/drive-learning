import './style.css';
import { detectLanguage, setLanguage, type Language } from './i18n/index.ts';
import type { Level } from './level-types.ts';
import { getSettings, updateSettings } from './storage.ts';
import { HomeScreen } from './ui/home.ts';
import { PlayScreen } from './ui/play.ts';

interface Screen {
  readonly element: HTMLElement;
  start(): void;
  destroy(): void;
}

const root = document.getElementById('app')!;
let current: Screen | null = null;

function show(screen: Screen): void {
  current?.destroy();
  current = screen;
  root.replaceChildren(screen.element);
  screen.start();
}

function showHome(selectedId?: string): void {
  show(new HomeScreen({ play: playLevel, changeLanguage }, selectedId));
}

function changeLanguage(language: Language, selectedId: string): void {
  updateSettings({ language });
  setLanguage(language);
  showHome(selectedId);
}

function playLevel(level: Level): void {
  show(new PlayScreen(level, { exit: () => showHome(level.id), play: playLevel }));
}

function blockBrowserGestures(): void {
  const prevent = (event: Event): void => event.preventDefault();
  document.addEventListener('gesturestart', prevent);
  document.addEventListener('dblclick', prevent);
  document.addEventListener('contextmenu', prevent);
  document.addEventListener(
    'touchmove',
    (event) => {
      const target = event.target as Element | null;
      if (!target?.closest('.scrollable')) event.preventDefault();
    },
    { passive: false },
  );
}

blockBrowserGestures();
setLanguage(getSettings().language ?? detectLanguage());
showHome();
