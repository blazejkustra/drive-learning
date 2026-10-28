import type { Chapter, Level } from '../level-types.ts';
import { de } from './de.ts';
import { en, type Messages } from './en.ts';
import { es } from './es.ts';
import { pl } from './pl.ts';
import { zh } from './zh.ts';

export type Language = 'en' | 'es' | 'de' | 'pl' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  htmlLang: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', htmlLang: 'en' },
  { code: 'es', name: 'Español', htmlLang: 'es' },
  { code: 'de', name: 'Deutsch', htmlLang: 'de' },
  { code: 'pl', name: 'Polski', htmlLang: 'pl' },
  { code: 'zh', name: '中文', htmlLang: 'zh-Hans' },
];

const MESSAGES: Record<Language, Messages> = { en, es, de, pl, zh };

let current: Language = 'en';

export function t(): Messages {
  return MESSAGES[current];
}

export function currentLanguage(): Language {
  return current;
}

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.some((option) => option.code === value);
}

export function detectLanguage(): Language {
  for (const tag of navigator.languages ?? [navigator.language]) {
    const base = tag.toLowerCase().split('-')[0];
    if (isLanguage(base)) return base;
  }
  return 'en';
}

export function setLanguage(language: Language): void {
  current = language;
  const option = LANGUAGES.find((entry) => entry.code === language)!;
  document.documentElement.lang = option.htmlLang;
  document.title = t().appName;
  const rotateNote = document.querySelector('.rotate-note');
  if (rotateNote) rotateNote.textContent = t().rotateNote;
}

export function levelText(level: Level): Messages['levels'][Level['id']] {
  return t().levels[level.id];
}

export function chapterText(chapter: Chapter): Messages['chapters'][Chapter['id']] {
  return t().chapters[chapter.id];
}
