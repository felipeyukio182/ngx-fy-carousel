import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[fupuCarouselItem]',
  standalone: true,
})
export class FupuCarouselItemDirective {}

@Directive({
  selector: '[fupuCarouselNext]',
  standalone: true,
})
export class FupuCarouselNextDirective {}

@Directive({
  selector: '[fupuCarouselPrev]',
  standalone: true,
})
export class FupuCarouselPrevDirective {}

@Directive({
  selector: '[fupuCarouselPoint]',
  standalone: true,
})
export class FupuCarouselPointDirective {}

@Directive({
  selector: '[fupuCarouselDef]',
  standalone: true,
})
export class FupuCarouselDefDirective<T = unknown> {
  readonly template = inject(TemplateRef<unknown>);

  @Input()
  when?: (index: number, nodeData: T) => boolean;
}

@Directive({
  selector: '[fupuCarouselOutlet]',
  standalone: true,
})
export class FupuCarouselOutlet {
  readonly viewContainer = inject(ViewContainerRef);
}
