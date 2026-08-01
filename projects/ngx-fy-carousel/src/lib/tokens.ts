import { InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const IS_BROWSER = new InjectionToken<boolean>('NGX_FY_CAROUSEL_IS_BROWSER', {
  providedIn: 'root',
  factory: () => isPlatformBrowser(inject(PLATFORM_ID)),
});

/** Nearest carousel navigation API for prev/next directives (supports nesting). */
export interface NgxFyCarouselNav {
  scrollOne(direction: number): void;
}

export const NGX_FY_CAROUSEL_NAV = new InjectionToken<NgxFyCarouselNav>('NGX_FY_CAROUSEL_NAV');
