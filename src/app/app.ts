import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Sky } from './sky/sky';
import { FormsModule } from '@angular/forms';
import { scale } from './signals/scale';
import { sky_height, sky_width } from './data/sky_size';

@Component({
  selector: 'app-root',
  imports: [Sky, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  dx = signal(0);
  dy = signal(0);
  watchMouse = signal(false);

  sky_width = sky_width;
  sky_height = sky_height;

  desired_width = signal(800);
  scale = scale(sky_width, sky_height);

  grid_width = computed(() => 2 * Math.abs(this.cam_x()) + 3);
  grid_height = computed(() => 2 * Math.abs(this.cam_y()) + 3);
  grid = computed(() => {
    const gx = this.grid_width();
    const gy = this.grid_height();
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
    () => -Math.sign(this.dx()) * Math.abs(Math.round(this.dx() / this.scale() / sky_width)),
  );
  cam_y = computed(
    () => -Math.sign(this.dy()) * Math.abs(Math.round(this.dy() / this.scale() / sky_height)),
  );

  protected scroll(x: number, y: number, force = false) {
    if(++scrollCount === modulo || force)
      scrollCount = 0;
    else
      return;
    this.dx.update((dx) => dx - x * modulo);
    this.dy.update((dy) => dy - y * modulo);
  }

  protected readonly JSON = JSON;
}

const modulo = 1;
let scrollCount = 0;
