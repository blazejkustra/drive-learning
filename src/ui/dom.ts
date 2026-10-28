type Attrs = Record<string, string | number | boolean | undefined>;
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs = {}, children: Child[] = []): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (name === 'class') element.className = String(value);
    else element.setAttribute(name, value === true ? '' : String(value));
  }
  append(element, children);
  return element;
}

export function append(parent: Element, children: Child[]): void {
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    parent.append(child);
  }
}

export function svg(markup: string): SVGSVGElement {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild as SVGSVGElement;
}

/** Fires on press rather than on click, so taps react instantly on touch screens. */
export function onPress(element: HTMLElement, handler: (event: PointerEvent) => void): void {
  element.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    if (element instanceof HTMLButtonElement && element.disabled) return;
    event.preventDefault();
    handler(event);
  });
}

export function onTap(element: HTMLElement, handler: () => void): void {
  element.addEventListener('click', (event) => {
    event.preventDefault();
    handler();
  });
}

export function formatTime(seconds: number): string {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = String(whole % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
}
