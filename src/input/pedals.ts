import type { Gear } from '../physics.ts';
import { h, onPress } from '../ui/dom.ts';

export class Pedal {
  readonly element: HTMLButtonElement;
  private readonly pointers = new Set<number>();

  constructor(label: string, className: string) {
    this.element = h('button', { class: `pedal ${className}`, type: 'button' }, [
      h('span', { class: 'pedal-grip' }),
      h('span', { class: 'pedal-label' }, [label]),
    ]);
    this.element.addEventListener('pointerdown', (e) => this.press(e));
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'] as const) {
      this.element.addEventListener(type, (e) => this.lift(e));
    }
    this.element.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  get pressed(): boolean {
    return this.pointers.size > 0;
  }

  release(): void {
    this.pointers.clear();
    this.element.classList.remove('pressed');
  }

  private press(event: PointerEvent): void {
    event.preventDefault();
    this.pointers.add(event.pointerId);
    this.element.classList.add('pressed');
    this.element.setPointerCapture(event.pointerId);
  }

  private lift(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    if (!this.pressed) this.element.classList.remove('pressed');
  }
}

const GEAR_LABELS: Record<Gear, string> = { P: 'Park', R: 'Reverse', D: 'Drive' };

export class GearSelector {
  readonly element: HTMLElement;
  private readonly buttons = new Map<Gear, HTMLButtonElement>();

  constructor(onSelect: (gear: Gear) => void) {
    this.element = h('div', { class: 'gears', role: 'group', 'aria-label': 'Gear' });
    for (const gear of ['P', 'R', 'D'] as const) {
      const button = h('button', { class: 'gear', type: 'button', 'aria-label': GEAR_LABELS[gear] }, [
        h('span', { class: 'gear-letter' }, [gear]),
        h('span', { class: 'gear-name' }, [GEAR_LABELS[gear]]),
      ]);
      onPress(button, () => onSelect(gear));
      this.buttons.set(gear, button);
      this.element.append(button);
    }
  }

  show(gear: Gear): void {
    for (const [key, button] of this.buttons) button.classList.toggle('active', key === gear);
  }
}
