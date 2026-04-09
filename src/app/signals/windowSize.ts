import { DestroyRef, inject, signal } from '@angular/core';

export function windowSize() {
  const size = signal({ width: 0, height: 0 });

  let last: any;
  const handleResize = () => {
    last = setTimeout(() => {
      clearTimeout(last);
      size.set({ width: window.innerWidth, height: window.innerHeight });
    }, 5 /* 200 fps frame-time */);
  };
  window.addEventListener('resize', handleResize);
  handleResize();
  inject(DestroyRef).onDestroy(() => window.removeEventListener('resize', handleResize));

  return size.asReadonly();
}
