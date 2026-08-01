import { signal, WritableSignal } from '@angular/core';
import {
  CarouselInterval,
  DeviceType,
  NgxFyButton,
  ItemsControl,
  TouchState,
  Transform,
  Vertical,
} from './types';

/**
 * Runtime carousel state. Public API keeps the same surface as ngu-carousel's store,
 * with signal-based isFirst/isLast.
 */
export class NgxFyCarouselStore {
  touch: TouchState = new TouchState();
  vertical: Vertical = new Vertical();
  interval?: CarouselInterval;
  transform: Transform = new Transform();
  button?: NgxFyButton;
  visibleItems?: ItemsControl;
  deviceType?: DeviceType;
  type = 'fixed';
  token = '';
  items = 0;
  load = 0;
  deviceWidth = 0;
  carouselWidth = 0;
  itemWidth = 0;
  slideItems = 0;
  itemWidthPer = 0;
  itemLength = 0;
  currentSlide = 0;
  easing = 'cubic-bezier(0, 0, 0.2, 1)';
  speed = 200;
  loop = false;
  dexVal = 0;
  touchTransform = 0;
  isEnd = false;
  readonly isFirst: WritableSignal<boolean> = signal(true);
  readonly isLast: WritableSignal<boolean> = signal(false);
  RTL = false;
  point = true;
  velocity = 1;
}
