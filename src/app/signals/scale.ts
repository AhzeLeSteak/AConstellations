import { windowSize } from './windowSize';
import { computed, Signal, signal, WritableSignal } from '@angular/core';

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
    ratio: WritableSignal<number>;
    min: number;
    max: number;
  };

  value.ratio = ratioDiff;
  value.max = 3;
  value.min = -value.max;

  return value;
}
