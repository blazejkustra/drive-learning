import type { Gear } from '../physics.ts';

export type PedalName = 'gas' | 'brake';

export interface KeyboardHandlers {
  pedal: (pedal: PedalName, down: boolean) => void;
  gear: (gear: Gear) => void;
}

const PEDAL_KEYS: Record<string, PedalName> = { w: 'gas', arrowup: 'gas', s: 'brake', arrowdown: 'brake' };
const GEAR_KEYS: Record<string, Gear> = { r: 'R', d: 'D', p: 'P' };

function hasModifier(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey;
}

export class KeyboardControls {
  private readonly handlers: KeyboardHandlers;

  constructor(handlers: KeyboardHandlers) {
    this.handlers = handlers;
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.releaseAll);
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.releaseAll);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (hasModifier(event)) return;
    const key = event.key.toLowerCase();
    const pedal = PEDAL_KEYS[key];
    const gear = GEAR_KEYS[key];
    if (!pedal && !gear) return;
    event.preventDefault();
    if (event.repeat) return;
    if (pedal) this.handlers.pedal(pedal, true);
    if (gear) this.handlers.gear(gear);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    const pedal = PEDAL_KEYS[event.key.toLowerCase()];
    if (pedal) this.handlers.pedal(pedal, false);
  };

  private readonly releaseAll = (): void => {
    this.handlers.pedal('gas', false);
    this.handlers.pedal('brake', false);
  };
}
