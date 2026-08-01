export interface PointerGestureHandlers {
  onPanStart: () => void;
  onPanMove: (deltaX: number, deltaY: number) => void;
  onPanEnd: (velocityX: number, velocityY: number) => void;
}

/**
 * Minimal pointer-based pan recognizer (HammerJS replacement).
 */
export function attachPointerGestures(
  element: HTMLElement,
  handlers: PointerGestureHandlers,
  options: { horizontal: boolean },
): () => void {
  let pointerId: number | null = null;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocityX = 0;
  let velocityY = 0;
  let active = false;

  const onPointerDown = (event: PointerEvent) => {
    if (pointerId !== null || event.button !== 0) {
      return;
    }

    // Nested carousels live inside this touch surface. Ignore pointers that
    // originate in a deeper ngx-fy-carousel so we don't steal their clicks via
    // setPointerCapture during the bubble phase.
    const targetEl =
      event.target instanceof Element
        ? event.target
        : ((event.target as Node | null)?.parentElement ?? null);
    if (targetEl) {
      const nestedHost = targetEl.closest('ngx-fy-carousel');
      const ownHost = element.closest('ngx-fy-carousel');
      if (nestedHost && ownHost && nestedHost !== ownHost) {
        return;
      }
    }

    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    startY = lastY = event.clientY;
    lastTime = event.timeStamp;
    velocityX = 0;
    velocityY = 0;
    active = false;
    element.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const primary = options.horizontal ? Math.abs(dx) : Math.abs(dy);
    const secondary = options.horizontal ? Math.abs(dy) : Math.abs(dx);

    if (!active) {
      if (primary < 6) {
        return;
      }
      if (secondary > primary) {
        // Let the browser handle scroll on the orthogonal axis.
        cleanupPointer(event);
        return;
      }
      active = true;
      handlers.onPanStart();
    }

    const dt = Math.max(1, event.timeStamp - lastTime);
    velocityX = (event.clientX - lastX) / dt;
    velocityY = (event.clientY - lastY) / dt;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = event.timeStamp;

    handlers.onPanMove(dx, dy);
    event.preventDefault();
  };

  const cleanupPointer = (event: PointerEvent) => {
    if (pointerId !== event.pointerId) {
      return;
    }
    if (active) {
      handlers.onPanEnd(velocityX, velocityY);
    }
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    pointerId = null;
    active = false;
  };

  element.style.touchAction = options.horizontal ? 'pan-y' : 'pan-x';
  element.addEventListener('pointerdown', onPointerDown);
  element.addEventListener('pointermove', onPointerMove);
  element.addEventListener('pointerup', cleanupPointer);
  element.addEventListener('pointercancel', cleanupPointer);

  return () => {
    element.removeEventListener('pointerdown', onPointerDown);
    element.removeEventListener('pointermove', onPointerMove);
    element.removeEventListener('pointerup', cleanupPointer);
    element.removeEventListener('pointercancel', cleanupPointer);
  };
}
