# Compatibility with @ngu/carousel

`fupu-carousel` aims for behavioral compatibility with `@ngu/carousel@20`, using a `fupu` naming prefix.

## Mapping

| ngu-carousel | fupu-carousel |
| --- | --- |
| `ngu-carousel` | `fupu-carousel` |
| `ngu-item` | `fupu-carousel-item` |
| `ngu-tile` | `fupu-carousel-tile` |
| `*nguCarouselDef` | `*fupuCarouselDef` |
| `[NguCarouselNext]` | `[fupuCarouselNext]` |
| `[NguCarouselPrev]` | `[fupuCarouselPrev]` |
| `[NguCarouselPoint]` | `[fupuCarouselPoint]` |
| `NguCarouselConfig` | `FupuCarouselConfig` |
| `NguCarouselStore` | `FupuCarouselStore` |

## Preserved contracts

- Inputs: `inputs`, `dataSource`, `trackBy`
- Outputs: `onMove`, `carouselLoad`
- Methods: `moveTo(point, withoutAnimation?)`, `reset(withoutAnimation?)`
- Signals: `activePoint()`, `pointNumbers()`, `isFirst()`, `isLast()`
- Config: `grid`, `gridBreakpoints`, `slide`, `speed`, `interval`, `animation`, `point`, `load`, `custom`, `loop`, `touch`, `easing`, `RTL`, `button`, `vertical`, `velocity`

## Intentional differences / fixes

- No HammerJS dependency; Pointer Events are used instead.
- No dynamic `<style>` injection; layout uses CSS custom properties.
- Config normalization is immutable and validates invalid grids.
- Resize uses `ResizeObserver` on the carousel host.
- Autoplay pauses with `IntersectionObserver` and Page Visibility.
- Touch autoplay pause/resume is corrected (`touchstart` pauses, `touchend` resumes).
- `trackBy` changes recreate the iterable differ.
- Identity changes update `$implicit`.
- Touch drag is clamped to valid offsets.
- `moveTo` rejects negative/out-of-range points.
- Vertical touch gestures are supported.

## Migration snippet

```ts
// before
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';

// after
import { FupuCarousel, FupuCarouselConfig } from 'fupu-carousel';
```

```html
<!-- before -->
<ngu-carousel [inputs]="cfg" [dataSource]="items">
  <ngu-tile *nguCarouselDef="let item">...</ngu-tile>
  <button NguCarouselPrev></button>
  <button NguCarouselNext></button>
</ngu-carousel>

<!-- after -->
<fupu-carousel [inputs]="cfg" [dataSource]="items">
  <fupu-carousel-tile *fupuCarouselDef="let item">...</fupu-carousel-tile>
  <button fupuCarouselPrev></button>
  <button fupuCarouselNext></button>
</fupu-carousel>
```
