import { Component, signal } from '@angular/core';
import {
  NgxFyCarousel,
  NgxFyCarouselConfig,
  NgxFyCarouselDefDirective,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPointDirective,
  NgxFyCarouselPrevDirective,
  NgxFyCarouselTileComponent,
} from 'ngx-fy-carousel';

@Component({
  selector: 'app-tile-page',
  imports: [
    NgxFyCarousel,
    NgxFyCarouselTileComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
    NgxFyCarouselPointDirective,
  ],
  template: `
    <h1>Tile carousel</h1>
    <p>Responsive grid with controls, points and incremental load.</p>

    <ngx-fy-carousel
      #carousel
      [inputs]="config"
      [dataSource]="items()"
      (carouselLoad)="loadMore()"
    >
      <ngx-fy-carousel-tile *ngxFyCarouselDef="let item; let i = index">
        <div class="card">{{ item }}</div>
      </ngx-fy-carousel-tile>

      <button type="button" class="nav left" ngxFyCarouselPrev [style.opacity]="carousel.isFirst() ? 0.4 : 1">
        ‹
      </button>
      <button type="button" class="nav right" ngxFyCarouselNext [style.opacity]="carousel.isLast() ? 0.4 : 1">
        ›
      </button>

      <ul class="points" ngxFyCarouselPoint>
        @for (p of carousel.pointNumbers(); track p) {
          <li [class.active]="p === carousel.activePoint()" (click)="carousel.moveTo(p)"></li>
        }
      </ul>
    </ngx-fy-carousel>
  `,
  styles: `
    .card {
      min-height: 180px;
      background: #dbeafe;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font-size: 2rem;
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
      cursor: pointer;
    }
    .left { left: 0; }
    .right { right: 0; }
    .points {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      margin: 0;
    }
    .points li {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: #94a3b8;
      cursor: pointer;
    }
    .points li.active {
      background: #1d4ed8;
      transform: scale(1.4);
    }
  `,
})
export class TilePage {
  items = signal(Array.from({ length: 12 }, (_, i) => i + 1));

  config: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, all: 0 },
    slide: 1,
    speed: 400,
    point: { visible: true },
    load: 2,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  loadMore(): void {
    const len = this.items().length;
    if (len >= 30) {
      return;
    }
    this.items.update(list => [...list, ...Array.from({ length: 6 }, (_, i) => len + i + 1)]);
  }
}
