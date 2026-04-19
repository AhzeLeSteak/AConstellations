import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Sky } from './sky/sky';
import { FormsModule } from '@angular/forms';
import { scale } from './signals/scale';
import { sky_height, sky_width } from './data/distance_computation';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [Sky, FormsModule, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  sky_width = sky_width;
  sky_height = sky_height;

  dx = signal(0);
  dy = signal(0);

  scale = scale(sky_width, sky_height);

  grid_width = computed(() => 2 * Math.abs(this.cam_x()) + 3);
  grid_height = computed(() => 2 * Math.abs(this.cam_y()) + 3);

  cam_x = computed(() => -Math.sign(this.dx()) * Math.abs(Math.round(this.dx() / sky_width)));
  cam_y = computed(() => -Math.sign(this.dy()) * Math.abs(Math.round(this.dy() / sky_height)));

  grid = computed(() => {
    const gx = this.grid_width();
    const gy = this.grid_height();
    let counter = 0;
    return new Array(gx * gy).fill(0).map((_, i) => {
      const x = (i % gx) - (gx - 1) / 2;
      const y = ((i / gx) | 0) - (gy - 1) / 2;
      const is_displayed = Math.abs(y - this.cam_y()) <= 1 && Math.abs(x - this.cam_x()) <= 1;
      return {
        idx: is_displayed ? (counter++).toString() : `${x}_${y}`,
        is_displayed,
      };
    });
  });

  get isHorizontal() {
    return window.innerWidth > window.innerHeight;
  }

  get isMobile() {
    return (
      'userAgentData' in navigator &&
      typeof navigator.userAgentData === 'object' &&
      navigator.userAgentData &&
      'mobile' in navigator.userAgentData &&
      !!navigator.userAgentData.mobile
    );
  }

  protected scroll(x: number, y: number, reverse = false) {
    this.dx.update((dx) => dx - (reverse ? y : x) / this.scale());
    this.dy.update((dy) => dy - (reverse ? x : y) / this.scale());
  }

  protected async copyUrlToClipBoard() {
    await navigator.clipboard.writeText(window.location.href);
  }
}
