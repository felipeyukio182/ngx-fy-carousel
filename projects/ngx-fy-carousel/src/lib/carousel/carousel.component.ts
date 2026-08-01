import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EmbeddedViewRef,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  NgIterable,
  NgZone,
  Renderer2,
  TrackByFunction,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { EMPTY, Subject, fromEvent, interval, merge, timer } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import {
  NgxFyCarouselDefDirective,
  NgxFyCarouselOutlet,
} from '../directives/carousel.directives';
import {
  NormalizedCarouselConfig,
  normalizeConfig,
  resolveDeviceType,
  resolveItemsPerView,
} from '../models/normalize';
import {
  clampSlideIndex,
  computePointCount,
  computePointNumbers,
  pointToSlideIndex,
  shouldEmitCarouselLoad,
  slideToActivePoint,
} from '../models/pagination';
import { NgxFyCarouselStore } from '../models/store';
import {
  NgxFyCarouselConfig,
  NgxFyCarouselOutletContext,
  createOutletContext,
} from '../models/types';
import { IS_BROWSER, NGX_FY_CAROUSEL_NAV } from '../tokens';
import { observeIntersection, observeResize, observeVisibility } from './observers';
import { attachPointerGestures } from './pointer-gestures';

type DirectionSymbol = '' | '-';
type NgxFyCarouselDataSource<T, U> = (U & NgIterable<T>) | null | undefined;

declare const ngDevMode: boolean;
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || ngDevMode;

@Component({
  selector: 'ngx-fy-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxFyCarouselOutlet],
  providers: [{ provide: NGX_FY_CAROUSEL_NAV, useExisting: NgxFyCarousel }],
  host: {
    '[class.banner]': 'normalized()?.custom === "banner"',
    '[class.ngxfyrtl]': 'RTL && !vertical.enabled',
    '[class.ngxfycarouselPointDefault]': 'normalized()?.pointVisible',
  },
})
export class NgxFyCarousel<T, U extends NgIterable<T> = NgIterable<T>> extends NgxFyCarouselStore {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly differs = inject(IterableDiffers);
  private readonly isBrowser = inject(IS_BROWSER);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly activePoint = signal(0);
  readonly pointNumbers = signal<number[]>([]);

  readonly inputs = input.required<NgxFyCarouselConfig>();
  readonly carouselLoad = output<number>();
  readonly onMove = output<this>();

  private readonly defDirectives = contentChildren(NgxFyCarouselDefDirective);
  private readonly nodeOutlet = viewChild(NgxFyCarouselOutlet);
  readonly carouselMain = viewChild.required('ngxfycarousel', { read: ElementRef });
  readonly itemsContainer = viewChild.required('ngxFyItemsContainer', { read: ElementRef });
  readonly touchContainer = viewChild.required('touchContainer', { read: ElementRef });

  readonly dataSource = input.required({
    transform: (v: NgxFyCarouselDataSource<T, U>) => v || ([] as never),
  });

  readonly trackBy = input<TrackByFunction<T>>();
  readonly trackByFn = computed(() => {
    const fn = this.trackBy();
    if (NG_DEV_MODE && fn != null && typeof fn !== 'function' && console?.warn) {
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    return fn || ((_index: number, item: T) => item);
  });

  private readonly normalizedSignal = signal<NormalizedCarouselConfig | null>(null);
  readonly normalized = this.normalizedSignal.asReadonly();

  private dataDiffer: IterableDiffer<T> | null = null;
  private lastTrackBy: TrackByFunction<T> | null = null;
  private pointIndex = 1;
  private withAnimation = true;
  private directionSymbol: DirectionSymbol = '-';
  private readonly intervalController$ = new Subject<number>();
  private autoplayPaused = false;
  private pageVisible = true;
  private inViewport = true;
  private lastEmittedLoadSlide: number | null = null;
  private detachPointer: (() => void) | null = null;
  private detachResize: (() => void) | null = null;
  private detachIntersection: (() => void) | null = null;
  private detachVisibility: (() => void) | null = null;
  private autoplayStop: (() => void) | null = null;
  private initialized = false;
  private styleElement: HTMLStyleElement | null = null;
  private styleSelector = '';

  constructor() {
    super();

    afterNextRender({
      write: () => this.bootstrap(),
    });

    effect(() => {
      const config = this.inputs();
      untracked(() => {
        try {
          const normalized = normalizeConfig(config);
          this.normalizedSignal.set(normalized);
          this.applyNormalizedConfig(normalized);
          if (this.initialized) {
            this.recalculateLayout(true);
            this.setupPointerGestures();
            this.setupAutoplay();
          }
        } catch (error) {
          if (NG_DEV_MODE) {
            console.error(error);
          }
        }
      });
    });

    effect(() => {
      const trackBy = this.trackByFn();
      const data = this.dataSource();
      const defs = this.defDirectives();
      untracked(() => this.syncData(data, trackBy, defs.length));
    });

    this.destroyRef.onDestroy(() => {
      this.detachPointer?.();
      this.detachResize?.();
      this.detachIntersection?.();
      this.detachVisibility?.();
      this.autoplayStop?.();
      this.intervalController$.complete();
      this.styleElement?.remove();
      this.styleElement = null;
    });
  }

  reset(withoutAnimation?: boolean): void {
    if (withoutAnimation) {
      this.withAnimation = false;
    }
    this.moveTo(0);
    this.refreshPoints();
  }

  moveTo(slide: number, withoutAnimation?: boolean): void {
    if (withoutAnimation) {
      this.withAnimation = false;
    }
    if (!Number.isFinite(slide) || slide < 0 || slide >= this.pointIndex) {
      this.withAnimation = true;
      return;
    }
    if (this.activePoint() === slide) {
      this.withAnimation = true;
      return;
    }

    const itemCount = this.itemCount();
    const target = pointToSlideIndex(
      slide,
      this.pointIndex,
      this.slideItems,
      itemCount,
      this.items,
    );
    const direction = this.currentSlide < target ? 1 : 0;

    if (slide === 0) {
      this.setEdgeFlags(true, false);
    } else if (slide === this.pointIndex - 1) {
      this.setEdgeFlags(false, true);
    } else {
      this.setEdgeFlags(false, false);
    }

    this.scrollTo(direction, target, this.speed);
  }

  private bootstrap(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    const config = this.normalizedSignal();
    if (config) {
      this.applyNormalizedConfig(config);
    }

    // Sync only if the outlet was unavailable during the first effect pass.
    const outlet = this.nodeOutlet();
    if (outlet && outlet.viewContainer.length === 0) {
      this.dataDiffer = null;
      this.syncData(this.dataSource(), this.trackByFn(), this.defDirectives().length);
    }
    this.recalculateLayout(true);

    if (this.isBrowser) {
      this.setupObservers();
      this.setupPointerGestures();
      this.setupAutoplay();
    }
  }

  private applyNormalizedConfig(config: NormalizedCarouselConfig): void {
    this.type = config.layoutType;
    this.loop = config.loop;
    this.easing = config.easing;
    this.touch.active = config.touch;
    this.RTL = config.RTL;
    this.interval = config.interval ?? undefined;
    this.velocity = config.velocity;
    this.vertical = { ...config.vertical };
    this.point = config.pointVisible;
    this.directionSymbol = this.RTL ? '' : '-';
    this.speed = config.speed;

    this.host.nativeElement.style.setProperty('--ngx-fy-easing', config.easing);
    this.host.nativeElement.style.setProperty('--ngx-fy-speed', `${config.speed}ms`);
    this.host.nativeElement.style.setProperty('--ngx-fy-dir', this.RTL ? '1' : '-1');

    if (config.vertical.enabled) {
      this.host.nativeElement.style.setProperty(
        '--ngx-fy-vertical-height',
        `${config.vertical.height}px`,
      );
      if (this.initialized) {
        this.renderer.setStyle(
          this.carouselMain().nativeElement,
          'height',
          `${config.vertical.height}px`,
        );
      }
    }

    // Match ngu-carousel: item widths come from injected @media rules so the
    // browser can switch breakpoints without waiting for JS measure.
    this.updateItemStyles(config);
  }

  private ensureToken(): string {
    if (!this.token) {
      this.token = this.generateId();
      this.renderer.addClass(this.host.nativeElement, this.token);
    }
    return this.token;
  }

  private updateItemStyles(config: NormalizedCarouselConfig): void {
    const token = this.ensureToken();
    this.styleSelector =
      `.${token} > .ngxfycarousel > .ngx-fy-container > .ngx-fy-touch-container > .ngxfycarousel-items`;

    let css = '';
    if (config.animation === 'lazy') {
      css += `${this.styleSelector} > .item { transition: transform .6s ease; }`;
    }

    const bp = config.gridBreakpoints;
    const cols = {
      xs: Math.max(1, config.grid.xs),
      sm: Math.max(1, config.grid.sm),
      md: Math.max(1, config.grid.md),
      lg: Math.max(1, config.grid.lg),
      xl: Math.max(1, config.grid.xl),
    };
    if (config.vertical.enabled) {
      const xs = `${this.styleSelector} > .item { height: ${config.vertical.height / cols.xs}px; }`;
      const sm = `${this.styleSelector} > .item { height: ${config.vertical.height / cols.sm}px; }`;
      const md = `${this.styleSelector} > .item { height: ${config.vertical.height / cols.md}px; }`;
      const lg = `${this.styleSelector} > .item { height: ${config.vertical.height / cols.lg}px; }`;
      const xl = `${this.styleSelector} > .item { height: ${config.vertical.height / cols.xl}px; }`;
      css += `
        @media (max-width: ${bp.sm - 1}px) { ${xs} }
        @media (min-width: ${bp.sm}px) { ${sm} }
        @media (min-width: ${bp.md}px) { ${md} }
        @media (min-width: ${bp.lg}px) { ${lg} }
        @media (min-width: ${bp.xl}px) { ${xl} }
      `;
    } else if (config.layoutType === 'responsive') {
      const xsFactor = config.type === 'mobile' ? 95 : 100;
      const xs = `${this.styleSelector} > .item { flex: 0 0 ${xsFactor / cols.xs}%; width: ${xsFactor / cols.xs}%; }`;
      const sm = `${this.styleSelector} > .item { flex: 0 0 ${100 / cols.sm}%; width: ${100 / cols.sm}%; }`;
      const md = `${this.styleSelector} > .item { flex: 0 0 ${100 / cols.md}%; width: ${100 / cols.md}%; }`;
      const lg = `${this.styleSelector} > .item { flex: 0 0 ${100 / cols.lg}%; width: ${100 / cols.lg}%; }`;
      const xl = `${this.styleSelector} > .item { flex: 0 0 ${100 / cols.xl}%; width: ${100 / cols.xl}%; }`;
      css += `
        @media (max-width: ${bp.sm - 1}px) { ${xs} }
        @media (min-width: ${bp.sm}px) { ${sm} }
        @media (min-width: ${bp.md}px) { ${md} }
        @media (min-width: ${bp.lg}px) { ${lg} }
        @media (min-width: ${bp.xl}px) { ${xl} }
      `;
    } else {
      css += `${this.styleSelector} > .item { flex: 0 0 ${config.grid.all}px; width: ${config.grid.all}px; }`;
    }

    this.writeStyleElement(css);
  }

  private writeStyleElement(css: string): void {
    if (!this.styleElement) {
      this.styleElement = this.renderer.createElement('style') as HTMLStyleElement;
      this.renderer.appendChild(this.host.nativeElement, this.styleElement);
    }
    this.renderer.setProperty(this.styleElement, 'textContent', css);
  }

  private setupObservers(): void {
    this.detachResize?.();
    this.detachIntersection?.();
    this.detachVisibility?.();

    this.detachResize = observeResize(this.carouselMain().nativeElement, () => {
      this.ngZone.run(() => {
        this.recalculateLayout(true);
      });
    });

    this.detachIntersection = observeIntersection(this.host.nativeElement, visible => {
      this.ngZone.run(() => {
        this.inViewport = visible;
        this.intervalController$.next(visible && this.pageVisible && !this.autoplayPaused ? 1 : 0);
      });
    });

    this.detachVisibility = observeVisibility(visible => {
      this.ngZone.run(() => {
        this.pageVisible = visible;
        this.intervalController$.next(visible && this.inViewport && !this.autoplayPaused ? 1 : 0);
      });
    });
  }

  private setupPointerGestures(): void {
    this.detachPointer?.();
    this.detachPointer = null;

    const config = this.normalizedSignal();
    if (!this.isBrowser || !config?.touch) {
      return;
    }

    const horizontal = !config.vertical.enabled;
    this.detachPointer = attachPointerGestures(
      this.touchContainer().nativeElement,
      {
        onPanStart: () => {
          this.carouselWidth = this.itemsContainer().nativeElement.offsetWidth;
          this.touchTransform = this.currentOffsetValue();
          this.dexVal = 0;
          this.setTransition('none');
        },
        onPanMove: (deltaX, deltaY) => {
          const delta = Math.abs(horizontal ? deltaX : deltaY);
          const direction =
            horizontal
              ? deltaX < 0
                ? 'panleft'
                : 'panright'
              : deltaY < 0
                ? 'panleft'
                : 'panright';
          this.handleTouch(direction, delta);
        },
        onPanEnd: (velocityX, velocityY) => {
          const velocity = horizontal ? velocityX : velocityY;
          if (Math.abs(velocity) >= this.velocity) {
            this.touch.velocity = velocity;
            let direction = 0;
            if (!this.RTL) {
              direction = this.touch.swipe === 'panright' ? 0 : 1;
            } else {
              direction = this.touch.swipe === 'panright' ? 1 : 0;
            }
            this.scrollOne(direction);
          } else {
            this.dexVal = 0;
            this.setTransition(`transform 324ms cubic-bezier(0, 0, 0.2, 1)`);
            this.applyOffset(this.currentSlide, false);
          }
        },
      },
      { horizontal },
    );
  }

  private setupAutoplay(): void {
    this.autoplayStop?.();
    this.autoplayStop = null;

    const config = this.normalizedSignal();
    if (!config?.interval || !config.loop || !this.isBrowser) {
      return;
    }

    const container = this.carouselMain().nativeElement;
    const mapToZero = map(() => 0);
    const mapToOne = map(() => 1);

    const play$ = fromEvent(container, 'mouseleave').pipe(mapToOne);
    const pause$ = fromEvent(container, 'mouseenter').pipe(mapToZero);
    // Corrected vs upstream: touchstart pauses, touchend resumes.
    const touchPause$ = fromEvent(container, 'touchstart').pipe(mapToZero);
    const touchPlay$ = fromEvent(container, 'touchend').pipe(mapToOne);
    const interval$ = interval(config.interval.timing).pipe(mapToOne);
    const initialDelay = config.interval.initialDelay || 0;

    const carouselInterval$ = merge(
      play$,
      touchPlay$,
      pause$,
      touchPause$,
      this.intervalController$,
    ).pipe(
      startWith(this.inViewport && this.pageVisible ? 1 : 0),
      switchMap(val => {
        this.autoplayPaused = val === 0;
        return val ? interval$ : EMPTY;
      }),
    );

    const sub = timer(initialDelay)
      .pipe(switchMap(() => carouselInterval$))
      .subscribe(() => this.scrollOne(1));
    this.autoplayStop = () => sub.unsubscribe();
  }

  private syncData(
    data: NgIterable<T>,
    trackBy: TrackByFunction<T>,
    _defsCount: number,
  ): void {
    const outlet = this.nodeOutlet();
    if (!outlet) {
      return;
    }

    if (!this.dataDiffer || this.lastTrackBy !== trackBy) {
      this.dataDiffer = this.differs.find([]).create(trackBy);
      this.lastTrackBy = trackBy;
    }

    const changes = this.dataDiffer.diff(data);
    if (!changes) {
      return;
    }

    const list = Array.from(data as Iterable<T>);
    const viewContainer = outlet.viewContainer;

    changes.forEachOperation(
      (
        item: IterableChangeRecord<T>,
        adjustedPreviousIndex: number | null,
        currentIndex: number | null,
      ) => {
        if (item.previousIndex == null && currentIndex != null) {
          const node = this.getNodeDef(list[currentIndex], currentIndex);
          if (!node?.template) {
            return;
          }
          const context = createOutletContext(list[currentIndex], currentIndex);
          viewContainer.createEmbeddedView(node.template, context, currentIndex);
        } else if (currentIndex == null && adjustedPreviousIndex != null) {
          viewContainer.remove(adjustedPreviousIndex);
        } else if (currentIndex != null && adjustedPreviousIndex != null) {
          const view = viewContainer.get(adjustedPreviousIndex);
          if (view) {
            viewContainer.move(view, currentIndex);
          }
        }
      },
    );

    changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
      if (record.currentIndex == null) {
        return;
      }
      const view = viewContainer.get(record.currentIndex) as EmbeddedViewRef<
        NgxFyCarouselOutletContext<T>
      > | null;
      if (view) {
        view.context.$implicit = record.item;
      }
    });

    this.updateItemIndexContext();
    if (this.initialized) {
      this.recalculateLayout();
    }
  }

  private updateItemIndexContext(): void {
    const outlet = this.nodeOutlet();
    if (!outlet) {
      return;
    }
    const viewContainer = outlet.viewContainer;
    for (let i = 0, count = viewContainer.length; i < count; i++) {
      const viewRef = viewContainer.get(i) as EmbeddedViewRef<NgxFyCarouselOutletContext<T>> | null;
      if (!viewRef) {
        continue;
      }
      const context = viewRef.context;
      context.count = count;
      context.first = i === 0;
      context.last = i === count - 1;
      context.even = i % 2 === 0;
      context.odd = !context.even;
      context.index = i;
    }
  }

  private getNodeDef(data: T, index: number): NgxFyCarouselDefDirective<T> | undefined {
    const defs = this.defDirectives();
    if (defs.length === 1) {
      return defs[0] as NgxFyCarouselDefDirective<T>;
    }
    return defs.find(def => !!def.when?.(index, data)) as NgxFyCarouselDefDirective<T> | undefined;
  }

  private recalculateLayout(snap = false): void {
    const config = this.normalizedSignal();
    if (!config) {
      return;
    }

    if (snap) {
      this.setTransition('none');
    }

    const breakpoints = config.gridBreakpoints;
    this.deviceWidth = this.isBrowser ? window.innerWidth : breakpoints.xl;
    this.carouselWidth = this.carouselMain().nativeElement.offsetWidth || this.deviceWidth;

    this.deviceType = resolveDeviceType(this.deviceWidth, breakpoints, config.layoutType);
    this.items = resolveItemsPerView(config, this.deviceType, this.carouselWidth);
    this.itemWidth =
      config.layoutType === 'fixed' ? config.grid.all : this.carouselWidth / this.items;

    this.slideItems = config.slide != null ? Math.min(config.slide, this.items) : this.items;
    this.slideItems = Math.max(1, this.slideItems);
    this.load = config.load != null ? Math.max(config.load, this.slideItems) : this.slideItems;
    this.speed = config.speed;
    this.itemLength = this.itemCount();

    this.currentSlide = clampSlideIndex(this.currentSlide, this.itemLength, this.items);
    this.refreshPoints();
    this.applyOffset(this.currentSlide, false);
  }

  private refreshPoints(): void {
    const config = this.normalizedSignal();
    this.pointIndex = computePointCount(this.itemCount(), this.items, this.slideItems);
    this.pointNumbers.set(
      computePointNumbers(this.pointIndex, !!config?.hideOnSingleSlide),
    );
    this.activePoint.set(slideToActivePoint(this.currentSlide, this.slideItems));

    if (this.pointIndex <= 1) {
      this.setEdgeFlags(true, true);
    } else if (this.currentSlide === 0 && !this.loop) {
      this.setEdgeFlags(true, false);
    } else if (this.currentSlide >= this.itemCount() - this.items && !this.loop) {
      this.setEdgeFlags(false, true);
    } else {
      this.setEdgeFlags(false, false);
    }
  }

  /** Navigate one step. `0` = previous, `1` = next. */
  scrollOne(btn: number): void {
    let itemSpeed = this.speed;
    let currentSlide = 0;
    let touchMove = Math.ceil(this.dexVal / Math.max(1, this.itemWidth));
    touchMove = Number.isFinite(touchMove) ? touchMove : 0;
    this.applyOffset(this.currentSlide, false);

    if (this.pointIndex === 1) {
      return;
    }

    if (btn === 0 && ((!this.loop && !this.isFirst()) || this.loop)) {
      const moveSlide = this.currentSlide;
      if (this.currentSlide === 0) {
        currentSlide = Math.max(0, this.itemCount() - this.items);
        itemSpeed = 400;
        this.setEdgeFlags(false, true);
      } else if (this.slideItems >= moveSlide) {
        currentSlide = 0;
        this.setEdgeFlags(true, false);
      } else {
        this.setEdgeFlags(false, false);
        currentSlide =
          touchMove > this.slideItems
            ? this.currentSlide - touchMove
            : this.currentSlide - this.slideItems;
        if (touchMove > this.slideItems) {
          itemSpeed = 200;
        }
      }
      this.scrollTo(btn, clampSlideIndex(currentSlide, this.itemCount(), this.items), itemSpeed);
      return;
    }

    if (btn === 1 && ((!this.loop && !this.isLast()) || this.loop)) {
      if (this.itemCount() <= this.currentSlide + this.items + this.slideItems && !this.isLast()) {
        currentSlide = Math.max(0, this.itemCount() - this.items);
        this.setEdgeFlags(false, true);
      } else if (this.isLast()) {
        currentSlide = 0;
        itemSpeed = 400;
        this.setEdgeFlags(true, false);
      } else {
        this.setEdgeFlags(false, false);
        if (touchMove > this.slideItems) {
          currentSlide = this.currentSlide + this.slideItems + (touchMove - this.slideItems);
          itemSpeed = 200;
        } else {
          currentSlide = this.currentSlide + this.slideItems;
        }
      }
      this.scrollTo(btn, clampSlideIndex(currentSlide, this.itemCount(), this.items), itemSpeed);
    }
  }

  private scrollTo(btn: number, currentSlide: number, itemSpeed: number): void {
    if (this.dexVal !== 0) {
      const val = Math.abs(this.touch.velocity) || 1;
      let somt = Math.floor((this.dexVal / val / this.dexVal) * (this.deviceWidth - this.dexVal));
      somt = somt > itemSpeed ? itemSpeed : somt;
      itemSpeed = somt < 200 ? 200 : somt;
      this.dexVal = 0;
    }

    const config = this.normalizedSignal();
    if (this.withAnimation) {
      this.setTransition(`transform ${itemSpeed}ms ${config?.easing ?? this.easing}`);
      if (config?.animation === 'lazy') {
        this.animateItems(
          btn,
          currentSlide + 1,
          currentSlide + this.items,
          itemSpeed,
          Math.abs(this.currentSlide - currentSlide),
        );
      }
    } else {
      this.setTransition('none');
    }

    this.itemLength = this.itemCount();
    this.applyOffset(currentSlide, true);
    this.currentSlide = currentSlide;
    this.onMove.emit(this);
    this.activePoint.set(slideToActivePoint(this.currentSlide, this.slideItems));
    this.emitLoadIfNeeded();
    this.withAnimation = true;
  }

  private applyOffset(slide: number, _animated: boolean): void {
    const config = this.normalizedSignal();
    if (!config) {
      return;
    }

    let offset: string;
    if (config.vertical.enabled) {
      const value = (config.vertical.height / this.items) * slide;
      this.transform[this.deviceType || 'xs'] = value;
      offset = `${value}px`;
    } else if (config.layoutType === 'responsive') {
      const value = (100 / this.items) * slide;
      this.transform[this.deviceType || 'xs'] = value;
      offset = `${value}%`;
    } else {
      const value = config.grid.all * slide;
      this.transform.all = value;
      offset = `${value}px`;
    }

    this.host.nativeElement.style.setProperty('--ngx-fy-offset', offset);
  }

  private currentOffsetValue(): number {
    const config = this.normalizedSignal();
    if (!config) {
      return 0;
    }
    if (config.vertical.enabled) {
      return (config.vertical.height / this.items) * this.currentSlide;
    }
    if (config.layoutType === 'responsive') {
      return (100 / this.items) * this.currentSlide;
    }
    return config.grid.all * this.currentSlide;
  }

  private handleTouch(direction: string, delta: number): void {
    let valt = delta - this.dexVal;
    const config = this.normalizedSignal();
    valt =
      this.type === 'responsive'
        ? (Math.abs(delta - this.dexVal) /
            (config?.vertical.enabled ? config.vertical.height : this.carouselWidth)) *
          100
        : valt;
    this.dexVal = delta;
    this.touch.swipe = direction;

    const condition = this.RTL ? 'panright' : 'panleft';
    this.touchTransform =
      direction === condition ? valt + this.touchTransform : this.touchTransform - valt;
    if (this.touchTransform < 0) {
      this.touchTransform = 0;
    }

    const maxOffset = this.maxTouchOffset();
    if (this.touchTransform > maxOffset) {
      this.touchTransform = maxOffset;
    }

    const unit = this.type === 'responsive' ? '%' : 'px';
    this.host.nativeElement.style.setProperty('--ngx-fy-offset', `${this.touchTransform}${unit}`);
  }

  private maxTouchOffset(): number {
    const config = this.normalizedSignal();
    if (!config) {
      return 0;
    }
    const maxSlide = Math.max(0, this.itemCount() - this.items);
    if (config.vertical.enabled) {
      return (config.vertical.height / this.items) * maxSlide;
    }
    if (config.layoutType === 'responsive') {
      return (100 / this.items) * maxSlide;
    }
    return config.grid.all * maxSlide;
  }

  private animateItems(
    direction: number,
    start: number,
    end: number,
    speed: number,
    length: number,
  ): void {
    const outlet = this.nodeOutlet();
    if (!outlet) {
      return;
    }
    const viewContainer = outlet.viewContainer;
    let val = length < 5 ? length : 5;
    val = val === 1 ? 3 : val;
    const indexes: number[] = [];

    if (direction === 1) {
      for (let i = start - 1; i < end; i++) {
        const viewRef = viewContainer.get(i) as EmbeddedViewRef<NgxFyCarouselOutletContext<T>> | null;
        if (!viewRef) {
          continue;
        }
        indexes.push(i);
        val *= 2;
        viewRef.context.animate = { value: true, params: { distance: val } };
      }
    } else {
      for (let i = end - 1; i >= start - 1; i--) {
        const viewRef = viewContainer.get(i) as EmbeddedViewRef<NgxFyCarouselOutletContext<T>> | null;
        if (!viewRef) {
          continue;
        }
        indexes.push(i);
        val *= 2;
        viewRef.context.animate = { value: true, params: { distance: -val } };
      }
    }

    if (this.isBrowser) {
      window.setTimeout(() => this.clearAnimations(indexes), speed * 0.7);
    }
  }

  private clearAnimations(indexes: number[]): void {
    const outlet = this.nodeOutlet();
    if (!outlet) {
      return;
    }
    const viewContainer = outlet.viewContainer;
    indexes.forEach(i => {
      const viewRef = viewContainer.get(i) as EmbeddedViewRef<NgxFyCarouselOutletContext<T>> | null;
      if (viewRef) {
        viewRef.context.animate = { value: false, params: { distance: 0 } };
      }
    });
  }

  private emitLoadIfNeeded(): void {
    const config = this.normalizedSignal();
    if (!config || !shouldEmitCarouselLoad(config.load, this.itemCount(), this.currentSlide, this.items)) {
      return;
    }
    if (this.lastEmittedLoadSlide === this.currentSlide) {
      return;
    }
    this.lastEmittedLoadSlide = this.currentSlide;
    this.carouselLoad.emit(this.currentSlide);
  }

  private setEdgeFlags(first: boolean, last: boolean): void {
    this.isFirst.set(first);
    this.isLast.set(last);
  }

  private setTransition(value: string): void {
    const el = this.itemsContainer()?.nativeElement;
    if (!el) {
      return;
    }
    this.renderer.setStyle(el, 'transition', value);
  }

  private itemCount(): number {
    return Array.from(this.dataSource() as Iterable<T>).length;
  }

  private generateId(): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return `ngxfycarousel${text}`;
  }

  static ngAcceptInputType_dataSource: NgxFyCarouselDataSource<any, any>;
}
