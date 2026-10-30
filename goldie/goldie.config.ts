import { resolve } from 'node:path';

const APP_ROOT = resolve(import.meta.dirname, '..');

export default {
  appRoot: APP_ROOT,
  appPath: 'out/capture-app/App.app',
  bundleId: 'com.blazejkustra.drivelearning',
  devices: ['iphone-6.9', 'ipad-13'],
  locales: ['en-US', 'es-ES', 'de-DE', 'pl', 'zh-Hans'],
  localizedCaptures: true,
  appearance: 'dark',
  frame: { variant: { 'iphone-6.9': '17-pro-silver', 'ipad-13': 'ipad-pro-13-silver' } },
  theme: {
    background: 'linear-gradient(160deg, #232c37 0%, #1b222b 60%, #161c24 100%)',
    headlineColor: '#f4f6f9',
    subheadColor: '#a9b3c0',
    fontFamily: 'DM Sans',
    layout: 'classic',
    copyHeightRatio: 0.2,
    deviceWidthRatio: 4,
  },
  store: {
    name: 'Drive Practice',
    subtitle: { 'en-US': 'Calm parking and reversing' },
    developer: 'Blazej Kustra',
    category: 'Education',
    rating: 5,
    ratingCount: '',
    ageRating: '4+',
    price: 'Free',
    description: { 'en-US': 'Short, calm exercises for tight spaces, parking and reversing. See exactly where every wheel goes.' },
  },
  scenes: [
    {
      kind: 'screenshot',
      id: 'pillar',
      flow: 'store-01-pillar',
      headline: {
        'en-US': 'See where every wheel goes',
        'es-ES': 'Mira por dónde va cada rueda',
        'de-DE': 'Sieh, wo jedes Rad entlangfährt',
        pl: 'Zobacz, którędy jedzie każde koło',
        'zh-Hans': '看清每个车轮的路线',
      },
    },
    {
      kind: 'screenshot',
      id: 'lesson',
      flow: 'store-02-lesson',
      headline: {
        'en-US': 'Learn how a car turns',
        'es-ES': 'Aprende cómo gira un coche',
        'de-DE': 'Lerne, wie ein Auto lenkt',
        pl: 'Poznaj, jak skręca samochód',
        'zh-Hans': '学会汽车转弯的原理',
      },
    },
    {
      kind: 'screenshot',
      id: 'parallel',
      flow: 'store-03-parallel',
      headline: {
        'en-US': 'Reverse into tight spaces',
        'es-ES': 'Aparca en huecos estrechos',
        'de-DE': 'Rückwärts in enge Lücken',
        pl: 'Parkuj tyłem w ciasnych miejscach',
        'zh-Hans': '倒车停进狭窄车位',
      },
    },
    {
      kind: 'screenshot',
      id: 'levels',
      flow: 'store-04-levels',
      headline: {
        'en-US': '22 levels, one step at a time',
        'es-ES': '22 niveles, paso a paso',
        'de-DE': '22 Level, Schritt für Schritt',
        pl: '22 poziomy, krok po kroku',
        'zh-Hans': '22 个关卡，循序渐进',
      },
    },
    {
      kind: 'preview',
      id: 'preview',
      segments: [
        { id: 'pillar', flow: 'store-preview-01-pillar' },
        { id: 'parallel', flow: 'store-preview-02-parallel' },
      ],
    },
  ],
};
