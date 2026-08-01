# ngx-fy-carousel

Angular SSR-friendly carousel library with ngu-carousel compatible behavior, modernized for Angular 20+.

## Features

- Standalone components and directives
- Signal inputs/outputs and public signals
- Responsive and fixed grids
- Loop, autoplay, points, lazy animation, RTL, vertical
- Pointer gestures (no HammerJS)
- SSR + hydration safe
- Zoneless-friendly

## Install

```bash
npm i ngx-fy-carousel
```

Peer dependencies: `@angular/core`, `@angular/common`, `rxjs`.

## Quick start

```ts
import {
  NgxFyCarousel,
  NgxFyCarouselConfig,
  NgxFyCarouselDefDirective,
  NgxFyCarouselTileComponent,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPrevDirective,
} from 'ngx-fy-carousel';

@Component({
  imports: [
    NgxFyCarousel,
    NgxFyCarouselTileComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
  ],
  template: `
    <ngx-fy-carousel [inputs]="config" [dataSource]="items">
      <ngx-fy-carousel-tile *ngxFyCarouselDef="let item">{{ item }}</ngx-fy-carousel-tile>
      <button ngxFyCarouselPrev>prev</button>
      <button ngxFyCarouselNext>next</button>
    </ngx-fy-carousel>
  `,
})
export class Demo {
  items = [1, 2, 3, 4, 5];
  config: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 2, md: 3, lg: 4, xl: 4, all: 0 },
    slide: 1,
    speed: 400,
    touch: true,
    point: { visible: true },
  };
}
```

## SSR notes

Initialize browser-only observers after render. The library already guards `window`/`document` usage behind platform checks and `afterNextRender`.

## Compatibility

See [docs/ngu-carousel-compatibility.md](../../docs/ngu-carousel-compatibility.md).

## Versioning

- `20.x` — Angular 20
- `21.x` — Angular 21
- `22.x` — Angular 22

## License

MIT. See [LICENSE](./LICENSE) and [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
