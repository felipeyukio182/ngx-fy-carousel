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
    <section class="demo-page">
      <header class="demo-intro">
        <p class="eyebrow">Axis flip</p>
        <h1>Vertical carousel</h1>
        <p>Scroll on the Y axis with loop and autoplay — controls sit above and below the stage.</p>
      </header>

      <div class="demo-stage vertical-stage">
        <ngx-fy-carousel [inputs]="config" [dataSource]="items()">
          <ngx-fy-carousel-item *ngxFyCarouselDef="let item; let i = index">
            <div class="row" [attr.data-tone]="i % 3">
              <span class="row-label">Panel</span>
              <strong>{{ item }}</strong>
            </div>
          </ngx-fy-carousel-item>
          <button type="button" class="demo-nav top" ngxFyCarouselPrev aria-label="Previous">▲</button>
          <button type="button" class="demo-nav bottom" ngxFyCarouselNext aria-label="Next">▼</button>
        </ngx-fy-carousel>
      </div>
    </section>
  `,
  styles: `
    .vertical-stage {
      max-width: 400px;
      margin-inline: auto;
    }

    .row {
      display: grid;
      place-content: center;
      gap: 0.3rem;
      height: 100%;
      text-align: center;
      border-bottom: 1px solid rgb(26 35 48 / 8%);
    }

    .row-label {
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }

    .row strong {
      font-size: 1.7rem;
      font-weight: 700;
      letter-spacing: -0.015em;
    }

    .row[data-tone='0'] {
      background: #dceee8;
    }
    .row[data-tone='1'] {
      background: #dbe6f0;
    }
    .row[data-tone='2'] {
      background: #efe4d6;
    }
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
