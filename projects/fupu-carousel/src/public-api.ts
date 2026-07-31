/*
 * Public API Surface of fupu-carousel
 */

export type {
  Animate,
  BreakpointsInterface,
  ButtonVisible,
  CarouselInterval,
  CarouselLayoutType,
  Custom,
  DeviceType,
  FupuCarouselOutletContext,
  Point,
  TransformInterface,
} from './lib/models/types';

export {
  Breakpoints,
  FupuButton,
  FupuCarouselConfig,
  ItemsControl,
  TouchState,
  Transform,
  Transfrom,
  Vertical,
  createOutletContext,
} from './lib/models/types';

export { FupuCarouselStore } from './lib/models/store';

export type { NormalizedCarouselConfig } from './lib/models/normalize';
export {
  normalizeConfig,
  resolveDeviceType,
  resolveItemsPerView,
} from './lib/models/normalize';

export { FupuCarousel } from './lib/carousel/carousel.component';
export { FupuCarouselItemComponent } from './lib/components/item.component';
export { FupuCarouselTileComponent } from './lib/components/tile.component';

export {
  FupuCarouselDefDirective,
  FupuCarouselItemDirective,
  FupuCarouselNextDirective,
  FupuCarouselOutlet,
  FupuCarouselPointDirective,
  FupuCarouselPrevDirective,
} from './lib/directives/carousel.directives';
