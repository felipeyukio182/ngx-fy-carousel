import { Component, signal } from '@angular/core';
import {
  NgxFyCarousel,
  NgxFyCarouselConfig,
  NgxFyCarouselDefDirective,
  NgxFyCarouselItemComponent,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPointDirective,
  NgxFyCarouselPrevDirective,
} from 'ngx-fy-carousel';

@Component({
  selector: 'app-banner-page',
  imports: [
    NgxFyCarousel,
    NgxFyCarouselItemComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
    NgxFyCarouselPointDirective,
  ],
  template: `
    <h1>Banner carousel</h1>
    <p>Autoplay + loop banner mode.</p>

    <ngx-fy-carousel #carousel [inputs]="config" [dataSource]="items()">
      <ngx-fy-carousel-item *ngxFyCarouselDef="let item">
        <div class="banner" [style.background]="item.color">
          <h2>{{ item.title }}</h2>
        </div>
      </ngx-fy-carousel-item>
      <button type="button" class="nav left" ngxFyCarouselPrev>‹</button>
      <button type="button" class="nav right" ngxFyCarouselNext>›</button>
      <ul class="points" ngxFyCarouselPoint>
        @for (p of carousel.pointNumbers(); track p) {
          <li [class.active]="p === carousel.activePoint()" (click)="carousel.moveTo(p)"></li>
        }
      </ul>
    </ngx-fy-carousel>
  `,
  styles: `
    .banner {
      min-height: 320px;
      display: grid;
      place-items: center;
      color: white;
      font-size: 2rem;
    }
    .nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 999px;
      background: #fff;
      box-shadow: 0 2px 10px rgb(0 0 0 / 25%);
      z-index: 2;
      cursor: pointer;
    }
    .left { left: 8px; }
    .right { right: 8px; }
    .points {
      list-style: none;
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      margin: 0;
    }
    .points li {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #cbd5e1;
      cursor: pointer;
    }
    .points li.active { background: #0f172a; }
  `,
})
export class BannerPage {
  items = signal([
    { title: 'Slide 1', color: '#2563eb' },
    { title: 'Slide 2', color: '#7c3aed' },
    { title: 'Slide 3', color: '#db2777' },
    { title: 'Slide 4', color: '#059669' },
  ]);

  config: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
    slide: 1,
    speed: 450,
    interval: { timing: 3000, initialDelay: 800 },
    point: { visible: true },
    load: 2,
    loop: true,
    touch: true,
    custom: 'banner',
  };
}
