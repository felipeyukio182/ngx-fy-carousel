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
    <section class="demo-page">
      <header class="demo-intro">
        <p class="eyebrow">Full-bleed slides</p>
        <h1>Banner carousel</h1>
        <p>Single-item banner mode with loop and autoplay — swipe or use the controls.</p>
      </header>

      <div class="demo-stage stage-flush">
        <ngx-fy-carousel #carousel [inputs]="config" [dataSource]="items()">
          <ngx-fy-carousel-item *ngxFyCarouselDef="let item">
            <div class="banner" [style.background]="item.color">
              <div class="banner-copy">
                <span>{{ item.kicker }}</span>
                <h2>{{ item.title }}</h2>
              </div>
            </div>
          </ngx-fy-carousel-item>
          <button type="button" class="demo-nav left" ngxFyCarouselPrev aria-label="Previous">‹</button>
          <button type="button" class="demo-nav right" ngxFyCarouselNext aria-label="Next">›</button>
          <ul class="demo-points on-banner" ngxFyCarouselPoint>
            @for (p of carousel.pointNumbers(); track p) {
              <li
                [class.active]="p === carousel.activePoint()"
                (click)="carousel.moveTo(p)"
                [attr.aria-label]="'Go to slide ' + (p + 1)"
              ></li>
            }
          </ul>
        </ngx-fy-carousel>
      </div>
    </section>
  `,
  styles: `
    .stage-flush {
      padding: 0;
    }

    .banner {
      min-height: min(48vh, 380px);
      display: grid;
      place-items: center;
      color: #fff;
      position: relative;
    }

    .banner::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 40%, rgb(0 0 0 / 30%));
      pointer-events: none;
    }

    .banner-copy {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 1.5rem;
    }

    .banner-copy span {
      display: inline-block;
      margin-bottom: 0.4rem;
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      opacity: 0.85;
    }

    .banner-copy h2 {
      margin: 0;
      font-size: clamp(1.75rem, 4vw, 2.6rem);
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .on-banner {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.9rem;
      margin: 0;
      z-index: 2;
    }

    .on-banner li {
      background: rgb(255 255 255 / 45%);
    }

    .on-banner li.active {
      background: #fff;
    }
  `,
})
export class BannerPage {
  items = signal([
    { title: 'Coastal Motion', kicker: 'Slide 01', color: 'linear-gradient(135deg, #2f6f7a, #1f4e5f)' },
    { title: 'Warm Horizon', kicker: 'Slide 02', color: 'linear-gradient(135deg, #b45309, #8a3d08)' },
    { title: 'Ink Tide', kicker: 'Slide 03', color: 'linear-gradient(135deg, #2a3644, #1a2330)' },
    { title: 'Soft Meadow', kicker: 'Slide 04', color: 'linear-gradient(135deg, #4f7a62, #355847)' },
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
