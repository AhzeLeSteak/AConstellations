import { windowSize } from './windowSize';
import { computed, Signal, signal } from '@angular/core';

const max = 2;
const min = -max;

export function scale(base_width: number, base_height: number){
  const window = windowSize();

  const ratioDiff = signal(0);

  const value = computed(() => {
    const ww = window().width;
    const wh = window().height;
    let ratio = ratioDiff() / 10;
    ratio += 0.8;
    return ww >= wh ? (ratio * ww) / base_width : (ratio * wh) / base_height;
  }) as Signal<number> & {
    zoomIn: () => void;
    zoomOut: () => void;
    canZoomIn: () => boolean;
    canZoomOut: () => boolean;
  };

  value.zoomIn = () => ratioDiff.update((x) => Math.min(max, x + 1));
  value.zoomOut = () => ratioDiff.update((x) => Math.max(min, x - 1));
  value.canZoomIn = () => ratioDiff() < max;
  value.canZoomOut = () => ratioDiff() > min;

  return value;
}
