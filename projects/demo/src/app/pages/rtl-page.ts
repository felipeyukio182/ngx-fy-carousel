import { Component, signal } from '@angular/core';
import {
  NgxFyCarousel,
  NgxFyCarouselConfig,
  NgxFyCarouselDefDirective,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPrevDirective,
  NgxFyCarouselTileComponent,
} from 'ngx-fy-carousel';

@Component({
  selector: 'app-rtl-page',
  imports: [
    NgxFyCarousel,
    NgxFyCarouselTileComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
  ],
  template: `
    <section class="demo-page">
      <header class="demo-intro">
        <p class="eyebrow">Right-to-left</p>
        <h1>RTL carousel</h1>
        <p>Same tile grid with <code>RTL: true</code> — navigation and swipe follow reading direction.</p>
      </header>

      <div class="demo-stage" dir="rtl">
        <ngx-fy-carousel #carousel [inputs]="config" [dataSource]="items()">
          <ngx-fy-carousel-tile *ngxFyCarouselDef="let item; let i = index">
            <div class="card" [attr.data-tone]="i % 3">
              <span>{{ item }}</span>
            </div>
          </ngx-fy-carousel-tile>
          <button type="button" class="demo-nav left" ngxFyCarouselPrev aria-label="Previous">‹</button>
          <button type="button" class="demo-nav right" ngxFyCarouselNext aria-label="Next">›</button>
        </ngx-fy-carousel>
      </div>
    </section>
  `,
  styles: `
    :host ::ng-deep ngx-fy-carousel-tile .tile {
      border-radius: var(--radius-card);
      overflow: hidden;
      box-shadow: 0 1px 2px rgb(26 35 48 / 6%), 0 8px 18px rgb(26 35 48 / 6%);
    }

    .card {
      min-height: 168px;
      display: grid;
      place-items: center;
    }

    .card span {
      font-size: 1.9rem;
      font-weight: 700;
      letter-spacing: -0.015em;
    }

    .card[data-tone='0'] {
      background: #efe4d6;
    }
    .card[data-tone='1'] {
      background: #dceee8;
    }
    .card[data-tone='2'] {
      background: #dbe6f0;
    }
  `,
})
export class RtlPage {
  items = signal(['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח']);
  config: NgxFyCarouselConfig = {
    grid: { xs: 2, sm: 3, md: 4, lg: 4, xl: 4, all: 0 },
    slide: 1,
    speed: 350,
    touch: true,
    RTL: true,
  };
}
