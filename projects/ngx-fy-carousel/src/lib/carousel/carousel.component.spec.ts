import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgxFyCarousel } from '../carousel/carousel.component';
import { NgxFyCarouselTileComponent } from '../components/tile.component';
import {
  NgxFyCarouselDefDirective,
  NgxFyCarouselNextDirective,
  NgxFyCarouselPrevDirective,
  NgxFyCarouselPointDirective,
} from '../directives/carousel.directives';
import { NgxFyCarouselConfig } from '../models/types';

@Component({
  standalone: true,
  imports: [
    NgxFyCarousel,
    NgxFyCarouselTileComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
    NgxFyCarouselPrevDirective,
    NgxFyCarouselPointDirective,
  ],
  template: `
    <ngx-fy-carousel
      #carousel
      [inputs]="config"
      [dataSource]="items()"
      (carouselLoad)="loads.push($event)"
      (onMove)="moves.push($event.currentSlide)"
    >
      <ngx-fy-carousel-tile *ngxFyCarouselDef="let item; let i = index">
        <div class="tile-content">{{ item }}-{{ i }}</div>
      </ngx-fy-carousel-tile>
      <button ngxFyCarouselPrev type="button">prev</button>
      <button ngxFyCarouselNext type="button">next</button>
      <ul ngxFyCarouselPoint>
        @for (p of carousel.pointNumbers(); track p) {
          <li [class.active]="p === carousel.activePoint()" (click)="carousel.moveTo(p)">{{ p }}</li>
        }
      </ul>
    </ngx-fy-carousel>
  `,
})
class HostComponent {
  items = signal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  loads: number[] = [];
  moves: number[] = [];
  config: NgxFyCarouselConfig = {
    grid: { xs: 2, sm: 2, md: 3, lg: 3, xl: 3, all: 0 },
    slide: 1,
    speed: 0,
    point: { visible: true },
    load: 2,
    touch: false,
    loop: false,
  };
}

describe('NgxFyCarousel', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let carousel: NgxFyCarousel<number>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    carousel = fixture.debugElement.query(By.directive(NgxFyCarousel)).componentInstance;
  });

  it('renders items from dataSource', () => {
    const tiles = fixture.nativeElement.querySelectorAll('.tile-content');
    expect(tiles.length).toBe(10);
    expect(tiles[0].textContent).toContain('0-0');
  });

  it('moves with next/prev and updates signals', async () => {
    expect(carousel.isFirst()).toBe(true);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host.moves.length).toBeGreaterThan(0);
    expect(carousel.activePoint()).toBeGreaterThanOrEqual(0);
  });

  it('moveTo clamps invalid points', () => {
    const before = carousel.currentSlide;
    carousel.moveTo(-1);
    expect(carousel.currentSlide).toBe(before);
    carousel.moveTo(999);
    expect(carousel.currentSlide).toBe(before);
  });

  it('reset returns to first slide', () => {
    carousel.moveTo(1, true);
    carousel.reset(true);
    expect(carousel.currentSlide).toBe(0);
    expect(carousel.activePoint()).toBe(0);
  });

  it('updates when dataSource changes', async () => {
    host.items.set([100, 101, 102]);
    fixture.detectChanges();
    await fixture.whenStable();
    const tiles = fixture.nativeElement.querySelectorAll('.tile-content');
    expect(tiles.length).toBe(3);
    expect(tiles[0].textContent).toContain('100-0');
  });
});
