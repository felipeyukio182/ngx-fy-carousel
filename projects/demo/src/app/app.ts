import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="shell">
      <div class="shell-inner">
        <a routerLink="/" class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-copy">
            <strong>ngx-fy-carousel</strong>
            <small>Angular SSR demo</small>
          </span>
        </a>

        <nav aria-label="Demo pages">
          <a routerLink="/tile" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Tile</a>
          <a routerLink="/banner" routerLinkActive="active">Banner</a>
          <a routerLink="/rtl" routerLinkActive="active">RTL</a>
          <a routerLink="/vertical" routerLinkActive="active">Vertical</a>
          <a routerLink="/nested" routerLinkActive="active">Nested</a>
        </nav>
      </div>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    .shell {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgb(243 245 247 / 90%);
      border-bottom: 1px solid var(--line);
      backdrop-filter: blur(10px);
    }

    .shell-inner {
      max-width: 1120px;
      margin: 0 auto;
      padding: 0.8rem 1.25rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.7rem;
      text-decoration: none;
      color: var(--ink);
      min-width: 0;
    }

    .brand-mark {
      width: 2rem;
      height: 2rem;
      border-radius: 0.55rem;
      background: var(--ink);
      position: relative;
      flex: 0 0 auto;
    }

    .brand-mark::before,
    .brand-mark::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 999px;
      background: #f3e0c9;
      transform: translateY(-50%);
    }

    .brand-mark::before {
      left: 0.35rem;
    }

    .brand-mark::after {
      right: 0.35rem;
      background: #d6e4ee;
    }

    .brand-copy {
      display: grid;
      gap: 0.05rem;
    }

    .brand-copy strong {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      line-height: 1.15;
    }

    .brand-copy small {
      color: var(--ink-soft);
      font-size: 0.75rem;
      font-weight: 500;
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.15rem 0.35rem;
    }

    nav a {
      position: relative;
      text-decoration: none;
      color: var(--ink-soft);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.4rem 0.55rem;
      transition: color 160ms var(--ease-out);
    }

    nav a::after {
      content: '';
      position: absolute;
      left: 0.55rem;
      right: 0.55rem;
      bottom: 0.15rem;
      height: 2px;
      border-radius: 999px;
      background: var(--accent);
      transform: scaleX(0);
      transition: transform 180ms var(--ease-out);
    }

    nav a:hover {
      color: var(--ink);
    }

    nav a.active {
      color: var(--ink);
      font-weight: 700;
    }

    nav a.active::after {
      transform: scaleX(1);
    }

    main {
      max-width: 1120px;
      margin: 0 auto;
      padding: 1.6rem 1.25rem 2.75rem;
    }

    @media (max-width: 720px) {
      .shell-inner {
        padding: 0.7rem 1rem;
      }

      .brand-copy small {
        display: none;
      }

      nav {
        width: 100%;
        justify-content: space-between;
      }

      nav a {
        padding: 0.35rem 0.3rem;
        font-size: 0.84rem;
      }

      nav a::after {
        left: 0.3rem;
        right: 0.3rem;
      }

      main {
        padding: 1.15rem 0.85rem 2.25rem;
      }
    }
  `,
})
export class App {
  title = signal('ngx-fy-carousel demo');
}
