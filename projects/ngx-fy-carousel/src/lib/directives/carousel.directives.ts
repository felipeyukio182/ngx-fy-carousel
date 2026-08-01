import {
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';

import { NGX_FY_CAROUSEL_NAV } from '../tokens';

@Directive({
  selector: '[ngxFyCarouselItem]',
  standalone: true,
})
export class NgxFyCarouselItemDirective {}

@Directive({
  selector: '[ngxFyCarouselNext]',
  standalone: true,
})
export class NgxFyCarouselNextDirective {
  private readonly nav = inject(NGX_FY_CAROUSEL_NAV);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.nav.scrollOne(1));
  }
}

@Directive({
  selector: '[ngxFyCarouselPrev]',
  standalone: true,
})
export class NgxFyCarouselPrevDirective {
  private readonly nav = inject(NGX_FY_CAROUSEL_NAV);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    fromEvent(this.el.nativeElement, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.nav.scrollOne(0));
  }
}

@Directive({
  selector: '[ngxFyCarouselPoint]',
  standalone: true,
})
export class NgxFyCarouselPointDirective {}

@Directive({
  selector: '[ngxFyCarouselDef]',
  standalone: true,
})
export class NgxFyCarouselDefDirective<T = unknown> {
  readonly template = inject(TemplateRef<unknown>);

  @Input()
  when?: (index: number, nodeData: T) => boolean;
}

@Directive({
  selector: '[ngxFyCarouselOutlet]',
  standalone: true,
})
export class NgxFyCarouselOutlet {
  readonly viewContainer = inject(ViewContainerRef);
}
