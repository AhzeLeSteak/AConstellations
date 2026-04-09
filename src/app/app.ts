import { Component, computed, signal } from '@angular/core';
import { Sky } from './sky/sky';
import { FormsModule } from '@angular/forms';
import {scale} from './signals/scale';

@Component({
  selector: 'app-root',
  imports: [Sky, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly sky_height = 298;
  readonly sky_width = 512;

  dx = signal(0);
  dy = signal(0);
  watchMouse = signal(false);

  desired_width = signal(800);
  scale = scale(this.sky_width, this.sky_height);

  grid_width = computed(() => 2 * Math.abs(this.cam_x()) + 3);
  grid_height = computed(() => 2 * Math.abs(this.cam_y()) + 3);
  grid = computed(() => {
    const gx = this.grid_width();
    const gy = this.grid_height();
    //console.log('grid', gx, gy, this.cam_x(), this.cam_y(), new Date());
    return new Array(gx * gy).fill(0).map((_, i) => {
      const x = (i % gx) - (gx - 1) / 2;
      const y = ((i / gx) | 0) - (gy - 1) / 2;
      return {
        idx: `${x}_${y}`,
        is_displayed: Math.abs(y - this.cam_y()) <= 1 && Math.abs(x - this.cam_x()) <= 1,
      };
    });
  });

  cam_x = computed(
    () => -Math.sign(this.dx()) * Math.abs(Math.round(this.dx() / this.scale() / this.sky_width)),
  );
  cam_y = computed(
    () => -Math.sign(this.dy()) * Math.abs(Math.round(this.dy() / this.scale() / this.sky_height)),
  );

  protected scroll(x: number, y: number) {
    this.dx.update((dx) => dx - x);
    this.dy.update((dy) => dy - y);
  }

  protected readonly JSON = JSON;
}
