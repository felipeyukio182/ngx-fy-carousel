import { Component } from '@angular/core';

@Component({
  selector: 'fupu-carousel-item',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'item',
  },
})
export class FupuCarouselItemComponent {}
