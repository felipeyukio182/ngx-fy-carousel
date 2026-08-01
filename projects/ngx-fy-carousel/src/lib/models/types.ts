export type DeviceType = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'all';
export type ButtonVisible = 'disabled' | 'hide';
export type Custom = 'banner';
export type Animate = 'lazy';
export type CarouselLayoutType = 'fixed' | 'responsive';

export interface TransformInterface {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl?: number;
  all: number;
}

export class Transform implements TransformInterface {
  constructor(
    public xs = 0,
    public sm = 0,
    public md = 0,
    public lg = 0,
    public all = 0,
    public xl = 0,
  ) {}
}

/** @deprecated Prefer `Transform`. Kept for ngu-carousel migration familiarity. */
export class Transfrom extends Transform {}

export interface BreakpointsInterface {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

/**
 * Default values: {sm: 768, md: 992, lg: 1200, xl: 1200}
 */
export class Breakpoints implements BreakpointsInterface {
  constructor(
    public sm = 768,
    public md = 992,
    public lg = 1200,
    public xl = 1200,
  ) {}
}

export class ItemsControl {
  start = 0;
  end = 0;
}

export class Vertical {
  enabled = false;
  height = 0;
}

export class NgxFyButton {
  visibility?: ButtonVisible;
  elastic?: number;
}

export class TouchState {
  active = false;
  swipe = '';
  velocity = 0;
}

export interface Point {
  visible: boolean;
  hideOnSingleSlide?: boolean;
}

export interface CarouselInterval {
  timing: number;
  initialDelay?: number;
}

export class NgxFyCarouselConfig {
  grid!: TransformInterface;
  gridBreakpoints?: BreakpointsInterface;
  slide?: number;
  speed?: number;
  interval?: CarouselInterval | number;
  animation?: Animate;
  point?: Point;
  type?: string;
  load?: number;
  custom?: Custom;
  loop?: boolean;
  touch?: boolean;
  easing?: string;
  RTL?: boolean;
  button?: NgxFyButton;
  vertical?: Vertical;
  velocity?: number;
}

export interface NgxFyCarouselOutletContext<T> {
  $implicit: T;
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
  animate?: { value: boolean; params: { distance: number } };
}

export function createOutletContext<T>(data: T, index = 0): NgxFyCarouselOutletContext<T> {
  return {
    $implicit: data,
    index,
    count: 0,
    first: false,
    last: false,
    even: false,
    odd: false,
  };
}
