import {
  Breakpoints,
  CarouselInterval,
  CarouselLayoutType,
  DeviceType,
  FupuCarouselConfig,
  Transform,
  TransformInterface,
  Vertical,
} from './types';

export interface NormalizedCarouselConfig {
  grid: Required<TransformInterface>;
  gridBreakpoints: Required<{ sm: number; md: number; lg: number; xl: number }>;
  slide: number | null;
  speed: number;
  interval: CarouselInterval | null;
  animation: 'lazy' | null;
  pointVisible: boolean;
  hideOnSingleSlide: boolean;
  type: string | null;
  load: number | null;
  custom: 'banner' | null;
  loop: boolean;
  touch: boolean;
  easing: string;
  RTL: boolean;
  vertical: Vertical;
  velocity: number;
  layoutType: CarouselLayoutType;
}

function toPositiveInt(value: unknown, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    return fallback;
  }
  return Math.floor(n);
}

function normalizeInterval(interval: FupuCarouselConfig['interval']): CarouselInterval | null {
  if (interval == null) {
    return null;
  }
  if (typeof interval === 'number') {
    return Number.isFinite(interval) && interval > 0 ? { timing: interval } : null;
  }
  if (typeof interval.timing === 'number' && Number.isFinite(interval.timing) && interval.timing > 0) {
    return {
      timing: interval.timing,
      initialDelay:
        typeof interval.initialDelay === 'number' && interval.initialDelay >= 0
          ? interval.initialDelay
          : 0,
    };
  }
  return null;
}

export function normalizeConfig(raw: FupuCarouselConfig): NormalizedCarouselConfig {
  if (!raw?.grid) {
    throw new Error('FupuCarouselConfig.grid is required.');
  }

  const breakpoints = {
    sm: raw.gridBreakpoints?.sm ?? new Breakpoints().sm,
    md: raw.gridBreakpoints?.md ?? new Breakpoints().md,
    lg: raw.gridBreakpoints?.lg ?? new Breakpoints().lg,
    xl: raw.gridBreakpoints?.xl ?? new Breakpoints().xl,
  };

  const grid: Required<TransformInterface> = {
    xs: Math.max(0, Number(raw.grid.xs) || 0),
    sm: Math.max(0, Number(raw.grid.sm) || 0),
    md: Math.max(0, Number(raw.grid.md) || 0),
    lg: Math.max(0, Number(raw.grid.lg) || 0),
    xl: Math.max(0, Number(raw.grid.xl ?? raw.grid.lg) || 0),
    all: Math.max(0, Number(raw.grid.all) || 0),
  };

  const layoutType: CarouselLayoutType = grid.all !== 0 ? 'fixed' : 'responsive';

  if (layoutType === 'responsive') {
    for (const key of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
      if (grid[key] <= 0) {
        throw new Error(`FupuCarouselConfig.grid.${key} must be > 0 for responsive layout.`);
      }
    }
  } else if (grid.all <= 0) {
    throw new Error('FupuCarouselConfig.grid.all must be > 0 for fixed layout.');
  }

  const vertical = new Vertical();
  if (raw.vertical?.enabled) {
    vertical.enabled = true;
    vertical.height = toPositiveInt(raw.vertical.height, 400);
  }

  const speed =
    typeof raw.speed === 'number' && Number.isFinite(raw.speed) && raw.speed >= 0
      ? raw.speed
      : 400;

  return {
    grid,
    gridBreakpoints: breakpoints,
    slide: typeof raw.slide === 'number' && raw.slide > 0 ? Math.floor(raw.slide) : null,
    speed,
    interval: normalizeInterval(raw.interval),
    animation: raw.animation === 'lazy' ? 'lazy' : null,
    pointVisible: raw.point?.visible ?? true,
    hideOnSingleSlide: !!raw.point?.hideOnSingleSlide,
    type: raw.type ?? null,
    load: typeof raw.load === 'number' && raw.load >= 0 ? Math.floor(raw.load) : null,
    custom: raw.custom === 'banner' ? 'banner' : null,
    loop: !!raw.loop,
    touch: !!raw.touch,
    easing: raw.easing || 'cubic-bezier(0, 0, 0.2, 1)',
    RTL: !!raw.RTL,
    vertical,
    velocity: typeof raw.velocity === 'number' && Number.isFinite(raw.velocity) ? raw.velocity : 1,
    layoutType,
  };
}

export function resolveDeviceType(
  width: number,
  breakpoints: NormalizedCarouselConfig['gridBreakpoints'],
  layoutType: CarouselLayoutType,
): DeviceType {
  if (layoutType === 'fixed') {
    return 'all';
  }
  if (width >= breakpoints.xl) {
    return 'xl';
  }
  if (width >= breakpoints.lg) {
    return 'lg';
  }
  if (width >= breakpoints.md) {
    return 'md';
  }
  if (width >= breakpoints.sm) {
    return 'sm';
  }
  return 'xs';
}

export function resolveItemsPerView(
  config: NormalizedCarouselConfig,
  deviceType: DeviceType,
  carouselWidth: number,
): number {
  if (config.layoutType === 'fixed') {
    return Math.max(1, Math.trunc(carouselWidth / config.grid.all));
  }
  return Math.max(1, config.grid[deviceType] || config.grid.xs);
}

export function createDefaultTransform(): Transform {
  return new Transform();
}
