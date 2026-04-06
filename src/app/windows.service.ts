import { DestroyRef, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Window {
  constructor() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', this.handleResize));
  }

  width = signal(0);
  height = signal(0);

  #last: any;
  handleResize = () => {
    this.#last = setTimeout(() => {
      clearTimeout(this.#last);
      this.width.set(window.innerWidth);
      this.height.set(window.innerHeight);
    }, 5 /* 200 fps frame-time */);
  };
}
