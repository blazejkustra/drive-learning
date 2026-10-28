import { clamp } from '../geometry.ts';
import { CAR } from '../physics.ts';
import { h, svg } from '../ui/dom.ts';

const WHEEL_SVG = `
<svg class="wheel-graphic" viewBox="-120 -120 240 240" aria-hidden="true">
  <circle r="100" fill="none" stroke="#252a31" stroke-width="22"/>
  <circle r="111" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle r="89" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
  <path d="M -24 -97.1 A 100 100 0 0 1 24 -97.1" fill="none" stroke="#f2f4f7" stroke-width="22"/>
  <path d="M -90 6 L -26 10 M 90 6 L 26 10 M 0 30 L 0 90" stroke="#2e343c" stroke-width="20" stroke-linecap="round"/>
  <circle r="32" fill="#2e343c"/>
  <circle r="24" fill="#3a414b"/>
</svg>`;

const SNAP_TO_CENTRE_DEG = 5;
const MIN_GRAB_RADIUS = 18;

export class SteeringWheel {
  readonly element: HTMLElement;
  private readonly graphic: SVGSVGElement;
  private rotation = 0;
  private pointerId: number | null = null;
  private lastAngle = 0;

  constructor() {
    this.graphic = svg(WHEEL_SVG);
    this.element = h('div', { class: 'wheel', role: 'slider', 'aria-label': 'Steering wheel' }, [this.graphic]);
    this.element.addEventListener('pointerdown', (e) => this.grab(e));
    this.element.addEventListener('pointermove', (e) => this.drag(e));
    this.element.addEventListener('pointerup', (e) => this.release(e));
    this.element.addEventListener('pointercancel', (e) => this.release(e));
    this.element.addEventListener('lostpointercapture', (e) => this.release(e));
  }

  /** Steering wheel rotation in degrees; positive turns right. */
  get angle(): number {
    return this.rotation;
  }

  turnTo(degrees: number): void {
    this.setRotation(degrees);
  }

  private pointerAngle(event: PointerEvent): { angle: number; radius: number } {
    const rect = this.element.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    return { angle: (Math.atan2(dy, dx) * 180) / Math.PI, radius: Math.hypot(dx, dy) };
  }

  private grab(event: PointerEvent): void {
    if (this.pointerId !== null) return;
    event.preventDefault();
    this.pointerId = event.pointerId;
    this.lastAngle = this.pointerAngle(event).angle;
    this.element.classList.add('held');
    this.element.setPointerCapture(event.pointerId);
  }

  private drag(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    const { angle, radius } = this.pointerAngle(event);
    if (radius < MIN_GRAB_RADIUS) return;
    let delta = angle - this.lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    this.lastAngle = angle;
    this.setRotation(this.rotation + delta);
  }

  private release(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    this.pointerId = null;
    this.element.classList.remove('held');
    if (Math.abs(this.rotation) < SNAP_TO_CENTRE_DEG) this.setRotation(0);
  }

  private setRotation(degrees: number): void {
    this.rotation = clamp(degrees, -CAR.wheelLockDeg, CAR.wheelLockDeg);
    this.graphic.style.transform = `rotate(${this.rotation}deg)`;
  }
}
