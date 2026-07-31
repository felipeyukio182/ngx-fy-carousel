import { describe, expect, it } from 'vitest';
import { Breakpoints, FupuCarouselConfig } from './types';
import { normalizeConfig, resolveDeviceType, resolveItemsPerView } from './normalize';
import {
  clampSlideIndex,
  computePointCount,
  computePointNumbers,
  pointToSlideIndex,
  shouldEmitCarouselLoad,
  slideToActivePoint,
} from './pagination';

describe('normalizeConfig', () => {
  it('normalizes responsive defaults', () => {
    const config = normalizeConfig({
      grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
    });
    expect(config.layoutType).toBe('responsive');
    expect(config.grid.xl).toBe(4);
    expect(config.gridBreakpoints.sm).toBe(new Breakpoints().sm);
    expect(config.loop).toBe(false);
    expect(config.speed).toBe(400);
  });

  it('accepts fixed layout', () => {
    const config = normalizeConfig({
      grid: { xs: 0, sm: 0, md: 0, lg: 0, all: 200 },
    });
    expect(config.layoutType).toBe('fixed');
  });

  it('rejects invalid responsive grid', () => {
    expect(() =>
      normalizeConfig({
        grid: { xs: 0, sm: 2, md: 3, lg: 4, all: 0 },
      } as FupuCarouselConfig),
    ).toThrow(/grid.xs/);
  });

  it('normalizes interval number and object', () => {
    expect(normalizeConfig({
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      interval: 3000,
    }).interval).toEqual({ timing: 3000 });

    expect(normalizeConfig({
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      interval: { timing: 2500, initialDelay: 100 },
    }).interval).toEqual({ timing: 2500, initialDelay: 100 });
  });
});

describe('pagination', () => {
  it('computes point counts safely', () => {
    expect(computePointCount(10, 3, 2)).toBe(5);
    expect(computePointCount(0, 3, 2)).toBe(1);
    expect(computePointCount(2, 3, 0)).toBe(1);
  });

  it('hides single slide points when requested', () => {
    expect(computePointNumbers(1, true)).toEqual([]);
    expect(computePointNumbers(1, false)).toEqual([0]);
    expect(computePointNumbers(3, true)).toEqual([0, 1, 2]);
  });

  it('clamps slide indexes', () => {
    expect(clampSlideIndex(-2, 10, 3)).toBe(0);
    expect(clampSlideIndex(99, 10, 3)).toBe(7);
    expect(clampSlideIndex(1.8, 10, 3)).toBe(1);
  });

  it('maps points to slide indexes', () => {
    expect(pointToSlideIndex(0, 5, 2, 10, 3)).toBe(0);
    expect(pointToSlideIndex(4, 5, 2, 10, 3)).toBe(7);
    expect(pointToSlideIndex(2, 5, 2, 10, 3)).toBe(4);
  });

  it('maps slides to active points and load trigger', () => {
    expect(slideToActivePoint(4, 2)).toBe(2);
    expect(shouldEmitCarouselLoad(2, 10, 7, 3)).toBe(true);
    expect(shouldEmitCarouselLoad(null, 10, 7, 3)).toBe(false);
  });
});

describe('device resolution', () => {
  const breakpoints = { sm: 768, md: 992, lg: 1200, xl: 1400 };

  it('resolves breakpoints', () => {
    expect(resolveDeviceType(500, breakpoints, 'responsive')).toBe('xs');
    expect(resolveDeviceType(800, breakpoints, 'responsive')).toBe('sm');
    expect(resolveDeviceType(1000, breakpoints, 'responsive')).toBe('md');
    expect(resolveDeviceType(1300, breakpoints, 'responsive')).toBe('lg');
    expect(resolveDeviceType(1500, breakpoints, 'responsive')).toBe('xl');
    expect(resolveDeviceType(1500, breakpoints, 'fixed')).toBe('all');
  });

  it('resolves items per view', () => {
    const responsive = normalizeConfig({
      grid: { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, all: 0 },
      gridBreakpoints: breakpoints,
    });
    expect(resolveItemsPerView(responsive, 'md', 1000)).toBe(3);

    const fixed = normalizeConfig({
      grid: { xs: 0, sm: 0, md: 0, lg: 0, all: 200 },
    });
    expect(resolveItemsPerView(fixed, 'all', 650)).toBe(3);
  });
});
