import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Sky } from './sky/sky';
import { FormsModule } from '@angular/forms';
import { scale } from './signals/scale';
import { sky_height, sky_width } from './data/sky_size';

let isShiftPressed = false;
document.addEventListener('keydown', (e) => (isShiftPressed = e.shiftKey));
document.addEventListener('keyup', (e) => (isShiftPressed = e.shiftKey));

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

  sky_width = sky_width;
  sky_height = sky_height;

  scale = scale(sky_width, sky_height);

  grid_width = computed(() => 2 * Math.abs(this.cam_x()) + 3);
  grid_height = computed(() => 2 * Math.abs(this.cam_y()) + 3);

  cam_x = computed(() => -Math.sign(this.dx()) * Math.abs(Math.round(this.dx() / sky_width)));
  cam_y = computed(() => -Math.sign(this.dy()) * Math.abs(Math.round(this.dy() / sky_height)));

  grid = computed(() => {
    const gx = this.grid_width();
    const gy = this.grid_height();
    let i = 0;
    return new Array(gx * gy).fill(0).map((_, i) => {
      const x = (i % gx) - (gx - 1) / 2;
      const y = ((i / gx) | 0) - (gy - 1) / 2;
      const is_displayed = Math.abs(y - this.cam_y()) <= 1 && Math.abs(x - this.cam_x()) <= 1;
      return {
        idx: is_displayed ? i++ : `${x}_${y}`,
        is_displayed,
      };
    });
  });

  protected scroll(x: number, y: number, fromWheel = false) {
    const reverse = fromWheel && isShiftPressed;
    this.dx.update((dx) => dx - (reverse ? y : x) / this.scale());
    this.dy.update((dy) => dy - (reverse ? x : y) / this.scale());
  }

}

