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
  selector: 'app-nested-page',
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
        <p class="eyebrow">Composition</p>
        <h1>Nested carousels</h1>
        <p>An outer carousel of groups, each with its own inner tile carousel and independent controls.</p>
      </header>

      <div class="demo-stage">
        <ngx-fy-carousel [inputs]="outerConfig" [dataSource]="groups()">
          <ngx-fy-carousel-tile *ngxFyCarouselDef="let group">
            <article class="group">
              <header class="group-head">
                <h3>{{ group.title }}</h3>
                <span>{{ group.items.length }} tiles</span>
              </header>
              <ngx-fy-carousel [inputs]="innerConfig" [dataSource]="group.items">
                <ngx-fy-carousel-tile *ngxFyCarouselDef="let item; let i = index">
                  <div class="mini" [attr.data-tone]="i % 3">{{ item }}</div>
                </ngx-fy-carousel-tile>
                <button type="button" class="demo-nav left inner" ngxFyCarouselPrev aria-label="Previous inner">
                  ‹
                </button>
                <button type="button" class="demo-nav right inner" ngxFyCarouselNext aria-label="Next inner">
                  ›
                </button>
              </ngx-fy-carousel>
            </article>
          </ngx-fy-carousel-tile>
          <button type="button" class="demo-nav left outer" ngxFyCarouselPrev aria-label="Previous group">‹</button>
          <button type="button" class="demo-nav right outer" ngxFyCarouselNext aria-label="Next group">›</button>
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

    .group {
      padding: 0.25rem 0.1rem 0.4rem;
    }

    .group-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin: 0 0 0.75rem;
      padding: 0 0.3rem;
    }

    .group-head h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .group-head span {
      color: var(--ink-soft);
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .mini {
      min-height: 124px;
      display: grid;
      place-items: center;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: -0.015em;
    }

    .mini[data-tone='0'] {
      background: #edd9d4;
    }
    .mini[data-tone='1'] {
      background: #dceee8;
    }
    .mini[data-tone='2'] {
      background: #dbe6f0;
    }

    .demo-nav.inner {
      width: 2.1rem;
      height: 2.1rem;
      font-size: 1.05rem;
    }

    .demo-nav.outer {
      top: 1rem;
      transform: none;
    }
  `,
})
export class NestedPage {
  groups = signal([
    { title: 'Group A', items: ['A1', 'A2', 'A3', 'A4'] },
    { title: 'Group B', items: ['B1', 'B2', 'B3', 'B4'] },
    { title: 'Group C', items: ['C1', 'C2', 'C3', 'C4'] },
  ]);

  outerConfig: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
    slide: 1,
    speed: 400,
    touch: true,
  };

  innerConfig: NgxFyCarouselConfig = {
    grid: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, all: 0 },
    slide: 1,
    speed: 300,
    touch: true,
  };
}
