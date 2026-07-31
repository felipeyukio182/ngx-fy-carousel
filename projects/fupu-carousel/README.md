# fupu-carousel

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
npm i fupu-carousel
```

Peer dependencies: `@angular/core`, `@angular/common`, `rxjs`.

## Quick start

```ts
import {
  FupuCarousel,
  FupuCarouselConfig,
  FupuCarouselDefDirective,
  FupuCarouselTileComponent,
  FupuCarouselNextDirective,
  FupuCarouselPrevDirective,
} from 'fupu-carousel';

@Component({
  imports: [
    FupuCarousel,
    FupuCarouselTileComponent,
    FupuCarouselDefDirective,
    FupuCarouselNextDirective,
    FupuCarouselPrevDirective,
  ],
  template: `
    <fupu-carousel [inputs]="config" [dataSource]="items">
      <fupu-carousel-tile *fupuCarouselDef="let item">{{ item }}</fupu-carousel-tile>
      <button fupuCarouselPrev>prev</button>
      <button fupuCarouselNext>next</button>
    </fupu-carousel>
  `,
})
export class Demo {
  items = [1, 2, 3, 4, 5];
  config: FupuCarouselConfig = {
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

MIT. See [LICENSE](../../LICENSE) and [THIRD_PARTY_NOTICES.md](../../THIRD_PARTY_NOTICES.md).
