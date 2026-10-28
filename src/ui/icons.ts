import { svg } from './dom.ts';

function icon(paths: string): SVGSVGElement {
  return svg(`
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`);
}

export const icons = {
  back: () => icon('<path d="M15 5l-7 7 7 7"/>'),
  guides: () => icon('<path d="M6 21c0-7 3-12 9-15"/><path d="M11 21c0-5 2-9 7-11"/><circle cx="20" cy="20" r="1.5"/>'),
  trail: () => icon('<circle cx="5" cy="19" r="1"/><circle cx="9" cy="14" r="1"/><circle cx="14" cy="10" r="1"/><circle cx="19" cy="5" r="1"/>'),
  camera: () => icon('<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><rect x="9" y="8" width="6" height="8" rx="1.5"/>'),
  slow: () => icon('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M10 2h4"/>'),
  restart: () => icon('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>'),
  next: () => icon('<path d="M9 5l7 7-7 7"/>'),
  lock: () => icon('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
  swap: () => icon('<path d="M4 8h14l-3-3M20 16H6l3 3"/>'),
};

export function starRow(filled: number, total = 3, className = 'stars'): HTMLElement {
  const row = document.createElement('span');
  row.className = className;
  row.setAttribute('aria-label', `${filled} of ${total} stars`);
  for (let i = 0; i < total; i++) {
    row.append(
      svg(`<svg class="star ${i < filled ? 'on' : 'off'}" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/>
      </svg>`),
    );
  }
  return row;
}
