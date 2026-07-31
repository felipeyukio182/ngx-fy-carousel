import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">fupu-carousel</a>
      <nav>
        <a routerLink="/tile">Tile</a>
        <a routerLink="/banner">Banner</a>
        <a routerLink="/rtl">RTL</a>
        <a routerLink="/vertical">Vertical</a>
        <a routerLink="/nested">Nested</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    .topbar {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      background: #fff;
      z-index: 10;
    }
    .brand {
      font-weight: 700;
      color: #111827;
      text-decoration: none;
    }
    nav {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    nav a {
      color: #2563eb;
      text-decoration: none;
    }
    main {
      padding: 1.5rem;
      max-width: 1100px;
      margin: 0 auto;
    }
  `,
})
export class App {
  title = signal('fupu-carousel demo');
}
