export function observeResize(
  element: Element,
  callback: (width: number, height: number) => void,
): () => void {
  if (typeof ResizeObserver === 'undefined') {
    return () => undefined;
  }
  let frame = 0;
  const observer = new ResizeObserver(entries => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = entry.contentRect;
      callback(box.width, box.height);
    });
  });
  observer.observe(element);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
  };
}

export function observeIntersection(
  element: Element,
  callback: (isVisible: boolean) => void,
): () => void {
  if (typeof IntersectionObserver === 'undefined') {
    callback(true);
    return () => undefined;
  }
  const observer = new IntersectionObserver(
    entries => {
      const entry = entries[0];
      callback(!!entry?.isIntersecting);
    },
    { threshold: 0.25 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

export function observeVisibility(callback: (visible: boolean) => void): () => void {
  if (typeof document === 'undefined') {
    return () => undefined;
  }
  const handler = () => callback(document.visibilityState === 'visible');
  document.addEventListener('visibilitychange', handler);
  handler();
  return () => document.removeEventListener('visibilitychange', handler);
}
