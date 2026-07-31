import { Component, signal } from '@angular/core';
import {
  FupuCarousel,
  FupuCarouselConfig,
  FupuCarouselDefDirective,
  FupuCarouselNextDirective,
  FupuCarouselPrevDirective,
  FupuCarouselTileComponent,
} from 'fupu-carousel';

@Component({
  selector: 'app-rtl-page',
  imports: [
    FupuCarousel,
    FupuCarouselTileComponent,
    FupuCarouselDefDirective,
    FupuCarouselNextDirective,
    FupuCarouselPrevDirective,
  ],
  template: `
    <h1>RTL carousel</h1>
    <fupu-carousel #carousel [inputs]="config" [dataSource]="items()">
      <fupu-carousel-tile *fupuCarouselDef="let item">
        <div class="card">{{ item }}</div>
      </fupu-carousel-tile>
      <button type="button" class="nav left" fupuCarouselPrev>‹</button>
      <button type="button" class="nav right" fupuCarouselNext>›</button>
    </fupu-carousel>
  `,
  styles: `
    .card {
      min-height: 160px;
      background: #fef3c7;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 2px 10px rgb(0 0 0 / 20%);
      z-index: 2;
    }
    .left { left: 0; }
    .right { right: 0; }
  `,
})
export class RtlPage {
  items = signal(['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']);
  config: FupuCarouselConfig = {
    grid: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4, all: 0 },
    slide: 1,
    speed: 350,
    touch: true,
    RTL: true,
  };
}
