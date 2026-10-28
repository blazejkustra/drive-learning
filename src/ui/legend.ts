import { t } from '../i18n/index.ts';
import { h } from './dom.ts';

export type Swatch = 'rear' | 'front' | 'swing' | 'pivot';

const ALL_SWATCHES: Swatch[] = ['rear', 'front', 'swing', 'pivot'];

export function guideLegend(swatches: Swatch[] = ALL_SWATCHES): HTMLElement {
  const legend = t().legend;
  return h('div', { class: 'legend' }, [
    h('p', { class: 'legend-title' }, [legend.title]),
    h(
      'ul',
      {},
      swatches.map((swatch) => h('li', {}, [h('span', { class: `swatch ${swatch}` }), legend[swatch]])),
    ),
  ]);
}
