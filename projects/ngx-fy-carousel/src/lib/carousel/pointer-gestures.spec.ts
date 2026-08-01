import { describe, expect, it } from 'vitest';
import { attachPointerGestures } from './pointer-gestures';

class FakePointerEvent extends Event {
  pointerId: number;
  clientX: number;
  clientY: number;
  button: number;

  constructor(type: string, init: Partial<FakePointerEvent> = {}) {
    super(type, { bubbles: true });
    this.pointerId = init.pointerId ?? 1;
    this.clientX = init.clientX ?? 0;
    this.clientY = init.clientY ?? 0;
    this.button = init.button ?? 0;
  }
}

describe('attachPointerGestures', () => {
  it('emits pan lifecycle for horizontal drag', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'setPointerCapture', { value: () => undefined });
    Object.defineProperty(el, 'releasePointerCapture', { value: () => undefined });
    Object.defineProperty(el, 'hasPointerCapture', { value: () => false });
    document.body.appendChild(el);

    const events: string[] = [];
    const detach = attachPointerGestures(
      el,
      {
        onPanStart: () => events.push('start'),
        onPanMove: () => events.push('move'),
        onPanEnd: () => events.push('end'),
      },
      { horizontal: true },
    );

    el.dispatchEvent(new FakePointerEvent('pointerdown', { pointerId: 1, clientX: 0, clientY: 0, button: 0 }));
    el.dispatchEvent(new FakePointerEvent('pointermove', { pointerId: 1, clientX: 20, clientY: 0 }));
    el.dispatchEvent(new FakePointerEvent('pointerup', { pointerId: 1, clientX: 20, clientY: 0 }));

    expect(events[0]).toBe('start');
    expect(events).toContain('move');
    expect(events.at(-1)).toBe('end');
    detach();
    el.remove();
  });

  it('ignores pointerdown from nested ngx-fy-carousel hosts', () => {
    const outer = document.createElement('ngx-fy-carousel');
    const touch = document.createElement('div');
    const nested = document.createElement('ngx-fy-carousel');
    const nestedBtn = document.createElement('button');
    nested.appendChild(nestedBtn);
    touch.appendChild(nested);
    outer.appendChild(touch);
    document.body.appendChild(outer);

    Object.defineProperty(touch, 'setPointerCapture', { value: () => undefined });
    Object.defineProperty(touch, 'releasePointerCapture', { value: () => undefined });
    Object.defineProperty(touch, 'hasPointerCapture', { value: () => false });

    let started = 0;
    const detach = attachPointerGestures(
      touch,
      {
        onPanStart: () => {
          started += 1;
        },
        onPanMove: () => undefined,
        onPanEnd: () => undefined,
      },
      { horizontal: true },
    );

    nestedBtn.dispatchEvent(
      new FakePointerEvent('pointerdown', { pointerId: 1, clientX: 0, clientY: 0, button: 0 }),
    );
    nestedBtn.dispatchEvent(
      new FakePointerEvent('pointermove', { pointerId: 1, clientX: 30, clientY: 0 }),
    );
    nestedBtn.dispatchEvent(
      new FakePointerEvent('pointerup', { pointerId: 1, clientX: 30, clientY: 0 }),
    );

    expect(started).toBe(0);
    detach();
    outer.remove();
  });
});
