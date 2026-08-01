import { Component, signal } from '@angular/core';
import {
  NgxFyCarousel,
  NgxFyCarouselConfig,
  NgxFyCarouselDefDirective,
  NgxFyCarouselItemComponent,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPrevDirective,
} from 'ngx-fy-carousel';

@Component({
  selector: 'app-vertical-page',
  imports: [
    NgxFyCarousel,
    NgxFyCarouselItemComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
  ],
  template: `
    <h1>Vertical carousel</h1>
    <ngx-fy-carousel [inputs]="config" [dataSource]="items()">
      <ngx-fy-carousel-item *ngxFyCarouselDef="let item">
        <div class="row">{{ item }}</div>
      </ngx-fy-carousel-item>
      <button type="button" class="nav top" ngxFyCarouselPrev>▲</button>
      <button type="button" class="nav bottom" ngxFyCarouselNext>▼</button>
    </ngx-fy-carousel>
  `,
  styles: `
    .row {
      display: grid;
      place-items: center;
      height: 100%;
      background: #e0e7ff;
      font-size: 1.75rem;
      font-weight: 700;
      border-bottom: 1px solid #c7d2fe;
    }
    .nav {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      border: 0;
      border-radius: 999px;
      width: 40px;
      height: 40px;
      background: #fff;
      box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
      z-index: 2;
    }
    .top { top: 8px; }
    .bottom { bottom: 8px; }
  `,
})
export class VerticalPage {
  items = signal(['One', 'Two', 'Three', 'Four', 'Five', 'Six']);
  config: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
    slide: 1,
    speed: 400,
    touch: true,
    loop: true,
    interval: 3500,
    vertical: { enabled: true, height: 360 },
  };
}
