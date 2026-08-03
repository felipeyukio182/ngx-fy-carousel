# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`ngx-fy-carousel` is an Angular SSR-friendly carousel library, a modernized rewrite of `@ngu/carousel` (see `docs/project-origin.md`). It aims for behavioral/API compatibility with `@ngu/carousel@20` under an `ngx-fy` naming prefix, but with zero runtime dependencies: no HammerJS (native Pointer Events instead), no manual `<style>` injection (CSS custom properties instead), `ResizeObserver`/`IntersectionObserver`/Page Visibility API instead of resize/visibility polling. The full behavior mapping and intentional fixes vs. upstream are in `docs/ngu-carousel-compatibility.md`.

This is an Angular CLI workspace with two projects:
- `projects/ngx-fy-carousel` — the publishable library
- `projects/demo` — an SSR demo app that exercises the library (banner, nested, RTL, tile, vertical pages)

## Branch strategy — read this before making changes

The library ships **one major version line per supported Angular version**, each on its own long-lived branch. There is no single `main` development branch for the library.

| Branch | Angular | Library version |
| --- | --- | --- |
| `angular-20` | 20.x | `20.x.x` |
| `angular-21` | 21.x | `21.x.x` |
| `angular-22` | 22.x | `22.x.x` |

Fixes/features that apply across versions must be ported to all three branches (git worktrees for each branch may exist locally, e.g. `ngx-fy-carousel-wt20`, `ngx-fy-carousel-wt21`). `master` is not one of the active branches — check `git branch -a` / `git worktree list` before assuming where to commit.

## Commands

```bash
npm start                 # serve demo SSR app
npm run build:lib         # build the library (ng-packagr) -> dist/ngx-fy-carousel
npm run build             # build lib + demo
npm run watch             # build lib in watch mode (development config)
npm test                  # unit tests for the library (Vitest, watch=false)
npm run test:demo         # unit tests for the demo app
npm run serve:ssr:demo    # run built SSR server (after npm run build)
```

Run a single test file/pattern with the underlying Angular unit-test builder, e.g.:
```bash
ng test ngx-fy-carousel --watch=false -- --run path/to/file.spec.ts
```

### Publishing (see `docs/publish.md` for the full one-time setup and troubleshooting)

```bash
npm run publish:lib:dry   # build + npm publish --dry-run (inspect tarball, no upload)
npm run publish:lib       # build + npm publish (manual/emergency only)
```

Production releases go through CI: bump `projects/ngx-fy-carousel/package.json` version → push on the matching `angular-2X` branch → tag `vX.Y.Z` (must equal that package.json version) → create a GitHub Release targeting that commit → `.github/workflows/publish.yml` runs tests, builds, verifies tag==version, and publishes with `--provenance` using the `NPM_TOKEN` secret. Never publish from the repo root — only `dist/ngx-fy-carousel` is published; the workspace root `package.json` (`ngx-fy-carousel-ws`) is `private` and stays at `0.0.0`.

CI (`.github/workflows/ci.yml`) runs `npm ci && npm test && npm run build:lib` on push/PR to any `angular-2X` branch.

## Architecture

### Library structure (`projects/ngx-fy-carousel/src/lib`)

- `carousel/carousel.component.ts` — `NgxFyCarousel`, the main component. Extends `NgxFyCarouselStore` (state fields: transform, touch, vertical, button, deviceType, etc. — kept as plain mutable fields for parity with the original store shape, not signals, except `isFirst`/`isLast`/`activePoint`/`pointNumbers` which are exposed as signals). Orchestrates rendering via `contentChildren`/`viewChild`, an `IterableDiffer` against the `dataSource`, and RxJS (`interval`/`timer`/`fromEvent`) for autoplay.
- `carousel/observers.ts` — `observeResize`, `observeIntersection`, `observeVisibility`: thin wrappers around `ResizeObserver`, `IntersectionObserver`, and the Page Visibility API, used to drive responsive breakpoints and to pause autoplay when off-screen/tab-hidden.
- `carousel/pointer-gestures.ts` — `attachPointerGestures`: native Pointer Events-based drag/swipe (replaces HammerJS), clamps drag offsets to valid ranges.
- `models/types.ts` — public config/state types (`NgxFyCarouselConfig`, `Breakpoints`, `Transform`, `TouchState`, `Vertical`, `NgxFyButton`, etc.) and `createOutletContext`.
- `models/normalize.ts` — `normalizeConfig`, `resolveDeviceType`, `resolveItemsPerView`: turns a raw `NgxFyCarouselConfig` (with `grid`/`gridBreakpoints`) into an immutable `NormalizedCarouselConfig`, validating grid values.
- `models/pagination.ts` — pure functions for slide/point math: `clampSlideIndex`, `computePointCount`, `computePointNumbers`, `pointToSlideIndex`, `slideToActivePoint`, `shouldEmitCarouselLoad`.
- `models/store.ts` — `NgxFyCarouselStore`: base class holding the mutable runtime state fields the component extends.
- `directives/carousel.directives.ts` — structural/attribute directives: `NgxFyCarouselDefDirective` (`*ngxFyCarouselDef`), `NgxFyCarouselOutlet`, `NgxFyCarouselItemDirective`, `NgxFyCarouselNextDirective`, `NgxFyCarouselPrevDirective`, `NgxFyCarouselPointDirective`.
- `components/item.component.ts`, `components/tile.component.ts` — `NgxFyCarouselItemComponent` / `NgxFyCarouselTileComponent` (`ngx-fy-carousel-item` / `ngx-fy-carousel-tile`).
- `tokens.ts` — DI tokens, notably `NGX_FY_CAROUSEL_NAV` (injected nav contract implemented by `NgxFyCarousel`, used so nested directives like prev/next/point can reach the host without a direct component reference) and `IS_BROWSER` (SSR guard).
- `public-api.ts` — the only source of truth for what's exported from the package; check/update this when adding or renaming public symbols.

### SSR

The demo (`projects/demo`) is built with `outputMode: server` and has its own `server.ts`/`main.server.ts`/`app.routes.server.ts`. The library itself must stay SSR-safe: browser-only APIs (`ResizeObserver`, `IntersectionObserver`, pointer events, Page Visibility) are guarded behind the `IS_BROWSER` token rather than called unconditionally — preserve this pattern when touching `carousel.component.ts` or `observers.ts`.

### Naming convention vs. upstream ngu-carousel

Every public symbol/selector mirrors `@ngu/carousel` 1:1 with an `ngu`→`ngx-fy` rename (e.g. `NguCarouselConfig` → `NgxFyCarouselConfig`, `*nguCarouselDef` → `*ngxFyCarouselDef`, `NguCarouselNext` → `ngxFyCarouselNext`). When adding a new public API, check `docs/ngu-carousel-compatibility.md` first — if an equivalent exists upstream, match its name/shape via the same rename rule instead of inventing a new convention.
