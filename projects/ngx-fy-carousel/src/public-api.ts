/*
 * Public API Surface of ngx-fy-carousel
 */

export type {
  Animate,
  BreakpointsInterface,
  ButtonVisible,
  CarouselInterval,
  CarouselLayoutType,
  Custom,
  DeviceType,
  NgxFyCarouselOutletContext,
  Point,
  TransformInterface,
} from './lib/models/types';

export {
  Breakpoints,
  NgxFyButton,
  NgxFyCarouselConfig,
  ItemsControl,
  TouchState,
  Transform,
  Transfrom,
  Vertical,
  createOutletContext,
} from './lib/models/types';

export { NgxFyCarouselStore } from './lib/models/store';

export type { NormalizedCarouselConfig } from './lib/models/normalize';
export {
  normalizeConfig,
  resolveDeviceType,
  resolveItemsPerView,
} from './lib/models/normalize';

export { NgxFyCarousel } from './lib/carousel/carousel.component';
export { NgxFyCarouselItemComponent } from './lib/components/item.component';
export { NgxFyCarouselTileComponent } from './lib/components/tile.component';

export {
  NgxFyCarouselDefDirective,
  NgxFyCarouselItemDirective,
  NgxFyCarouselNextDirective,
  NgxFyCarouselOutlet,
  NgxFyCarouselPointDirective,
  NgxFyCarouselPrevDirective,
} from './lib/directives/carousel.directives';
