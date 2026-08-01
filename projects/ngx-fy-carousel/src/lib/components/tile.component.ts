import { Component } from '@angular/core';

@Component({
  selector: 'ngx-fy-carousel-tile',
  standalone: true,
  template: `
    <div class="tile">
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      padding: 10px;
      box-sizing: border-box;
    }

    .tile {
      box-shadow:
        0 2px 5px #00000029,
        0 2px 10px #0000001f;
    }
  `,
  host: {
    class: 'item',
  },
})
export class NgxFyCarouselTileComponent {}
