import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

@Directive({
  selector: '[ngxFyCarouselItem]',
  standalone: true,
})
export class NgxFyCarouselItemDirective {}

@Directive({
  selector: '[ngxFyCarouselNext]',
  standalone: true,
})
export class NgxFyCarouselNextDirective {}

@Directive({
  selector: '[ngxFyCarouselPrev]',
  standalone: true,
})
export class NgxFyCarouselPrevDirective {}

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
