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

@Component({
  standalone: true,
  imports: [
    NgxFyCarousel,
    NgxFyCarouselTileComponent,
    NgxFyCarouselDefDirective,
    NgxFyCarouselNextDirective,
  ],
  template: `
    <ngx-fy-carousel [inputs]="outerConfig" [dataSource]="groups">
      <ngx-fy-carousel-tile *ngxFyCarouselDef="let group">
        <ngx-fy-carousel [inputs]="innerConfig" [dataSource]="group.items">
          <ngx-fy-carousel-tile *ngxFyCarouselDef="let item">
            <div class="mini">{{ item }}</div>
          </ngx-fy-carousel-tile>
          <button type="button" class="inner-next" ngxFyCarouselNext>inner-next</button>
        </ngx-fy-carousel>
      </ngx-fy-carousel-tile>
      <button type="button" class="outer-next" ngxFyCarouselNext>outer-next</button>
    </ngx-fy-carousel>
  `,
})
class NestedHostComponent {
  groups = [
    { title: 'A', items: ['A1', 'A2', 'A3', 'A4'] },
    { title: 'B', items: ['B1', 'B2', 'B3', 'B4'] },
    { title: 'C', items: ['C1', 'C2', 'C3', 'C4'] },
  ];
  outerConfig: NgxFyCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, xl: 1, all: 0 },
    slide: 1,
    speed: 0,
    touch: false,
  };
  innerConfig: NgxFyCarouselConfig = {
    grid: { xs: 2, sm: 2, md: 2, lg: 2, xl: 2, all: 0 },
    slide: 1,
    speed: 0,
    touch: false,
  };
}

describe('NgxFyCarousel nested controls', () => {
  let fixture: ComponentFixture<NestedHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedHostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(NestedHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('outer and inner next buttons control their own carousel', async () => {
    const carousels = fixture.debugElement.queryAll(By.directive(NgxFyCarousel));
    const outer = carousels[0].componentInstance as NgxFyCarousel<unknown>;
    const inner = carousels[1].componentInstance as NgxFyCarousel<unknown>;

    expect(outer.currentSlide).toBe(0);
    expect(inner.currentSlide).toBe(0);

    fixture.nativeElement.querySelector('button.outer-next').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(outer.currentSlide).toBeGreaterThan(0);
    expect(inner.currentSlide).toBe(0);

    const innerSlideBefore = inner.currentSlide;
    const outerSlideBefore = outer.currentSlide;
    fixture.nativeElement.querySelector('button.inner-next').click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inner.currentSlide).toBeGreaterThan(innerSlideBefore);
    expect(outer.currentSlide).toBe(outerSlideBefore);
  });
});
