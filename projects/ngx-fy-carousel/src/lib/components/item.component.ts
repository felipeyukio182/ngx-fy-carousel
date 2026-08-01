import { Component } from '@angular/core';

@Component({
  selector: 'ngx-fy-carousel-item',
  standalone: true,
  template: `<ng-content />`,
  host: {
    class: 'item',
  },
})
export class NgxFyCarouselItemComponent {}
