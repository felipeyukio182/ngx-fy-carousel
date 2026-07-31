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
  selector: 'app-nested-page',
  imports: [
    FupuCarousel,
    FupuCarouselTileComponent,
    FupuCarouselDefDirective,
    FupuCarouselNextDirective,
    FupuCarouselPrevDirective,
  ],
  template: `
    <h1>Nested carousels</h1>
    <fupu-carousel [inputs]="outerConfig" [dataSource]="groups()">
      <fupu-carousel-tile *fupuCarouselDef="let group">
        <h3>{{ group.title }}</h3>
        <fupu-carousel [inputs]="innerConfig" [dataSource]="group.items">
          <fupu-carousel-tile *fupuCarouselDef="let item">
            <div class="mini">{{ item }}</div>
          </fupu-carousel-tile>
          <button type="button" class="nav left" fupuCarouselPrev>‹</button>
          <button type="button" class="nav right" fupuCarouselNext>›</button>
        </fupu-carousel>
      </fupu-carousel-tile>
      <button type="button" class="nav left outer" fupuCarouselPrev>‹</button>
      <button type="button" class="nav right outer" fupuCarouselNext>›</button>
    </fupu-carousel>
  `,
  styles: `
    h3 { margin: 0 0 0.5rem; }
    .mini {
      min-height: 120px;
      background: #fce7f3;
      border-radius: 10px;
      display: grid;
      place-items: center;
      font-weight: 700;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      border: 0;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
      z-index: 2;
    }
    .left { left: 0; }
    .right { right: 0; }
    .outer { top: 24px; transform: none; }
  `,
})
export class NestedPage {
  groups = signal([
    { title: 'Group A', items: ['A1', 'A2', 'A3', 'A4'] },
    { title: 'Group B', items: ['B1', 'B2', 'B3', 'B4'] },
    { title: 'Group C', items: ['C1', 'C2', 'C3', 'C4'] },
  ]);

  outerConfig: FupuCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
    slide: 1,
    speed: 400,
    touch: true,
  };

  innerConfig: FupuCarouselConfig = {
    grid: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, all: 0 },
    slide: 1,
    speed: 300,
    touch: true,
  };
}
