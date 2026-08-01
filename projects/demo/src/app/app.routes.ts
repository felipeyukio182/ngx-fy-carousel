import { Routes } from '@angular/router';

import { BannerPage } from './pages/banner-page';
import { NestedPage } from './pages/nested-page';
import { RtlPage } from './pages/rtl-page';
import { TilePage } from './pages/tile-page';
import { VerticalPage } from './pages/vertical-page';

// Eager page components keep SSR markup hydratable. Lazy `loadComponent`
// was destroying/recreating the page during client bootstrap (visible flash).
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tile' },
  { path: 'tile', component: TilePage },
  { path: 'banner', component: BannerPage },
  { path: 'rtl', component: RtlPage },
  { path: 'vertical', component: VerticalPage },
  { path: 'nested', component: NestedPage },
];
