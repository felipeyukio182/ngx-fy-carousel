export function computePointCount(
  itemCount: number,
  itemsPerView: number,
  slideItems: number,
): number {
  const safeItems = Math.max(1, itemsPerView);
  const safeSlide = Math.max(1, slideItems);
  const numerator = itemCount - (safeItems - safeSlide);
  if (numerator <= 0 || itemCount <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(numerator / safeSlide));
}

export function computePointNumbers(pointCount: number, hideOnSingleSlide: boolean): number[] {
  if (pointCount <= 1 && hideOnSingleSlide) {
    return [];
  }
  return Array.from({ length: pointCount }, (_, i) => i);
}

export function clampSlideIndex(slide: number, itemCount: number, itemsPerView: number): number {
  const max = Math.max(0, itemCount - Math.max(1, itemsPerView));
  if (!Number.isFinite(slide)) {
    return 0;
  }
  return Math.min(Math.max(0, Math.floor(slide)), max);
}

export function pointToSlideIndex(
  point: number,
  pointCount: number,
  slideItems: number,
  itemCount: number,
  itemsPerView: number,
): number {
  const safePoint = Math.max(0, Math.floor(point));
  if (safePoint <= 0) {
    return 0;
  }
  if (safePoint >= pointCount - 1) {
    return Math.max(0, itemCount - itemsPerView);
  }
  return clampSlideIndex(safePoint * slideItems, itemCount, itemsPerView);
}

export function slideToActivePoint(currentSlide: number, slideItems: number): number {
  const safeSlide = Math.max(1, slideItems);
  return Math.ceil(currentSlide / safeSlide);
}

export function shouldEmitCarouselLoad(
  load: number | null,
  itemCount: number,
  currentSlide: number,
  itemsPerView: number,
): boolean {
  if (load == null) {
    return false;
  }
  return itemCount - load <= currentSlide + itemsPerView;
}
