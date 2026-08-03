# Project origin

`ngx-fy-carousel` started as a refactor and modernization of
[`@ngu/carousel`](https://github.com/uiuniversal/ngu-carousel) (MIT License,
copyright uiuniversal / ngu-carousel contributors). The public API shape,
configuration object, and directive/output naming were used as a
compatibility reference; see [`ngu-carousel-compatibility.md`](ngu-carousel-compatibility.md)
for the full mapping and [`THIRD_PARTY_NOTICES.md`](../THIRD_PARTY_NOTICES.md)
for the license attribution.

## Why a rewrite instead of a fork

The workspace structure (Angular library + SSR demo app) mirrors
`ngu-carousel`'s layout, but the implementation underneath was rewritten to:

- Drop the **HammerJS** dependency — touch/drag/swipe gestures are implemented
  with native Pointer Events instead.
- Drop manual `<style>` tag injection — responsive grid/breakpoint layout is
  driven by CSS custom properties instead.
- Use `ResizeObserver` for responsive breakpoints instead of window resize
  polling.
- Use `IntersectionObserver` + the Page Visibility API to pause autoplay when
  the carousel is off-screen or the tab is hidden.
- Fix behavioral bugs present upstream (touch autoplay pause/resume,
  out-of-range `moveTo` calls, `trackBy` identity changes) — see the
  "Intentional differences / fixes" section of the compatibility doc.
- Target current Angular APIs (standalone components, signals) and be
  SSR-safe out of the box.

The result keeps the parts of the original design that worked well
(component structure, config shape, directive names under the `ngx-fy`
prefix) while removing every external runtime dependency and modernizing the
implementation.

## Branch strategy

The library ships one major version line per supported Angular version, each
on its own long-lived branch:

| Branch | Angular | Library version |
| --- | --- | --- |
| `angular-20` | 20.x | `20.x.x` |
| `angular-21` | 21.x | `21.x.x` |
| `angular-22` | 22.x | `22.x.x` |

Fixes and features that apply across versions are ported to all three
branches. See [`publish.md`](publish.md) for how each branch is versioned and
released independently on npm.
