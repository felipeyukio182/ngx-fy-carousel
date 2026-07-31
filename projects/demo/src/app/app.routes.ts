import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tile' },
  {
    path: 'tile',
    loadComponent: () => import('./pages/tile-page').then(m => m.TilePage),
  },
  {
    path: 'banner',
    loadComponent: () => import('./pages/banner-page').then(m => m.BannerPage),
  },
  {
    path: 'rtl',
    loadComponent: () => import('./pages/rtl-page').then(m => m.RtlPage),
  },
  {
    path: 'vertical',
    loadComponent: () => import('./pages/vertical-page').then(m => m.VerticalPage),
  },
  {
    path: 'nested',
    loadComponent: () => import('./pages/nested-page').then(m => m.NestedPage),
  },
];
