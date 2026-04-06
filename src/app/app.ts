import { Component, computed, inject, signal } from '@angular/core';
import { Sky } from './sky/sky';
import { Window } from './windows.service';
import { FormsModule } from '@angular/forms';

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

  desired_width = signal(800);
  scale = computed(() => this.desired_width() / this.sky_width);

  window = inject(Window);
  grid_width = computed(() => make_array(Math.ceil(this.window.width() / this.desired_width())));
  grid_height = computed(() =>
    make_array(
      Math.ceil(
        this.window.height() / ((this.desired_width() * this.sky_height) / this.sky_width),
      ),
    ),
  );

  protected scroll($event: WheelEvent) {
    this.dy.update((dy) => dy - $event.deltaY);
    this.dx.update((dx) => dx - $event.deltaX);
    if (this.dy() >= this.sky_height * this.scale()) {
      this.dy.update((dy) => dy - this.sky_height * this.scale());
    }
    if (this.dy() <= -this.sky_height * this.scale()) {
      this.dy.update((dy) => dy + this.sky_height * this.scale());
    }
  }

  protected readonly JSON = JSON;
}

function make_array(size: number) {
  return new Array(size + 2).fill(0).map((_, i) => i);
}
