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
    <section class="demo-page">
      <header class="demo-intro">
        <p class="eyebrow">Responsive grid</p>
        <h1>Tile carousel</h1>
        <p>Multi-item layout with controls, pagination points, and incremental load as you browse.</p>
      </header>

      <div class="demo-stage">
        <ngx-fy-carousel
          #carousel
          [inputs]="config"
          [dataSource]="items()"
          (carouselLoad)="loadMore()"
        >
          <ngx-fy-carousel-tile *ngxFyCarouselDef="let item; let i = index">
            <div class="card" [attr.data-tone]="i % 4">
              <span class="card-index">{{ item }}</span>
              <span class="card-label">Tile</span>
            </div>
          </ngx-fy-carousel-tile>

          <button
            type="button"
            class="demo-nav left"
            ngxFyCarouselPrev
            [style.opacity]="carousel.isFirst() ? 0.4 : 1"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            class="demo-nav right"
            ngxFyCarouselNext
            [style.opacity]="carousel.isLast() ? 0.4 : 1"
            aria-label="Next"
          >
            ›
          </button>

          <ul class="demo-points" ngxFyCarouselPoint>
            @for (p of carousel.pointNumbers(); track p) {
              <li
                [class.active]="p === carousel.activePoint()"
                (click)="carousel.moveTo(p)"
                [attr.aria-label]="'Go to page ' + (p + 1)"
              ></li>
            }
          </ul>
        </ngx-fy-carousel>
      </div>
    </section>
  `,
  styles: `
    :host ::ng-deep ngx-fy-carousel-tile .tile {
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: 0 1px 2px rgb(26 35 48 / 6%), 0 8px 18px rgb(26 35 48 / 6%);
      transition: box-shadow 180ms var(--ease-out);
    }

    :host ::ng-deep ngx-fy-carousel-tile:hover .tile {
      box-shadow: 0 2px 4px rgb(26 35 48 / 8%), 0 12px 24px rgb(26 35 48 / 10%);
    }

    .card {
      min-height: 188px;
      display: grid;
      place-content: center;
      gap: 0.3rem;
      text-align: center;
      border-radius: inherit;
    }

    .card[data-tone='0'] {
      background: #dceee8;
    }
    .card[data-tone='1'] {
      background: #dbe6f0;
    }
    .card[data-tone='2'] {
      background: #efe4d6;
    }
    .card[data-tone='3'] {
      background: #edd9d4;
    }

    .card-index {
      font-size: clamp(1.75rem, 3vw, 2.2rem);
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--ink);
      line-height: 1;
    }

    .card-label {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-soft);
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
