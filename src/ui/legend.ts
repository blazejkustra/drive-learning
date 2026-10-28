import { h } from './dom.ts';

const ENTRIES = [
  { swatch: 'rear', text: 'Back wheels' },
  { swatch: 'front', text: 'Front wheels' },
  { swatch: 'swing', text: 'Front corner swing' },
  { swatch: 'pivot', text: 'Turning point' },
];

export function guideLegend(): HTMLElement {
  return h('div', { class: 'legend' }, [
    h('p', { class: 'legend-title' }, ['Guide lines']),
    h(
      'ul',
      {},
      ENTRIES.map((entry) => h('li', {}, [h('span', { class: `swatch ${entry.swatch}` }), entry.text])),
    ),
  ]);
}
